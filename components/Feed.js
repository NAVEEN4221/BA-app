import { useEffect, useRef, useState } from 'react'
import PostCard from './PostCard'

const makePosts = (start, count) =>
  Array.from({ length: count }).map((_, i) => ({
    id: start + i,
    image: `https://picsum.photos/seed/${start + i}/600/800`,
    author: `User ${((start + i) % 10) + 1}`,
    caption: `Sample caption for post ${start + i}`,
  }))

export default function Feed() {
  const [posts, setPosts] = useState(() => makePosts(1, 9))
  const [page, setPage] = useState(1)
  const loaderRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1)
      },
      { rootMargin: '200px' }
    )
    if (loaderRef.current) obs.observe(loaderRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (page === 1) return
    const more = makePosts(page * 9 + 1, 9)
    setPosts((prev) => [...prev, ...more])
  }, [page])

  return (
    <section className="feed">
      <div className="feed-grid">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      <div ref={loaderRef} className="feed-loader">
        Loading…
      </div>
    </section>
  )
}
