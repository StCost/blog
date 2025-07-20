import ReactMarkdown from "react-markdown";
import { parseImages } from "../utils/imageParser";
import MarkdownImage from "./MarkdownImage";

const MarkdownWithImages = ({ children }: { children: string }): React.ReactNode[] => {
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
            <MarkdownImage
                key={`image-${imageIndex}`}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
            />
            );
        }
        }

        return <ReactMarkdown key={`markdown-${index}`}>{part}</ReactMarkdown>;
    });
};

export default MarkdownWithImages;