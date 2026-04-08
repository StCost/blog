import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

import config from "../src/config.js";
import { replaceImageTags, replaceYouTubeUrls } from "./lib/contentTransform.js";
import {
  extractExcerpt,
  extractFirstImageUrl,
  extractFirstVideoUrl,
  extractFirstYouTubeId,
  extractTitleFromContentOrFilename,
  makeSlug
} from "./lib/postMeta.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const postsDir = path.join(root, "content", "posts");
const distDir = path.join(root, "dist");
const assetsSrcDir = path.join(root, "src", "assets");
const assetsOutDir = path.join(distDir, "assets");
const templatesDir = path.join(root, "src", "templates");

const BASE_PATH_RAW = process.env.BASE_PATH || "/";
const BASE_PATH = (BASE_PATH_RAW.startsWith("/") ? BASE_PATH_RAW : `/${BASE_PATH_RAW}`)
  .replace(/\/?$/, "/");

function readText(p) {
  return fs.readFileSync(p, "utf-8");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function emptyDir(p) {
  if (!fs.existsSync(p)) return;
  for (const entry of fs.readdirSync(p)) {
    const full = path.join(p, entry);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      emptyDir(full);
      fs.rmdirSync(full);
    } else {
      fs.unlinkSync(full);
    }
  }
}

function htmlEscape(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTemplate(template, vars) {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, v ?? "");
  }
  return out;
}

async function mdToHtml(md) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md);
  return String(file);
}

function normalizeMd(raw) {
  return replaceYouTubeUrls(replaceImageTags(raw));
}

