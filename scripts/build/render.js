import {
  BASE_PATH,
  SITE_URL,
  config,
  GITHUB_DEFAULT_BRANCH,
  GITHUB_EDIT_REPO,
  GITHUB_POSTS_PATH,
  GOOGLE_SITE_VERIFICATION
} from "./context.js";
import { soundCloudPlayerSrc } from "../lib/soundcloud.js";
import { htmlEscape, xmlEscape, renderTemplate } from "./utils.js";

function googleSiteVerificationMetaHtml() {
  const t = GOOGLE_SITE_VERIFICATION;
  if (!t) return "";
  return `<meta name="google-site-verification" content="${htmlEscape(t)}" />`;
}

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
    FOOTER_TEXT: htmlEscape(view.footerText),
    GITHUB_EDIT_REPO: htmlEscape(GITHUB_EDIT_REPO),
    GITHUB_DEFAULT_BRANCH: htmlEscape(GITHUB_DEFAULT_BRANCH),
    GITHUB_POSTS_PATH: htmlEscape(GITHUB_POSTS_PATH),
    GOOGLE_SITE_VERIFICATION_META: googleSiteVerificationMetaHtml()
  });
}

export function buildPinnedHtml(p, pinnedPost) {
  if (p !== 1 || !pinnedPost) return "";
  return `
  <section class="card post-item post-item-pinned">
    <div class="pinned-content">
      ${pinnedPost.html || ""}
    </div>
  </section>`.trim();
}

function listingImg(src, { play = false } = {}) {
  const remote = /^https?:\/\//i.test(src);
  const referrer = remote ? ' referrerpolicy="no-referrer"' : "";
  const img = `<img loading="lazy" decoding="async"${referrer} src="${htmlEscape(src)}" alt="" />`;
  if (!play) return `<div class="post-media">${img}</div>`;
  return `<div class="post-media post-media-video">${img}<div class="post-media-play" aria-hidden="true"></div></div>`;
}

export function buildPostListItem(post) {
  const href = `${BASE_PATH}${post.slug}/`;
  const media = post.media || {};
  const mediaHtml = media.imageUrl
    ? listingImg(media.imageUrl, { play: /\bsoundcloud-cover\.jpe?g\b/i.test(media.imageUrl) || /sndcdn\.com/i.test(media.imageUrl) })
    : media.youTubeId
      ? listingImg(`https://i.ytimg.com/vi/${media.youTubeId}/hqdefault.jpg`, { play: true })
      : media.videoUrl
        ? `<video class="post-video" controls preload="metadata" src="${htmlEscape(media.videoUrl)}"></video>`
        : media.soundCloudUrl
          ? `<div class="post-media post-media-soundcloud"><iframe width="100%" height="320" scrolling="no" frameborder="no" allow="autoplay" title="SoundCloud player" src="${htmlEscape(soundCloudPlayerSrc(media.soundCloudUrl))}"></iframe></div>`
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
    FOOTER_TEXT: htmlEscape(view.footerText),
    GITHUB_EDIT_REPO: htmlEscape(GITHUB_EDIT_REPO),
    GITHUB_DEFAULT_BRANCH: htmlEscape(GITHUB_DEFAULT_BRANCH),
    GITHUB_POSTS_PATH: htmlEscape(GITHUB_POSTS_PATH),
    GOOGLE_SITE_VERIFICATION_META: googleSiteVerificationMetaHtml()
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

