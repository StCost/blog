// Mirrors the current SaintBlog behavior.

export const replaceImageTags = (content) =>
  content.replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, (_, src) => `![${src}](${src})`);

const YOUTUBE_WATCH = /^(https:\/\/(?:www\.)?youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})$/m;
const YOUTUBE_SHORT = /^(https:\/\/youtu\.be\/)([A-Za-z0-9_-]{11})$/m;
const YOUTUBE_SHORTS = /^(https:\/\/(?:www\.)?youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})$/m;

const embedYouTube = (line) => {
  let videoId = null;
  const watchMatch = line.match(YOUTUBE_WATCH);
  const shortMatch = line.match(YOUTUBE_SHORT);
  const shortsMatch = line.match(YOUTUBE_SHORTS);
  if (watchMatch) videoId = watchMatch[2];
  else if (shortMatch) videoId = shortMatch[2];
  else if (shortsMatch) videoId = shortsMatch[2];
  if (!videoId) return line;
  return `<div class="youtube-embed"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
};

const isYouTubeUrl = (trimmed) =>
  YOUTUBE_WATCH.test(trimmed) || YOUTUBE_SHORT.test(trimmed) || YOUTUBE_SHORTS.test(trimmed);

export const replaceYouTubeUrls = (content) =>
  content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      return trimmed && isYouTubeUrl(trimmed) ? embedYouTube(trimmed) : line;
    })
    .join("\n");

