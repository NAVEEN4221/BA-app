import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Feed from '../components/Feed'

export default function FeedPage() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('idToken') : null
    if (!token) router.push('/login')
  }, [router])

  return (
    <>
      <Head>
        <title>Feed — BA Platform</title>
      </Head>
      <main className="container">
        <h2>Your Feed</h2>
        <Feed />
      </main>
    </>
  )
}
