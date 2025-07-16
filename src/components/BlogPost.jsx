import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

// Auto-import all markdown files
const postFiles = import.meta.glob('../posts/*.md', { as: 'raw' })

function BlogPost() {
  const { filename } = useParams()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Find the matching post file
        const postPath = Object.keys(postFiles).find(path => 
          path.includes(`${filename}.md`)
        )
        
        if (!postPath) {
          throw new Error('Post not found')
        }
        
        // Load the markdown content
        const content = await postFiles[postPath]()
        setContent(content)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [filename])

  if (loading) {
    return (
      <>
        <Link to="/" className="back-link">← Back to posts</Link>
        <article className="post-content">
          <div className="loading">Loading post...</div>
        </article>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Link to="/" className="back-link">← Back to posts</Link>
        <div className="error">Error: {error}</div>
      </>
    )
  }

  return (
    <>
      <Link to="/" className="back-link">← Back to posts</Link>
      <article className="post-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </>
  )
}

export default BlogPost 