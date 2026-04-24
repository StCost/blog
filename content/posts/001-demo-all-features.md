# Demo: all generator features in one post

This file is the whole demo corpus for the static blog builder. It exercises listing excerpts, OpenGraph preview images, Twitter card mode, YouTube and local video detection, GitHub Flavored Markdown, raw HTML in Markdown, image tag normalization, and syntax-highlighted fenced code.

The first heading becomes the HTML title (with the numeric prefix from the filename). The first plain paragraph after that heading is used as the short excerpt on index pages.

## Headings, inline markup, lists

Regular **bold**, *italic*, and `inline code`. [Link to the engine repo](https://github.com/StCost/blog).

- Unordered item one
- Unordered item two

1. Ordered first
2. Ordered second

> Blockquote: used for callouts or citations.

---

Horizontal rule above separates sections.

## GFM extras (remark-gfm)

~~Strikethrough~~ is supported.

| Column A | Column B |
| --- | --- |
| tables | work |

Task list items:

- [x] Completed task
- [ ] Open task

Autolinked URL on its own line (do not use as the excerpt line):

https://github.com/StCost/blog

Footnote reference after this sentence.[^demo]

[^demo]: Footnotes render at the bottom via GFM.

## Images (Markdown, raw HTML, normalization)

Markdown image — also the **first** image in the file, so it becomes the OpenGraph / Twitter preview on the post page and drives the listing thumbnail when no earlier YouTube/video wins:

![Demo landscape from Picsum](https://picsum.photos/seed/seoblogdemo/800/420)

Raw HTML image **with** `width` and `height` (kept as HTML for layout / CLS):

<img src="https://picsum.photos/seed/seoblogdemo2/320/200" alt="Small demo" width="320" height="200" />

Raw HTML image **without** dimensions (converted to a Markdown image during build):

<img src="https://picsum.photos/seed/seoblogdemo3/280/180" alt="Converted to markdown image" />

## YouTube (standalone URL lines → embeds)

Each of these must be on a line by itself (only the URL, trimmed) to become an iframe.

Watch URL:

https://www.youtube.com/watch?v=jNQXAC9IVRw

Short share URL:

https://youtu.be/jNQXAC9IVRw

Shorts URL:

https://www.youtube.com/shorts/jNQXAC9IVRw

## Video files (Markdown link, bare URL, HTML5)

Markdown link to an `.mp4` (used for preview metadata when it appears before other video patterns):

[Sample clip (MDN flower demo)](https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4)

Bare media URL on its own line (`.webm` / `.mp4` / `.mov` — detected for metadata; listed after the Markdown link so the link stays the “first” video URL):

https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm

HTML5 `<video>` with `<source>` (body markup; `extractFirstVideoUrl` can pick this up if needed):

<video controls width="320" preload="metadata">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Raw HTML block (rehype-raw)

<details>
<summary>Expandable summary (HTML details)</summary>
<p>This content is plain HTML inside Markdown. Useful for long link lists or spoilers.</p>
</details>

## Fenced code with syntax highlighting (rehype-highlight)

```javascript
// JavaScript example
export const demo = (posts) => posts.map((p) => p.slug);
```

```css
/* CSS example */
.demo-card { border-radius: 8px; }
```

```html
<!-- HTML in a code fence -->
<article class="post"></article>
```

## End

That covers Markdown titles, excerpts, GFM (table, tasks, strike, autolink, footnote), images (MD + raw `<img>` both styles), all three YouTube URL shapes, video via link / bare file URL / `<video>`, raw HTML blocks, and highlighted code fences.
