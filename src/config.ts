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
  },

  blog: {
    postsDirectory: "../posts",
    excerptLength: 100,
  },

  social: {
    github: "https://github.com/StCost/blog",
  },
};

export default config;
