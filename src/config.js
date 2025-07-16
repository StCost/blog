// Blog Configuration
export const config = {
  // Site Information
  site: {
    title: "✨ Saint Blog 👼",
    description: "A blessed collection of thoughts and musings",
    tagline: "Sharing divine inspiration, one post at a time",
    author: "Saint Blogger",
    url: "https://your-domain.com",
    favicon: "/favicon.svg"
  },

  // SEO and Meta Tags
  meta: {
    keywords: "blog, thoughts, inspiration, writing",
    language: "en",
    twitterHandle: "@yourblog",
    ogImage: "/og-image.jpg"
  },

  // UI Text and Messages
  ui: {
    // Loading messages
    loadingPosts: "Loading blessed posts...",
    loadingPost: "Loading post...",
    
    // Error messages
    postNotFound: "Post not found",
    noPosts: "No posts found. Add some .md files to public/posts/ directory!",
    
    // Navigation
    backToPosts: "← Back to posts",
    
    // Post metadata
    defaultTitle: "Untitled Post",
    defaultExcerpt: "No excerpt available...",
    
    // Actions
    readMore: "Read more...",
    share: "Share this post"
  },

  // Blog Settings
  blog: {
    postsDirectory: "../posts",
    excerptLength: 100,
    postsPerPage: 10,
    dateFormat: "MMMM d, yyyy",
    showDates: false,
    showAuthor: false,
    enableComments: false
  },

  // Theme and Layout
  theme: {
    primaryColor: "#ff8c42",
    darkMode: true,
    showScrollbar: true,
    animations: true
  },

  // Social Links (optional)
  social: {
    github: "",
    twitter: "",
    linkedin: "",
    email: "",
    rss: "/feed.xml"
  },

  // Features
  features: {
    search: false,
    tags: false,
    categories: false,
    analytics: false,
    rss: false
  }
}

export default config 