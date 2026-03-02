import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import config from "../config";
import { replaceImageTags, replaceYouTubeUrls } from "../helpers/contentTransform";
import { usePostByFilename } from "../helpers/usePosts";
import CodeBlock from "./CodeBlock";

const STORAGE_KEY = "saintblog-pinned-collapsed";
const collapsedStyle = { maxHeight: "3em", overflow: "hidden", paddingTop: "0.25rem", paddingLeft: "0.5rem" };

const getStoredCollapsed = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const PinnedPost = () => {
  const pinnedFilename = config.blog.pinnedPost;
  const { content, title, loading, error } = usePostByFilename(pinnedFilename);
  const [collapsed, setCollapsed] = useState(() => getStoredCollapsed());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  if (!pinnedFilename || loading || error) return null;
  if (!content) return null;

  const toggle = () => setCollapsed((c) => !c);

  return (
    <section className="pinned-post-wrap" aria-label="Pinned post">
      <div className="pinned-post-actions" aria-hidden>
        <button
          type="button"
          className="code-block-btn"
          onClick={toggle}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "More" : "Less"}
        </button>
        <Link
          to={`/${pinnedFilename}`}
          className="code-block-btn pinned-post-link"
          title="Open full post"
        >
          Open
        </Link>
      </div>
      <div
        className="pinned-post-content post-content"
        style={
          collapsed
            ? collapsedStyle
            : undefined
        }
      >
        {collapsed ? (
          <h3 className="post-title">{title}</h3>
        ) : (
        <ReactMarkdown
          rehypePlugins={[rehypeRaw as never]}
          components={{ pre: CodeBlock as never }}
        >
          {replaceYouTubeUrls(replaceImageTags(content))}
        </ReactMarkdown>
        )}
      </div>
    </section>
  );
};

export default PinnedPost;
