import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import config from "../../src/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, "../..");

function postsDirFromArgv() {
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--posts" && argv[i + 1]) return argv[i + 1];
    const eq = a.match(/^--posts=(.+)$/);
    if (eq) return eq[1];
  }
  return "";
}

/** Markdown posts directory: POSTS_DIR env, then --posts / --posts=, else content/posts in this repo. */
function resolvePostsDir() {
  const raw = (process.env.POSTS_DIR || "").trim() || postsDirFromArgv().trim();
  if (!raw) return path.join(root, "content", "posts");
  const resolved = path.isAbsolute(raw) ? path.normalize(raw) : path.resolve(process.cwd(), raw);
  if (!fs.existsSync(resolved)) {
    console.warn(`posts directory not found (using anyway): ${resolved}`);
  }
  return resolved;
}

export const postsDir = resolvePostsDir();
export const distDir = path.join(root, "dist");
export const assetsSrcDir = path.join(root, "src", "assets");
export const assetsOutDir = path.join(distDir, "assets");
export const templatesDir = path.join(root, "src", "templates");

const BASE_PATH_RAW = process.env.BASE_PATH || "/";
export const BASE_PATH = (BASE_PATH_RAW.startsWith("/") ? BASE_PATH_RAW : `/${BASE_PATH_RAW}`).replace(/\/?$/, "/");

const SITE_URL_RAW = process.env.SITE_URL || config.site.url || "";
export const SITE_URL = SITE_URL_RAW ? SITE_URL_RAW.replace(/\/+$/, "") : "";

const BUILD_YEAR = new Date().getFullYear();
export const FOOTER_TEXT = `© 2016–${BUILD_YEAR} ${config.site.companyName || "Dreaming Saints"}`;

export function absUrl(pathname) {
  const p = String(pathname || "");
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  if (!SITE_URL) return p;
  const withSlash = p.startsWith("/") ? p : `/${p}`;
  return `${SITE_URL}${withSlash}`;
}

export function toAbsoluteUrl(pathname) {
  if (!SITE_URL) return "";
  const raw = String(pathname || "");
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return `${SITE_URL}${normalized}`;
}

export { config };
