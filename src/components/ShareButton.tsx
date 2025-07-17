import React from 'react';

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, url, className = '' }) => {
  const handleShare = () => {
    // Encode the title and URL for Twitter
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    
    // Create Twitter share URL with pre-filled content
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    
    // Open in new window
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <button 
      onClick={handleShare}
      className={`share-button ${className}`}
      title="Share on X (Twitter)"
      aria-label="Share this post on X (Twitter)"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      <span>Share on X</span>
    </button>
  );
};

export default ShareButton; 