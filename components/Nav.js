import Link from 'next/link'

export default function Nav(){
  return (
    <header className="nav">
      <div className="nav-inner container">
        <div className="brand"><Link href="/">BA Platform</Link></div>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup" className="btn small">Sign up</Link>
        </nav>
      </div>
    </header>
  )
}
