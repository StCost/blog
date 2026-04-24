/** Non-empty env overrides file defaults (build / CI). */
function envOverride(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === null) return fallback;
  const trimmed = String(raw).trim();
  return trimmed === "" ? fallback : trimmed;
}

const defaults = {
  site: {
    title: "👼 Dreaming Saints 👼",
    tagline:
      "Developing 🚕 COLLAPSE MACHINE 💥, a tesla-punk co-op open-world imm-sim sci-fi sandbox",
    url: "",
    companyName: "Dreaming Saints"
  },
  ui: {
    backToPosts: "← Back to posts",
    noPosts: "No posts found"
  },
  blog: {
    postsPerPage: 10,
    excerptLength: 120
  }
};

export default {
  site: {
    ...defaults.site,
    title: envOverride("SITE_TITLE", defaults.site.title),
    tagline: envOverride("SITE_TAGLINE", defaults.site.tagline),
    companyName: envOverride("SITE_COMPANY_NAME", defaults.site.companyName)
  },
  ui: defaults.ui,
  blog: defaults.blog
};
