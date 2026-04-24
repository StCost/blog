// Intentionally tiny: keep runtime JS minimal for SEO.
// You can add client-side enhancements here later (search, theme toggles, etc.).

function parseGitHubPagesUrl() {
  const url = window.location.href;
  const match = url.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);
  if (!match) return null;
  const [, username, repo] = match;
  return { username, repo };
}

function getOwnerRepo() {
  const raw = document.documentElement.getAttribute("data-gh-repo");
  const s = raw ? raw.trim() : "";
  if (s) {
    const i = s.indexOf("/");
    if (i > 0 && i < s.length - 1) {
      return { owner: s.slice(0, i), repo: s.slice(i + 1) };
    }
  }
  const parsed = parseGitHubPagesUrl();
  if (parsed) return { owner: parsed.username, repo: parsed.repo };
  return null;
}

/** Posts path inside the GitHub repo (no slashes at ends). Legacy HTML → content/posts. */
function githubPostsDirFromDom() {
  const raw = document.documentElement.getAttribute("data-gh-posts-dir");
  if (raw === null) return "content/posts";
  return raw.trim();
}

function githubBranchFromDom() {
  const b = document.documentElement.getAttribute("data-gh-branch");
  const s = b ? b.trim() : "";
  return s || "main";
}

function githubRepoFilePath(postsDirRel, filename) {
  const dir = (postsDirRel || "").replace(/^\/+|\/+$/g, "");
  const file = String(filename || "").replace(/^\/+/, "");
  return dir ? `${dir}/${file}` : file;
}

