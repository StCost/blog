const parseGitHubPagesUrl = () => {
  const url = window.location.href;
  const match = url.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);

  if (!match) {
    alert(`Invalid GitHub Pages URL format: ${url}`);
    return null;
  }

  const [, username, repo] = match;
  return { username, repo };
};

const generateEditUrl = (filename: string): string | null => {
  const parsed = parseGitHubPagesUrl();

  if (!parsed) {
    return null;
  }

  const { username, repo } = parsed;
  return `https://github.com/${username}/${repo}/edit/main/src/posts/${filename}`;
};

const generateNewPostUrl = (suggestedFilename: string): string | null => {
  const parsed = parseGitHubPagesUrl();

  if (!parsed) {
    return null;
  }

  const { username, repo } = parsed;
  return `https://github.com/${username}/${repo}/new/main/src/posts?filename=${encodeURIComponent(suggestedFilename)}`;
};

export { generateEditUrl, generateNewPostUrl };
