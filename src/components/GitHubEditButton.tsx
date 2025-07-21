import React from "react";
import config from "../config";

interface GitHubEditButtonProps {
  filename: string;
}

const GitHubEditButton: React.FC<GitHubEditButtonProps> = ({ filename }) => {
  const handleEdit = () => {
    // Construct GitHub edit URL
    // Format: https://github.com/{username}/{repo}/edit/main/src/posts/{filename}
    const githubUrl = config.social.github;

    if (!githubUrl) {
      console.warn("GitHub URL not configured in config.ts");
      return;
    }

    // Extract username and repo from GitHub URL
    const githubMatch = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!githubMatch) {
      console.warn("Invalid GitHub URL format in config.ts");
      return;
    }

    const [, username, repo] = githubMatch;
    const editUrl = `https://github.com/${username}/${repo}/edit/main/src/posts/${filename}`;

    // Open in new window
    window.open(editUrl, "_blank");
  };

  return (
    <span
      onClick={handleEdit}
      className="github-edit-button"
      style={{ cursor: "pointer" }}
    >
      {filename}
    </span>
  );
};

export default GitHubEditButton;
