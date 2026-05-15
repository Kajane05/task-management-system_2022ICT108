import Icon from './Icon'

function StatusBadge({ task }) {
  if (task.completed)
    return <span className="badge bg-success-bg text-success"><Icon name="check_circle" size={11} fill={1} />Done</span>
  if (task.status === 'in-progress')
    return <span className="badge bg-primary-faint text-primary"><Icon name="autorenew" size={11} />In Progress</span>
  return <span className="badge bg-surface-high text-on-muted"><Icon name="schedule" size={11} />Pending</span>
}

function DueDateCell({ task }) {
  if (!task.dueDate) return <span className="text-on-muted text-xs">—</span>
  const d = new Date(task.dueDate)
  const overdue = !task.completed && d < new Date()
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return (
    <span className={`text-xs font-medium flex items-center gap-1 ${overdue ? 'text-danger' : 'text-on-muted'}`}>
      {overdue && <Icon name="warning" size={13} fill={1} className="text-danger" />}
      {label}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr>
      {[250, 80, 100, 60, 70].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`skeleton h-4 rounded`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  )
}

export default function TaskTable({ tasks, loading, onEdit, onDelete, onToggle }) {
  return (
    <div className="card overflow-hidden">
      {/* Table Header Bar */}
      <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-surface-card">
        <div className="flex items-center gap-2">
          <Icon name="list_alt" size={18} className="text-primary" />
          <h3 className="text-sm font-bold text-on-surface">Task List</h3>
          <span className="badge bg-primary-faint text-primary">{tasks.length}</span>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface border-b border-border/50">
              {['Task', 'Status', 'Due Date', 'Done', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-on-muted/70">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {loading
              ? [0,1,2,3].map(i => <SkeletonRow key={i} />)
              : tasks.length === 0
                ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-on-muted">
                        <Icon name="inbox" size={40} className="opacity-30" />
                        <p className="text-sm font-medium">No tasks found</p>
                      </div>
                    </td>
                  </tr>
                )
                : tasks.map((t, i) => (
                  <tr
                    key={t._id}
                    className="group hover:bg-surface/60 transition-colors animate-fadeUp"
                    style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                  >
                    {/* Task */}
                    <td className="px-5 py-4 max-w-xs">
                      <p className={`text-sm font-semibold text-on-surface truncate ${t.completed ? 'line-through opacity-40' : ''}`}>
                        {t.title}
                      </p>
                      {t.description && (
                        <p className="text-xs text-on-muted truncate mt-0.5">{t.description}</p>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4"><StatusBadge task={t} /></td>
                    {/* Due */}
                    <td className="px-5 py-4"><DueDateCell task={t} /></td>
                    {/* Toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onToggle(t._id, !t.completed)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                          ${t.completed ? 'bg-success border-success' : 'border-border hover:border-primary'}`}
                        title={t.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {t.completed && <Icon name="check" size={12} fill={1} className="text-white" />}
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(t)}
                          className="p-1.5 rounded-lg hover:bg-primary-faint text-on-muted hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(t)}
                          className="p-1.5 rounded-lg hover:bg-danger-bg text-on-muted hover:text-danger transition-colors"
                          title="Delete"
                        >
                          <Icon name="delete" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-border/40">
        {loading
          ? [0,1,2,3].map(i => (
            <div key={i} className="p-4 flex gap-3 items-start">
              <div className="skeleton w-5 h-5 rounded mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            </div>
          ))
          : tasks.length === 0
            ? (
              <div className="py-16 flex flex-col items-center gap-3 text-on-muted">
                <Icon name="inbox" size={36} className="opacity-30" />
                <p className="text-sm font-medium">No tasks found</p>
              </div>
            )
            : tasks.map((t, i) => (
              <div
                key={t._id}
                className="p-4 flex items-start gap-3 animate-fadeUp"
                style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
              >
                <button
                  onClick={() => onToggle(t._id, !t.completed)}
                  className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${t.completed ? 'bg-success border-success' : 'border-border'}`}
                >
                  {t.completed && <Icon name="check" size={11} fill={1} className="text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold text-on-surface ${t.completed ? 'line-through opacity-40' : ''}`}>
                    {t.title}
                  </p>
                  {t.description && <p className="text-xs text-on-muted mt-0.5 line-clamp-1">{t.description}</p>}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StatusBadge task={t} />
                    <DueDateCell task={t} />
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => onEdit(t)} className="p-1.5 rounded-lg hover:bg-primary-faint text-on-muted hover:text-primary transition-colors">
                    <Icon name="edit" size={15} />
                  </button>
                  <button onClick={() => onDelete(t)} className="p-1.5 rounded-lg hover:bg-danger-bg text-on-muted hover:text-danger transition-colors">
                    <Icon name="delete" size={15} />
                  </button>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}
