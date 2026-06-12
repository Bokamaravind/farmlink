'use client'
import { formatCurrency, getInitials, STATUS_CONFIG } from '@/lib/utils'

// ── FARMER ROW (admin table) ──────────────────────────────────────
export function FarmerRow({ farmer, onEdit, onToggle, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center font-bold text-brand-700 shrink-0">
          {getInitials(farmer.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900">{farmer.name}</h3>
            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded-lg font-mono text-gray-600">{farmer.farmerId}</code>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${farmer.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {farmer.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">📍 {farmer.region} · 📞 {farmer.phone}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {farmer.vegetables?.length || 0} vegetables · {farmer.totalOrders || 0} orders
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(farmer)}
          className="flex-1 py-2 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onToggle(farmer)}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
            farmer.active
              ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
              : 'border-brand-200 text-brand-600 hover:bg-brand-50'
          }`}
        >
          {farmer.active ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={() => onDelete(farmer)}
          className="flex-1 py-2 text-xs font-semibold border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

// ── ORDER CARD (admin view) ───────────────────────────────────────
const STATUS_OPTIONS = ['placed','confirmed','picked_up','on_the_way','delivered','cancelled']

export function OrderCard({ order, onStatusChange }) {
  const sc = STATUS_CONFIG[order.status]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs font-mono text-gray-500">{order.orderId}</code>
            <span className={`badge badge-${sc?.color}`}>{sc?.label}</span>
          </div>
          <p className="font-bold text-sm mt-1">{order.customerName}</p>
          <p className="text-xs text-gray-400">
            {order.farmerName} · {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-brand-600">{formatCurrency(order.total)}</p>
          <p className="text-[11px] text-gray-400">Platform: {formatCurrency(Math.round(order.total * 0.08))}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        {order.items?.map(i => `${i.name} ×${i.qty}`).join(' · ')}
      </p>

      {/* Status quick-change buttons */}
      <div className="flex gap-1.5 flex-wrap pt-2 border-t border-gray-50">
        {STATUS_OPTIONS.filter(s => s !== order.status).map(s => (
          <button
            key={s}
            onClick={() => onStatusChange(order.orderId, s)}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition-colors badge-${STATUS_CONFIG[s]?.color} hover:opacity-80`}
          >
            → {STATUS_CONFIG[s]?.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── REVENUE BAR ───────────────────────────────────────────────────
export function RevenueBar({ label, value, maxValue, color }) {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0
  return (
    <div className="flex items-center gap-3 mb-3 last:mb-0">
      <span className="text-xs text-gray-500 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-lg overflow-hidden">
        <div
          className="h-full rounded-lg transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-sm font-bold text-gray-800 w-24 text-right">{formatCurrency(value)}</span>
    </div>
  )
}
