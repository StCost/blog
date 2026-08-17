const thumbnailCache = new Map();

export async function fetchSoundCloudThumbnail(trackUrl) {
  if (!trackUrl) return null;
  if (thumbnailCache.has(trackUrl)) return thumbnailCache.get(trackUrl);

  const pending = (async () => {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 8000);
    try {
      const res = await fetch(
        `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(trackUrl)}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "StCost-blog"
          },
          signal: ac.signal
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      const thumb = typeof data?.thumbnail_url === "string" ? data.thumbnail_url.trim() : "";
      return thumb || null;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  })();

  thumbnailCache.set(trackUrl, pending);
  return pending;
}
