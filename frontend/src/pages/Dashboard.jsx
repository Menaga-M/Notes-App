import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/ContextProvider'
import NoteModel from '../components/NoteModel'

const Dashboard = () => {
  const { user, setUser, loading } = useAuth()
  const navigate = useNavigate()
  const menuButton = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editorNote, setEditorNote] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [notes, setNotes] = useState([])
  const [notesLoading, setNotesLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [actionError, setActionError] = useState('')

  const closeSidebar = () => { setSidebarOpen(false); menuButton.current?.focus() }
  const openEditor = (note = null) => { setEditorNote(note); setIsEditorOpen(true) }
  const closeEditor = () => { setIsEditorOpen(false); setEditorNote(null) }

  const readApiResponse = async (response) => {
    const body = await response.text()
    let data = null
    try { data = body ? JSON.parse(body) : null } catch { /* Handled below with a helpful message. */ }
    if (!response.ok || !data?.success) {
      if (response.status === 502 || response.status === 503 || !body) {
        throw new Error('The notes server is unavailable. Start or restart the backend and try again.')
      }
      throw new Error(data?.message || 'The server returned an unexpected response. Please try again.')
    }
    return data
  }

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await fetch('/api/notes', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        const data = await readApiResponse(response)
        if (response.ok && data.success) setNotes(data.notes)
      } catch (error) { setActionError(error.message) } finally { setNotesLoading(false) }
    }
    loadNotes()
  }, [])

  const visibleNotes = useMemo(() => {
    const term = query.trim().toLowerCase()
    return term ? notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(term)) : notes
  }, [notes, query])

  const request = async (path, options = {}) => {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`, ...options.headers } })
    return readApiResponse(response)
  }

  const saveNote = async (draft) => {
    const data = editorNote
      ? await request(`/api/notes/${editorNote._id}`, { method: 'PUT', body: JSON.stringify(draft) })
      : await request('/api/notes', { method: 'POST', body: JSON.stringify(draft) })
    setNotes((items) => editorNote ? items.map((item) => item._id === data.note._id ? data.note : item) : [data.note, ...items])
    closeEditor()
  }

  const deleteNote = async (note) => {
    if (!window.confirm(`Delete “${note.title}”? This cannot be undone.`)) return
    try {
      await request(`/api/notes/${note._id}`, { method: 'DELETE' })
      setNotes((items) => items.filter((item) => item._id !== note._id))
    } catch (error) { setActionError(error.message) }
  }

  const handleLogout = () => { localStorage.removeItem('token'); setUser(null); navigate('/login') }
  if (loading) return <div className="dashboard-loading">Loading your dashboard...</div>
  if (!user?.name) return <Navigate to="/login" replace />

  return <div className="dashboard-page">
    <div className={`dashboard-backdrop ${sidebarOpen ? 'visible' : ''}`} onClick={closeSidebar} />
    <aside id="workspace-navigation" className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`} aria-hidden={!sidebarOpen}>
      <div className="sidebar-brand"><div className="sidebar-brand-mark">N</div><div><h2>Notes App</h2><p>{user.name}'s workspace</p></div></div>
      <button className="sidebar-close" onClick={closeSidebar} aria-label="Close navigation menu">×</button>
      <nav className="sidebar-links" aria-label="Workspace navigation">
        <button className="sidebar-link active" onClick={closeSidebar}>All notes</button>
        <button className="sidebar-link" onClick={closeSidebar}>Favorites</button>
        <button className="sidebar-link" onClick={closeSidebar}>Archive</button>
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
    </aside>
    <main className="dashboard-shell dashboard-main">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <button ref={menuButton} className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open navigation menu" aria-expanded={sidebarOpen} aria-controls="workspace-navigation">☰</button>
          <div><p className="dashboard-eyebrow">{user.name}</p><h1>My notes</h1><p className="dashboard-subtitle">A simple space for your ideas, tasks, and everything in between.</p></div>
        </div>
        <div className="dashboard-actions"><label className="dashboard-search" htmlFor="dashboard-search"><span>⌕</span><input id="dashboard-search" value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search notes" /></label><button onClick={() => openEditor()} className="dashboard-new-note">+ New note</button></div>
      </header>
      <section className="notes-workspace" aria-labelledby="notes-heading">
        <div className="notes-workspace-header"><div><h2 id="notes-heading">All notes</h2><p>{notesLoading ? 'Loading notes…' : `${visibleNotes.length} note${visibleNotes.length === 1 ? '' : 's'}`}</p></div><button className="notes-card-add" onClick={() => openEditor()}>+ Add note</button></div>
        {actionError && <p className="note-form-error" role="alert">{actionError}</p>}
        {!notesLoading && visibleNotes.length > 0 && <div className="note-list">{visibleNotes.map((note) => <article className="note-preview" key={note._id}><div><h3>{note.title}</h3><p>{note.content || 'No additional content'}</p></div><div className="note-preview-actions"><button onClick={() => openEditor(note)} aria-label={`Edit ${note.title}`}>Edit</button><button className="note-delete" onClick={() => deleteNote(note)} aria-label={`Delete ${note.title}`}>Delete</button></div></article>)}</div>}
        {!notesLoading && visibleNotes.length === 0 && <div className="empty-notes"><h3>{query ? 'No matching notes' : 'Your workspace is ready'}</h3><p>{query ? 'Try another search term.' : 'Create a note to begin collecting your thoughts.'}</p>{!query && <button onClick={() => openEditor()}>Create a note</button>}</div>}
      </section>
    </main>
    {isEditorOpen && <NoteModel note={editorNote} onClose={closeEditor} onSave={saveNote} />}
  </div>
}

export default Dashboard
