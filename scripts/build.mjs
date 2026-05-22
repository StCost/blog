import fs from "node:fs";
import path from "node:path";

import {
  extractExcerpt,
  extractFirstImageUrl,
  extractFirstVideoUrl,
  extractFirstYouTubeId,
  extractTitleFromContentOrFilename
} from "./lib/postMeta.js";
import {
  BASE_PATH,
  FOOTER_TEXT,
  SITE_URL,
  absUrl,
  toAbsoluteUrl,
  assetsOutDir,
  assetsSrcDir,
  config,
  distDir,
  templatesDir
} from "./build/context.js";
import { mdToHtml, normalizeMd, replaceImageTags, stripFirstH1 } from "./build/markdown.js";
import {
  copyPostAssets,
  postAssetBasename,
  resolvePostAssetDir,
  resolvePostPublicAssetUrl,
  rewritePostAssetUrls
} from "./build/postAssets.js";
import {
  buildPostSlug,
  cleanTitlePrefixNumber,
  extractPostNumber,
  isPinnedPostFilename,
  listPostFiles,
  postFilePath,
  suggestNextPostFilename
} from "./build/posts.js";
import {
  buildPagination,
  buildPinnedHtml,
  buildPostListItem,
  buildRobotsTxt,
  buildSitemapXml,
  renderPageHtml,
  renderPostHtml
} from "./build/render.js";
import { emptyDir, ensureDir, htmlEscape, readText } from "./build/utils.js";

function copyStaticAssets() {
  function copyDir(srcDir, outDir) {
    ensureDir(outDir);
    for (const name of fs.readdirSync(srcDir)) {
      const src = path.join(srcDir, name);
      const dest = path.join(outDir, name);
      const st = fs.statSync(src);
      if (st.isDirectory()) copyDir(src, dest);
      else if (st.isFile()) fs.copyFileSync(src, dest);
    }
  }
  copyDir(assetsSrcDir, assetsOutDir);

  const katexCss = path.join(process.cwd(), "node_modules", "katex", "dist", "katex.min.css");
  if (fs.existsSync(katexCss)) {
    fs.copyFileSync(katexCss, path.join(assetsOutDir, "katex.css"));
  }
}

function write404Page() {
  const notFound = `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Not found</title>
<meta http-equiv="refresh" content="0; url=${BASE_PATH}"/></head>
<body>Not found. <a href="${BASE_PATH}">Go home</a>.</body></html>`;
  fs.writeFileSync(path.join(distDir, "404.html"), notFound, "utf-8");
}

function writeSeoFiles(posts, pages) {
  fs.writeFileSync(path.join(distDir, "robots.txt"), buildRobotsTxt(), "utf-8");

  const sitemapUrls = [];
  if (SITE_URL) {
    sitemapUrls.push(toAbsoluteUrl(BASE_PATH));
    for (let p = 2; p <= pages; p++) {
      sitemapUrls.push(toAbsoluteUrl(`${BASE_PATH}page/${p}/`));
    }
    for (const post of posts) {
      sitemapUrls.push(toAbsoluteUrl(`${BASE_PATH}${post.slug}/`));
    }
  }
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), buildSitemapXml(sitemapUrls), "utf-8");
}

function writeCnameIfNeeded() {
  if (process.env.CNAME) {
    fs.writeFileSync(path.join(distDir, "CNAME"), `${process.env.CNAME}\n`, "utf-8");
  }
}

