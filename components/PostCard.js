import React from 'react'

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className="post-image">
        <img src={post.image} alt={post.caption || 'Post image'} loading="lazy" />
      </div>
      <div className="post-meta">
        <div className="post-author">{post.author}</div>
        <div className="post-caption">{post.caption}</div>
      </div>
    </article>
  )
}
