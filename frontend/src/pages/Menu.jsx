import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/ContextProvider'

const Menu = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) return <div className="dashboard-loading">Loading your workspace...</div>
  if (!user?.name) return <Navigate to="/login" replace />

  return (
    <main className="menu-page">
      <section className="menu-card">
        <button className="menu-back" onClick={() => navigate('/dashboard')}>← Back to dashboard</button>
        <div className="menu-brand"><span>N</span><div><h1>Notes App</h1><p>{user.name}'s workspace</p></div></div>
        <nav className="menu-links" aria-label="Workspace navigation">
          <button className="active" onClick={() => navigate('/dashboard')}>Overview</button>
          <button onClick={() => navigate('/dashboard')}>Notes</button>
          <button onClick={() => navigate('/dashboard')}>Favorites</button>
          <button onClick={() => navigate('/dashboard')}>Archive</button>
        </nav>
      </section>
    </main>
  )
}

export default Menu
