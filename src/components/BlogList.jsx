import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// For this simple implementation, we'll define our posts here
// In a real app, you might fetch this data from an API or import markdown files
const blogPosts = [
  { 
    filename: '003-third-post.md', 
    title: '✨ My Third Blessed Post',
    excerpt: 'This is the third and latest divine post on my blog...'
  },
  { 
    filename: '002-second-post.md', 
    title: '⭐ Second Sacred Thoughts',
    excerpt: 'Some divine reflections on my previous post and blessed ideas...'
  },
  { 
    filename: '001-first-post.md', 
    title: '🙏 Hello World - My First Sacred Post',
    excerpt: 'Welcome to my blessed blog! This is my very first divine post...'
  }
]

// Sort posts by number in filename (descending)
const sortedPosts = blogPosts.sort((a, b) => {
  const numA = parseInt(a.filename.match(/(\d+)/)?.[0] || '0')
  const numB = parseInt(b.filename.match(/(\d+)/)?.[0] || '0')
  return numB - numA
})

function BlogList() {
  return (
    <>
      <header className="header">
        <h1>✨ Saint Blog 👼</h1>
      </header>
      
      <main>
        <ul className="post-list">
          {sortedPosts.map((post) => (
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
      </main>
    </>
  )
}

export default BlogList 