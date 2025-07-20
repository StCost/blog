import { useParams, Link } from "react-router-dom";
import config from "../config";
import { PostParams } from "../types";
import ShareButton from "../components/ShareButton";
import GitHubEditButton from "../components/GitHubEditButton";
import { usePostByFilename } from "../usePosts";
import { hasImage } from "../utils/imageParser";
import ReactMarkdown from "react-markdown";
import { lazy } from "react";
const ReactMarkdownWithImages = lazy(
  () => import("../components/MarkdownWithImages"),
);

const BlogPost = () => {
  const { filename } = useParams<PostParams>();
  const {
    content,
    title: postTitle,
    loading,
    error,
  } = usePostByFilename(filename);

  if (loading) {
    return (
      <>
        <Link to="/" className="back-link">
          {config.ui.backToPosts}
        </Link>
        <article className="post-content">
          <div className="loading">{config.ui.loadingPost}</div>
        </article>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Link to="/" className="back-link">
          {config.ui.backToPosts}
        </Link>
        <div className="error">Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <Link to="/" className="back-link">
        {config.ui.backToPosts}
      </Link>
      <article className="post-content">
        <small className="post-filename">
          <GitHubEditButton filename={`${filename}.md`} />
        </small>
        {hasImage(content) ? (
          <ReactMarkdownWithImages>{content}</ReactMarkdownWithImages>
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
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
