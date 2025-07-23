import { FC } from "react";
import { generateEditUrl } from "../helpers/externalLinks";

interface GitHubEditButtonProps {
  filename: string;
}

const GitHubEditButton: FC<GitHubEditButtonProps> = ({ filename }) => {
  const handleEdit = () => {
    const editUrl = generateEditUrl(filename);

    if (!editUrl) {
      console.warn("Failed to generate GitHub edit URL");
      return;
    }

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
