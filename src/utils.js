import config from './config.js'

/**
 * Updates the document title
 * @param {string} title - The title to set (optional, defaults to site title)
 */
export const updateDocumentTitle = (title) => {
  document.title = title || config.site.title
}

/**
 * Updates meta tags in the document head
 */
export const updateMetaTags = () => {
  // Update description
  let descMeta = document.querySelector('meta[name="description"]')
  if (!descMeta) {
    descMeta = document.createElement('meta')
    descMeta.name = 'description'
    document.head.appendChild(descMeta)
  }
  descMeta.content = config.site.description

  // Update keywords
  let keywordsMeta = document.querySelector('meta[name="keywords"]')
  if (!keywordsMeta) {
    keywordsMeta = document.createElement('meta')
    keywordsMeta.name = 'keywords'
    document.head.appendChild(keywordsMeta)
  }
  keywordsMeta.content = config.meta.keywords

  // Update language
  document.documentElement.lang = config.meta.language

  // Update Open Graph tags
  updateOpenGraphTags()
}

/**
 * Updates Open Graph meta tags for social sharing
 */
const updateOpenGraphTags = () => {
  const ogTags = [
    { property: 'og:title', content: config.site.title },
    { property: 'og:description', content: config.site.description },
    { property: 'og:url', content: config.site.url },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: config.meta.ogImage }
  ]

  ogTags.forEach(({ property, content }) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.content = content
  })

  // Twitter Card tags
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: config.meta.twitterHandle },
    { name: 'twitter:title', content: config.site.title },
    { name: 'twitter:description', content: config.site.description },
    { name: 'twitter:image', content: config.meta.ogImage }
  ]

  twitterTags.forEach(({ name, content }) => {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = name
      document.head.appendChild(meta)
    }
    meta.content = content
  })
}

/**
 * Initializes all document meta data based on configuration
 */
export const initializeDocumentMeta = () => {
  updateDocumentTitle()
  updateMetaTags()
} 