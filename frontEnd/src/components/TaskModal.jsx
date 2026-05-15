import { useState, useEffect } from 'react'
import Icon from './Icon'

const EMPTY = { title: '', description: '', status: 'pending', dueDate: '', completed: false }

export default function TaskModal({ open, task, onClose, onSave }) {
  const [form,    setForm]    = useState(EMPTY)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    if (task) {
      setForm({
        title:       task.title       || '',
        description: task.description || '',
        status:      task.status      || 'pending',
        dueDate:     task.dueDate ? task.dueDate.substring(0, 10) : '',
        completed:   task.completed   || false,
      })
    } else {
      setForm(EMPTY)
    }
    setError('')
    setLoading(false)
  }, [open, task])

  function set(field, val) { setForm(p => ({ ...p, [field]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.dueDate)       { setError('Due date is required.'); return }
    setLoading(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const isEdit = !!task

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 animate-fadeIn"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-scaleIn bg-surface-card rounded-xl shadow-modal w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-faint flex items-center justify-center">
              <Icon name={isEdit ? 'edit' : 'add_task'} size={16} className="text-primary" />
            </div>
            <h2 className="text-base font-bold text-on-surface font-display">
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-high flex items-center justify-center text-on-muted transition-colors"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-on-muted uppercase tracking-wider mb-1.5">
              Title <span className="text-danger">*</span>
            </label>
            <input
              className="input-field"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-on-muted uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Add more details (optional)…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Status + Due Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-muted uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                className="input-field"
                value={form.status}
                onChange={e => set('status', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-muted uppercase tracking-wider mb-1.5">
                Due Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="input-field"
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
              />
            </div>
          </div>

          {/* Completed toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set('completed', !form.completed)}
              className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all
                ${form.completed ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'}`}
            >
              {form.completed && <Icon name="check" size={12} fill={1} className="text-white" />}
            </div>
            <span className="text-sm font-medium text-on-surface">Mark as completed</span>
          </label>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-danger-bg border border-danger/20 rounded-lg text-sm text-danger font-medium animate-fadeIn">
              <Icon name="error" size={16} fill={1} />
              {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/60 bg-surface">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".2" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <Icon name={isEdit ? 'save' : 'add'} size={16} />
                {isEdit ? 'Save Changes' : 'Create Task'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
