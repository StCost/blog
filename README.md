# seo-blog

Static blog generator (raw HTML/CSS/JS) that builds SEO-friendly HTML files from Markdown posts.

## Structure
- `content/posts/*.md`: your posts
- `src/templates/page.html`: index template
- `src/templates/post.html`: post template
- `src/assets/*`: CSS/JS copied into `dist/assets`
- `dist/`: generated output (publish this to GitHub Pages)

## Commands
- `npm install`
- `npm run dev` (local preview server + rebuild on changes)
- `npm run build` (generate `dist/`)

## GitHub Pages
This repo includes a workflow that builds and uploads `dist/` as the Pages artifact.
It also supports project-pages base paths (e.g. `/<repo>/`) by setting `BASE_PATH`.

