'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { formatCurrency, getInitials, STATUS_CONFIG } from '@/lib/utils'
import { useActionLock } from '@/components/ui'
function DeliveryProfileEdit({ partner, partnerId, onSaved }) {
  const { runAction, isPending } = useActionLock()
  const [editing, setEditing] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const [form,    setForm]    = useState({
    name:     partner?.name    || '',
    phone:    partner?.phone   || '',
    email:    partner?.email   || '',
    region:   'Lankelapalem',
    vehicle:  partner?.vehicle || 'Bike',
    password: '',
  })
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function save() {
    setSaving(true); setMsg('')
    const body = { name: form.name, phone: form.phone, email: form.email, vehicle: form.vehicle }
    if (form.password) {
      if (form.password.length < 6) { setMsg('Password must be at least 6 characters'); setSaving(false); return }
      body.password = form.password
    }
    const res  = await fetch(`/api/delivery/${partnerId}`, {
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
      <div className="text-center mb-5">
        <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl font-bold text-amber-700 mx-auto mb-3">
          {(partner?.name || 'DP').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <h2 className="font-bold text-lg">{form.name}</h2>
        <p className="text-gray-400 text-sm font-mono">{partnerId}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">My Details</h3>
        {!editing
          ? <button onClick={() => setEditing(true)} className="text-sm font-semibold text-brand-600">✏️ Edit</button>
          : <button onClick={() => { setEditing(false); setMsg('') }} className="text-sm font-semibold text-gray-400">Cancel</button>
        }
      </div>

      {editing ? (
        <div className="space-y-3">
          {[
            ['name',   'Full Name', 'text', 'Suresh Kumar'],
            ['phone',  'Phone',     'tel',  '9876543210'],
            ['email',  'Email',     'email',  'delivery@example.com'],
          ].map(([key, label, type, ph]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
              <input className="input" type={type} placeholder={ph} value={form[key]} onChange={e => upd(key, e.target.value)}/>
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Vehicle</label>
            <select className="input" value={form.vehicle} onChange={e => upd('vehicle', e.target.value)}>
              {['Bike','Scooter','Bicycle','Auto'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">New Password (leave blank to keep)</label>
            <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => upd('password', e.target.value)}/>
          </div>
          {msg && <p className={`text-sm font-medium text-center ${msg.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
          <button onClick={() => runAction('profile-save', save)} disabled={saving || isPending('profile-save')} className="btn-brand w-full disabled:opacity-50 disabled:cursor-wait">{saving || isPending('profile-save') ? 'Processing…' : 'Save Changes'}</button>
        </div>
      ) : (
        <div className="space-y-2">
          {[
            ['📛 Name',    form.name    || '—'],
            ['📞 Phone',   form.phone   || '—'],
            ['📍 Area',    'Lankelapalem'],
            ['🛵 Vehicle', form.vehicle || '—'],
            ['🔒 Password','••••••••'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="font-medium text-sm">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
function LoginScreen() {
  const [partnerId, setPartnerId] = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const res = await signIn('delivery', { partnerId: partnerId.toUpperCase(), password, redirect: false })
    setLoading(false)
    if (res?.error) setError('Invalid Partner ID or password')
  }

  return (
    <div className="login-page min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🛵</div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Partner</h1>
          <p className="text-gray-500 text-sm mt-1">Login with your Partner ID from Kisavi admin</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-medium">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Partner ID</label>
              <input className="input font-mono" placeholder="DL-001"
                value={partnerId} onChange={e => setPartnerId(e.target.value.toUpperCase())} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-brand w-full">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-4 p-3 bg-amber-50 rounded-xl text-xs text-amber-700">
            Your Partner ID and password are provided by the Kisavi admin. Contact admin if you don't have them.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DeliveryPanel() {
  const { data: session, status } = useSession()
  const { runAction, isPending } = useActionLock()
  const [tab,       setTab]       = useState('dashboard')
  const [orders,    setOrders]    = useState([])
  const [partner,   setPartner]   = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [sharing,   setSharing]   = useState(false)
  const [location,  setLocation]  = useState(null)
  const [toast,     setToast]     = useState('')
  const watchRef = useRef(null)

  const isDelivery = status === 'authenticated' && session?.user?.role === 'delivery'

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    if (!isDelivery) return
    const pid = session.user.partnerId
    Promise.all([
      fetch(`/api/delivery/${pid}`).then(r => r.json()),
      fetch(`/api/orders?partnerId=${session.user.id}`).then(r => r.json()),
      fetch('/api/orders?available=true').then(r => r.json()),
    ]).then(([p, o, available]) => { setPartner(p); setOrders([...o, ...available.filter(order => !o.some(item => item.orderId === order.orderId))]); setLoading(false) })
  }, [isDelivery, session?.user?.partnerId])

  // Start / stop live location sharing
  function toggleLocationSharing() {
    if (sharing) {
      navigator.geolocation.clearWatch(watchRef.current)
      setSharing(false); showToast('Location sharing stopped')
      return
    }
    if (!navigator.geolocation) { showToast('GPS not available on this device'); return }
    setSharing(true); showToast('Sharing live location…')
    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setLocation({ lat, lng })
        // Find active order to attach location to
        const activeOrder = orders.find(o => ['confirmed','picked_up','on_the_way'].includes(o.status))
        await fetch('/api/location', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lng, partnerId: session.user.partnerId, orderId: activeOrder?.orderId }),
        }).catch(() => {})
      },
      (err) => { console.error('GPS error:', err); setSharing(false) },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    )
  }

  // Cleanup GPS on unmount
  useEffect(() => () => { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current) }, [])

  async function updateStatus(orderId, newStatus) {
    let currentLocation
    if (['picked_up', 'delivered'].includes(newStatus)) {
      if (!navigator.geolocation) { showToast('GPS is not available on this device'); return }
      try {
        const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }))
        currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude }
        setLocation(currentLocation)
      } catch (_) {
        showToast('Allow location access to verify your delivery position')
        return
      }
    }
    const response = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus, partnerId: session.user.id, currentLocation }),
    })
    const data = await response.json()
    if (!response.ok) { showToast(data.error || 'Could not update order status'); return }
    setOrders(prev => prev.map(o => o.orderId === orderId ? data : o))
    showToast(`Status updated to ${STATUS_CONFIG[newStatus]?.label}`)
  }

  function openDirections(order, destination) {
    const coordinates = destination === 'farmer' ? order.farmerLocation : order.location
    const address = destination === 'farmer' ? order.farmerAddress : order.address
    const target = coordinates?.lat && coordinates?.lng ? `${coordinates.lat},${coordinates.lng}` : address
    if (!target) { showToast('Destination address is unavailable'); return }
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(target)}&travelmode=driving`, '_blank', 'noopener,noreferrer')
  }

  async function requestSettlement() {
    if (new Date().getHours() < 21) { showToast('Settlement requests open after 9:00 PM'); return }
    const response = await fetch(`/api/delivery/${session.user.partnerId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settlementRequest: true }),
    })
    const data = await response.json()
    if (!response.ok) { showToast(data.error || 'Could not request settlement'); return }
    setPartner(data); showToast('Settlement request sent to Kisavi')
  }

  async function claimOrder(orderId) {
    const response = await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, claimPartnerId: session.user.partnerId }) })
    const data = await response.json()
    if (!response.ok) { showToast(data.error || 'Order was already accepted'); return }
    setOrders(previous => previous.map(order => order.orderId === orderId ? data : order))
    showToast('Order accepted')
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-bounce">🛵</div></div>
  if (!isDelivery) return <LoginScreen />
  if (loading)     return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-bounce">🛵</div></div>

  const delivered   = orders.filter(o => o.status === 'delivered')
  const deliveryPayout = order => order.deliveryAgentFee || order.deliveryFee || 0
  const earnings    = delivered.reduce((s, o) => s + deliveryPayout(o), 0)
  const now = new Date()
  const isToday = order => { const date = new Date(order.createdAt); return date.toDateString() === now.toDateString() }
  const isThisMonth = order => { const date = new Date(order.createdAt); return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() }
  const todayEarnings = delivered.filter(isToday).reduce((sum, order) => sum + deliveryPayout(order), 0)
  const monthlyEarnings = delivered.filter(isThisMonth).reduce((sum, order) => sum + deliveryPayout(order), 0)
  const settledAmount = delivered.filter(order => order.deliverySettlementStatus === 'settled').reduce((sum, order) => sum + deliveryPayout(order), 0)
  const pendingSettlement = delivered.filter(order => order.deliverySettlementStatus !== 'settled').reduce((sum, order) => sum + deliveryPayout(order), 0)
  const settlementRequestOpen = now.getHours() >= 21
  const activeOrder = orders.find(o => ['confirmed','picked_up','on_the_way'].includes(o.status))

  const NEXT_STATUS = {
    confirmed:  { next: 'picked_up',  label: 'Mark Picked Up',     color: 'brand' },
    picked_up:  { next: 'on_the_way', label: 'Mark On the Way',    color: 'blue'  },
    on_the_way: { next: 'delivered',  label: 'Mark as Delivered ✓', color: 'green' },
  }

  return (
    <div className="panel-page min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <div className="panel-header text-white px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1"><span className="panel-logo"/><p className="text-white/70 text-xs">Kisavi Delivery</p></div>
            <h1 className="font-bold text-lg leading-tight">{partner?.name || session.user.name}</h1>
            <p className="text-amber-200 text-xs font-mono">{session.user.partnerId} · {partner?.region}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live GPS toggle */}
            <button onClick={toggleLocationSharing}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${sharing ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white'}`}>
              {sharing ? '● LIVE' : '○ Share GPS'}
            </button>
            <button onClick={() => signOut({ callbackUrl: '/delivery' })} className="text-amber-200 text-xs">Logout</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="panel-tabs bg-white border-b border-gray-100 px-4 flex sticky top-[76px] z-30">
        {[['dashboard','📊 Dashboard'],['orders','📦 My Orders'],['profile','👤 Profile']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-colors ${tab===id ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-400'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 pb-16 space-y-4">

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="fade-in-up space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ['☀️', 'Today Earnings', formatCurrency(todayEarnings), 'text-green-600'],
                ['📅', 'Monthly Earnings', formatCurrency(monthlyEarnings), 'text-brand-600'],
                ['✅', 'Amount Settled', formatCurrency(settledAmount), 'text-blue-600'],
                ['⏳', 'Pending Settlement', formatCurrency(pendingSettlement), 'text-amber-600'],
              ].map(([icon,label,val,color]) => (
                <div key={label} className="card p-3 text-center">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className={`font-bold ${color}`}>{val}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>
            <div className="card p-4 border-amber-100 bg-amber-50 flex items-center justify-between gap-3">
              <div><p className="font-bold text-sm text-amber-800">Request settlement</p><p className="text-xs text-amber-700 mt-1">Available daily after 9:00 PM</p></div>
              <button onClick={() => runAction('settlement', requestSettlement)} disabled={isPending('settlement') || !settlementRequestOpen || !pendingSettlement || partner?.settlementRequestStatus === 'requested'} className="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-wait">{isPending('settlement') ? 'Processing…' : partner?.settlementRequestStatus === 'requested' ? 'Requested' : settlementRequestOpen ? 'Request now' : 'After 9 PM'}</button>
            </div>

            {/* GPS status */}
            <div className={`card p-4 border-2 ${sharing ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{sharing ? '🟢 Sharing live location' : '⚪ Location sharing off'}</p>
                  {location && <p className="text-xs text-gray-500 mt-0.5">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
                  {!location && !sharing && <p className="text-xs text-gray-400 mt-0.5">Turn on so customers can track you</p>}
                </div>
                <button onClick={toggleLocationSharing}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${sharing ? 'bg-red-100 text-red-600' : 'bg-brand-600 text-white'}`}>
                  {sharing ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>

            {/* Active order */}
            {activeOrder ? (
              <div className="card p-4 border-2 border-amber-300 bg-amber-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-amber-800">🔥 Active Delivery</h3>
                  <span className={`badge badge-${STATUS_CONFIG[activeOrder.status]?.color}`}>
                    {STATUS_CONFIG[activeOrder.status]?.label}
                  </span>
                </div>
                <p className="font-mono text-xs text-gray-500 mb-1">{activeOrder.orderId}</p>
                <p className="font-semibold text-sm mb-0.5">{activeOrder.customerName}</p>
                <p className="text-xs text-gray-500 mb-1">🌾 Farm: {activeOrder.farmerName} · {activeOrder.farmerAddress || 'Address unavailable'}</p>
                <p className="text-xs text-gray-500 mb-1">📍 {activeOrder.address}</p>
                <p className="text-xs text-gray-500 mb-3">
                  Items: {activeOrder.items?.map(i=>`${i.name} ×${i.qty}`).join(', ')}
                </p>
                <button
                  onClick={() => openDirections(activeOrder, activeOrder.status === 'confirmed' ? 'farmer' : 'customer')}
                  className="w-full mb-2 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-bold">
                  🗺️ {activeOrder.status === 'confirmed' ? 'Start ride to farmer' : 'Navigate to customer'}
                </button>
                {NEXT_STATUS[activeOrder.status] && (
                  <button
                    onClick={() => runAction(`status-${activeOrder.orderId}`, () => updateStatus(activeOrder.orderId, NEXT_STATUS[activeOrder.status].next))}
                    disabled={isPending(`status-${activeOrder.orderId}`)} className="btn-brand w-full text-sm py-3 disabled:opacity-50 disabled:cursor-wait">
                    {isPending(`status-${activeOrder.orderId}`) ? 'Processing…' : NEXT_STATUS[activeOrder.status].label}
                  </button>
                )}
              </div>
            ) : (
              <div className="card p-8 text-center text-gray-400">
                <div className="text-4xl mb-2">✅</div>
                <p className="font-medium">No active delivery</p>
                <p className="text-sm mt-1">You'll be assigned orders by the admin</p>
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div className="fade-in-up space-y-3">
            <h2 className="font-bold text-gray-800">All Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">📦</div><p>No orders assigned yet</p>
              </div>
            ) : orders.map(o => {
              const sc = STATUS_CONFIG[o.status]
              const ns = NEXT_STATUS[o.status]
              return (
                <div key={o._id} className="card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-gray-400">{o.orderId}</span>
                    <span className={`badge badge-${sc?.color}`}>{sc?.label}</span>
                  </div>
                  <p className="font-bold text-sm">{o.customerName}</p>
                  {!o.deliveryPartnerId && o.status === 'confirmed' && <button onClick={() => runAction(`claim-${o.orderId}`, () => claimOrder(o.orderId))} disabled={isPending(`claim-${o.orderId}`)} className="w-full mb-2 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold disabled:opacity-50 disabled:cursor-wait">{isPending(`claim-${o.orderId}`) ? 'Processing…' : 'Accept delivery'}</button>}
                  <p className="text-xs text-gray-500 mt-0.5">🌾 Farm: {o.farmerName} · {o.farmerAddress || 'Address unavailable'}</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-1">📍 {o.address}</p>
                  <p className="text-xs text-gray-500 mb-2">{o.items?.map(i=>`${i.name} ×${i.qty}`).join(' · ')}</p>
                  {o.deliveryPartnerId === session.user.id && ['confirmed', 'picked_up', 'on_the_way'].includes(o.status) && (
                    <button
                      onClick={() => openDirections(o, o.status === 'confirmed' ? 'farmer' : 'customer')}
                      className="w-full mb-2 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold">
                      🗺️ {o.status === 'confirmed' ? 'Start ride to farmer' : 'Navigate to customer'}
                    </button>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600 font-semibold">
                      Your earning: {formatCurrency(deliveryPayout(o))}
                    </span>
                    {ns && o.status !== 'delivered' && (
                      <button onClick={() => runAction(`status-${o.orderId}`, () => updateStatus(o.orderId, ns.next))}
                        disabled={isPending(`status-${o.orderId}`)} className="text-xs font-bold px-3 py-1.5 bg-brand-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-wait">
                        {isPending(`status-${o.orderId}`) ? 'Processing…' : ns.label}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {/* PROFILE */}
{tab === 'profile' && (
  <div className="fade-in-up max-w-lg">
    <DeliveryProfileEdit partner={partner} partnerId={session.user.partnerId} onSaved={(updated) => setPartner(updated)} />
  </div>
)}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl fade-in-up z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
