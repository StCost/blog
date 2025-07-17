import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';
import { BlogPost, BlogPostMeta } from '../types';
import NewPostButton from './NewPostButton';

const postFiles = import.meta.glob('../posts/*.md', { as: 'raw' });

const extractPostMeta = (content: string): BlogPostMeta => {
  const lines = content.split('\n');
  const titleLine = lines.find(line => line.startsWith('# '));
  const title = titleLine ? titleLine.replace('# ', '').trim() : config.ui.defaultTitle;
  
  const contentLines = lines.slice(lines.findIndex(line => line.startsWith('# ')) + 1);
  const firstParagraph = contentLines.find(line => line.trim() && !line.startsWith('#'));
  const excerpt = firstParagraph ? firstParagraph.trim().substring(0, config.blog.excerptLength) + '...' : config.ui.defaultExcerpt;
  
  return { title, excerpt };
};

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPosts = async (): Promise<void> => {
      try {
        const loadedPosts: BlogPost[] = [];
        
        for (const [path, loader] of Object.entries(postFiles)) {
          const content = await loader();
          const filename = path.split('/').pop();
          
          if (!filename) continue;
          
          const { title, excerpt } = extractPostMeta(content);
          
          loadedPosts.push({
            filename,
            title,
            excerpt,
            content
          });
        }
        
        const sortedPosts = loadedPosts.sort((a, b) => {
          const numA = a.filename.match(/^(\d+)/)?.[0];
          const numB = b.filename.match(/^(\d+)/)?.[0];
          
          if (numA && numB) {
            return parseInt(numB) - parseInt(numA);
          }
          
          if (numA && !numB) return -1;
          if (!numA && numB) return 1;
          
          return a.filename.localeCompare(b.filename);
        });
        
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);
  
  if (loading) {
    return (
      <>
        <header className="header">
          <h1>{config.site.title}</h1>
          {config.site.tagline && <p>{config.site.tagline}</p>}
        </header>
        <div className="loading">{config.ui.loadingPosts}</div>
      </>
    );
  }

  return (
    <>
      <header className="header">
        <h1>{config.site.title}</h1>
        {config.site.tagline && <p>{config.site.tagline}</p>}
      </header>
      
      <main>
        {posts.length === 0 ? (
          <div className="loading">{config.ui.noPosts}</div>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <Link 
                key={post.filename}
                to={`/${post.filename.replace('.md', '')}`}
                className="post-link"
              >
                <li className="post-item">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-excerpt">{post.excerpt}</p>
                </li>
              </Link>
            ))}
          </ul>
        )}
        
        <div className="new-post-section">
          <NewPostButton className="new-post-button-main" />
        </div>
      </main>
    </>
  );
};

export default BlogList; 