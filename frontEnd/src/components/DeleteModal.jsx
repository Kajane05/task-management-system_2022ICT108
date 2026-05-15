import Icon from './Icon'

export default function DeleteModal({ open, onClose, onConfirm, taskTitle }) {
  if (!open) return null
  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 animate-fadeIn"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-scaleIn bg-surface-card rounded-xl shadow-modal w-full max-w-sm overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center flex-shrink-0">
              <Icon name="delete_forever" size={22} fill={1} className="text-danger" />
            </div>
            <div>
              <h2 className="font-bold text-on-surface text-base mb-1">Delete Task?</h2>
              <p className="text-sm text-on-muted leading-relaxed">
                <span className="font-semibold text-on-surface">"{taskTitle}"</span> will be permanently removed.
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="btn-ghost">Cancel</button>
            <button onClick={onConfirm} className="btn-danger">
              <Icon name="delete" size={15} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
