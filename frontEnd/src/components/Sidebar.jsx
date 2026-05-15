import Icon from './Icon'

const NAV = [
  { key: 'all',         label: 'Dashboard',   icon: 'dashboard' },
  { key: 'all',         label: 'All Tasks',   icon: 'task_alt' },
  { key: 'pending',     label: 'Pending',     icon: 'pending_actions' },
  { key: 'in-progress', label: 'In Progress', icon: 'autorenew' },
  { key: 'completed',   label: 'Completed',   icon: 'check_circle' },
]

export default function Sidebar({ filter, onFilter, counts }) {
  return (
    <aside className="hidden md:flex flex-col h-screen w-[260px] fixed left-0 top-0 z-50 bg-surface-card border-r border-border/60">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-btn">
            <Icon name="bolt" size={20} fill={1} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg leading-none text-on-surface">TaskFlow</h1>
            <p className="text-xs text-on-muted mt-0.5 font-medium">Pro Workspace</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-1 text-[10px] font-bold tracking-widest text-on-muted/60 uppercase mb-2">
          Navigation
        </p>
        {NAV.map((item, i) => (
          <button
            key={i}
            onClick={() => onFilter(item.key)}
            className={`nav-item w-full text-left group ${filter === item.key && item.key !== 'all' || (i <= 1 && filter === 'all') && i === 0 ? 'active' : ''}`}
          >
            <Icon
              name={item.icon}
              size={18}
              fill={filter === item.key ? 1 : 0}
              className="flex-shrink-0"
            />
            <span className="flex-1">{item.label}</span>
            {counts?.[item.key] !== undefined && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                ${filter === item.key ? 'bg-primary/20 text-primary' : 'bg-surface-high text-on-muted'}`}>
                {counts[item.key]}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border/40">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-low transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold">
            TF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate">TaskFlow User</p>
            <p className="text-xs text-on-muted truncate">Admin</p>
          </div>
          <Icon name="more_vert" size={16} className="text-on-muted" />
        </div>
      </div>
    </aside>
  )
}
