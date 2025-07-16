import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Auto-import all markdown files from posts directory
const postFiles = import.meta.glob('../posts/*.md', { as: 'raw' })

// Extract title and excerpt from markdown content
const extractPostMeta = (content) => {
  const lines = content.split('\n')
  const titleLine = lines.find(line => line.startsWith('# '))
  const title = titleLine ? titleLine.replace('# ', '').trim() : 'Untitled Post'
  
  // Get first paragraph as excerpt (skip title and empty lines)
  const contentLines = lines.slice(lines.findIndex(line => line.startsWith('# ')) + 1)
  const firstParagraph = contentLines.find(line => line.trim() && !line.startsWith('#'))
  const excerpt = firstParagraph ? firstParagraph.trim().substring(0, 100) + '...' : 'No excerpt available...'
  
  return { title, excerpt }
}

function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const loadedPosts = []
        
        for (const [path, loader] of Object.entries(postFiles)) {
          const content = await loader()
          const filename = path.split('/').pop()
          const { title, excerpt } = extractPostMeta(content)
          
          loadedPosts.push({
            filename,
            title,
            excerpt
          })
        }
        
        // Smart sort: numbers first (descending), then alphabetical
        const sortedPosts = loadedPosts.sort((a, b) => {
          const numA = a.filename.match(/^(\d+)/)?.[0]
          const numB = b.filename.match(/^(\d+)/)?.[0]
          
          // Both have numbers - sort by numbers descending
          if (numA && numB) {
            return parseInt(numB) - parseInt(numA)
          }
          
          // Only A has number - A comes first
          if (numA && !numB) return -1
          
          // Only B has number - B comes first  
          if (!numA && numB) return 1
          
          // Neither has numbers - sort alphabetically
          return a.filename.localeCompare(b.filename)
        })
        
        setPosts(sortedPosts)
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])
  if (loading) {
    return (
      <>
        <header className="header">
          <h1>✨ Saint Blog 👼</h1>
        </header>
        <div className="loading">Loading blessed posts...</div>
      </>
    )
  }

  return (
    <>
      <header className="header">
        <h1>✨ Saint Blog 👼</h1>
      </header>
      
      <main>
        {posts.length === 0 ? (
          <div className="loading">No posts found. Add some .md files to public/posts/ directory!</div>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.filename} className="post-item">
                <Link 
                  to={`/post/${post.filename.replace('.md', '')}`}
                  className="post-link"
                >
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-excerpt">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}

export default BlogList 