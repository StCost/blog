import path from "node:path";
import { fileURLToPath } from "node:url";

import config from "../../src/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, "../..");

export const postsDir = path.join(root, "content", "posts");
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
