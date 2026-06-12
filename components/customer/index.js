'use client'
import { getVegEmoji, formatCurrency, getInitials, STATUS_CONFIG } from '@/lib/utils'

// ── QTY CONTROL ───────────────────────────────────────────────────
export function QtyControl({ qty, onIncrease, onDecrease, small = false }) {
  if (qty === 0) {
    return (
      <button
        onClick={onIncrease}
        className={`${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} bg-brand-600 text-white rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95`}
      >
        + ADD
      </button>
    )
  }
  return (
    <div className={`flex items-center bg-brand-600 rounded-xl overflow-hidden ${small ? 'h-8' : 'h-9'}`}>
      <button
        onClick={onDecrease}
        className="w-9 h-full flex items-center justify-center text-white hover:bg-brand-700 transition-colors font-bold text-lg"
      >
        −
      </button>
      <span className={`px-3 text-white font-bold ${small ? 'text-sm' : 'text-base'}`}>{qty}</span>
      <button
        onClick={onIncrease}
        className="w-9 h-full flex items-center justify-center text-white hover:bg-brand-700 transition-colors font-bold text-lg"
      >
        +
      </button>
    </div>
  )
}

// ── FARMER CARD ───────────────────────────────────────────────────
const CARD_GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-green-500 to-emerald-600',
  'from-teal-500 to-cyan-600',
  'from-lime-500 to-green-600',
]

