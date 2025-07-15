import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

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
        
        // Fetch markdown file from public/posts directory
        const response = await fetch(`/SaintBlog/posts/${filename}.md`)
        
        if (!response.ok) {
          throw new Error('Post not found')
        }
        
        const text = await response.text()
        setContent(text)
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
        <div className="loading">Loading post...</div>
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