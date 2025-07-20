import ReactMarkdown from 'react-markdown';
import CustomImage from './CustomImage';
import { parseImages } from '../utils/imageParser';

interface MarkdownWithImagesProps {
  children: string;
  className?: string;
}

const MarkdownWithImages: React.FC<MarkdownWithImagesProps> = ({ 
  children, 
  className = '' 
}) => {
  
  // Create a component that renders the content with images
  const renderContent = () => {
    // Parse images from the content
    const images = parseImages(children);

    let processedContent = children;
    
    // Replace each image with a React component
    images.forEach((image, index) => {
      const placeholder = `{{IMAGE_${index}}}`;
      processedContent = processedContent.replace(image.originalTag, placeholder);
    });
    
    // Split content by placeholders and render
    const parts = processedContent.split(/({{IMAGE_\d+}})/);
    
    return parts.map((part, index) => {
      const imageMatch = part.match(/{{IMAGE_(\d+)}}/);
      if (imageMatch) {
        const imageIndex = parseInt(imageMatch[1]);
        const image = images[imageIndex];
        if (image) {
          return (
            <CustomImage
              key={`image-${imageIndex}`}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
            />
          );
        }
      }
      
      // Render markdown for non-image parts
      if (part.trim()) {
        return (
          <ReactMarkdown key={`markdown-${index}`}>
            {part}
          </ReactMarkdown>
        );
      }
      
      return null;
    });
  };

  return (
    <div className={className}>
      {renderContent()}
    </div>
  );
};

export default MarkdownWithImages; 