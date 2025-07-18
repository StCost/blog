import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import config from '../config';
import { PostParams } from '../types';
import ShareButton from './ShareButton';
import GitHubEditButton from './GitHubEditButton';

const postFiles = import.meta.glob('../posts/*.md', { as: 'raw' });
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
});

const BlogPost = () => {
  const { filename } = useParams<PostParams>();
  const [content, setContent] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const postPath = Object.keys(postFiles).find(path => 
          path.includes(`${filename}.md`)
        );
        
        if (!postPath) {
          throw new Error(config.ui.postNotFound);
        }
        
        const markdownContent = await postFiles[postPath]();
        const htmlContent = md.render(markdownContent);
        setContent(htmlContent);
        
        // Extract title from markdown content (first # heading)
        const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : config.ui.defaultTitle;
        setPostTitle(title);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (filename) {
      loadPost();
    }
  }, [filename]);

  if (loading) {
    return (
      <>
        <Link to="/" className="back-link">{config.ui.backToPosts}</Link>
        <article className="post-content">
          <div className="loading">{config.ui.loadingPost}</div>
        </article>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Link to="/" className="back-link">{config.ui.backToPosts}</Link>
        <div className="error">Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <Link to="/" className="back-link">{config.ui.backToPosts}</Link>
      <article className="post-content">
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <div className="post-actions">
          <GitHubEditButton 
            filename={`${filename}.md`}
            className="post-edit-button"
          />
          <ShareButton 
            title={postTitle}
            url={window.location.href}
            className="post-share-button"
          />
        </div>
      </article>
    </>
  );
};

export default BlogPost; 