function encodeGithubPathForEdit(relPath) {
  return relPath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

function setupNewPostButton() {
  const el = document.getElementById("new-post-button");
  if (!el) return;

  const filename = el.getAttribute("data-filename") || "001.md";

  el.addEventListener("click", (e) => {
    e.preventDefault();
    const ownerRepo = getOwnerRepo();
    if (!ownerRepo) {
      alert(`Can't resolve GitHub repo (set data-gh-repo on <html> at build, or use a *.github.io/<repo>/ URL):\n${window.location.href}`);
      return;
    }
    const branch = githubBranchFromDom();
    const postsDir = githubPostsDirFromDom();
    const fullPath = githubRepoFilePath(postsDir, filename);
    const newPostUrl = `https://github.com/${ownerRepo.owner}/${ownerRepo.repo}/new/${branch}?filename=${encodeURIComponent(fullPath)}`;
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
    const ownerRepo = getOwnerRepo();
    if (!ownerRepo) {
      alert(`Can't resolve GitHub repo (set data-gh-repo on <html> at build, or use a *.github.io/<repo>/ URL):\n${window.location.href}`);
      return;
    }
    const branch = githubBranchFromDom();
    const postsDir = githubPostsDirFromDom();
    const rel = githubRepoFilePath(postsDir, filename);
    const editUrl = `https://github.com/${ownerRepo.owner}/${ownerRepo.repo}/edit/${branch}/${encodeGithubPathForEdit(rel)}`;
    window.open(editUrl, "_blank");
  });
}

function inferCodeLanguage(codeEl) {
  const classNames = (codeEl.className || "").split(/\s+/);
  for (const cls of classNames) {
    if (cls.startsWith("language-")) {
      return cls.slice("language-".length).toLowerCase();
    }
    if (cls.startsWith("lang-")) {
      return cls.slice("lang-".length).toLowerCase();
    }
  }
  return "";
}

function inferFileNameFromSummary(codeEl) {
  const details = codeEl.closest("details");
  if (!details) return "";

  const summaryEl = details.querySelector("summary");
  const summaryText = (summaryEl?.textContent || "").trim();
  if (!summaryText) return "";

  const explicitFile = summaryText.match(/([A-Za-z0-9_.-]+\.[A-Za-z0-9]+)\b/);
  if (explicitFile?.[1]) return explicitFile[1];

  const extMap = {
    csharp: "cs",
    cs: "cs",
    javascript: "js",
    js: "js",
    typescript: "ts",
    ts: "ts",
    python: "py",
    py: "py",
    java: "java",
    go: "go",
    rust: "rs",
    rs: "rs",
    json: "json",
    yaml: "yml",
    yml: "yml",
    xml: "xml",
    html: "html",
    css: "css",
    sql: "sql",
    bash: "sh",
    sh: "sh"
  };

  const lowered = summaryText.toLowerCase();
  let pickedExt = "";
  for (const [key, ext] of Object.entries(extMap)) {
    if (lowered.includes(key)) {
      pickedExt = ext;
      break;
    }
  }
  if (!pickedExt) return "";

  const base = summaryText
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(format|lang|language|code|snippet|script|file)\b/gi, " ")
    .replace(/[^A-Za-z0-9_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join("-");

  return `${base || "snippet"}.${pickedExt}`;
}

function inferFileName(text, language, codeEl) {
  const fromSummary = inferFileNameFromSummary(codeEl);
  if (fromSummary) return fromSummary;

  const extByLang = {
    js: "js",
    javascript: "js",
    ts: "ts",
    typescript: "ts",
    jsx: "jsx",
    tsx: "tsx",
    py: "py",
    python: "py",
    rb: "rb",
    ruby: "rb",
    php: "php",
    go: "go",
    rs: "rs",
    rust: "rs",
    java: "java",
    cs: "cs",
    csharp: "cs",
    cpp: "cpp",
    c: "c",
    html: "html",
    xml: "xml",
    css: "css",
    scss: "scss",
    json: "json",
    yml: "yml",
    yaml: "yaml",
    sh: "sh",
    bash: "sh",
    sql: "sql",
    md: "md",
    markdown: "md"
  };

  const extension = extByLang[language] || "txt";

  if (extension === "cs") {
    const classMatch = text.match(
      /\b(?:public|private|protected|internal)?\s*(?:abstract\s+|sealed\s+|static\s+|partial\s+)*class\s+([A-Za-z_][A-Za-z0-9_]*)\b/
    );
    if (classMatch?.[1]) {
      return `${classMatch[1]}.cs`;
    }
  }

  return `snippet.${extension}`;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function setupCodeBlockActions() {
  const blocks = document.querySelectorAll(".post-content pre > code, .pinned-content pre > code");
  for (const codeEl of blocks) {
    const preEl = codeEl.parentElement;
    if (!preEl || preEl.dataset.actionsReady === "true") continue;
    preEl.dataset.actionsReady = "true";
    preEl.classList.add("code-block");

    const toolbar = document.createElement("div");
    toolbar.className = "code-block-toolbar";

    const language = inferCodeLanguage(codeEl);
    const text = codeEl.innerText || codeEl.textContent || "";

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "code-block-btn";
    copyBtn.textContent = "Copy";
    copyBtn.setAttribute("aria-label", "Copy code block");
    copyBtn.addEventListener("click", async () => {
      try {
        await copyTextToClipboard(text);
        copyBtn.textContent = "Copied";
        window.setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 1400);
      } catch {
        copyBtn.textContent = "Failed";
        window.setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 1400);
      }
    });

    const downloadBtn = document.createElement("button");
    downloadBtn.type = "button";
    downloadBtn.className = "code-block-btn";
    downloadBtn.textContent = "Download";
    downloadBtn.setAttribute("aria-label", "Download code block as file");
    downloadBtn.addEventListener("click", () => {
      const fileName = inferFileName(text, language, codeEl);
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    toolbar.append(copyBtn, downloadBtn);
    preEl.prepend(toolbar);
  }
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
  setupCodeBlockActions();
  setupListPrefetch();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initClientEnhancements);
} else {
  initClientEnhancements();
}

setupNewPostButton();
setupGitHubEditButton();

