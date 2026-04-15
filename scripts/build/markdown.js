import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

import { replaceImageTags, replaceYouTubeUrls } from "../lib/contentTransform.js";
export { replaceImageTags };

export async function mdToHtml(md) {
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

export function normalizeMd(raw) {
  return replaceYouTubeUrls(replaceImageTags(raw));
}

export function stripFirstH1(md) {
  const s = String(md || "");
  return s.replace(/^#\s+.*\r?\n/, "");
}
