import config from "./config";

interface MetaTag {
  property?: string;
  name?: string;
  content: string;
}

export const updateDocumentTitle = (title?: string): void => {
  document.title = title || config.site.title;
};

export const updateMetaTags = (): void => {
  let descMeta = document.querySelector(
    'meta[name="description"]',
  ) as HTMLMetaElement | null;
  if (!descMeta) {
    descMeta = document.createElement("meta");
    descMeta.name = "description";
    document.head.appendChild(descMeta);
  }
  descMeta.content = config.site.description;

  let keywordsMeta = document.querySelector(
    'meta[name="keywords"]',
  ) as HTMLMetaElement | null;
  if (!keywordsMeta) {
    keywordsMeta = document.createElement("meta");
    keywordsMeta.name = "keywords";
    document.head.appendChild(keywordsMeta);
  }
  keywordsMeta.content = config.meta.keywords;

  document.documentElement.lang = config.meta.language;
  updateOpenGraphTags();
};

const updateOpenGraphTags = (): void => {
  const ogTags: MetaTag[] = [
    { property: "og:title", content: config.site.title },
    { property: "og:description", content: config.site.description },
    { property: "og:url", content: config.site.url },
    { property: "og:type", content: "website" },
    { property: "og:image", content: config.meta.ogImage },
  ];

  ogTags.forEach(({ property, content }) => {
    let meta = document.querySelector(
      `meta[property="${property}"]`,
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property!);
      document.head.appendChild(meta);
    }
    meta.content = content;
  });

  const twitterTags: MetaTag[] = [
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: config.meta.twitterHandle },
    { name: "twitter:title", content: config.site.title },
    { name: "twitter:description", content: config.site.description },
    { name: "twitter:image", content: config.meta.ogImage },
  ];

  twitterTags.forEach(({ name, content }) => {
    let meta = document.querySelector(
      `meta[name="${name}"]`,
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = name!;
      document.head.appendChild(meta);
    }
    meta.content = content;
  });
};

export const initializeDocumentMeta = (): void => {
  updateDocumentTitle();
  updateMetaTags();
};
