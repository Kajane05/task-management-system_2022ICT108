import { useState, useCallback, useEffect, useRef } from 'react'
import Icon from './Icon'

let _push = null
export function pushToast(msg, type = 'success') { _push?.(msg, type) }

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])
  const ref = useRef(0)

  useEffect(() => {
    _push = (msg, type) => {
      const id = ++ref.current
      setToasts(p => [...p, { id, msg, type }])
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200)
    }
    return () => { _push = null }
  }, [])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-fadeUp flex items-center gap-2 px-5 py-3 rounded-full shadow-modal text-sm font-semibold text-white whitespace-nowrap pointer-events-auto
            ${t.type === 'error' ? 'bg-danger' : 'bg-primary'}`}
        >
          <Icon name={t.type === 'error' ? 'error' : 'check_circle'} size={16} fill={1} />
          {t.msg}
        </div>
      ))}
    </div>
  )
}
