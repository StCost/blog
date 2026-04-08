import slugify from "slugify";

export function titleFromFilename(filename) {
  const base = filename.replace(/\.md$/i, "").trim();
  const match = base.match(/^(\d+)-(.*)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    const slug = match[2].replace(/-/g, " ").trim();
    const text = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";
    return text ? `${num} ${text}` : String(num);
  }
  const fallback = base.replace(/-/g, " ").trim();
  return fallback ? fallback.charAt(0).toUpperCase() + fallback.slice(1) : base;
}

export function isImageLine(line) {
  const t = line.trim();
  return /^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(t) || /<img[^>]+src=/.test(t);
}

export function extractFirstImageUrl(content) {
  const mdMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (mdMatch) return mdMatch[1].trim();
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1].trim();
  return null;
}

const YOUTUBE_WATCH = /https:\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/;
const YOUTUBE_SHORT = /https:\/\/youtu\.be\/([A-Za-z0-9_-]{11})/;
const YOUTUBE_SHORTS = /https:\/\/(?:www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/;

export function extractFirstYouTubeId(content) {
  const m1 = content.match(YOUTUBE_WATCH);
  if (m1) return m1[1];
  const m2 = content.match(YOUTUBE_SHORT);
  if (m2) return m2[1];
  const m3 = content.match(YOUTUBE_SHORTS);
  if (m3) return m3[1];
  return null;
}

export function extractFirstVideoUrl(content) {
  const mdLink = content.match(/\[[^\]]*\]\(([^)]+\.(?:mp4|webm|mov))(?:\?[^)]*)?\)/i);
  if (mdLink) return mdLink[1].trim();
  const bare = content.match(/^(https?:\/\/\S+\.(?:mp4|webm|mov))(?:\?\S+)?$/im);
  if (bare) return bare[1].trim();
  const htmlVideo = content.match(/<video[^>]*>\s*<source[^>]+src=["']([^"']+)["']/i);
  if (htmlVideo) return htmlVideo[1].trim();
  return null;
}

function stripHtml(s) {
  return s.replace(/<[^>]*>/g, "");
}

function isBareUrlLine(line) {
  return /^https?:\/\/\S+$/i.test(line.trim());
}

function isYouTubeLine(line) {
  const t = line.trim();
  return YOUTUBE_WATCH.test(t) || YOUTUBE_SHORT.test(t) || YOUTUBE_SHORTS.test(t);
}

export function extractTitleFromContentOrFilename(content, filename) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) return titleMatch[1].trim();
  return titleFromFilename(filename);
}

export function makeSlug({ content, filename }) {
  const title = extractTitleFromContentOrFilename(content, filename);
  const raw = (title || filename || "").toString();
  const s = slugify(raw, { lower: true, strict: true, trim: true });
  if (s) return s.slice(0, 80);
  return filename.replace(/\.md$/i, "").trim() || "post";
}

export function extractExcerpt(content, excerptLength) {
  const lines = content.split("\n");
  const titleIndex = lines.findIndex((line) => line.startsWith("# "));
  const afterTitle = titleIndex >= 0 ? titleIndex + 1 : 0;
  const contentLines = lines.slice(afterTitle);
  const firstParagraph = contentLines.find(
    (line) =>
      line.trim() &&
      !line.startsWith("#") &&
      !isImageLine(line) &&
      !isBareUrlLine(line) &&
      !isYouTubeLine(line),
  );
  if (!firstParagraph) return "";
  return stripHtml(firstParagraph)
    .trim()
    .substring(0, excerptLength)
    .replace(/\*\*/g, "");
}

