import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import katex from "katex";

import { replaceImageTags, replaceYouTubeUrls } from "../lib/contentTransform.js";
export { replaceImageTags };

const PIPELINE_STEPS_HTML = /<ol class="(?:pipeline|phase1)-steps"[\s\S]*?<\/ol>/gi;

function renderMathTex(tex, displayMode) {
  return katex.renderToString(tex, { displayMode, throwOnError: false, strict: "ignore" });
}

/** remark-math does not run inside raw HTML blocks; render $...$ / $$...$$ there before parse. */
export function renderMathInHtmlBlocks(md) {
  return String(md || "").replace(PIPELINE_STEPS_HTML, (block) => {
    let out = block.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
      const html = renderMathTex(tex.trim(), true);
      return `<span class="katex-display">${html}</span>`;
    });
    out = out.replace(/\$([^$\n]+?)\$/g, (_, tex) => renderMathTex(tex.trim(), false));
    return out;
  });
}

export async function mdToHtml(md) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(renderMathInHtmlBlocks(md));
  return String(file);
}

export function normalizeMd(raw) {
  return replaceYouTubeUrls(replaceImageTags(raw));
}

export function stripFirstH1(md) {
  const s = String(md || "");
  return s.replace(/^#\s+.*\r?\n/, "");
}
