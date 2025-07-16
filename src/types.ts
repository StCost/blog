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
  description: string;
  tagline: string;
  author: string;
  url: string;
  favicon: string;
}

export interface MetaConfig {
  keywords: string;
  language: string;
  twitterHandle: string;
  ogImage: string;
}

export interface UIConfig {
  loadingPosts: string;
  loadingPost: string;
  postNotFound: string;
  noPosts: string;
  backToPosts: string;
  defaultTitle: string;
  defaultExcerpt: string;
  readMore: string;
  share: string;
}

export interface BlogConfig {
  postsDirectory: string;
  excerptLength: number;
  postsPerPage: number;
  dateFormat: string;
  showDates: boolean;
  showAuthor: boolean;
  enableComments: boolean;
}

export interface ThemeConfig {
  primaryColor: string;
  darkMode: boolean;
  showScrollbar: boolean;
  animations: boolean;
}

export interface SocialConfig {
  github: string;
  twitter: string;
  linkedin: string;
  email: string;
  rss: string;
}

export interface FeaturesConfig {
  search: boolean;
  tags: boolean;
  categories: boolean;
  analytics: boolean;
  rss: boolean;
}

export interface Config {
  site: SiteConfig;
  meta: MetaConfig;
  ui: UIConfig;
  blog: BlogConfig;
  theme: ThemeConfig;
  social: SocialConfig;
  features: FeaturesConfig;
}

export interface PostParams extends Record<string, string | undefined> {
  filename?: string;
} 