async function buildPosts({ postTpl, files, nextPostFilename, pinnedFilename, usedSlugs }) {
  const posts = [];

  for (const filename of files) {
    const raw = readText(postFilePath(filename));
    const assetBasename = postAssetBasename(filename);
    const normalized = normalizeMd(rewritePostAssetUrls(raw, assetBasename));
    const rawForMeta = replaceImageTags(normalized);

    const postNumber = extractPostNumber(filename);
    const baseTitle = extractTitleFromContentOrFilename(normalized, filename);
    const cleanedTitle = cleanTitlePrefixNumber(baseTitle, postNumber);
    const title = postNumber != null ? `#${postNumber}${cleanedTitle ? ` ${cleanedTitle}` : ""}` : baseTitle;

    const excerpt = extractExcerpt(rawForMeta, config.blog.excerptLength || 120);
    const description = excerpt || config.site.tagline || "";
    const slug = buildPostSlug({ filename, normalized, pinnedFilename, used: usedSlugs });
    const html = await mdToHtml(stripFirstH1(normalized));

    const publicAsset = (url) => resolvePostPublicAssetUrl(url, slug);
    const firstImageUrl = extractFirstImageUrl(rawForMeta);
    const firstYouTubeId = extractFirstYouTubeId(rawForMeta);
    const firstVideoUrl = extractFirstVideoUrl(rawForMeta);
    const ogImage = firstImageUrl
      ? absUrl(publicAsset(firstImageUrl))
      : firstYouTubeId
        ? `https://i.ytimg.com/vi/${firstYouTubeId}/hqdefault.jpg`
        : "";

    const postOutDir = path.join(distDir, slug);
    ensureDir(postOutDir);
    copyPostAssets(resolvePostAssetDir(filename), postOutDir);
    fs.writeFileSync(
      path.join(postOutDir, "index.html"),
      renderPostHtml(postTpl, {
        filename,
        slug,
        title,
        description,
        html,
        ogImage,
        nextPostFilename,
        footerText: FOOTER_TEXT
      }),
      "utf-8"
    );

    posts.push({
      filename,
      title,
      excerpt,
      slug,
      html,
      media: {
        imageUrl: firstImageUrl ? publicAsset(firstImageUrl) : "",
        youTubeId: firstYouTubeId,
        videoUrl: firstVideoUrl
      }
    });
  }

  return posts;
}

function writeListingPages({ pageTpl, posts, pinnedFilename, nextPostFilename }) {
  const perPage = Number(config.blog.postsPerPage || 0);
  const pages = perPage > 0 ? Math.max(1, Math.ceil(posts.length / perPage)) : 1;

  for (let p = 1; p <= pages; p++) {
    const baseForPaging = pinnedFilename ? posts.filter((x) => x.filename !== pinnedFilename) : posts;
    const slice = perPage > 0 ? baseForPaging.slice((p - 1) * perPage, (p - 1) * perPage + perPage) : baseForPaging;

    const pinnedPost = pinnedFilename ? posts.find((x) => x.filename === pinnedFilename) : null;
    const pinnedHtml = buildPinnedHtml(p, pinnedPost);
    const itemsHtml = slice.length
      ? slice.map((post) => buildPostListItem(post)).join("\n")
      : `<section class="card post-item"><p class="excerpt">${htmlEscape(config.ui.noPosts)}</p></section>`;
    const listHtml = [pinnedHtml, itemsHtml].filter(Boolean).join("\n");
    const paginationHtml = buildPagination(p, pages);

    const pageHtml = renderPageHtml(pageTpl, {
      listHtml,
      paginationHtml,
      nextPostFilename,
      footerText: FOOTER_TEXT
    });

    const out = path.join(distDir, "page", String(p));
    ensureDir(out);
    fs.writeFileSync(path.join(out, "index.html"), pageHtml, "utf-8");
    if (p === 1) fs.writeFileSync(path.join(distDir, "index.html"), pageHtml, "utf-8");
  }

  return pages;
}

async function build() {
  const pageTpl = readText(path.join(templatesDir, "page.html"));
  const postTpl = readText(path.join(templatesDir, "post.html"));

  ensureDir(distDir);
  emptyDir(distDir);
  ensureDir(assetsOutDir);
  copyStaticAssets();

  const files = listPostFiles();
  const nextPostFilename = suggestNextPostFilename(files);
  const usedSlugs = new Set();
  const pinnedFilename = files.find(isPinnedPostFilename) || null;

  const posts = await buildPosts({ postTpl, files, nextPostFilename, pinnedFilename, usedSlugs });
  const pages = writeListingPages({ pageTpl, posts, pinnedFilename, nextPostFilename });

  write404Page();
  writeSeoFiles(posts, pages);
  writeCnameIfNeeded();
}

await build();

