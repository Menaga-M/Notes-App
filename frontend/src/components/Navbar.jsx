// import React from 'react'

const Navbar = () => {
  return (
    <header className="navbar-shell">
      <nav className="navbar">
        <a className="navbar-brand" href="/">
          <div className="brand-mark">N</div>
          <div>
            <span className="brand-title">Notes App</span>
            <span className="brand-subtitle">Organize ideas elegantly</span>
          </div>
        </a>

        <label className="navbar-search-wrap" htmlFor="note-search">
          <span className="search-icon">⌕</span>
          <input id="note-search" type="text" className="navbar-search" placeholder="Search notes..." />
        </label>

        <div className="navbar-actions">
          <a className="navbar-link" href="/">Home</a>
          <a className="navbar-link" href="/login">Login</a>
          <a className="navbar-link navbar-link--primary" href="/register">Get Started</a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
