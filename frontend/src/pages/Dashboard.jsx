import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FaArchive, FaBars, FaHeart, FaPen, FaRegHeart, FaSearch, FaTrash } from 'react-icons/fa'
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
  const [activeView, setActiveView] = useState('all')
  const [actionError, setActionError] = useState('')

  const closeSidebar = () => { setSidebarOpen(false); menuButton.current?.focus() }
  const openEditor = (note = null) => { setEditorNote(note); setIsEditorOpen(true) }
  const closeEditor = () => { setIsEditorOpen(false); setEditorNote(null) }
  const readApiResponse = useCallback(async (response) => {
    const body = await response.text()
    let data = null
    try { data = body ? JSON.parse(body) : null } catch { /* Handled below. */ }
    if (!response.ok || !data?.success) throw new Error(data?.message || 'The server returned an unexpected response. Please try again.')
    return data
  }, [])
  const request = useCallback(async (path, options = {}) => readApiResponse(await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`, ...options.headers } })), [readApiResponse])

  useEffect(() => {
    const loadNotes = async () => {
      try { setNotes((await request('/api/notes')).notes) } catch (error) { setActionError(error.message) } finally { setNotesLoading(false) }
    }
    loadNotes()
  }, [request])

  const visibleNotes = useMemo(() => {
    const scope = activeView === 'favorites'
      ? notes.filter((note) => note.isFavorite && !note.isArchived)
      : activeView === 'archived'
        ? notes.filter((note) => note.isArchived)
        : notes.filter((note) => !note.isArchived)
    const term = query.trim().toLowerCase()
    return term ? scope.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(term)) : scope
  }, [notes, query, activeView])

  const saveNote = async (draft) => {
    const data = editorNote ? await request(`/api/notes/${editorNote._id}`, { method: 'PUT', body: JSON.stringify(draft) }) : await request('/api/notes', { method: 'POST', body: JSON.stringify(draft) })
    setNotes((items) => editorNote ? items.map((item) => item._id === data.note._id ? data.note : item) : [data.note, ...items])
    closeEditor()
  }
  const deleteNote = async (note) => {
    if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) return
    try { await request(`/api/notes/${note._id}`, { method: 'DELETE' }); setNotes((items) => items.filter((item) => item._id !== note._id)) } catch (error) { setActionError(error.message) }
  }
  const toggleFavorite = async (note) => {
    try {
      const data = await request(`/api/notes/${note._id}`, { method: 'PUT', body: JSON.stringify({ title: note.title, content: note.content, isFavorite: !note.isFavorite }) })
      setNotes((items) => items.map((item) => item._id === data.note._id ? data.note : item))
    } catch (error) { setActionError(error.message) }
  }
  const toggleArchive = async (note) => {
    try {
      const data = await request(`/api/notes/${note._id}`, { method: 'PUT', body: JSON.stringify({ title: note.title, content: note.content, isFavorite: note.isFavorite, isArchived: !note.isArchived }) })
      setNotes((items) => items.map((item) => item._id === data.note._id ? data.note : item))
    } catch (error) { setActionError(error.message) }
  }
  const selectView = (view) => { setActiveView(view); closeSidebar() }
  const handleLogout = () => { localStorage.removeItem('token'); setUser(null); navigate('/login') }
  if (loading) return <div className="dashboard-loading">Loading your dashboard...</div>
  if (!user?.name) return <Navigate to="/login" replace />

  return <div className="dashboard-page">
    <div className={`dashboard-backdrop ${sidebarOpen ? 'visible' : ''}`} onClick={closeSidebar} />
    <aside id="workspace-navigation" className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`} aria-hidden={!sidebarOpen}>
      <div className="sidebar-brand"><div className="sidebar-brand-mark">N</div><div><h2>Notes App</h2><p>{user.name}'s workspace</p></div></div>
      <button className="sidebar-close" onClick={closeSidebar} aria-label="Close navigation menu">&times;</button>
      <nav className="sidebar-links" aria-label="Workspace navigation">
        <button className={`sidebar-link ${activeView === 'all' ? 'active' : ''}`} onClick={() => selectView('all')}>All notes</button>
        <button className={`sidebar-link ${activeView === 'favorites' ? 'active' : ''}`} onClick={() => selectView('favorites')}>Favorites</button>
        <button className={`sidebar-link ${activeView === 'archived' ? 'active' : ''}`} onClick={() => selectView('archived')}>Archive</button>
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
    </aside>
    <main className="dashboard-shell dashboard-main">
      <header className="dashboard-header"><div className="dashboard-header-left"><button ref={menuButton} className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open navigation menu" aria-expanded={sidebarOpen} aria-controls="workspace-navigation"><FaBars /></button><div><p className="dashboard-eyebrow">{user.name}</p><h1>My notes</h1><p className="dashboard-subtitle">A simple space for your ideas, tasks, and everything in between.</p></div></div><div className="dashboard-actions"><label className="dashboard-search" htmlFor="dashboard-search"><FaSearch aria-hidden="true" /><input id="dashboard-search" value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search notes" /></label><button onClick={() => openEditor()} className="dashboard-new-note">+ New note</button></div></header>
      <section className="notes-workspace" aria-labelledby="notes-heading"><div className="notes-workspace-header"><div><h2 id="notes-heading">{activeView === 'favorites' ? 'Favorite notes' : activeView === 'archived' ? 'Archived notes' : 'All notes'}</h2><p>{notesLoading ? 'Loading notes...' : `${visibleNotes.length} note${visibleNotes.length === 1 ? '' : 's'}`}</p></div></div>
        {actionError && <p className="note-form-error" role="alert">{actionError}</p>}
        {!notesLoading && visibleNotes.length > 0 && <div className="note-list">{visibleNotes.map((note) => <article className="note-preview" key={note._id}><div className="note-preview-top"><div><h3>{note.title}</h3><p>{note.content || 'No additional content'}</p></div><button className={`note-icon-button note-favorite ${note.isFavorite ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(note)} aria-label={`${note.isFavorite ? 'Remove' : 'Add'} ${note.title} ${note.isFavorite ? 'from' : 'to'} favorites`} title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>{note.isFavorite ? <FaHeart /> : <FaRegHeart />}</button></div><div className="note-preview-actions"><button className="note-icon-button" onClick={() => openEditor(note)} aria-label={`Edit ${note.title}`} title="Edit note"><FaPen /></button><button className={`note-icon-button note-archive ${note.isArchived ? 'is-archived' : ''}`} onClick={() => toggleArchive(note)} aria-label={`${note.isArchived ? 'Restore' : 'Archive'} ${note.title}`} title={note.isArchived ? 'Restore note' : 'Archive note'}><FaArchive /></button><button className="note-icon-button note-delete" onClick={() => deleteNote(note)} aria-label={`Delete ${note.title}`} title="Delete note"><FaTrash /></button></div></article>)}</div>}
        {!notesLoading && visibleNotes.length === 0 && <div className="empty-notes"><h3>{query ? 'No matching notes' : activeView === 'favorites' ? 'No favorite notes yet' : activeView === 'archived' ? 'No archived notes yet' : 'Your workspace is ready'}</h3><p>{query ? 'Try another search term.' : activeView === 'favorites' ? 'Tap the heart on a note to keep it close.' : activeView === 'archived' ? 'Archived notes will appear here.' : 'Create a note to begin collecting your thoughts.'}</p>{!query && activeView === 'all' && <button onClick={() => openEditor()}>Create a note</button>}</div>}
      </section>
    </main>
    {isEditorOpen && <NoteModel note={editorNote} onClose={closeEditor} onSave={saveNote} />}
  </div>
}
export default Dashboard
