import { useState, useEffect } from 'react';

interface ImageProps {
  src: string;
  alt: string | undefined;
  width: string | undefined;
  height: string | undefined;
  className?: string;
}

const MarkdownImage: React.FC<ImageProps> = ({ 
  src, 
  alt = 'Image', 
  width, 
  height, 
  className = '' 
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading image:', src);
        setImageUrl(src);
      } catch (err) {
        console.error('Error loading image:', err);
        setError('Failed to load image');
        // Still try to display the original URL as fallback
        setImageUrl(src);
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      loadImage();
    }
  }, [src]);

  if (loading) {
    return (
      <div className={`image-loading ${className}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading image...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`image-error ${className}`}>
        <p>Error loading image: {error}</p>
        <a href={src} target="_blank" rel="noopener noreferrer">
          View image directly
        </a>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={`custom-image ${className}`}
      onError={() => setError('Image failed to load')}
      style={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '6px',
        margin: '1rem 0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'box-shadow 0.2s ease'
      }}
    />
  );
};

export default MarkdownImage; 