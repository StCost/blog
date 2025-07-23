import React, { useState, useEffect } from "react";
import { generateNewPostUrl } from "../utils/githubLinks";

const postFiles = import.meta.glob("../posts/*.md", { as: "raw" });

const NewPostButton: React.FC = () => {
  const [nextNumber, setNextNumber] = useState<number>(1);

  useEffect(() => {
    const calculateNextNumber = () => {
      const filenames = Object.keys(postFiles).map((path) => {
        const filename = path.split("/").pop();
        return filename || "";
      });

      let maxNumber = 0;

      filenames.forEach((filename) => {
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
    const paddedNumber = nextNumber.toString().padStart(3, "0");
    const suggestedFilename = `${paddedNumber}-new-post.md`;
    const newPostUrl = generateNewPostUrl(suggestedFilename);

    if (!newPostUrl) {
      console.warn("Failed to generate GitHub new post URL");
      return;
    }

    window.open(newPostUrl, "_blank");
  };

  return (
    <button
      onClick={handleNewPost}
      className="new-post-button new-post-button-main"
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