function extractPostNumber(filename) {
  const base = String(filename || "").trim();
  const m = base.match(/^(\d+)(?:-|\.md$)/i);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

function cleanTitlePrefixNumber(title, num) {
  const t = String(title || "").trim();
  if (num == null) return t;
  // When the filename provides the number, strip any leading number already present in the title
  // (e.g. "#29 Foo", "29 Foo", "29 - Foo") to avoid "#36 #29 Foo" situations.
  return t.replace(/^[#\s]*\d+\s*[-–—:]?\s*/i, "").trim();
}

function stripFirstH1(md) {
  const s = String(md || "");
  return s.replace(/^#\s+.*\r?\n/, "");
}

function listPostFiles() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort((a, b) => b.localeCompare(a)); // same as your current project: newer first
}

function suggestNextPostFilename(files) {
  let max = 0;
  for (const f of files || []) {
    const n = extractPostNumber(f);
    if (n != null && n > max) max = n;
  }
  const next = max + 1;
  const padded = String(next).padStart(3, "0");
  return `${padded}.md`;
}

function uniqueSlug(slug, used) {
  let s = slug;
  let i = 2;
  while (used.has(s)) {
    s = `${slug}-${i}`;
    i++;
  }
  used.add(s);
  return s;
}

async function build() {
  const pageTpl = readText(path.join(templatesDir, "page.html"));
  const postTpl = readText(path.join(templatesDir, "post.html"));

  ensureDir(distDir);
  emptyDir(distDir);
  ensureDir(assetsOutDir);

  // Copy static assets
  for (const f of fs.readdirSync(assetsSrcDir)) {
    const src = path.join(assetsSrcDir, f);
    const st = fs.statSync(src);
    if (!st.isFile()) continue;
    fs.copyFileSync(src, path.join(assetsOutDir, f));
  }

  const files = listPostFiles();
  const nextPostFilename = suggestNextPostFilename(files);
  const used = new Set();

  const posts = [];
  for (const filename of files) {
    const full = path.join(postsDir, filename);
    const raw = readText(full);
    const rawForMeta = replaceImageTags(raw);
    const normalized = normalizeMd(raw);
    const postNumber = extractPostNumber(filename);
    const baseTitle = extractTitleFromContentOrFilename(normalized, filename);
    const cleanedTitle = cleanTitlePrefixNumber(baseTitle, postNumber);
    const title =
      postNumber != null
        ? `#${postNumber}${cleanedTitle ? ` ${cleanedTitle}` : ""}`
        : baseTitle;
    const excerpt = extractExcerpt(rawForMeta, config.blog.excerptLength || 120);
    const slug = uniqueSlug(makeSlug({ content: normalized, filename }), used);
    const html = await mdToHtml(stripFirstH1(normalized));

    const firstImageUrl = extractFirstImageUrl(rawForMeta);
    const firstYouTubeId = extractFirstYouTubeId(rawForMeta);
    const firstVideoUrl = extractFirstVideoUrl(rawForMeta);

    const postOutDir = path.join(distDir, "posts", slug);
    ensureDir(postOutDir);
    const postHtml = renderTemplate(postTpl, {
      BASE_PATH,
      SITE_TITLE: htmlEscape(config.site.title),
      POST_TITLE: htmlEscape(title),
      POST_EXCERPT: htmlEscape(excerpt),
      BACK_TO_POSTS: htmlEscape(config.ui.backToPosts),
      POST_HTML: html
    });
    fs.writeFileSync(path.join(postOutDir, "index.html"), postHtml, "utf-8");

    posts.push({
      filename,
      title,
      excerpt,
      slug,
      media: {
        imageUrl: firstImageUrl,
        youTubeId: firstYouTubeId,
        videoUrl: firstVideoUrl
      }
    });
  }

  // Index pages (optional pagination)
  const perPage = Number(config.blog.postsPerPage || 0);
  const pages = perPage > 0 ? Math.max(1, Math.ceil(posts.length / perPage)) : 1;

  for (let p = 1; p <= pages; p++) {
    const slice =
      perPage > 0 ? posts.slice((p - 1) * perPage, (p - 1) * perPage + perPage) : posts;

    const listHtml = slice.length
      ? slice
          .map((post) => {
            const href = `${BASE_PATH}posts/${post.slug}/`;
            const media = post.media || {};
            const mediaHtml = media.imageUrl
              ? `<div class="post-media"><img loading="lazy" decoding="async" src="${htmlEscape(media.imageUrl)}" alt="" /></div>`
              : media.youTubeId
                ? `<div class="post-media post-media-youtube"><img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/${htmlEscape(media.youTubeId)}/hqdefault.jpg" alt="" /></div>`
                : media.videoUrl
                  ? `<div class="post-media post-media-video"><div class="post-media-play" aria-hidden="true"></div></div>`
                  : "";
            return `
  <a class="card post-item post-item-link" href="${href}">
    <h2>${htmlEscape(post.title)}</h2>
    ${mediaHtml}
    ${post.excerpt ? `<p class="excerpt">${htmlEscape(post.excerpt)}...</p>` : ""}
  </a>`.trim();
          })
          .join("\n")
      : `<section class="card post-item"><p class="excerpt">${htmlEscape(config.ui.noPosts)}</p></section>`;

    const pagination = (() => {
      if (pages <= 1) return "";
      const prevHref = p > 1 ? (p === 2 ? `${BASE_PATH}index.html` : `${BASE_PATH}page/${p - 1}/`) : null;
      const nextHref = p < pages ? `${BASE_PATH}page/${p + 1}/` : null;
      const pageLinks = Array.from({ length: pages }, (_, i) => i + 1)
        .map((n) => {
          const href = n === 1 ? `${BASE_PATH}index.html` : `${BASE_PATH}page/${n}/`;
          return n === p ? `<strong aria-current="page">${n}</strong>` : `<a href="${href}">${n}</a>`;
        })
        .join(" ");
      return `<nav class="pagination" aria-label="Posts pagination">
  ${prevHref ? `<a class="pagination-prev" href="${prevHref}" rel="prev">← Prev</a>` : `<span class="pagination-prev disabled">← Prev</span>`}
  <span class="pagination-pages">${pageLinks}</span>
  ${nextHref ? `<a class="pagination-next" href="${nextHref}" rel="next">Next →</a>` : `<span class="pagination-next disabled">Next →</span>`}
</nav>`;
    })();

    const pageHtml = renderTemplate(pageTpl, {
      BASE_PATH,
      SITE_TITLE: htmlEscape(config.site.title),
      SITE_TAGLINE: htmlEscape(config.site.tagline),
      POST_LIST: listHtml,
      PAGINATION: pagination,
      NEW_POST_FILENAME: htmlEscape(nextPostFilename)
    });

    // Always write /page/N/ for every page (matches "separate page html" request)
    const out = path.join(distDir, "page", String(p));
    ensureDir(out);
    fs.writeFileSync(path.join(out, "index.html"), pageHtml, "utf-8");

    // Keep root index.html as page 1 for convenience
    if (p === 1) fs.writeFileSync(path.join(distDir, "index.html"), pageHtml, "utf-8");
  }

  // A simple 404 that sends users to index (project pages often need this)
  const notFound = `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Not found</title>
<meta http-equiv="refresh" content="0; url=${BASE_PATH}index.html"/></head>
<body>Not found. <a href="${BASE_PATH}index.html">Go home</a>.</body></html>`;
  fs.writeFileSync(path.join(distDir, "404.html"), notFound, "utf-8");

  // Optional: CNAME support (if provided)
  if (process.env.CNAME) {
    fs.writeFileSync(path.join(distDir, "CNAME"), `${process.env.CNAME}\n`, "utf-8");
  }
}

await build();

