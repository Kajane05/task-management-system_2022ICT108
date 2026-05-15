import Icon from './Icon'

const STATS = [
  { key: 'total',     label: 'Total Tasks',  icon: 'assignment',     color: 'text-primary',   bg: 'bg-primary-faint' },
  { key: 'completed', label: 'Completed',    icon: 'task_alt',       color: 'text-success',   bg: 'bg-success-bg' },
  { key: 'pending',   label: 'Pending',      icon: 'pending_actions',color: 'text-warning',   bg: 'bg-warning-bg' },
  { key: 'overdue',   label: 'Overdue',      icon: 'warning',        color: 'text-danger',    bg: 'bg-danger-bg' },
]

function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="skeleton w-11 h-11 rounded-lg" />
      </div>
      <div className="skeleton h-3 w-16 mb-2 rounded" />
      <div className="skeleton h-7 w-10 rounded" />
    </div>
  )
}

export default function StatsGrid({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <SkeletonCard key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((s, i) => (
        <div
          key={s.key}
          className="card p-5 hover:shadow-hover transition-all duration-200 animate-fadeUp"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-11 h-11 rounded-lg ${s.bg} flex items-center justify-center`}>
              <Icon name={s.icon} size={20} fill={1} className={s.color} />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-on-muted mb-1">{s.label}</p>
          <p className="text-2xl font-bold text-on-surface font-sans">{stats[s.key] ?? 0}</p>
        </div>
      ))}
    </div>
  )
}
