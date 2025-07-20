export interface ParsedImage {
  src: string;
  alt: string | undefined;
  width: string | undefined;
  height: string | undefined;
  originalTag: string;
}

export const hasImage = (content: string): boolean =>
  /<img[^>]*src="([^"]+)"[^>]*>/.test(content);

export const parseImages = (content: string): ParsedImage[] => {
  const images: ParsedImage[] = [];

  // Regex to match any img tags
  const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/gi;

  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const src = match[1];

    // Extract additional attributes
    const altMatch = fullTag.match(/alt="([^"]*)"/i);
    const widthMatch = fullTag.match(/width="([^"]*)"/i);
    const heightMatch = fullTag.match(/height="([^"]*)"/i);

    images.push({
      src,
      alt: altMatch ? altMatch[1] : undefined,
      width: widthMatch ? widthMatch[1] : undefined,
      height: heightMatch ? heightMatch[1] : undefined,
      originalTag: fullTag,
    });
  }

  return images;
};
