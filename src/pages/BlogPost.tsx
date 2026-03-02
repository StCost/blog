import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Link, useParams } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";
import GitHubEditButton from "../components/GitHubEditButton";
import ShareButton from "../components/ShareButton";
import config from "../config";
import { usePostByFilename } from "../helpers/usePosts";
import { replaceImageTags, replaceYouTubeUrls } from "../helpers/contentTransform";
import { PostParams } from "../types";

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
        <ReactMarkdown
          rehypePlugins={[rehypeRaw as never]}
          components={{ pre: CodeBlock as never }}
        >
          {replaceYouTubeUrls(replaceImageTags(content))}
        </ReactMarkdown>
        <div className="post-actions">
          <ShareButton title={postTitle} url={window.location.href} />
        </div>
      </article>
    </>
  );
};

export default BlogPost;
