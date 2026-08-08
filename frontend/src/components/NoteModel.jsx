import { useEffect, useRef, useState } from 'react'

const NoteModel = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const titleInput = useRef(null)

  useEffect(() => {
    titleInput.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim() && !content.trim()) {
      setError('Add a title or write something before saving.')
      return
    }

    setError('')
    setIsSaving(true)
    try {
      await onSave({ title: title.trim() || 'Untitled note', content: content.trim() })
    } catch (saveError) {
      setError(saveError.message || 'Your note could not be saved. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div className="note-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="note-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="note-modal-header">
          <div>
            <p className="note-modal-eyebrow">{note ? 'Edit note' : 'New note'}</p>
            <h2 id="note-modal-title">{note ? 'Refine your note' : 'Capture your thought'}</h2>
          </div>
          <button className="note-modal-close" type="button" onClick={onClose} aria-label="Close note editor">×</button>
        </div>

        <form className="note-form" onSubmit={handleSubmit}>
          <label className="note-field" htmlFor="note-title">
            <span>Title</span>
            <input
              ref={titleInput}
              id="note-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give your note a title"
              maxLength="120"
            />
          </label>
          <label className="note-field" htmlFor="note-content">
            <span>Note</span>
            <textarea
              id="note-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Start writing..."
              rows="8"
              maxLength="5000"
            />
          </label>
          {error && <p className="note-form-error" role="alert">{error}</p>}
          <div className="note-modal-actions">
            <button className="note-cancel" type="button" onClick={onClose}>Cancel</button>
            <button className="note-save" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : note ? 'Save changes' : 'Save note'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default NoteModel
