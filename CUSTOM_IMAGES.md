# Custom Image Parsing Feature

This feature automatically detects and properly displays any HTML img tags in blog posts with enhanced loading states and error handling.

## How it Works

When a blog post contains an `<img>` tag (like `<img width="2552" height="861" alt="image" src="https://example.com/image.jpg" />`), the system will:

1. **Parse the content** - Extract image information from the markdown
2. **Create a custom component** - Use `CustomImage` component instead of regular `<img>` tags
3. **Handle loading states** - Show loading spinner while image loads
4. **Error handling** - Display error message if image fails to load
5. **Fallback support** - Provide direct link to image if display fails

## Components Created

### `CustomImage.tsx`

- Custom React component for displaying any images
- Handles loading states with spinner animation
- Error handling with fallback options
- Responsive design with hover effects

### `MarkdownWithImages.tsx`

- Wrapper around ReactMarkdown that intercepts image tags
- Automatically detects any HTML img tags
- Replaces them with the custom `CustomImage` component
- Preserves regular markdown image handling

### `imageParser.ts`

- Utility functions for parsing any image URLs
- Extracts image attributes (src, alt, width, height)
- Helper functions for checking content and extracting URLs

## Usage

The feature is automatically enabled for all blog posts. When you include any image in your markdown:

```markdown
<img width="2552" height="861" alt="image" src="https://example.com/image.jpg" />
```

It will be automatically processed and displayed with:

- Loading spinner while the image loads
- Error handling if the image fails to load
- Responsive design that works on all screen sizes
- Hover effects for better user experience

## Features

- ✅ **Automatic Detection** - No manual configuration needed
- ✅ **Loading States** - Visual feedback while images load
- ✅ **Error Handling** - Graceful fallbacks for failed loads
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Hover Effects** - Enhanced user experience
- ✅ **Console Logging** - Debug information for development
- ✅ **TypeScript Support** - Full type safety
- ✅ **Universal Support** - Works with any image URL

## CSS Classes

The feature adds several CSS classes for styling:

- `.custom-image` - Main image container
- `.image-loading` - Loading state container
- `.image-error` - Error state container
- `.loading-spinner` - Loading spinner container
- `.spinner` - Animated spinner element

## Example

In your markdown post:

```markdown
# My Blog Post

Here's an image:

<img width="800" height="600" alt="Screenshot" src="https://example.com/image.jpg" />

The image above will be automatically processed and displayed with loading states and error handling.
```

## Technical Details

- Uses regex patterns to detect any HTML img tags
- Integrates with ReactMarkdown's component system
- Handles CORS and network errors gracefully
- Maintains backward compatibility with regular markdown images
- Includes TypeScript interfaces for type safety
