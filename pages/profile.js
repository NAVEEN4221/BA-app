import Head from 'next/head'

export default function Profile() {
  return (
    <>
      <Head>
        <title>Profile — BA Platform</title>
      </Head>
      <main className="container">
        <section className="profile-card">
          <h2>Your profile</h2>
          <div className="profile-grid">
            <div>
              <strong>Name</strong>
              <div>Jane Analyst</div>
            </div>
            <div>
              <strong>Email</strong>
              <div>jane@example.com</div>
            </div>
            <div>
              <strong>Role</strong>
              <div>Business Analyst</div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
