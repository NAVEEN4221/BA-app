import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.target)
    const body = { email: form.get('email'), password: form.get('password') }
    try {
      const res = await fetch('/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Login failed')
      // store token and uid
      if (json.data?.idToken) localStorage.setItem('idToken', json.data.idToken)
      if (json.data?.uid) localStorage.setItem('uid', json.data.uid)
      router.push('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login — BA Platform</title>
      </Head>
      <main className="container form-page">
        <section className="form-card">
          <h2>Login</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Email
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input type="password" name="password" placeholder="••••••••" required />
            </label>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
            {error && <div style={{color:'crimson',marginTop:8}}>{error}</div>}
          </form>
          <p className="small">Don't have an account? <Link href="/signup">Sign up</Link></p>
        </section>
      </main>
    </>
  )
}
