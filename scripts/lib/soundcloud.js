import fs from "node:fs";
import path from "node:path";

const thumbnailCache = new Map();

const UA =
  "Mozilla/5.0 (compatible; StCost-blog/1.0; +https://github.com/StCost/blog)";

export function soundCloudPlayerSrc(trackUrl) {
  return (
    "https://w.soundcloud.com/player/?url=" +
    encodeURIComponent(trackUrl) +
    "&color=%23ff8c42&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=true"
  );
}

async function fetchWithTimeout(url, headers, ms) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), ms);
  try {
    return await fetch(url, { headers, signal: ac.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function oembedOnce(trackUrl) {
  const res = await fetchWithTimeout(
    `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(trackUrl)}`,
    { Accept: "application/json", "User-Agent": UA },
    12000
  );
  if (!res.ok) return null;
  const data = await res.json();
  const thumb = typeof data?.thumbnail_url === "string" ? data.thumbnail_url.trim() : "";
  return thumb || null;
}

export async function fetchSoundCloudThumbnail(trackUrl) {
  if (!trackUrl) return null;
  if (thumbnailCache.has(trackUrl)) return thumbnailCache.get(trackUrl);

  const pending = (async () => {
    try {
      return (await oembedOnce(trackUrl)) || (await oembedOnce(trackUrl));
    } catch {
      return null;
    }
  })();

  thumbnailCache.set(trackUrl, pending);
  const thumb = await pending;
  if (!thumb) console.warn(`SoundCloud cover missing for ${trackUrl}`);
  return thumb;
}

export async function saveSoundCloudCover(trackUrl, destPath) {
  const remoteUrl = await fetchSoundCloudThumbnail(trackUrl);
  if (!remoteUrl) return { remoteUrl: "", saved: false };
  try {
    const res = await fetchWithTimeout(remoteUrl, { "User-Agent": UA }, 15000);
    if (!res.ok) return { remoteUrl, saved: false };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 32) return { remoteUrl, saved: false };
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, buf);
    return { remoteUrl, saved: true };
  } catch {
    return { remoteUrl, saved: false };
  }
}
