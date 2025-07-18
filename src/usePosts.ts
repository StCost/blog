import { BlogPost, BlogPostMeta } from "./types";
import config from "./config";
import { useState, useEffect } from "react";

const postFiles = import.meta.glob('./posts/*.md', { as: 'raw' });

const extractPostMeta = (content: string): BlogPostMeta => {
    const lines = content.split('\n');
    const titleLine = lines.find(line => line.startsWith('# '));
    const title = titleLine ? titleLine.replace('# ', '').trim() : config.ui.defaultTitle;
    
    const contentLines = lines.slice(lines.findIndex(line => line.startsWith('# ')) + 1);
    const firstParagraph = contentLines.find(line => line.trim() && !line.startsWith('#'));
    const excerpt = firstParagraph ? firstParagraph.trim().substring(0, config.blog.excerptLength) + '...' : config.ui.defaultExcerpt;
    
    return { title, excerpt };
  };
  
const loadPosts = async (): Promise<BlogPost[]> => 
  ((await Promise.allSettled(
    Object.entries(postFiles).map(async ([path, loader]) => {
      const filename = path.split('/').pop();
      if (!filename) throw new Error('Invalid filename');
      
      const content = await loader();
      const { title, excerpt } = extractPostMeta(content);
      
      return {
        filename,
        title,
        excerpt,
        content
      };
    })
  ))
  .map(result => result.status === 'fulfilled' ? result.value : null)
  .filter(Boolean) as BlogPost[])
  .sort((a, b) => b.filename.localeCompare(a.filename)); // later letter first, or bigger number first (prefer numbers in name)

const usePosts = (): { posts: BlogPost[], loading: boolean } => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPosts().then(setPosts).finally(() => setLoading(false));
  }, []);

  return { posts, loading };
};

export { usePosts };