import { Config } from "./types";

/**
 * NOTE: also visit index.html to configure meta tags
 */

export const config: Config = {
  site: {
    title: "🎊 COLLAPSE MACHINE 🚘",
    tagline:
      "✨ Dreaming Saints 👼 studio developing my co-op FPS open world dream-game: COLLAPSE MACHINE",
  },

  ui: {
    loadingPosts: "Loading blessed posts...",
    loadingPost: "Loading post...",
    postNotFound: "Post not found",
    noPosts: "No posts found. Add some .md files to public/posts/ directory!",
    backToPosts: "← Back to posts",
    defaultTitle: "Untitled Post",
    defaultExcerpt: "No excerpt available...",
    readMore: "Read more...",
    share: "Share this post",
  },

  blog: {
    postsDirectory: "../posts",
    excerptLength: 100,
    postsPerPage: 10,
    dateFormat: "MMMM d, yyyy",
    showDates: false,
    showAuthor: false,
    enableComments: false,
  },

  theme: {
    primaryColor: "#ff8c42",
    darkMode: true,
    showScrollbar: true,
    animations: true,
  },

  social: {
    github: "https://github.com/StCost/blog",
    twitter: "",
    linkedin: "",
    email: "",
    rss: "/feed.xml",
  },

  features: {
    search: false,
    tags: false,
    categories: false,
    analytics: false,
    rss: false,
  },
};

export default config;
