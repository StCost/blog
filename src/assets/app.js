// Intentionally tiny: keep runtime JS minimal for SEO.
// You can add client-side enhancements here later (search, theme toggles, etc.).

function parseGitHubPagesUrl() {
  const url = window.location.href;
  const match = url.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);
  if (!match) return null;
  const [, username, repo] = match;
  return { username, repo };
}

function setupNewPostButton() {
  const el = document.getElementById("new-post-button");
  if (!el) return;

  const filename = el.getAttribute("data-filename") || "001.md";

  el.addEventListener("click", (e) => {
    e.preventDefault();
    const parsed = parseGitHubPagesUrl();
    if (!parsed) {
      alert(`Can't infer GitHub repo from URL:\n${window.location.href}`);
      return;
    }
    const { username, repo } = parsed;
    const newPostUrl = `https://github.com/${username}/${repo}/new/main/content/posts?filename=${encodeURIComponent(filename)}`;
    window.open(newPostUrl, "_blank");
  });
}

/** True if URL is the post index (page 1) or /page/N/ — matches build.mjs listing routes. */
function isListingReferrer(ref, basePath) {
  if (!ref) return false;
  let u;
  try {
    u = new URL(ref);
  } catch {
    return false;
  }
  if (u.origin !== window.location.origin) return false;

  const bp = (basePath || "/").replace(/\/?$/, "/");
  let localPath = u.pathname;

  if (bp !== "/") {
    const prefix = bp.replace(/\/$/, "");
    if (!localPath.startsWith(`${prefix}/`) && localPath !== prefix) return false;
    localPath =
      localPath === prefix || localPath === `${prefix}/`
        ? "/"
        : localPath.slice(prefix.length);
  }

  const tail = localPath.replace(/^\/+/, "").replace(/\/+$/, "");
  if (tail === "" || tail === "index.html") return true;
  return /^page\/\d+$/.test(tail);
}

/** Point "Back to posts" at the listing page the user came from (correct pagination), not always page 1. */
function setupBackToPosts() {
  const a = document.getElementById("back-to-posts");
  if (!a) return;

  const basePath = a.getAttribute("data-base-path") || "/";
  const ref = document.referrer;
  if (ref && isListingReferrer(ref, basePath)) {
    a.href = ref;
  }
}

function setupGitHubEditButton() {
  const el = document.getElementById("github-edit-button");
  if (!el) return;

  const filename = el.getAttribute("data-filename");
  if (!filename) return;

  el.addEventListener("click", (e) => {
    e.preventDefault();
    const parsed = parseGitHubPagesUrl();
    if (!parsed) {
      alert(`Can't infer GitHub repo from URL:\n${window.location.href}`);
      return;
    }
    const { username, repo } = parsed;
    const editUrl = `https://github.com/${username}/${repo}/edit/main/content/posts/${encodeURIComponent(filename)}`;
    window.open(editUrl, "_blank");
  });
}

const prefetchedHrefs = new Set();

function prefetchDocument(href) {
  if (!href || prefetchedHrefs.has(href)) return;
  prefetchedHrefs.add(href);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  link.as = "document";
  document.head.appendChild(link);
}

/** Prefetch post HTML on hover only (no scroll / no pagination). Skipped when Save-Data is on. */
function setupListPrefetch() {
  if (navigator.connection?.saveData) return;

  for (const item of document.querySelectorAll(".post-item")) {
    const a = item.querySelector("a.post-item-link[href]");
    if (!a) continue;

    a.addEventListener(
      "pointerenter",
      () => {
        prefetchDocument(a.href);
      },
      { passive: true }
    );
  }
}

function initClientEnhancements() {
  setupBackToPosts();
  setupListPrefetch();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initClientEnhancements);
} else {
  initClientEnhancements();
}

setupNewPostButton();
setupGitHubEditButton();

