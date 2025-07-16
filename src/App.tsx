import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import { initializeDocumentMeta } from './utils';

const App = () => {
  useEffect(() => {
    initializeDocumentMeta();
  }, []);

  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className="container">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/post/:filename" element={<BlogPost />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 