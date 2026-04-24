# blog

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
  - Rebuilds when Markdown under the active posts directory or files under `src/` change
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
- **`POSTS_DIR`**: absolute or cwd-relative folder of `*.md` posts (default: `content/posts` in this repo). CLI: `npm run build -- --posts path/to/posts`
- **`SITE_TITLE`**, **`SITE_TAGLINE`**, **`SITE_COMPANY_NAME`**: when set to a non-empty string, override the matching fields from `src/config.js` (footer uses `SITE_COMPANY_NAME`). Used by the posts-only reusable workflow via `with:` inputs `site_title`, `site_tagline`, `site_company_name`.

## GitHub Pages deployment
There’s a ready-to-use workflow at `.github/workflows/deploy.yml`:
- Builds on pushes to `main`
- Uses:
  - `BASE_PATH=/<repo>/`
  - `SITE_URL=https://<owner>.github.io`
- Uploads `dist/` as the Pages artifact and deploys it

## Posts-only repository (Markdown + one workflow)

You can host **only** posts in a separate GitHub repo and still build with this generator—no copy of `scripts/`, `src/`, or `package.json` there.

1. Create a new repository.
2. Put every post as a `*.md` file at the **root** of that repo (same naming style as here works well, e.g. `001.md`, `052.md`).
3. Add the workflow file: copy [`examples/posts-only-repo/.github/workflows/deploy.yml`](examples/posts-only-repo/.github/workflows/deploy.yml) to `.github/workflows/deploy.yml` in the new repo (it calls the reusable workflow in this repo).
4. In that repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Push to `main`. The site is published under `https://<your-username>.github.io/<that-repo-name>/` (project pages), using `StCost/blog` as the engine.

If you prefer a subfolder for Markdown (e.g. `content/posts/`), set `posts_subpath: content/posts` in the workflow’s `with:` block in the posts-only repo.

Optional branding for that site only: in the same `with:` block, set `site_title`, `site_tagline`, and/or `site_company_name` (see [`deploy-from-posts.yml`](.github/workflows/deploy-from-posts.yml)). Anything you omit still comes from [`src/config.js`](src/config.js) in the engine repo. Pagination and other `blog` / `ui` settings still come from the engine unless you fork it.

## Notes on generated pages
- Index is written to both:
  - `dist/index.html` (convenience)
  - `dist/page/1/index.html` (consistent pagination layout)
- A simple redirecting `dist/404.html` is generated to send users back to the index (useful for project-pages routing)