export function FarmerCard({ farmer, onClick }) {
  const idx    = (parseInt(farmer.farmerId?.replace('FL-', '') || '0') - 1) % CARD_GRADIENTS.length
  const avail  = farmer.vegetables?.filter(v => v.available).length || 0
  const rating = farmer.rating?.toFixed(1) || '4.5'

  return (
    <div
      onClick={onClick}
      className="card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Banner */}
      <div className={`h-24 bg-gradient-to-r ${CARD_GRADIENTS[idx]} relative flex items-end p-3`}>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${avail > 0 ? 'bg-white text-green-700' : 'bg-white text-red-600'}`}>
            {avail > 0 ? `${avail} items` : 'Closed'}
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-xl font-bold text-white shadow-lg">
          {getInitials(farmer.name)}
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-[15px] text-gray-900 leading-tight">{farmer.name}'s Farm</h3>
          <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
            ★ {rating}
          </div>
        </div>
        <p className="text-gray-400 text-xs mb-3">📍 {farmer.region}</p>
        <div className="flex flex-wrap gap-1.5">
          {farmer.vegetables
            ?.filter(v => v.available)
            .slice(0, 4)
            .map(v => (
              <span key={v._id} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-lg font-medium">
                {getVegEmoji(v.name)} {v.name}
              </span>
            ))}
          {avail > 4 && (
            <span className="text-xs text-gray-400">+{avail - 4} more</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── TRACK MAP ─────────────────────────────────────────────────────
export function TrackMap({ order, farmer }) {
  if (!order) return null

  const step = STATUS_CONFIG[order.status]?.step ?? 0

  const STEPS = [
    { label: 'Order placed',    sub: 'Farmer notified',              icon: '📋' },
    { label: 'Confirmed',       sub: 'Farmer accepted your order',   icon: '✅' },
    { label: 'Picked up',       sub: 'Rider collected from farm',    icon: '📦' },
    { label: 'On the way',      sub: 'Heading to your location',     icon: '🛵' },
    { label: 'Delivered',       sub: 'Enjoy your fresh vegetables!', icon: '🏠' },
  ]

  // Rider position along 6 waypoints
  const WAYPOINTS = [
    { x: 44, y: 182 }, { x: 100, y: 158 }, { x: 160, y: 120 },
    { x: 240, y: 96 }, { x: 320, y: 72  }, { x: 358, y: 62  },
  ]
  const t        = Math.min(step / 4, 0.95)
  const pidx     = Math.floor(t * (WAYPOINTS.length - 1))
  const riderPos = WAYPOINTS[pidx] || WAYPOINTS[0]

  return (
    <div className="fade-in-up space-y-4">
      {/* SVG Map */}
      <div className="card overflow-hidden">
        <div className="relative bg-[#dce8dc]">
          <svg viewBox="0 0 400 220" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="dropshadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* Background */}
            <rect width="400" height="220" fill="#dce8dc" />
            <rect x="0"   y="0"   width="100" height="80"  fill="#c8ddc8" />
            <rect x="280" y="130" width="120" height="90"  fill="#c8ddc8" />
            <rect x="160" y="0"   width="70"  height="50"  fill="#cce0cc" />

            {/* Buildings */}
            <rect x="10"  y="85"  width="48" height="36" rx="4" fill="#b5c9b5" />
            <rect x="66"  y="75"  width="34" height="44" rx="4" fill="#adc0ad" />
            <rect x="115" y="138" width="44" height="38" rx="4" fill="#b0c3b0" />
            <rect x="170" y="148" width="32" height="28" rx="4" fill="#baccba" />
            <rect x="298" y="18"  width="56" height="40" rx="4" fill="#b8ccb8" />
            <rect x="340" y="76"  width="44" height="36" rx="4" fill="#b0c3b0" />
            <rect x="256" y="8"   width="36" height="28" rx="4" fill="#bacbba" />

            {/* Road */}
            <path
              d="M44 182 C74 182 88 160 112 146 C140 128 168 114 198 104 C228 94 258 88 286 80 C314 72 334 66 358 62"
              stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"
            />
            <path
              d="M44 182 C74 182 88 160 112 146 C140 128 168 114 198 104 C228 94 258 88 286 80 C314 72 334 66 358 62"
              stroke="#e8e8e8" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="8 10"
            />

            {/* Progress line */}
            <path
              d="M44 182 C74 182 88 160 112 146 C140 128 168 114 198 104 C228 94 258 88 286 80 C314 72 334 66 358 62"
              stroke="#1a9e66" strokeWidth="4" fill="none" strokeLinecap="round"
              strokeDasharray="380"
              strokeDashoffset={380 - 380 * Math.min(step / 4, 1)}
              style={{ transition: 'stroke-dashoffset 1.2s ease' }}
            />

            {/* Farm marker */}
            <g transform="translate(358,62)" filter="url(#dropshadow)">
              <circle r="18" fill="rgba(26,158,102,0.15)" />
              <circle r="12" fill="#1a9e66" />
              <text x="0" y="5"  textAnchor="middle" fontSize="13">🌾</text>
              <text x="0" y="28" textAnchor="middle" fill="#1a9e66" fontSize="9" fontFamily="sans-serif" fontWeight="700">FARM</text>
            </g>

            {/* Home marker */}
            <g transform="translate(44,182)" filter="url(#dropshadow)">
              <circle r="18" fill="rgba(59,130,246,0.15)" />
              <circle r="12" fill="#3b82f6" />
              <text x="0" y="5"  textAnchor="middle" fontSize="13">🏠</text>
              <text x="0" y="28" textAnchor="middle" fill="#3b82f6" fontSize="9" fontFamily="sans-serif" fontWeight="700">YOU</text>
            </g>

            {/* Rider pin */}
            {step > 0 && step < 4 && (
              <g transform={`translate(${riderPos.x},${riderPos.y})`} className="rider-animate">
                <circle r="20" fill="white" filter="url(#dropshadow)" />
                <text x="0" y="7" textAnchor="middle" fontSize="18">🛵</text>
              </g>
            )}

            {/* Delivered check */}
            {step >= 4 && (
              <g transform="translate(44,182)">
                <circle r="22" fill="rgba(26,158,102,0.25)" />
                <circle r="14" fill="#1a9e66" />
                <text x="0" y="6" textAnchor="middle" fontSize="16" fill="white">✓</text>
              </g>
            )}
          </svg>

          {/* Ribbon */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold shadow-sm">
            {order.status === 'delivered'
              ? '✅ Delivered'
              : <><span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse inline-block" />{STATUS_CONFIG[order.status]?.label || 'Processing'}</>
            }
          </div>
          <div className="absolute bottom-3 right-3 bg-brand-600 text-white rounded-full px-3 py-1.5 text-xs font-bold shadow-lg">
            {order.status === 'delivered' ? 'Done ✓' : '~25 min'}
          </div>
        </div>

        {/* Order details */}
        <div className="p-4 space-y-2.5 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Order</span>
            <span className="font-mono font-semibold text-gray-800 text-xs">{order.orderId}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">From</span>
            <span className="font-semibold text-gray-800">{farmer?.name} · {farmer?.region}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Items</span>
            <span className="text-gray-500 text-xs text-right max-w-[60%]">
              {order.items?.map(i => `${i.name} ×${i.qty}`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Total paid</span>
            <span className="font-bold text-brand-600 text-base">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Step timeline */}
      <div className="card p-4">
        <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">Delivery Progress</h3>
        {STEPS.map((s, i) => {
          const done    = step > i
          const active  = step === i
          const pending = step < i
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${done    ? 'bg-brand-500 text-white'
                  : active  ? 'bg-amber-400 text-white animate-pulse'
                  :           'bg-gray-100 text-gray-400'}`}
                >
                  {done ? '✓' : s.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 h-8 my-1 transition-colors ${done ? 'bg-brand-400' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className={`pb-4 flex-1 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                <p className={`font-semibold text-sm ${pending ? 'text-gray-400' : 'text-gray-900'}`}>{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
