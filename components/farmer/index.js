'use client'
import { Toggle } from '@/components/ui'
import { getVegEmoji, formatCurrency } from '@/lib/utils'

// ── VEG CARD (farmer view) ────────────────────────────────────────
export function VegCard({ veg, onEdit, onDelete, onToggle }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{getVegEmoji(veg.name)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900">{veg.name}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${veg.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {veg.available ? 'Live' : 'Hidden'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatCurrency(veg.price)}/{veg.unit} · {veg.qty} {veg.unit} stock
          </p>
        </div>
        <Toggle checked={veg.available} onChange={() => onToggle(veg)} />
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(veg)}
          className="flex-1 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(veg._id)}
          className="flex-1 py-2 text-sm font-semibold border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

// ── ORDER ROW (farmer view) ───────────────────────────────────────
export function OrderRow({ order, statusConfig }) {
  const sc = statusConfig[order.status]
  const earnings = Math.round(order.total * 0.85)

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-gray-400">{order.orderId}</span>
        <span className={`badge badge-${sc?.color}`}>{sc?.label}</span>
      </div>
      <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
      <p className="text-xs text-gray-500 mt-0.5 mb-2">
        {order.items?.map(i => `${i.name} ×${i.qty} ${i.unit}`).join(' · ')}
      </p>
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
          })}
        </span>
        <div className="text-right">
          <p className="font-bold text-brand-600 text-sm">{formatCurrency(order.total)}</p>
          <p className="text-[11px] text-gray-400">Your cut: {formatCurrency(earnings)}</p>
        </div>
      </div>
    </div>
  )
}
