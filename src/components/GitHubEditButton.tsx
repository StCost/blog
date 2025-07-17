import React from 'react';
import config from '../config';

interface GitHubEditButtonProps {
  filename: string;
  className?: string;
}

const GitHubEditButton: React.FC<GitHubEditButtonProps> = ({ filename, className = '' }) => {
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
    <button 
      onClick={handleEdit}
      className={`github-edit-button ${className}`}
      title="Edit on GitHub"
      aria-label="Edit this post on GitHub"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>Edit on GitHub</span>
    </button>
  );
};

export default GitHubEditButton; 