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

/** `owner/repo` for Edit/New on GitHub; empty = infer from *.github.io URL in the browser. */
export const GITHUB_EDIT_REPO = (process.env.GITHUB_EDIT_REPO || "").trim();

export const GITHUB_DEFAULT_BRANCH = (process.env.GITHUB_DEFAULT_BRANCH || "main").trim() || "main";

/**
 * Path to posts inside the GitHub repo (no leading slash). Used for edit/new links.
 * Env `GITHUB_POSTS_PATH`: set to "" for Markdown at repo root (posts-only layout).
 * If unset: `content/posts` when POSTS_DIR is this repo's default, otherwise "" (external folder).
 */
function resolveGithubPostsPath() {
  if (process.env.GITHUB_POSTS_PATH !== undefined) {
    return String(process.env.GITHUB_POSTS_PATH).trim().replace(/^\/+|\/+$/g, "");
  }
  const canonical = path.join(root, "content", "posts");
  return path.resolve(postsDir) === path.resolve(canonical) ? "content/posts" : "";
}

export const GITHUB_POSTS_PATH = resolveGithubPostsPath();

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
