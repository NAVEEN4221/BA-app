import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('idToken') : null
    if (!token) {
      setError('Not authenticated')
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const res = await fetch('/api/v1/me', { headers: { Authorization: `Bearer ${token}` } })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to fetch profile')
        setProfile(json.data)
      } catch (err) {
        setError(err.message)
        // redirect to login after short delay
        setTimeout(() => router.push('/login'), 1500)
      } finally {
        setLoading(false)
      }
    })()
  }, [router])

  return (
    <>
      <Head>
        <title>Profile — BA Platform</title>
      </Head>
      <main className="container">
        <section className="profile-card">
          <h2>Your profile</h2>
          {loading && <div>Loading…</div>}
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
          {profile && (
            <div className="profile-grid">
              <div>
                <strong>Name</strong>
                <div>{profile.displayName || '-'}</div>
              </div>
              <div>
                <strong>Email</strong>
                <div>{profile.email || '-'}</div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
