import { BASE_PATH, SITE_URL, config } from "./context.js";
import { htmlEscape, xmlEscape, renderTemplate } from "./utils.js";

export function renderPostHtml(postTpl, view) {
  const postUrl = SITE_URL ? `${SITE_URL}${BASE_PATH}${view.slug}/` : `${BASE_PATH}${view.slug}/`;
  const ogImageMeta = view.ogImage ? `<meta property="og:image" content="${htmlEscape(view.ogImage)}" />` : "";
  const twitterCard = view.ogImage ? "summary_large_image" : "summary";
  const twitterImageMeta = view.ogImage ? `<meta name="twitter:image" content="${htmlEscape(view.ogImage)}" />` : "";

  return renderTemplate(postTpl, {
    BASE_PATH,
    SITE_TITLE: htmlEscape(config.site.title),
    SITE_TAGLINE: htmlEscape(config.site.tagline),
    POST_TITLE: htmlEscape(view.title),
    POST_EXCERPT: htmlEscape(view.description),
    CANONICAL_URL: htmlEscape(postUrl),
    OG_IMAGE_META: ogImageMeta,
    TWITTER_CARD: twitterCard,
    TWITTER_IMAGE_META: twitterImageMeta,
    BACK_TO_POSTS: htmlEscape(config.ui.backToPosts),
    POST_HTML: view.html,
    POST_SOURCE_FILENAME: htmlEscape(view.filename),
    NEW_POST_FILENAME: htmlEscape(view.nextPostFilename),
    FOOTER_TEXT: htmlEscape(view.footerText)
  });
}

export function buildPinnedHtml(p, pinnedPost) {
  if (p !== 1 || !pinnedPost) return "";
  return `
  <section class="card post-item post-item-pinned">
    <h2>${htmlEscape(pinnedPost.title)}</h2>
    <div class="pinned-content">
      ${pinnedPost.html || ""}
    </div>
  </section>`.trim();
}

export function buildPostListItem(post) {
  const href = `${BASE_PATH}${post.slug}/`;
  const media = post.media || {};
  const mediaHtml = media.imageUrl
    ? `<div class="post-media"><img loading="lazy" decoding="async" src="${htmlEscape(media.imageUrl)}" alt="" /></div>`
    : media.youTubeId
      ? `<div class="youtube-embed"><iframe width="560" height="315" src="https://www.youtube.com/embed/${htmlEscape(media.youTubeId)}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
      : media.videoUrl
        ? `<video class="post-video" controls preload="metadata" src="${htmlEscape(media.videoUrl)}"></video>`
        : "";

  return `
  <section class="card post-item">
    <a class="post-item-link" href="${href}" aria-label="${htmlEscape(post.title)}"></a>
    <h2>${htmlEscape(post.title)}</h2>
    ${mediaHtml}
    ${post.excerpt ? `<p class="excerpt">${htmlEscape(post.excerpt)}...</p>` : ""}
  </section>`.trim();
}

export function buildPagination(p, pages) {
  if (pages <= 1) return "";
  const prevHref = p > 1 ? (p === 2 ? `${BASE_PATH}` : `${BASE_PATH}page/${p - 1}/`) : null;
  const nextHref = p < pages ? `${BASE_PATH}page/${p + 1}/` : null;
  const pageLinks = Array.from({ length: pages }, (_, i) => i + 1)
    .map((n) => {
      const href = n === 1 ? `${BASE_PATH}` : `${BASE_PATH}page/${n}/`;
      return n === p ? `<strong aria-current="page">${n}</strong>` : `<a href="${href}">${n}</a>`;
    })
    .join(" ");

  return `<nav class="pagination" aria-label="Posts pagination">
  ${prevHref ? `<a class="pagination-prev" href="${prevHref}" rel="prev">← Prev</a>` : `<span class="pagination-prev disabled">← Prev</span>`}
  <span class="pagination-pages">${pageLinks}</span>
  ${nextHref ? `<a class="pagination-next" href="${nextHref}" rel="next">Next →</a>` : `<span class="pagination-next disabled">Next →</span>`}
</nav>`;
}

export function renderPageHtml(pageTpl, view) {
  return renderTemplate(pageTpl, {
    BASE_PATH,
    SITE_TITLE: htmlEscape(config.site.title),
    SITE_TAGLINE: htmlEscape(config.site.tagline),
    CANONICAL_URL: htmlEscape(SITE_URL ? `${SITE_URL}${BASE_PATH}` : `${BASE_PATH}`),
    OG_IMAGE: "",
    POST_LIST: view.listHtml,
    PAGINATION: view.paginationHtml,
    NEW_POST_FILENAME: htmlEscape(view.nextPostFilename),
    FOOTER_TEXT: htmlEscape(view.footerText)
  });
}

export function buildSitemapXml(urls) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const url of urls) {
    if (!url) continue;
    lines.push("  <url>");
    lines.push(`    <loc>${xmlEscape(url)}</loc>`);
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return `${lines.join("\n")}\n`;
}

export function buildRobotsTxt() {
  const lines = ["User-agent: *", "Allow: /"];
  if (SITE_URL) {
    lines.push(`Sitemap: ${SITE_URL}${BASE_PATH}sitemap.xml`);
  }
  return `${lines.join("\n")}\n`;
}

