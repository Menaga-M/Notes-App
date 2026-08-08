import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/ContextProvider'
import NoteModel from '../components/NoteModel'

const Dashboard = () => {
  const { user, setUser, loading } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notes, setNotes] = useState([])
  const [notesLoading, setNotesLoading] = useState(true)

  useEffect(() => {
    const loadNotes = async () => {
      const token = localStorage.getItem('token')
      if (!token) return setNotesLoading(false)
      try {
        const response = await fetch('/api/notes', { headers: { Authorization: `Bearer ${token}` } })
        const data = await response.json()
        if (response.ok && data.success) setNotes(data.notes)
      } finally {
        setNotesLoading(false)
      }
    }
    loadNotes()
  }, [])

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

  const saveNote = async (note) => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(note),
    })
    const data = await response.json()
    if (!response.ok || !data.success) throw new Error(data.message)
    setNotes((currentNotes) => [data.note, ...currentNotes])
    setIsModalOpen(false)
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
              <button 
              onClick={() => setIsModalOpen(true)}
              className="dashboard-new-note">+ New Note</button>
              <button className="dashboard-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="dashboard-grid">
            <article className="dashboard-card featured-card notes-card">
              <div className="notes-card-heading">
                <div>
                  <h3>Recent notes</h3>
                  <p>{notesLoading ? 'Loading your notes...' : notes.length ? `${notes.length} note${notes.length === 1 ? '' : 's'} in your workspace` : 'No notes yet. Start by creating your first one.'}</p>
                </div>
                <button className="notes-card-add" onClick={() => setIsModalOpen(true)}>+ Add note</button>
              </div>
              {!notesLoading && notes.length > 0 && (
                <div className="note-list">
                  {notes.slice(0, 4).map((note) => (
                    <article className="note-preview" key={note._id}>
                      <h4>{note.title}</h4>
                      <p>{note.content || 'No additional content'}</p>
                    </article>
                  ))}
                </div>
              )}
            </article>

            <article className="dashboard-card">
              <h3>Quick actions</h3>
              <p>Create a note, organize your ideas, and keep your workflow moving with confidence.</p>
            </article>
          </div>
        </main>
      </div>
      {isModalOpen && <NoteModel onClose={() => setIsModalOpen(false)} onSave={saveNote} />}
    </div>
  )
}

export default Dashboard
