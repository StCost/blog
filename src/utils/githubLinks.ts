export function parseGitHubPagesUrl() {
  const url = window.location.href;
  const match = url.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);

  if (!match) {
    console.warn("Invalid GitHub Pages URL format:", url);
    return null;
  }

  const [, username, repo] = match;
  return { username, repo };
}

export function generateEditUrl(filename: string): string | null {
  const parsed = parseGitHubPagesUrl();

  if (!parsed) {
    return null;
  }

  const { username, repo } = parsed;
  return `https://github.com/${username}/${repo}/edit/main/src/posts/${filename}`;
}

export function generateNewPostUrl(suggestedFilename: string): string | null {
  const parsed = parseGitHubPagesUrl();

  if (!parsed) {
    return null;
  }

  const { username, repo } = parsed;
  return `https://github.com/${username}/${repo}/new/main/src/posts?filename=${encodeURIComponent(suggestedFilename)}`;
}
