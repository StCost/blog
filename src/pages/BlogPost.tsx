import { useParams, Link } from "react-router-dom";
import config from "../config";
import { PostParams } from "../types";
import ShareButton from "../components/ShareButton";
import GitHubEditButton from "../components/GitHubEditButton";
import { usePostByFilename } from "../usePosts";
import ReactMarkdown from "react-markdown";

// replace <img> tags with ![]()
// why: GitHub .md editor allows to CTRL+V paste images, they uploaded to GitHub and returned as <img> tags. replaced to basic markdown syntax to display on our site
const replaceImageTags = (content: string) =>
  content.replace(
    /<img[^>]*src="([^"]+)"[^>]*>/gi,
    (_, src) => `![${src}](${src})`,
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
        <ReactMarkdown>{replaceImageTags(content)}</ReactMarkdown>
        <div className="post-actions">
          <ShareButton title={postTitle} url={window.location.href} />
        </div>
      </article>
    </>
  );
};

export default BlogPost;
