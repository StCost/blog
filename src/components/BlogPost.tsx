import { useParams, Link } from 'react-router-dom';
import MarkdownWithImages from './MarkdownWithImages';
import config from '../config';
import { PostParams } from '../types';
import ShareButton from './ShareButton';
import GitHubEditButton from './GitHubEditButton';
import { usePostByFilename } from '../usePosts';

const BlogPost = () => {
  const { filename } = useParams<PostParams>();
  const { content, title: postTitle, loading, error } = usePostByFilename(filename);

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
        <small className="post-filename">
          <GitHubEditButton filename={`${filename}.md`}>
            {filename}.md
          </GitHubEditButton>
        </small>
        <MarkdownWithImages>{content}</MarkdownWithImages>
        <div className="post-actions">
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