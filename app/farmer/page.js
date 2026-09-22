'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { getVegEmoji, formatCurrency, getInitials, STATUS_CONFIG } from '@/lib/utils'

const UNITS = ['kg', 'bunch', 'piece', '250g', '500g']
const FARMER_SIZES = [
  { id: 'small', label: 'Small', amount: '₹199' },
  { id: 'medium', label: 'Medium', amount: '₹399' },
  { id: 'large', label: 'Large', amount: '₹599' },
]

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : ''}`}/>
    </button>
  )
}

function FarmerProfileEdit({ farmer, farmerId, onSaved }) {
  const [editing, setEditing] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const [form,    setForm]    = useState({
    name:     farmer?.name    || '',
    phone:    farmer?.phone   || '',
    email:    farmer?.email   || '',
    region:   farmer?.region  || '',
    address:  farmer?.address || '',
    availableSizes: farmer?.availableSizes?.length ? farmer.availableSizes : ['small'],
    password: '',
  })
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function save() {
    setSaving(true); setMsg('')
    const body = { name: form.name, phone: form.phone, email: form.email, region: form.region, address: form.address, availableSizes: form.availableSizes }
    if (form.password) {
      if (form.password.length < 6) { setMsg('Password must be at least 6 characters'); setSaving(false); return }
      body.password = form.password
    }
    const res  = await fetch(`/api/farmers/${farmerId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setMsg('Failed to save'); return }
    setMsg('Profile updated! ✓')
    setEditing(false)
    onSaved?.(data)
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="card p-5">

      {/* Avatar */}
      <div className="text-center mb-5">
        <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center text-3xl font-bold text-brand-700 mx-auto mb-3">
          {getInitials(form.name)}
        </div>
        <h2 className="font-bold text-lg">{form.name}</h2>
        <p className="text-gray-400 text-sm font-mono">{farmerId}</p>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Farm Details</h3>
        {!editing
          ? <button onClick={() => setEditing(true)} className="text-sm font-semibold text-brand-600">✏️ Edit</button>
          : <button onClick={() => { setEditing(false); setMsg('') }} className="text-sm font-semibold text-gray-400">Cancel</button>
        }
      </div>

      {editing ? (
        <div className="space-y-3">

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
            <input
              className="input"
              type="text"
              placeholder="Balu Patil"
              value={form.name}
              onChange={e => upd('name', e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
            <input
              className="input"
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={e => upd('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
            <input className="input" type="email" placeholder="farmer@example.com" value={form.email} onChange={e => upd('email', e.target.value)} />
          </div>

          {/* Area dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Area</label>
            <select
              className="input"
              value={form.region}
              onChange={e => upd('region', e.target.value)}
            >
              <option value="">Select area</option>
              <option value="Lankelapalem">Lankelapalem (HQ)</option>
              <option value="Kurmannapalem">Kurmannapalem (East)</option>
              <option value="Anakapalli">Anakapalli (West)</option>
              <option value="Paravada">Paravada (South)</option>
            </select>
          </div>

          {/* Farm Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Farm Address</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Near Bus Stand, Lankelapalem"
              value={form.address}
              onChange={e => upd('address', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order sizes you can supply</label>
            <div className="grid grid-cols-3 gap-2">
              {FARMER_SIZES.map(size => {
                const checked = form.availableSizes.includes(size.id)
                return <button type="button" key={size.id} onClick={() => upd('availableSizes', checked ? form.availableSizes.filter(item => item !== size.id) : [...form.availableSizes, size.id])} className={`p-2 rounded-xl border-2 text-left ${checked ? 'border-brand-500 bg-brand-50' : 'border-gray-100'}`}><span className="block text-xs text-gray-500">{size.label}</span><span className="font-bold text-brand-700">{size.amount}</span></button>
              })}
            </div>
            <p className="text-xs text-gray-400 mt-1">Select all sizes that apply. Customers will see you in each selected tab.</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              New Password (leave blank to keep current)
            </label>
            <input
              className="input"
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => upd('password', e.target.value)}
            />
          </div>

          {/* Message */}
          {msg && (
            <p className={`text-sm font-medium text-center ${msg.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>
              {msg}
            </p>
          )}

          {/* Save button */}
          <button
            onClick={save}
            disabled={saving}
            className="btn-brand w-full disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

        </div>
      ) : (
        <div className="space-y-2">
          {[
            ['📛 Name',         form.name    || '—'],
            ['📞 Phone',        form.phone   || '—'],
            ['📍 Area',         form.region  || '—'],
            ['🏡 Farm Address', form.address || '—'],
            ['📦 Order sizes', form.availableSizes.join(', ') || '—'],
            ['🔒 Password',     '••••••••'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="font-medium text-sm text-gray-900">{val}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}


function LoginScreen() {
  const [farmerId, setFarmerId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const res = await signIn('farmer', { farmerId: farmerId.toUpperCase(), password, redirect: false })
    setLoading(false)
    if (res?.error) setError('Invalid Farmer ID or password')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-emerald-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🌾</div>
          <h1 className="text-2xl font-bold text-gray-900">Farmer Login</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your Farmer ID given by Kisavi admin</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-medium">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Farmer ID</label>
              <input className="input font-mono" placeholder="FL-001" value={farmerId}
                onChange={e => setFarmerId(e.target.value.toUpperCase())} required/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required/>
            </div>
            <button type="submit" disabled={loading} className="btn-brand w-full">
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>
          <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
            <p className="font-semibold mb-1">Demo accounts:</p>
            <p>FL-001 / farm001 &nbsp;•&nbsp; FL-002 / farm002</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FarmerPanel() {
  const { data: session, status } = useSession()
  const [tab, setTab]             = useState('dashboard')
  const [farmer, setFarmer]       = useState(null)
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [vegModal, setVegModal]   = useState(false)
  const [editVeg, setEditVeg]     = useState(null)
  const [form, setForm]           = useState({ name:'', price:'', unit:'kg', qty:'', available:true })
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState('')

  const isFarmer = status === 'authenticated' && session?.user?.role === 'farmer'

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }
  function upd(k, v) { setForm(f => ({ ...f, [k]: v })) }

  useEffect(() => {
    if (!isFarmer) return
    const fid = session.user.farmerId
    Promise.all([
      fetch(`/api/farmers/${fid}`).then(r => r.json()),
      fetch(`/api/orders?farmerId=${fid}`).then(r => r.json()),
    ]).then(([f, o]) => { setFarmer(f); setOrders(o); setLoading(false) })
  }, [isFarmer, session?.user?.farmerId])

  useEffect(() => {
    if (!isFarmer || !session?.user?.farmerId) return
    const refreshOrders = async () => {
      try {
        const updated = await fetch(`/api/orders?farmerId=${session.user.farmerId}`).then(r => r.json())
        setOrders(updated)
      } catch (_) {}
    }
    const interval = setInterval(refreshOrders, 10000)
    return () => clearInterval(interval)
  }, [isFarmer, session?.user?.farmerId])

  async function saveVeg() {
    setSaving(true)
    if (editVeg) {
      await fetch('/api/vegetables', { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId: farmer.farmerId, vegId: editVeg._id, updates: { ...form, price: +form.price, qty: +form.qty } }) })
    } else {
      await fetch('/api/vegetables', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId: farmer.farmerId, vegetable: { ...form, price: +form.price, qty: +form.qty } }) })
    }
    const updated = await fetch(`/api/farmers/${farmer.farmerId}`).then(r => r.json())
    setFarmer(updated); setSaving(false); setVegModal(false); setEditVeg(null)
    setForm({ name:'', price:'', unit:'kg', qty:'', available:true })
    showToast(editVeg ? 'Vegetable updated!' : 'Vegetable added!')
  }

  async function deleteVeg(vegId) {
    if (!confirm('Remove this vegetable?')) return
    await fetch('/api/vegetables', { method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmerId: farmer.farmerId, vegId }) })
    const updated = await fetch(`/api/farmers/${farmer.farmerId}`).then(r => r.json())
    setFarmer(updated); showToast('Removed!')
  }

  async function toggleAvail(veg) {
    await fetch('/api/vegetables', { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmerId: farmer.farmerId, vegId: veg._id, updates: { available: !veg.available } }) })
    const updated = await fetch(`/api/farmers/${farmer.farmerId}`).then(r => r.json())
    setFarmer(updated)
  }

  async function requestSettlement() {
    const hour = new Date().getHours()
    if (hour < 21) { showToast('Settlement requests open after 9:00 PM'); return }
    const response = await fetch(`/api/farmers/${farmer.farmerId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settlementRequest: true }),
    })
    const data = await response.json()
    if (!response.ok) { showToast(data.error || 'Could not request settlement'); return }
    setFarmer(data); showToast('Settlement request sent to Kisavi')
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-bounce">🌾</div></div>
  if (!isFarmer) return <LoginScreen />
  if (loading)   return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-bounce">🌾</div></div>

  const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.subtotal || 0), 0)
  const deliveredOrders = orders.filter(o => o.status === 'delivered')
  const farmerPayout = order => (order.subtotal || 0) - (order.platformCommission || Math.round((order.subtotal || 0) * 0.05))
  const now = new Date()
  const isToday = order => {
    const date = new Date(order.createdAt)
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()
  }
  const isThisMonth = order => {
    const date = new Date(order.createdAt)
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  }
  const todayEarnings = deliveredOrders.filter(isToday).reduce((sum, order) => sum + farmerPayout(order), 0)
  const monthlyEarnings = deliveredOrders.filter(isThisMonth).reduce((sum, order) => sum + farmerPayout(order), 0)
  const settledAmount = deliveredOrders.filter(order => order.farmerSettlementStatus === 'settled').reduce((sum, order) => sum + farmerPayout(order), 0)
  const pendingSettlement = deliveredOrders.filter(order => order.farmerSettlementStatus !== 'settled').reduce((sum, order) => sum + farmerPayout(order), 0)
  const settlementRequestOpen = now.getHours() >= 21

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-brand-700 text-white px-5 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brand-300 text-xs">🌾 Kisavi Farmer</p>
            <h1 className="font-bold text-lg leading-tight">{farmer?.name}</h1>
            <p className="text-brand-300 text-xs font-mono">{session.user.farmerId} · {farmer?.region}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/farmer' })} className="text-brand-300 text-xs hover:text-white transition-colors">Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 flex gap-0 sticky top-[76px] z-30">
      {[['dashboard','📊 Dashboard'],['vegetables','🥦 Vegetables'],['orders','📦 Orders'],['profile','👤 Profile']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors border-b-2 ${tab === id ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-400'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 pb-10">

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="space-y-4 fade-in-up">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Today Earnings', formatCurrency(todayEarnings), '☀️', 'green'],
                ['Monthly Earnings', formatCurrency(monthlyEarnings), '📅', 'brand'],
                ['Amount Settled', formatCurrency(settledAmount), '✅', 'blue'],
                ['Pending Settlement', formatCurrency(pendingSettlement), '⏳', 'amber'],
              ].map(([label, val, icon, color]) => (
                <div key={label} className="card p-4">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className={`text-xl font-bold text-${color === 'brand' ? 'brand-600' : color === 'green' ? 'green-600' : color === 'blue' ? 'blue-600' : 'amber-600'}`}>{val}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <div className="card p-4 border-brand-100 bg-brand-50 flex items-center justify-between gap-3">
              <div><p className="font-bold text-sm text-brand-800">Request settlement</p><p className="text-xs text-brand-700 mt-1">Available daily after 9:00 PM</p></div>
              <button onClick={requestSettlement} disabled={!settlementRequestOpen || !pendingSettlement || farmer?.settlementRequestStatus === 'requested'} className="px-3 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold disabled:opacity-40">{farmer?.settlementRequestStatus === 'requested' ? 'Requested' : settlementRequestOpen ? 'Request now' : 'After 9 PM'}</button>
            </div>

            <div className="card p-4">
              <h3 className="font-bold mb-3 text-sm text-gray-700">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>
              ) : orders.slice(0, 5).map(o => {
                const sc = STATUS_CONFIG[o.status]
                return (
                  <div key={o._id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{o.customerName}</p>
                      <p className="text-xs text-gray-400">{o.items?.map(i=>`${i.name} ×${i.qty}`).join(', ')}</p>
                      {o.status === 'placed' && <p className="text-[11px] font-semibold text-amber-700 mt-1">Prepare items before the delivery agent arrives.</p>}
                    </div>
                    <span className={`badge badge-${sc?.color} shrink-0`}>{sc?.label}</span>
                    <span className="font-bold text-sm text-brand-600 shrink-0">{formatCurrency(o.total)}</span>
                  </div>
                )
              })}
            </div>
            <div className="card p-4 border-brand-100 bg-brand-50">
              <h3 className="font-bold mb-1 text-sm text-brand-800">Order preparation</h3>
              <p className="text-xs text-brand-700">When a new order is placed, prepare the items before the delivery agent reaches your farm.</p>
            </div>
          </div>
        )}

        {/* VEGETABLES */}
        {tab === 'vegetables' && (
          <div className="fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">My Vegetables ({farmer?.vegetables?.length || 0})</h2>
              <button onClick={() => { setEditVeg(null); setForm({ name:'', price:'', unit:'kg', qty:'', available:true }); setVegModal(true) }}
                className="btn-brand px-4 py-2 text-sm">+ Add</button>
            </div>
            <div className="space-y-3">
              {farmer?.vegetables?.map(veg => (
                <div key={veg._id} className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getVegEmoji(veg.name)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{veg.name}</p>
                        <span className={`badge ${veg.available ? 'badge-green' : 'badge-red'} text-[10px]`}>{veg.available ? 'Live' : 'Hidden'}</span>
                      </div>
                      <p className="text-sm text-gray-500">{formatCurrency(veg.price)}/{veg.unit} · {veg.qty} {veg.unit} stock</p>
                    </div>
                    <Toggle checked={veg.available} onChange={() => toggleAvail(veg)}/>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => { setEditVeg(veg); setForm({ name:veg.name, price:veg.price, unit:veg.unit, qty:veg.qty, available:veg.available }); setVegModal(true) }}
                      className="flex-1 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Edit</button>
                    <button onClick={() => deleteVeg(veg._id)}
                      className="flex-1 py-2 text-sm font-semibold border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div className="fade-in-up space-y-3">
            <h2 className="font-bold text-gray-800">All Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="text-center py-16"><div className="text-5xl mb-3">📦</div><p className="text-gray-400">No orders yet</p></div>
            ) : orders.map(o => {
              const sc = STATUS_CONFIG[o.status]
              return (
                <div key={o._id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-gray-400">{o.orderId}</span>
                    <span className={`badge badge-${sc?.color}`}>{sc?.label}</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{o.customerName}</p>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">{o.items?.map(i=>`${i.name} ×${i.qty} ${i.unit}`).join(' · ')}</p>
                  {o.status === 'placed' && <p className="text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-2">Order placed. Please prepare these items before the delivery agent reaches you.</p>}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
                    <div className="text-right">
                      <p className="font-bold text-brand-600">{formatCurrency(o.total)}</p>
                      <p className="text-xs text-gray-400">Your payout: {formatCurrency(farmerPayout(o))} · {o.farmerSettlementStatus === 'settled' ? 'Settled' : 'Pending settlement'}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* PROFILE */}
{tab === 'profile' && (
  <div className="fade-in-up max-w-lg">
    <FarmerProfileEdit farmer={farmer} farmerId={session.user.farmerId} onSaved={(updated) => setFarmer(updated)} />
  </div>
)}
      </div>

      {/* VEG MODAL */}
      <Modal open={vegModal} onClose={() => setVegModal(false)} title={editVeg ? 'Edit Vegetable' : 'Add Vegetable'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Vegetable Name</label>
            <input className="input" placeholder="e.g. Tomato" value={form.name} onChange={e => upd('name', e.target.value)}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price (₹)</label>
              <input className="input" type="number" placeholder="28" value={form.price} onChange={e => upd('price', e.target.value)}/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unit</label>
              <select className="input" value={form.unit} onChange={e => upd('unit', e.target.value)}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Stock Quantity</label>
            <input className="input" type="number" placeholder="50" value={form.qty} onChange={e => upd('qty', e.target.value)}/>
          </div>
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
            <span className="font-medium text-sm">Available for sale</span>
            <Toggle checked={form.available} onChange={v => upd('available', v)}/>
          </div>
          <button onClick={saveVeg} disabled={saving || !form.name || !form.price} className="btn-brand w-full disabled:opacity-50">
            {saving ? 'Saving...' : editVeg ? 'Update Vegetable' : 'Add Vegetable'}
          </button>
        </div>
      </Modal>

      {/* Toast */}
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl fade-in-up z-50">{toast}</div>}
    </div>
  )
}
