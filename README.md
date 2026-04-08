# seo-blog

Static blog generator that turns Markdown files into **SEO-friendly, fully static HTML** (no framework runtime). Output is written to `dist/` and can be published directly (GitHub Pages supported out of the box).

## What it does
- **Builds HTML pages** from Markdown in `content/posts/`
- **Generates an index** (optionally paginated) and one folder-per-post under `dist/<slug>/index.html` (public URL `/<slug>/`; pagination: site root `/`, `/page/N/`)
- **Copies static assets** from `src/assets/` into `dist/assets/`
- **Adds basic SEO metadata** (canonical URL, OpenGraph, Twitter cards)
- **Auto-embeds YouTube links** and preserves inline HTML when rendering Markdown

## Requirements
- **Node.js**: the workflow uses Node 20; any recent Node 18+ should work
- **npm**: `package-lock.json` is present, so `npm ci` is supported

## Commands
- **Install**: `npm ci` (or `npm install`)
- **Build**: `npm run build`
  - Writes output to `dist/`
  - Respects `BASE_PATH`, `SITE_URL`, and `CNAME` (see below)
- **Dev server**: `npm run dev`
  - Runs a local server (default `http://127.0.0.1:4173/`)
  - Rebuilds automatically on changes in `content/` or `src/`
  - Always uses `BASE_PATH=/` for local convenience
- **Clean**: `npm run clean` (removes `dist/`)

## Project layout (high signal)
- `scripts/build.mjs`: static site build (Markdown → HTML, templates, pagination, SEO metas)
- `scripts/dev.mjs`: rebuild-on-change + tiny HTTP server for `dist/`
- `scripts/clean.mjs`: deletes `dist/`
- `scripts/lib/contentTransform.js`: transforms content (YouTube URL → embed, `<img>` → Markdown image)
- `scripts/lib/postMeta.js`: slug/title/excerpt + media detection for OG images
- `src/config.js`: site title/tagline + pagination/excerpt settings
- `src/templates/page.html`: index template (list + pagination + “New Post” button)
- `src/templates/post.html`: post template (article + “Edit on GitHub” button)
- `src/assets/*`: CSS/JS/favicon copied to `dist/assets/`
- `dist/`: generated output (publish this directory)

## How URLs and paths work
The builder supports “root sites” and “project pages” style hosting:
- **`BASE_PATH`**: prefix used for links and asset URLs (always normalized to end with `/`)
  - Examples: `/` or `/my-repo/`
- **`SITE_URL`**: optional absolute site origin used to form canonical URLs and absolute OG image URLs
  - Example: `https://username.github.io`

When `SITE_URL` is not set, canonical/OG URLs remain relative (still valid for local previews).

## Environment variables
Used by `scripts/build.mjs`:
- **`BASE_PATH`**: URL prefix for links/assets (default: `/`)
- **`SITE_URL`**: absolute site origin for canonical URLs (default: `src/config.js` `site.url`, or empty)
- **`CNAME`**: if set, writes `dist/CNAME` with this value

## GitHub Pages deployment
There’s a ready-to-use workflow at `.github/workflows/deploy.yml`:
- Builds on pushes to `main`
- Uses:
  - `BASE_PATH=/<repo>/`
  - `SITE_URL=https://<owner>.github.io`
- Uploads `dist/` as the Pages artifact and deploys it

## Notes on generated pages
- Index is written to both:
  - `dist/index.html` (convenience)
  - `dist/page/1/index.html` (consistent pagination layout)
- A simple redirecting `dist/404.html` is generated to send users back to the index (useful for project-pages routing)

