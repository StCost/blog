import fs from "node:fs";
import path from "node:path";

import { BASE_PATH, postsDir } from "./context.js";
import { ensureDir } from "./utils.js";

/** Basename of the markdown file without `.md` (e.g. `002-my-post`). */
export function postAssetBasename(filename) {
  return String(filename || "")
    .replace(/\.md$/i, "")
    .trim();
}

/** Sibling folder next to the `.md` file: `posts/<basename>/`. */
export function resolvePostAssetDir(filename) {
  const base = postAssetBasename(filename);
  if (!base) return null;
  const dir = path.join(postsDir, base);
  if (!fs.existsSync(dir)) return null;
  const st = fs.statSync(dir);
  return st.isDirectory() ? dir : null;
}

/**
 * Strip `./<post-basename>/` so built HTML uses `./file.svg` (assets live beside index.html).
 */
export function rewritePostAssetUrls(content, basename) {
  if (!basename) return content;
  const s = String(content || "");
  const folderPrefix = `./${basename}/`;
  if (!s.includes(folderPrefix)) return s;
  return s.split(folderPrefix).join("./");
}

/** `./diagrams/x.svg` on a post page -> `<BASE_PATH><slug>/diagrams/x.svg` for OG/listing. */
export function resolvePostPublicAssetUrl(url, slug) {
  const u = String(url || "").trim();
  if (!u || /^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return u;
  if (u.startsWith("../")) return u;
  const rel = u.replace(/^\.\//, "").replace(/^\/+/, "");
  return rel ? `${BASE_PATH}${slug}/${rel}` : "";
}

function copyDirRecursive(srcDir, outDir, { skipMd = true } = {}) {
  ensureDir(outDir);
  for (const name of fs.readdirSync(srcDir)) {
    const src = path.join(srcDir, name);
    const dest = path.join(outDir, name);
    const st = fs.statSync(src);
    if (st.isDirectory()) {
      copyDirRecursive(src, dest, { skipMd });
      continue;
    }
    if (!st.isFile()) continue;
    if (skipMd && name.toLowerCase().endsWith(".md")) continue;
    fs.copyFileSync(src, dest);
  }
}

/** Copy `posts/<basename>/**` into `dist/<slug>/` preserving subfolders. */
export function copyPostAssets(assetDir, postOutDir) {
  if (!assetDir || !fs.existsSync(assetDir)) return;
  copyDirRecursive(assetDir, postOutDir);
}
