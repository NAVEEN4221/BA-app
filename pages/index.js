import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>BA App</title>
        <meta name="description" content="Minimal Next.js app scaffold" />
      </Head>
      <main style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',fontFamily:'system-ui,Segoe UI,Roboto'}}>
        <div>
          <h1>Welcome to the BA Next.js app</h1>
          <p>Run `npm run dev` to start the dev server.</p>
        </div>
      </main>
    </>
  )
}
