import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Signup() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.target)
    const body = { name: form.get('name'), email: form.get('email'), password: form.get('password') }
    try {
      const res = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Signup failed')
      if (json.data?.idToken) localStorage.setItem('idToken', json.data.idToken)
      if (json.data?.uid) localStorage.setItem('uid', json.data.uid)
      router.push('/profile')
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign up — BA Platform</title>
      </Head>
      <main className="container form-page">
        <section className="form-card">
          <h2>Create account</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input type="text" name="name" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input type="password" name="password" placeholder="At least 8 characters" required />
            </label>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
            {error && <div style={{color:'crimson',marginTop:8}}>{error}</div>}
          </form>
          <p className="small">Already have an account? <Link href="/login">Login</Link></p>
        </section>
      </main>
    </>
  )
}
