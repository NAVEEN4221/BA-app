import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>BA Platform — Home</title>
        <meta name="description" content="Business Analysts Platform - Home" />
      </Head>
      <main className="container">
        <section className="hero">
          <h1>Business Analysts Platform</h1>
          <p className="lead">Tools and workspace for business analysis collaboration.</p>
          <div className="cta">
            <Link href="/login" className="btn">Login</Link>
            <Link href="/signup" className="btn btn-outline">Sign up</Link>
          </div>
        </section>

        <section className="cards">
          <article className="card">
            <h3>Profile</h3>
            <p>View and edit your profile information.</p>
            <Link href="/profile" className="link">Open profile</Link>
          </article>
          <article className="card">
            <h3>Projects</h3>
            <p>Create and manage analysis projects (coming soon).</p>
            <span className="link muted">Coming soon</span>
          </article>
        </section>
      </main>
    </>
  )
}
