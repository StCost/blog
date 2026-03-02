// replace <img> tags with ![]()
// GitHub .md editor allows CTRL+V paste images; they become <img> tags — normalize to markdown
export const replaceImageTags = (content: string) =>
  content.replace(
    /<img[^>]*src="([^"]+)"[^>]*>/gi,
    (_, src) => `![${src}](${src})`,
  );

const YOUTUBE_WATCH = /^(https:\/\/(?:www\.)?youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})$/m;
const YOUTUBE_SHORT = /^(https:\/\/youtu\.be\/)([A-Za-z0-9_-]{11})$/m;

const embedYouTube = (line: string): string => {
  let videoId: string | null = null;
  const watchMatch = line.match(YOUTUBE_WATCH);
  const shortMatch = line.match(YOUTUBE_SHORT);
  if (watchMatch) videoId = watchMatch[2];
  else if (shortMatch) videoId = shortMatch[2];
  if (!videoId) return line;
  return `<div class="youtube-embed"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
};

export const replaceYouTubeUrls = (content: string) =>
  content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      return trimmed && (YOUTUBE_WATCH.test(trimmed) || YOUTUBE_SHORT.test(trimmed))
        ? embedYouTube(trimmed)
        : line;
    })
    .join("\n");
