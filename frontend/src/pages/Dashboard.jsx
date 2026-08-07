import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/ContextProvider'

const Dashboard = () => {
  const { user, setUser, loading } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  // Prevent accessing user properties before session check finishes
  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>
  }

  if (!user?.name) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="dashboard-page">
      <div className={`dashboard-backdrop ${sidebarOpen ? 'visible' : ''}`} onClick={closeSidebar} />
      <div className="dashboard-shell">
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">N</div>
            <div>
              <h2>Notes App</h2>
              <p>Workspace</p>
            </div>
          </div>

          <div className="sidebar-links">
            <button className="sidebar-link active">Overview</button>
            <button className="sidebar-link">Notes</button>
            <button className="sidebar-link">Favorites</button>
            <button className="sidebar-link">Archive</button>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-header">
            <div className="dashboard-header-left">
              <button className="sidebar-toggle" onClick={toggleSidebar}>
                ☰
              </button>
              <div>
                <p className="dashboard-eyebrow">{user.name}</p>
                <h1>Welcome to your dashboard</h1>
                <p className="dashboard-subtitle">
                  This is where your notes, ideas, and plans can live in one calm place.
                </p>
              </div>
            </div>

            <div className="dashboard-actions">
              <label className="dashboard-search" htmlFor="dashboard-search">
                <span>⌕</span>
                <input id="dashboard-search" type="text" placeholder="Search notes" />
              </label>
              <button className="dashboard-new-note">+ New Note</button>
              <button className="dashboard-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="dashboard-grid">
            <article className="dashboard-card featured-card">
              <h3>Recent notes</h3>
              <p>No notes yet. Start by creating your first one and build your personal workspace.</p>
            </article>

            <article className="dashboard-card">
              <h3>Quick actions</h3>
              <p>Create a note, organize your ideas, and keep your workflow moving with confidence.</p>
            </article>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
