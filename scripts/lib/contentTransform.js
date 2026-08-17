// Mirrors the current SaintBlog behavior.

export const replaceImageTags = (content) =>
  content.replace(/<img\b[^>]*>/gi, (imgTag) => {
    const srcMatch = imgTag.match(/\bsrc=["']([^"']+)["']/i);
    if (!srcMatch?.[1]) return imgTag;

    const src = srcMatch[1];
    const alt = imgTag.match(/\balt=["']([^"']*)["']/i)?.[1] || src;
    const width = imgTag.match(/\bwidth=["']?(\d+)["']?/i)?.[1];
    const height = imgTag.match(/\bheight=["']?(\d+)["']?/i)?.[1];

    // Preserve intrinsic dimensions so browsers can reserve space and avoid CLS.
    if (width && height) {
      return `<img src="${src}" alt="${alt}" width="${width}" height="${height}" />`;
    }

    return `![${alt}](${src})`;
  });

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

const SOUNDCLOUD_URL =
  /^(https:\/\/(?:www\.|m\.)?soundcloud\.com\/[A-Za-z0-9_-]+\/(?:sets\/)?[A-Za-z0-9_-]+)(?:\?[^\s]*)?$/i;

const embedSoundCloud = (line) => {
  const match = line.trim().match(SOUNDCLOUD_URL);
  if (!match) return line;
  const src =
    "https://w.soundcloud.com/player/?url=" +
    encodeURIComponent(match[1]) +
    "&color=%23ff8c42&inverse=true&auto_play=false&show_user=true";
  return `<div class="soundcloud-embed"><iframe width="100%" height="20" scrolling="no" frameborder="no" allow="autoplay" title="SoundCloud player" src="${src}"></iframe></div>`;
};

const isSoundCloudUrl = (trimmed) => SOUNDCLOUD_URL.test(trimmed);

export const replaceSoundCloudUrls = (content) =>
  content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      return trimmed && isSoundCloudUrl(trimmed) ? embedSoundCloud(trimmed) : line;
    })
    .join("\n");

