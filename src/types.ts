export interface BlogPost {
  filename: string;
  title: string;
  excerpt: string;
  content: string;
  date?: string;
  author?: string;
}

export interface BlogPostMeta {
  title: string;
  excerpt: string;
}

export interface SiteConfig {
  title: string;
  tagline: string;
}

export interface UIConfig {
  loadingPosts: string;
  loadingPost: string;
  postNotFound: string;
  noPosts: string;
  backToPosts: string;
  defaultTitle: string;
  defaultExcerpt: string;
}

export interface BlogConfig {
  postsDirectory: string;
  excerptLength: number;
}

export interface SocialConfig {
  github: string;
}

export interface Config {
  site: SiteConfig;
  ui: UIConfig;
  blog: BlogConfig;
  social: SocialConfig;
}

export interface PostParams extends Record<string, string | undefined> {
  filename?: string;
}
