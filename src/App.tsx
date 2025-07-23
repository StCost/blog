import { lazy } from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { usePosts } from "./helpers/usePosts";
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

const App = () => {
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
