import fs from "node:fs";
import path from "node:path";

export function readText(p) {
  return fs.readFileSync(p, "utf-8");
}

export function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

export function emptyDir(p) {
  if (!fs.existsSync(p)) return;
  try {
    fs.rmSync(p, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  } catch {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
      return;
    }
    for (const entry of fs.readdirSync(p)) {
      const full = path.join(p, entry);
      try {
        fs.rmSync(full, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
      } catch {
        /* Windows can keep media files locked; skip and continue. */
      }
    }
  }
  fs.mkdirSync(p, { recursive: true });
}

export function htmlEscape(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function xmlEscape(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderTemplate(template, vars) {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, v ?? "");
  }
  return out;
}

export function uniqueSlug(slug, used) {
  let s = slug;
  let i = 2;
  while (used.has(s)) {
    s = `${slug}-${i}`;
    i++;
  }
  used.add(s);
  return s;
}

