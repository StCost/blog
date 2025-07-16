# Blog Configuration Guide

This guide explains how to customize your Saint Blog using the configuration file.

## Configuration File

All blog settings and text are centralized in `src/config.js`. This file contains various sections for different aspects of the blog:

### Site Information
```javascript
site: {
  title: "✨ Saint Blog 👼",           // Main blog title
  description: "A blessed collection...", // Meta description for SEO
  tagline: "Sharing divine inspiration...", // Subtitle shown under title
  author: "Saint Blogger",             // Blog author name
  url: "https://your-domain.com",      // Your blog's URL
  favicon: "/favicon.svg"              // Path to favicon
}
```

### UI Text and Messages
```javascript
ui: {
  loadingPosts: "Loading blessed posts...",     // Loading message for post list
  loadingPost: "Loading post...",               // Loading message for single post
  postNotFound: "Post not found",               // Error when post doesn't exist
  noPosts: "No posts found...",                 // Message when no posts exist
  backToPosts: "← Back to posts",               // Navigation back link text
  defaultTitle: "Untitled Post",                // Default title for posts without one
  defaultExcerpt: "No excerpt available...",    // Default excerpt text
}
```

### Blog Settings
```javascript
blog: {
  postsDirectory: "../posts",          // Directory containing markdown files
  excerptLength: 100,                  // Number of characters in post excerpts
  postsPerPage: 10,                    // Posts per page (for future pagination)
  dateFormat: "MMMM d, yyyy",          // Date format (for future use)
  showDates: false,                    // Whether to show post dates
  showAuthor: false,                   // Whether to show author info
  enableComments: false                // Whether to enable comments
}
```

### SEO and Meta Tags
```javascript
meta: {
  keywords: "blog, thoughts, inspiration, writing", // SEO keywords
  language: "en",                                    // Site language
  twitterHandle: "@yourblog",                       // Twitter handle for cards
  ogImage: "/og-image.jpg"                          // Open Graph image for sharing
}
```

### Theme Settings
```javascript
theme: {
  primaryColor: "#ff8c42",            // Primary accent color
  darkMode: true,                     // Enable dark mode
  showScrollbar: true,                // Show custom scrollbar
  animations: true                    // Enable animations
}
```

### Social Links
```javascript
social: {
  github: "",                         // GitHub profile URL
  twitter: "",                        // Twitter profile URL
  linkedin: "",                       // LinkedIn profile URL
  email: "",                          // Contact email
  rss: "/feed.xml"                    // RSS feed URL
}
```

### Feature Toggles
```javascript
features: {
  search: false,                      // Enable search functionality
  tags: false,                        // Enable post tags
  categories: false,                  // Enable post categories
  analytics: false,                   // Enable analytics
  rss: false                          // Enable RSS feed
}
```

## How to Customize

1. **Open** `src/config.js`
2. **Edit** any values you want to change
3. **Save** the file
4. **Restart** your development server if needed

## Quick Customization Checklist

### Essential Changes
- [ ] Update `site.title` with your blog name
- [ ] Change `site.description` for SEO
- [ ] Set `site.tagline` for your subtitle
- [ ] Update `site.author` with your name
- [ ] Set `site.url` to your domain

### Optional Customizations
- [ ] Adjust `blog.excerptLength` for longer/shorter previews
- [ ] Customize loading and error messages in `ui` section
- [ ] Add your social media links in `social` section
- [ ] Update SEO keywords in `meta.keywords`
- [ ] Change `theme.primaryColor` to match your brand

## Advanced Usage

### Accessing Config in Components
```javascript
import config from '../config.js'

// Use in your component
const MyComponent = () => {
  return <h1>{config.site.title}</h1>
}
```

### Dynamic Title Updates
```javascript
import { updateDocumentTitle } from '../utils'

// Update page title dynamically
updateDocumentTitle("Custom Page Title")
```

### Adding New Configuration Options

1. Add your new option to `src/config.js`:
```javascript
ui: {
  // ... existing options
  myNewMessage: "Hello World!"
}
```

2. Use it in your components:
```javascript
import config from '../config.js'

const MyComponent = () => {
  return <p>{config.ui.myNewMessage}</p>
}
```

## Tips

- **Restart** the development server after major config changes
- **Test** your changes in both development and production builds
- **Backup** your config before making major changes
- **Keep** the structure intact when editing - only change the values
- **Use** meaningful names for any custom configuration you add

## Troubleshooting

**Config changes not showing?**
- Make sure you saved the file
- Restart the development server
- Check browser console for errors

**Breaking the app?**
- Check that all quotes and commas are properly formatted
- Ensure no trailing commas after the last property
- Verify the JavaScript syntax is valid 