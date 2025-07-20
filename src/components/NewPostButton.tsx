import React, { useState, useEffect } from "react";
import config from "../config";

interface NewPostButtonProps {
  className?: string;
}

const postFiles = import.meta.glob("../posts/*.md", { as: "raw" });

const NewPostButton: React.FC<NewPostButtonProps> = ({ className = "" }) => {
  const [nextNumber, setNextNumber] = useState<number>(1);

  useEffect(() => {
    const calculateNextNumber = () => {
      const filenames = Object.keys(postFiles).map((path) => {
        const filename = path.split("/").pop();
        return filename || "";
      });

      let maxNumber = 0;

      filenames.forEach((filename) => {
        // Extract number from filename (e.g., "001-first-post.md" -> 1)
        const numberMatch = filename.match(/^(\d+)/);
        if (numberMatch) {
          const number = parseInt(numberMatch[1], 10);
          if (number > maxNumber) {
            maxNumber = number;
          }
        }
      });

      setNextNumber(maxNumber + 1);
    };

    calculateNextNumber();
  }, []);

  const handleNewPost = () => {
    // Construct GitHub new file URL with prefilled filename
    // Format: https://github.com/{username}/{repo}/new/main/src/posts?filename={nextNumber}-new-post.md
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
    const paddedNumber = nextNumber.toString().padStart(3, "0");
    const suggestedFilename = `${paddedNumber}-new-post.md`;
    const newPostUrl = `https://github.com/${username}/${repo}/new/main/src/posts?filename=${encodeURIComponent(suggestedFilename)}`;

    // Open in new window
    window.open(newPostUrl, "_blank");
  };

  return (
    <button
      onClick={handleNewPost}
      className={`new-post-button ${className}`}
      title="Create New Post"
      aria-label="Create a new blog post on GitHub"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
      <span>New Post</span>
    </button>
  );
};

export default NewPostButton;
