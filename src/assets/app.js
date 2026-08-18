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
/** Wrap post/listing images in links so a click opens the image URL in a new tab. */
function setupImageOpenInNewTab() {
  const imgs = document.querySelectorAll(
    ".post-content img, .pinned-content img, .post-media img"
  );
  for (const img of imgs) {
    if (
      img.closest("a") ||
      img.closest(".about-avatar-wrap") ||
      img.closest(".about-tip-trigger") ||
      img.closest(".about-tip") ||
      img.dataset.newTabReady === "true"
    ) continue;

    const href = img.currentSrc || img.src;
    if (!href) continue;

    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "post-image-link";
    const label = (img.getAttribute("alt") || "").trim();
    a.setAttribute("aria-label", label ? `Open image: ${label}` : "Open image in new tab");

    img.dataset.newTabReady = "true";
    img.parentNode.insertBefore(a, img);
    a.appendChild(img);

    // Nested <a> inside <summary> must not toggle the parent <details>.
    if (a.closest("summary")) {
      a.addEventListener("click", (e) => e.stopPropagation());
    }
  }
}

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

function setupAboutPersonAnchors() {
  if (window.__aboutPersonAnchors) return;
  window.__aboutPersonAnchors = true;
  function openFromHash() {
    const id = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (!id) return;
    const el = document.getElementById(id);
    if (!(el instanceof HTMLDetailsElement)) return;
    el.open = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  document.querySelectorAll("a.about-anchor").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      e.preventDefault();
      e.stopPropagation();
      history.replaceState(null, "", href);
      openFromHash();
    });
  });
  window.addEventListener("hashchange", openFromHash);
  openFromHash();
}

function tipNeedsTap() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function clearTipPos(tip) {
  tip.style.transform = "";
  tip.style.position = "";
  tip.style.left = "";
  tip.style.right = "";
  tip.style.top = "";
  tip.style.bottom = "";
  tip.style.maxHeight = "";
  tip.style.overflowY = "";
  tip.style.paddingTop = "";
  tip.style.paddingBottom = "";
  tip.style.zIndex = "";
}

function clampTipToScreen(tip, host = tip.parentElement) {
  const pad = 8;
  const gap = 6;
  if (!host) return;
  clearTipPos(tip);
  tip.style.position = "fixed";
  tip.style.zIndex = "10000";
  tip.style.right = "auto";
  tip.style.bottom = "auto";

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const link = host.getBoundingClientRect();

  tip.style.left = `${Math.round(link.left)}px`;
  tip.style.top = `${Math.round(link.bottom - gap)}px`;
  tip.style.paddingTop = `${gap}px`;
  void tip.offsetWidth;

  let rect = tip.getBoundingClientRect();
  const maxH = vh - pad * 2;
  if (rect.height > maxH) {
    tip.style.maxHeight = `${maxH}px`;
    tip.style.overflowY = "auto";
    void tip.offsetWidth;
    rect = tip.getBoundingClientRect();
  }

  const placeAbove = rect.bottom > vh - pad && link.top > rect.height + pad + gap;
  if (placeAbove) {
    tip.style.paddingTop = "0";
    tip.style.paddingBottom = `${gap}px`;
    tip.style.top = `${Math.round(link.top - rect.height + gap)}px`;
    void tip.offsetWidth;
    rect = tip.getBoundingClientRect();
  }

  let left = rect.left;
  let top = rect.top;
  if (rect.right > vw - pad) left = vw - pad - rect.width;
  if (left < pad) left = pad;
  if (rect.bottom > vh - pad) top = Math.max(pad, vh - pad - rect.height);
  if (top < pad) top = pad;
  tip.style.left = `${Math.round(left)}px`;
  tip.style.top = `${Math.round(top)}px`;
}

function setupAboutTips() {
  const tips = [...document.querySelectorAll(".about-tip")].filter(
    (tip) => tip.parentElement && tip.parentElement.classList.contains("about-tip-trigger")
  );
  if (!tips.length) return;

  const homes = new WeakMap();
  let active = null;
  let hideTimer = 0;

  function parkTip(tip) {
    const host = homes.get(tip);
    if (host && tip.parentElement !== host) host.appendChild(tip);
    homes.delete(tip);
  }

  function hideTip() {
    window.clearTimeout(hideTimer);
    hideTimer = 0;
    if (!active) return;
    const { host, tip } = active;
    host.classList.remove("tip-open");
    tip.classList.remove("is-open");
    host.closest(".game-cell")?.classList.remove("tip-open");
    clearTipPos(tip);
    parkTip(tip);
    active = null;
  }

  function showTip(host, tip, tap) {
    window.clearTimeout(hideTimer);
    hideTimer = 0;
    if (active && active.tip !== tip) hideTip();
    active = { host, tip, tap };
    host.classList.add("tip-open");
    tip.classList.add("is-open");
    host.closest(".game-cell")?.classList.add("tip-open");
    if (tip.parentElement !== document.body) {
      homes.set(tip, host);
      document.body.appendChild(tip);
    }
    clampTipToScreen(tip, host);
  }

  function scheduleHide() {
    if (!active || active.tap) return;
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hideTip, 80);
  }

  for (const tip of tips) {
    const host = tip.parentElement;
    host.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target.closest("a.about-tip-title")) return;
      if (!tipNeedsTap()) return;
      e.preventDefault();
      if (active?.host === host) {
        hideTip();
        return;
      }
      showTip(host, tip, true);
    });
    host.addEventListener("mouseenter", () => {
      if (tipNeedsTap()) return;
      showTip(host, tip, false);
    });
    host.addEventListener("mouseleave", () => {
      if (tipNeedsTap()) return;
      scheduleHide();
    });
    tip.addEventListener("mouseenter", () => {
      if (tipNeedsTap()) return;
      window.clearTimeout(hideTimer);
      hideTimer = 0;
    });
    tip.addEventListener("mouseleave", () => {
      if (tipNeedsTap()) return;
      scheduleHide();
    });
    tip.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  document.addEventListener("click", (e) => {
    if (!active?.tap) return;
    if (active.host.contains(e.target) || active.tip.contains(e.target)) return;
    hideTip();
  });
  window.addEventListener(
    "resize",
    () => {
      if (active) clampTipToScreen(active.tip, active.host);
    },
    { passive: true }
  );
  window.addEventListener(
    "scroll",
    () => {
      if (active) clampTipToScreen(active.tip, active.host);
    },
    { passive: true }
  );
}

function initClientEnhancements() {
  setupBackToPosts();
  setupCodeBlockActions();
  setupImageOpenInNewTab();
  setupListPrefetch();
  setupAboutPersonAnchors();
  setupAboutTips();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initClientEnhancements);
} else {
  initClientEnhancements();
}

setupNewPostButton();
setupGitHubEditButton();

