import { useState, useEffect, useMemo, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import StatsGrid from './components/StatsGrid'
import TaskTable from './components/TaskTable'
import TaskModal from './components/TaskModal'
import DeleteModal from './components/DeleteModal'
import ToastContainer, { pushToast } from './components/Toast'
import Icon from './components/Icon'
import { getTasks, createTask, updateTask, deleteTask } from './api'

const FILTER_TABS = [
  { key: 'all',         label: 'All' },
  { key: 'pending',     label: 'Pending' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed',   label: 'Completed' },
]

export default function App() {
  const [tasks,      setTasks]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('all')
  const [search,     setSearch]     = useState('')
  const [modalOpen,  setModalOpen]  = useState(false)
  const [editTask,   setEditTask]   = useState(null)
  const [deleteInfo, setDeleteInfo] = useState(null) // { task }

  // ── Load ──────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      pushToast('Could not connect to backend. Is the server running?', 'error')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])

  // ── Stats ─────────────────────────────────────────
  const stats = useMemo(() => {
    const now = new Date()
    return {
      total:     tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending:   tasks.filter(t => !t.completed && t.status !== 'in-progress').length,
      overdue:   tasks.filter(t => !t.completed && new Date(t.dueDate) < now).length,
    }
  }, [tasks])

  const navCounts = useMemo(() => ({
    all:          tasks.length,
    pending:      stats.pending,
    'in-progress': tasks.filter(t => !t.completed && t.status === 'in-progress').length,
    completed:    stats.completed,
  }), [tasks, stats])

  // ── Filtered list ─────────────────────────────────
  const visible = useMemo(() => {
    const q = search.toLowerCase().trim()
    return tasks.filter(t => {
      const matchFilter =
        filter === 'all' ||
        (filter === 'completed'   && t.completed) ||
        (filter === 'pending'     && !t.completed && (t.status === 'pending' || !t.status)) ||
        (filter === 'in-progress' && !t.completed && t.status === 'in-progress')
      const matchSearch = !q ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      return matchFilter && matchSearch
    })
  }, [tasks, filter, search])

  // ── CRUD ──────────────────────────────────────────
  async function handleSave(formData) {
    if (editTask) {
      const updated = await updateTask(editTask._id, formData)
      setTasks(p => p.map(t => t._id === editTask._id ? updated : t))
      pushToast('Task updated successfully!')
    } else {
      const created = await createTask(formData)
      setTasks(p => [created, ...p])
      pushToast('Task created successfully!')
    }
  }

  async function handleDelete() {
    if (!deleteInfo) return
    try {
      await deleteTask(deleteInfo.task._id)
      setTasks(p => p.filter(t => t._id !== deleteInfo.task._id))
      pushToast('Task deleted.')
    } catch {
      pushToast('Failed to delete task.', 'error')
    } finally {
      setDeleteInfo(null)
    }
  }

  async function handleToggle(id, completed) {
    const task = tasks.find(t => t._id === id)
    if (!task) return
    try {
      const updated = await updateTask(id, { ...task, completed })
      setTasks(p => p.map(t => t._id === id ? updated : t))
    } catch {
      pushToast('Failed to update task.', 'error')
    }
  }

  function openCreate() { setEditTask(null); setModalOpen(true) }
  function openEdit(task) { setEditTask(task); setModalOpen(true) }

  // ── Render ────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar filter={filter} onFilter={setFilter} counts={navCounts} />

      {/* Main area */}
      <div className="flex-1 md:ml-[260px] flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-surface-card/80 backdrop-blur-md border-b border-border/60 px-5 py-3 flex items-center gap-4">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2 mr-1">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="bolt" size={15} fill={1} className="text-white" />
            </div>
            <span className="font-display text-sm text-on-surface">TaskFlow</span>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-md">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-muted pointer-events-none" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-on-muted/50 font-medium"
              placeholder="Search tasks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-muted hover:text-on-surface">
                <Icon name="close" size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Refresh */}
            <button
              onClick={loadTasks}
              disabled={loading}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-on-muted hover:text-primary hover:border-primary transition-colors disabled:opacity-40"
              title="Refresh"
            >
              <Icon name="refresh" size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            {/* New Task */}
            <button onClick={openCreate} className="btn-primary">
              <Icon name="add" size={16} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-6 space-y-6 max-w-[1440px] mx-auto w-full">

          {/* Hero */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fadeUp">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-on-surface leading-tight">
                Task Dashboard
              </h2>
              <p className="text-on-muted text-sm mt-1 font-medium">
                {loading ? 'Loading your tasks…' : `${stats.total} task${stats.total !== 1 ? 's' : ''} total · ${stats.completed} completed · ${stats.overdue} overdue`}
              </p>
            </div>
            <button
              onClick={openCreate}
              className="btn-primary self-start sm:self-auto"
            >
              <Icon name="add_task" size={16} />
              Add Task
            </button>
          </div>

          {/* Stats */}
          <StatsGrid stats={stats} loading={loading} />

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap animate-fadeUp" style={{ animationDelay: '120ms' }}>
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all
                  ${filter === tab.key
                    ? 'bg-primary text-white border-primary shadow-btn'
                    : 'text-on-muted border-border hover:border-primary hover:text-primary bg-surface-card'}`}
              >
                {tab.label}
                <span className={`ml-1.5 text-[10px] ${filter === tab.key ? 'opacity-70' : 'opacity-50'}`}>
                  {navCounts[tab.key] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Task Table */}
          <div className="animate-fadeUp" style={{ animationDelay: '160ms' }}>
            <TaskTable
              tasks={visible}
              loading={loading}
              onEdit={openEdit}
              onDelete={task => setDeleteInfo({ task })}
              onToggle={handleToggle}
            />
          </div>

        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-card/90 backdrop-blur-md border-t border-border/60 flex justify-around items-center py-2 z-50">
        {[
          { key: 'all',      icon: 'dashboard',      label: 'Home' },
          { key: 'pending',  icon: 'pending_actions', label: 'Pending' },
          { key: null,       icon: null,              label: 'Add', isCta: true },
          { key: 'completed',icon: 'check_circle',    label: 'Done' },
        ].map((item, i) =>
          item.isCta ? (
            <button key={i} onClick={openCreate} className="relative -top-4 w-13 h-13 w-12 h-12 bg-primary text-white rounded-full shadow-btn flex items-center justify-center">
              <Icon name="add" size={22} />
            </button>
          ) : (
            <button
              key={i}
              onClick={() => setFilter(item.key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${filter === item.key ? 'text-primary' : 'text-on-muted'}`}
            >
              <Icon name={item.icon} size={20} fill={filter === item.key ? 1 : 0} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          )
        )}
      </nav>

      {/* Modals */}
      <TaskModal
        open={modalOpen}
        task={editTask}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
      <DeleteModal
        open={!!deleteInfo}
        taskTitle={deleteInfo?.task?.title || ''}
        onClose={() => setDeleteInfo(null)}
        onConfirm={handleDelete}
      />

      {/* Toasts */}
      <ToastContainer />
    </div>
  )
}
