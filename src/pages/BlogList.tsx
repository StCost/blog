import { Link } from "react-router-dom";
import config from "../config";
import NewPostButton from "../components/NewPostButton";
import { BlogPost } from "../types";

const BlogList = ({ posts }: { posts: BlogPost[] }) => (
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
              to={`/${post.filename.replace(".md", "")}`}
              className="post-link"
            >
              <li className="post-item">
                <small className="post-filename">{post.filename}</small>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
              </li>
            </Link>
          ))}
        </ul>
      )}

      <div className="new-post-section">
        <NewPostButton />
      </div>
    </main>
  </>
);

export default BlogList;
