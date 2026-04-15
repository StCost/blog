import fs from "node:fs";
import path from "node:path";

import { makeSlug } from "../lib/postMeta.js";
import { postsDir } from "./context.js";
import { uniqueSlug } from "./utils.js";

export function extractPostNumber(filename) {
  const base = String(filename || "").trim();
  const m = base.match(/^(\d+)(?:-|\.md$)/i);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

export function isPinnedPostFilename(filename) {
  return extractPostNumber(filename) === 0;
}

export function cleanTitlePrefixNumber(title, num) {
  const t = String(title || "").trim();
  if (num == null) return t;
  return t.replace(/^[#\s]*\d+\s*[-–—:]?\s*/i, "").trim();
}

export function listPostFiles() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort((a, b) => b.localeCompare(a));
}

export function suggestNextPostFilename(files) {
  let max = 0;
  for (const f of files || []) {
    const n = extractPostNumber(f);
    if (n != null && n > max) max = n;
  }
  const next = max + 1;
  return `${String(next).padStart(3, "0")}.md`;
}

const RESERVED_PATH_SLUGS = new Set(["assets"]);

function uniquePostSlug(baseSlug, used) {
  const initial = RESERVED_PATH_SLUGS.has(baseSlug) ? `${baseSlug}-post` : baseSlug;
  return uniqueSlug(initial, used);
}

export function postFilePath(filename) {
  return path.join(postsDir, filename);
}

export function buildPostSlug({ filename, normalized, pinnedFilename, used }) {
  const pinnedSlug = pinnedFilename ? "pinned" : null;
  return pinnedFilename && filename === pinnedFilename
    ? uniqueSlug(pinnedSlug, used)
    : uniquePostSlug(makeSlug({ content: normalized, filename }), used);
}

