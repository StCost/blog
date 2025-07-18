import React from 'react';
import config from '../config';

interface GitHubEditButtonProps {
  filename: string;
  className?: string;
  children: React.ReactNode;
}

const GitHubEditButton: React.FC<GitHubEditButtonProps> = ({ filename, className = '', children }) => {
  const handleEdit = () => {
    // Construct GitHub edit URL
    // Format: https://github.com/{username}/{repo}/edit/main/src/posts/{filename}
    const githubUrl = config.social.github;
    
    if (!githubUrl) {
      console.warn('GitHub URL not configured in config.ts');
      return;
    }
    
    // Extract username and repo from GitHub URL
    const githubMatch = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!githubMatch) {
      console.warn('Invalid GitHub URL format in config.ts');
      return;
    }
    
    const [, username, repo] = githubMatch;
    const editUrl = `https://github.com/${username}/${repo}/edit/main/src/posts/${filename}`;
    
    // Open in new window
    window.open(editUrl, '_blank');
  };

  return (
    <span 
      onClick={handleEdit}
      className={`github-edit-button ${className}`}
      title="Edit post file on GitHub"
      aria-label="Edit this post file on GitHub"
      style={{ cursor: 'pointer' }}
    >
      {children}
    </span>
  );
};

export default GitHubEditButton; 