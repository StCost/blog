import { lazy, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
import { initializeDocumentMeta } from "./utils";
import { usePosts } from "./usePosts";

const App = () => {
  useEffect(() => {
    initializeDocumentMeta();
  }, []);

  const { posts, loading } = usePosts();

  if (loading) {
    return null;
  }

  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className="container">
        <Routes>
          <Route path="/" element={<BlogList posts={posts} />} />
          <Route path="/:filename" element={<BlogPost />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
