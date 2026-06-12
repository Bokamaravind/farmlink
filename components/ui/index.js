// Shared UI components used across all panels

// ── MODAL ─────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold text-sm">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── TOGGLE SWITCH ─────────────────────────────────────────────────
export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : ''}`} />
    </button>
  )
}

// ── BADGE ─────────────────────────────────────────────────────────
export function Badge({ color = 'green', children }) {
  return (
    <span className={`badge badge-${color}`}>{children}</span>
  )
}

// ── SKELETON LOADER ───────────────────────────────────────────────
export function Skeleton({ className = 'h-24' }) {
  return <div className={`skeleton rounded-2xl ${className}`} />
}

// ── EMPTY STATE ───────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-semibold text-gray-500">{title}</p>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}

// ── STAT CARD ─────────────────────────────────────────────────────
export function StatCard({ icon, label, value, sub, color = 'brand' }) {
  const gradients = {
    brand:  'from-brand-500 to-emerald-600',
    amber:  'from-amber-400 to-orange-500',
    blue:   'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-violet-600',
    red:    'from-red-500 to-rose-600',
  }
  return (
    <div className={`bg-gradient-to-br ${gradients[color] || gradients.brand} rounded-2xl p-4 text-white`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-white/80 text-xs mt-0.5">{label}</div>
      {sub && <div className="text-white/60 text-[11px] mt-1">{sub}</div>}
    </div>
  )
}

// ── TOAST HOOK ────────────────────────────────────────────────────
import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg, type = 'default') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  return { toasts, addToast }
}

export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  )
}

// ── LOADING SPINNER ───────────────────────────────────────────────
export function LoadingScreen({ label = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🌱</div>
        <p className="text-brand-700 font-semibold">{label}</p>
      </div>
    </div>
  )
}
