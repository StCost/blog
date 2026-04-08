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

setupNewPostButton();
setupGitHubEditButton();

