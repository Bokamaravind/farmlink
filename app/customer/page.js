'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { getVegEmoji, formatCurrency, calculateDeliveryFee, getFreeDeliveryMinimum, getInitials, STATUS_CONFIG, CENTER_LOCATION, DELIVERY_RADIUS_KM, SERVICE_AREA_NAME } from '@/lib/utils'

// ── ICONS ─────────────────────────────────────────────────────────
const HomeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
const CartIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
const TrackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const PinIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
const StarIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>

function getFarmerCoordinates(farmer) {
  return {
    lat: Number(farmer?.location?.lat) || CENTER_LOCATION.lat,
    lng: Number(farmer?.location?.lng) || CENTER_LOCATION.lng,
  }
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

function useToast() {
  const [toasts, setToasts] = useState([])
  const add = useCallback((msg, type = 'default') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])
  return { toasts, add }
}

// ── QTY CONTROL ───────────────────────────────────────────────────
function QtyBtn({ qty, onInc, onDec }) {
  if (qty === 0) return (
    <button onClick={onInc} className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-transform">
      + ADD
    </button>
  )
  return (
    <div className="flex items-center bg-brand-600 rounded-xl overflow-hidden h-9">
      <button onClick={onDec} className="w-9 h-full text-white text-xl font-bold hover:bg-brand-700">−</button>
      <span className="px-3 text-white font-bold text-base">{qty}</span>
      <button onClick={onInc} className="w-9 h-full text-white text-xl font-bold hover:bg-brand-700">+</button>
    </div>
  )
}

// ── FARMER CARD ───────────────────────────────────────────────────
const GRADIENTS = ['from-emerald-500 to-teal-600', 'from-green-500 to-emerald-600', 'from-teal-500 to-cyan-600', 'from-lime-500 to-green-600']
function FarmerCard({ farmer, onClick }) {
  const idx = (parseInt(farmer.farmerId?.replace('FL-', '') || '1') - 1) % GRADIENTS.length
  const avail = farmer.vegetables?.filter(v => v.available).length || 0
  return (
    <div onClick={onClick} className="card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
      <div className={`h-24 bg-gradient-to-r ${GRADIENTS[idx]} relative flex items-end p-3`}>
        <div className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-green-700">
          {avail > 0 ? `${avail} items` : 'Closed'}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center text-xl font-bold text-white">
          {getInitials(farmer.name)}
        </div>
      </div>
      <div className="p-3.5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-[15px]">{farmer.name}'s Farm</h3>
          <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">
            <span className="w-3 h-3"><StarIcon /></span>{farmer.rating?.toFixed(1)}
          </span>
        </div>
        <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
          <span className="w-3 h-3"><PinIcon /></span>{farmer.address || farmer.region}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {(farmer.availableSizes || ['small']).map(size => <span key={size} className="text-[10px] font-semibold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{size}</span>)}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {farmer.vegetables?.filter(v => v.available).slice(0, 4).map(v => (
            <span key={v._id} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-lg font-medium">
              {getVegEmoji(v.name)} {v.name}
            </span>
          ))}
          {avail > 4 && <span className="text-xs text-gray-400">+{avail - 4} more</span>}
        </div>
      </div>
    </div>
  )
}

// ── GOOGLE MAPS TRACKER ───────────────────────────────────────────
function MapTracker({ order, farmer, onCancel }) {
  const mapRef    = useRef(null)
  const mapObj    = useRef(null)
  const riderRef  = useRef(null)
  const [riderPos, setRiderPos] = useState(null)

  const step = STATUS_CONFIG[order?.status]?.step ?? 0

  // Load Leaflet CSS + JS (free, no API key)
  useEffect(() => {
    // Add Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link  = document.createElement('link')
      link.id     = 'leaflet-css'
      link.rel    = 'stylesheet'
      link.href   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    // Add Leaflet JS
    if (window.L) { initMap(); return }
    const script   = document.createElement('script')
    script.src     = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async   = true
    script.onload  = initMap
    document.head.appendChild(script)

    return () => {
      // Cleanup map on unmount
      if (mapObj.current) {
        mapObj.current.remove()
        mapObj.current = null
      }
    }
  }, [])

  function initMap() {
    if (!mapRef.current || !window.L || mapObj.current) return

    const farmerLocation = getFarmerCoordinates(farmer)
    const FARM = [farmerLocation.lat, farmerLocation.lng]
    const CUSTOMER = order?.location?.lat && order?.location?.lng
      ? [order.location.lat, order.location.lng]
      : FARM

    mapObj.current = window.L.map(mapRef.current, {
      center: FARM,
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    })

    // OpenStreetMap tiles — completely free, no key needed
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapObj.current)

    // Farm marker (green)
    const farmIcon = window.L.divIcon({
      html: '<div style="background:#1a9e66;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🌾</div>',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      className: '',
    })
    window.L.marker(FARM, { icon: farmIcon })
      .addTo(mapObj.current)
      .bindPopup(`<b>${farmer?.name || 'Farm'}</b><br>${farmer?.region || ''}`)

    // Customer home marker (blue)
    const homeIcon = window.L.divIcon({
      html: '<div style="background:#3b82f6;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🏠</div>',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      className: '',
    })
    window.L.marker(CUSTOMER, { icon: homeIcon })
      .addTo(mapObj.current)
      .bindPopup('<b>Your location</b>')

    // Rider marker (animated)
    const riderIcon = window.L.divIcon({
      html: '<div id="rider-marker" style="background:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid #1a9e66;box-shadow:0 2px 12px rgba(0,0,0,0.3)">🛵</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      className: '',
    })
    riderRef.current = window.L.marker(FARM, { icon: riderIcon })
      .addTo(mapObj.current)
      .bindPopup('<b>Your delivery rider</b>')

    // Draw route line between farm and customer
    const routeCoords = [
      FARM,
      [FARM[0] + 0.01, FARM[1] + 0.01],
      [FARM[0] + 0.005, FARM[1] + 0.005],
      [FARM[0] + 0.002, FARM[1] + 0.002],
      CUSTOMER,
    ]
    window.L.polyline(routeCoords, {
      color: '#1a9e66',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 8',
    }).addTo(mapObj.current)
    mapObj.current.fitBounds([FARM, CUSTOMER], { padding: [30, 30] })
  }

  // Poll rider GPS location every 10 seconds
  useEffect(() => {
    if (!order?.orderId || order.status === 'delivered') return
    const poll = async () => {
      try {
        const res  = await fetch(`/api/location?orderId=${order.orderId}`)
        const data = await res.json()
        if (data.location?.lat && data.location?.lng) {
          const pos = [data.location.lat, data.location.lng]
          setRiderPos({ lat: data.location.lat, lng: data.location.lng })
          if (riderRef.current && mapObj.current) {
            riderRef.current.setLatLng(pos)
            mapObj.current.panTo(pos)
          }
        }
      } catch (_) {}
    }
    poll()
    const id = setInterval(poll, 10000)
    return () => clearInterval(id)
  }, [order?.orderId, order?.status])

  const STEPS = [
    { label: 'Order placed',   sub: 'Farmer notified',            icon: '📋' },
    { label: 'Confirmed',      sub: 'Farmer accepted your order', icon: '✅' },
    { label: 'Picked up',      sub: 'Rider collected from farm',  icon: '📦' },
    { label: 'On the way',     sub: 'Heading to your location',   icon: '🛵' },
    { label: 'Delivered',      sub: 'Enjoy your fresh veggies!',  icon: '🏠' },
  ]

  return (
    <div className="space-y-4 fade-in-up">

      {/* MAP CARD */}
      <div className="card overflow-hidden">

        {/* Leaflet Map */}
        <div style={{ position: 'relative' }}>
          <div
            ref={mapRef}
            style={{ height: '240px', width: '100%', zIndex: 1 }}
          />

          {/* Status ribbon on top of map */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 999 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2 shadow-sm">
            {order?.status === 'delivered'
              ? '✅ Delivered'
              : <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"/>
                  {STATUS_CONFIG[order?.status]?.label || 'Processing'}</>
            }
          </div>

          {/* ETA pill */}
          <div style={{ position: 'absolute', bottom: '12px', right: '12px', zIndex: 999 }}
            className="bg-brand-600 text-white rounded-full px-3 py-1.5 text-xs font-bold shadow-lg">
            {order?.status === 'delivered' ? 'Done ✓' : '~25 min'}
          </div>

          {/* Live GPS coordinates (shown when rider is sharing) */}
          {riderPos && order?.status !== 'delivered' && (
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 999 }}
              className="bg-white/90 rounded-lg px-2 py-1 text-[10px] text-gray-600 font-mono">
              🛵 {riderPos.lat.toFixed(4)}, {riderPos.lng.toFixed(4)}
            </div>
          )}
        </div>

        {/* Order details below map */}
        <div className="p-4 border-t border-gray-100 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-medium">Order ID</span>
            <span className="font-mono font-semibold text-xs text-gray-800">{order?.orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-medium">Farm</span>
            <span className="font-semibold text-gray-800">{farmer?.name} · {farmer?.region}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-medium">Delivery partner</span>
            <span className="font-semibold text-gray-800">{order?.deliveryPartnerName || 'Assigning rider'}{order?.deliveryPhone ? ` · ${order.deliveryPhone}` : ''}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-medium">Items</span>
            <span className="text-gray-500 text-xs text-right max-w-[60%]">
              {order?.items?.map(i => `${i.name} ×${i.qty}`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-medium">Payment</span>
            <span className={`font-semibold ${order?.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
              {order?.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-medium">Total</span>
            <span className="font-bold text-brand-600 text-base">{formatCurrency(order?.total)}</span>
          </div>
          {['placed', 'confirmed'].includes(order?.status) && (
            <button type="button" onClick={onCancel} className="w-full mt-2 border border-red-200 text-red-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-red-50">
              Cancel order
            </button>
          )}
          {order?.status === 'cancelled' && <p className="text-sm text-red-600 font-semibold">This order was cancelled.</p>}
        </div>
      </div>

      {/* STEP TIMELINE */}
      <div className="card p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          Delivery Progress
        </p>
        {STEPS.map((s, i) => {
          const done    = step > i
          const active  = step === i
          const pending = step < i
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${done   ? 'bg-brand-500 text-white'
                  : active ? 'bg-amber-400 text-white animate-pulse'
                  :          'bg-gray-100 text-gray-400'}`}>
                  {done ? '✓' : s.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 h-8 my-1 transition-colors ${done ? 'bg-brand-400' : 'bg-gray-200'}`}/>
                )}
              </div>
              <div className={`pb-4 flex-1 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                <p className={`font-semibold text-sm ${pending ? 'text-gray-400' : 'text-gray-900'}`}>
                  {s.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

function DeliveryFeedback({ order, onSaved }) {
  const [rating, setRating] = useState(order?.feedbackRating || 0)
  const [comment, setComment] = useState(order?.feedbackComment || '')
  const [saving, setSaving] = useState(false)
  if (!order || order.status !== 'delivered' || order.feedbackRating) return null
  async function submit() {
    if (!rating) return
    setSaving(true)
    const res = await fetch('/api/orders', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.orderId, feedbackRating: rating, feedbackComment: comment }),
    })
    setSaving(false)
    if (res.ok) onSaved?.({ ...order, feedbackRating: rating, feedbackComment: comment })
  }
  return (
    <div className="card p-4">
      <h3 className="font-bold">How was your delivery?</h3>
      <div className="flex gap-2 my-3">{[1, 2, 3, 4, 5].map(value => <button key={value} onClick={() => setRating(value)} className={`text-2xl ${value <= rating ? 'text-amber-400' : 'text-gray-300'}`}>★</button>)}</div>
      <textarea className="input mb-3" rows={2} value={comment} onChange={e => setComment(e.target.value)} placeholder="Tell us about the freshness and delivery" />
      <button onClick={submit} disabled={!rating || saving} className="btn-brand w-full disabled:opacity-50">{saving ? 'Saving...' : 'Send feedback'}</button>
    </div>
  )
}

function AddressPicker({ address, onChange, onLocation, initialLocation }) {
  const mapRef = useRef(null)
  const mapObj = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    const init = () => {
      if (!mapRef.current || !window.L || mapObj.current) return
      mapObj.current = window.L.map(mapRef.current).setView([CENTER_LOCATION.lat, CENTER_LOCATION.lng], 13)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapObj.current)
      mapObj.current.on('click', event => setPin(event.latlng.lat, event.latlng.lng))
      if (initialLocation?.lat && initialLocation?.lng) setPin(initialLocation.lat, initialLocation.lng)
    }
    if (window.L) init()
    else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = init
      document.head.appendChild(script)
    }
    return () => { if (mapObj.current) { mapObj.current.remove(); mapObj.current = null } }
  }, [])

  async function reverseGeocode(lat, lng) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      const data = await response.json()
      const a = data.address || {}
      onChange(prev => ({
        ...prev,
        street: [a.house_number, a.road].filter(Boolean).join(' ') || prev.street,
        area: a.neighbourhood || a.suburb || a.village || a.town || a.city_district || prev.area,
        city: a.city || a.town || a.municipality || a.city_district || a.state_district || prev.city,
        pincode: a.postcode || prev.pincode,
      }))
    } catch (_) {}
  }

  function setPin(lat, lng) {
    if (!mapObj.current || !window.L) return
    if (markerRef.current) markerRef.current.setLatLng([lat, lng])
    else markerRef.current = window.L.marker([lat, lng], { draggable: true }).addTo(mapObj.current)
    markerRef.current.off('dragend').on('dragend', event => { const pos = event.target.getLatLng(); setPin(pos.lat, pos.lng) })
    mapObj.current.setView([lat, lng], 16)
    onLocation({ lat, lng })
    reverseGeocode(lat, lng)
  }

  function useLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(({ coords }) => setPin(coords.latitude, coords.longitude), () => {})
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input className="input" value={address.recipientName} onChange={e => onChange({ ...address, recipientName: e.target.value })} placeholder="Recipient name" />
        <input className="input" value={address.flatHouse} onChange={e => onChange({ ...address, flatHouse: e.target.value })} placeholder="Flat / house no." />
      </div>
      <input className="input" value={address.street} onChange={e => onChange({ ...address, street: e.target.value })} placeholder="Street / road" />
      <div className="grid grid-cols-2 gap-2">
        <input className="input" value={address.landmark} onChange={e => onChange({ ...address, landmark: e.target.value })} placeholder="Landmark" />
        <input className="input" value={address.area} onChange={e => onChange({ ...address, area: e.target.value })} placeholder="Area" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input className="input" value={address.city} onChange={e => onChange({ ...address, city: e.target.value })} placeholder="City" />
        <input className="input" value={address.pincode} onChange={e => onChange({ ...address, pincode: e.target.value })} placeholder="Pincode" inputMode="numeric" />
      </div>
      <button type="button" onClick={useLocation} className="btn-outline w-full">Use current location and fill address</button>
      <div ref={mapRef} style={{ height: '210px', width: '100%', zIndex: 1 }} className="rounded-xl overflow-hidden" />
      <p className="text-xs text-gray-400">Tap the map or drag the pin to fine-tune your delivery point.</p>
    </div>
  )
}
// ── AUTH SCREEN ───────────────────────────────────────────────────
function AuthScreen() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function doLogin(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const res = await signIn('customer', { email: form.email, password: form.password, redirect: false })
    setLoading(false)
    if (res?.error) setError('Invalid email or password')
  }

  async function doSignup(e) {
    e.preventDefault(); setError(''); setLoading(true)
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
    const res = await fetch('/api/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Signup failed'); setLoading(false); return }
    await signIn('customer', { email: form.email, password: form.password, redirect: false })
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      <div className="bg-brand-600 text-white px-6 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {['🌿', '🥬', '🍅', '🥕', '🫛'].map((e, i) => (
            <span key={i} className="absolute text-5xl" style={{ top: `${10 + i * 15}%`, left: `${5 + i * 18}%`, transform: `rotate(${i * 20 - 20}deg)` }}>{e}</span>
          ))}
        </div>
        <div className="relative">
          <div className="text-6xl mb-3">🌱</div>
          <h1 className="text-3xl font-bold mb-2">Kisavi</h1>
          <p className="text-brand-100 text-sm">Farm-fresh vegetables, direct to your door</p>
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {['No middlemen', 'Farm fresh', 'Best prices'].map(t => (
              <span key={t} className="bg-white/20 text-xs px-3 py-1 rounded-full font-medium">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-6 pt-6 pb-10">
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'}`}>
              {t === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-medium">{error}</div>}

        <form onSubmit={tab === 'login' ? doLogin : doSignup} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input className="input" placeholder="Your name" value={form.name} onChange={e => upd('name', e.target.value)} required />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => upd('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => upd('password', e.target.value)} required />
          </div>
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone (for delivery updates)</label>
              <input className="input" type="tel" placeholder="9876543210" value={form.phone} onChange={e => upd('phone', e.target.value)} />
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-brand w-full">
            {loading ? 'Please wait…' : tab === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button onClick={() => signIn('google', { callbackUrl: '/customer' })}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <GoogleIcon /> Continue with Google
        </button>
      </div>
    </div>
  )
}

function CustomerProfile({ user, orders, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || 'Madhapur, Hyderabad',
    password: '',
  })
  const [msg, setMsg] = useState('')
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function save() {
    setSaving(true); setMsg('')
    const body = { name: form.name, phone: form.phone, address: form.address }
    if (form.password) body.password = form.password
    const res = await fetch(`/api/customers/${user.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setMsg(data.error || 'Failed to save'); return }
    setMsg('Profile updated! ✓')
    setEditing(false)
    onUpdate?.(data)
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="space-y-4">
      {/* Avatar + name */}
      <div className="card p-5 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-3xl font-bold text-brand-700 mx-auto mb-3 overflow-hidden">
          {user?.image
            ? <img src={user.image} className="w-full h-full object-cover" alt="" />
            : getInitials(user?.name || '')}
        </div>
        <h2 className="font-bold text-lg">{form.name}</h2>
        <p className="text-gray-400 text-sm">{user?.email}</p>
        {user?.provider === 'google' && (
          <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full mt-2 font-medium">
            🔵 Google account
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[['📦', orders.length, 'Orders'], ['⭐', '4.8', 'Rating'], ['📍', '1', 'Address']].map(([icon, val, label]) => (
          <div key={label} className="card p-3 text-center">
            <div className="text-lg">{icon}</div>
            <div className="font-bold text-sm text-brand-600">{val}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Profile Details</h3>
          {!editing
            ? <button onClick={() => setEditing(true)} className="text-sm font-semibold text-brand-600 hover:text-brand-700">✏️ Edit</button>
            : <button onClick={() => { setEditing(false); setMsg('') }} className="text-sm font-semibold text-gray-400">Cancel</button>
          }
        </div>

        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
              <input className="input" value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
              <input className="input" type="tel" value={form.phone} onChange={e => upd('phone', e.target.value)} placeholder="9876543210" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivery Address</label>
              <textarea className="input" rows={2} value={form.address} onChange={e => upd('address', e.target.value)} placeholder="Your delivery address" />
            </div>
            {user?.provider !== 'google' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">New Password (leave blank to keep)</label>
                <input className="input" type="password" value={form.password} onChange={e => upd('password', e.target.value)} placeholder="Min 6 characters" />
              </div>
            )}
            {msg && <p className={`text-sm font-medium text-center ${msg.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
            <button onClick={save} disabled={saving} className="btn-brand w-full">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {[
              ['📛 Name', form.name || '—'],
              ['📞 Phone', form.phone || '—'],
              ['📍 Address', form.address || '—'],
              ['🔒 Password', user?.provider === 'google' ? 'Managed by Google' : '••••••••'],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="text-gray-900 text-sm font-medium text-right max-w-[60%]">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div>
          <h3 className="font-bold text-sm text-gray-600 mb-2">Recent Orders</h3>
          {orders.slice(0, 5).map(o => {
            const sc = STATUS_CONFIG[o.status]
            return (
              <div key={o._id} className="card p-4 mb-2">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-xs text-gray-400">{o.orderId}</span>
                  <span className={`badge badge-${sc?.color}`}>{sc?.label}</span>
                </div>
                <p className="text-sm font-semibold">{o.items?.map(i => `${i.name} ×${i.qty}`).join(', ')}</p>
                <div className="flex justify-between mt-1">
                  <span className={`text-xs font-medium ${o.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                    {o.paymentStatus === 'paid' ? '✓ Paid' : 'Pending payment'}
                  </span>
                  <span className="font-bold text-brand-600 text-sm">{formatCurrency(o.total)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── RAZORPAY PAYMENT HANDLER ──────────────────────────────────────
async function initiatePayment({ order, user, amount = order.total, onSuccess, onFail }) {
  try {
    // 1. Create Razorpay order on backend
    const res = await fetch('/api/payment', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderId: order.orderId }),
    })
    const rzp = await res.json()
    if (!rzp.rzpOrderId) throw new Error('Failed to create payment order')

    // 2. Open Razorpay checkout
    const options = {
      key: rzp.keyId,
      amount: rzp.amount,
      currency: rzp.currency,
      name: 'Kisavi',
      description: `Order ${order.orderId}`,
      order_id: rzp.rzpOrderId,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || '',
      },
      theme: { color: '#1a9e66' },
      handler: async (response) => {
        // 3. Verify on backend
        const verify = await fetch('/api/payment', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: order.orderId,
          }),
        })
        const result = await verify.json()
        if (result.success) onSuccess(response.razorpay_payment_id)
        else onFail('Payment verification failed')
      },
      modal: { ondismiss: () => onFail('Payment cancelled') },
    }

    const rzpInstance = new window.Razorpay(options)
    rzpInstance.open()
  } catch (err) {
    onFail(err.message)
  }
}

// ── MAIN CUSTOMER APP ─────────────────────────────────────────────
export default function CustomerApp() {
  const { data: session, status } = useSession()
  const { toasts, add: addToast } = useToast()
  const [tab, setTab] = useState('home')
  const [farmers, setFarmers] = useState([])
  const [selFarmer, setSelFarmer] = useState(null)
  const [cart, setCart] = useState({})
  const [orders, setOrders] = useState([])
  const [activeOrder, setActiveOrder] = useState(null)
  const [activeFarmer, setActiveFarmer] = useState(null)
  const [search, setSearch] = useState('')
  const [stockWarning, setStockWarning] = useState('')
  const [loading, setLoading] = useState(true)
  const [customerLocation, setCustomerLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('idle')
  const [addressFields, setAddressFields] = useState({
    recipientName: '', flatHouse: '', street: '', landmark: '', area: SERVICE_AREA_NAME, city: 'Visakhapatnam', pincode: '',
  })
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [savingAddress, setSavingAddress] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [selectedSize, setSelectedSize] = useState('small')
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [placing, setPlacing] = useState(false)
  const [showFreeDelivery, setShowFreeDelivery] = useState(false)

  const isLoggedIn = status === 'authenticated' && session?.user?.role === 'customer'
  const user = session?.user

  useEffect(() => {
    if (user?.name) setAddressFields(fields => ({ ...fields, recipientName: user.name }))
  }, [user?.name])

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return
    fetch(`/api/customers/${user.id}`).then(response => response.json()).then(customer => {
      const addresses = customer.savedAddresses || []
      setSavedAddresses(addresses)
      const defaultAddress = addresses.at(-1)
      if (defaultAddress?._id) {
        selectSavedAddress(defaultAddress._id)
      }
    }).catch(() => {})
  }, [isLoggedIn, user?.id])

  useEffect(() => {
    const value = [addressFields.recipientName, addressFields.flatHouse, addressFields.street, addressFields.landmark, addressFields.area, addressFields.city, addressFields.pincode].filter(Boolean).join(', ')
    setDeliveryAddress(value)
  }, [addressFields])

  function useCurrentLocation() {
    if (!navigator.geolocation) { setLocationStatus('unsupported'); return }
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const distance = haversine(CENTER_LOCATION.lat, CENTER_LOCATION.lng, coords.latitude, coords.longitude)
        if (distance > DELIVERY_RADIUS_KM) {
          setLocationStatus('outside')
          setCustomerLocation(null)
          return
        }
        setCustomerLocation({ lat: coords.latitude, lng: coords.longitude, distanceKm: distance })
        setLocationStatus('ready')
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Load Razorpay script
  useEffect(() => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.async = true
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    fetch('/api/farmers').then(r => r.json()).then(d => { setFarmers(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return
    fetch(`/api/orders?customerId=${user.id}`).then(r => r.json()).then(data => {
      setOrders(data)
      const current = data.find(o => !['delivered', 'cancelled'].includes(o.status)) || data[0]
      if (current) {
        setActiveOrder(current)
        fetch(`/api/farmers/${current.farmerId}`).then(r => r.json()).then(f => setActiveFarmer(f)).catch(() => { })
      }
    }).catch(() => { })
  }, [isLoggedIn, user?.id])

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return
    const refreshLiveOrder = async () => {
      try {
        const data = await fetch(`/api/orders?customerId=${user.id}`).then(r => r.json())
        setOrders(data)
        const refreshed = activeOrder?.orderId && data.find(o => o.orderId === activeOrder.orderId)
        const live = data.find(o => !['delivered', 'cancelled'].includes(o.status))
        if (refreshed) setActiveOrder(refreshed)
        else if (live) setActiveOrder(live)
      } catch (_) {}
    }
    const id = setInterval(refreshLiveOrder, 10000)
    return () => clearInterval(id)
  }, [isLoggedIn, user?.id, activeOrder?.orderId])

  // Cart helpers
  const cartFarmerId = Object.keys(cart).find(fid => Object.keys(cart[fid] || {}).length > 0)
  const cartFarmer = farmers.find(farmer => farmer.farmerId === cartFarmerId)
  const cartCount = Object.values(cart).reduce((s, m) => s + Object.values(m).reduce((a, b) => a + b, 0), 0)
  function getQty(fid, vid) { return cart[fid]?.[vid] || 0 }
  function changeQty(fid, vid, delta) {
    const farmer = farmers.find(f => f.farmerId === fid)
    const veg = farmer?.vegetables?.find(v => v._id === vid || v._id?.toString() === vid)
    const maxQty = veg?.qty || 0
    const currentQty = cart[fid]?.[vid] || 0

    if (delta > 0 && currentQty >= maxQty) {
      setStockWarning(`Only ${maxQty} ${veg?.unit || 'kg'} of ${veg?.name} available!`)
      setTimeout(() => setStockWarning(''), 3000)
      return
    }

    setStockWarning('')
    setCart(prev => {
      const next = { ...prev, [fid]: { ...(prev[fid] || {}) } }
      next[fid][vid] = Math.max(0, (next[fid][vid] || 0) + delta)
      if (!next[fid][vid]) delete next[fid][vid]
      return next
    })
  }

  // Cart totals
  const cartItems = []; let subtotal = 0
  if (cartFarmerId) {
    const f = farmers.find(x => x.farmerId === cartFarmerId)
    if (f) Object.entries(cart[cartFarmerId] || {}).forEach(([vid, qty]) => {
      const v = f.vegetables.find(x => x._id === vid || x._id?.toString() === vid)
      if (v && qty > 0) { cartItems.push({ ...v, qty, farmerId: f.farmerId, farmerName: f.name, farmerPhone: f.phone }); subtotal += qty * v.price }
    })
  }

  const platformFee = 0
  const platformCommission = Math.round(subtotal * 0.05)

  function haversine(lat1, lon1, lat2, lon2) {
    const toRad = d => d * Math.PI / 180
    const R = 6371 // km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const farmerCoordinates = getFarmerCoordinates(cartFarmer)
  const distanceKm = customerLocation
    ? haversine(farmerCoordinates.lat, farmerCoordinates.lng, customerLocation.lat, customerLocation.lng)
    : null
  const freeDeliveryMinimum = getFreeDeliveryMinimum(selectedSize)
  const deliveryFee = calculateDeliveryFee(distanceKm, subtotal, selectedSize)

  const total = subtotal + platformFee + deliveryFee

  async function saveCurrentAddress() {
    if (!addressFields.recipientName || !addressFields.flatHouse || !addressFields.street || !addressFields.area || !addressFields.city || !customerLocation) {
      addToast('Complete the address and select a map pin first', 'error')
      return
    }
    setSavingAddress(true)
    const current = {
      label: addressFields.landmark || addressFields.area || 'Address',
      ...addressFields,
      location: { lat: customerLocation.lat, lng: customerLocation.lng },
    }
    const nextAddresses = selectedAddressId
      ? savedAddresses.map(address => address._id === selectedAddressId ? { ...current, _id: selectedAddressId } : address)
      : [...savedAddresses, current]
    const response = await fetch(`/api/customers/${user.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedAddresses: nextAddresses }),
    })
    const data = await response.json()
    setSavingAddress(false)
    if (!response.ok) { addToast(data.error || 'Could not save address', 'error'); return }
    setSavedAddresses(data.savedAddresses || nextAddresses)
    const saved = (data.savedAddresses || nextAddresses).at(-1)
    if (!selectedAddressId && saved?._id) setSelectedAddressId(saved._id)
    addToast(selectedAddressId ? 'Address updated' : 'Address saved', 'success')
  }

  function selectSavedAddress(addressId) {
    if (!addressId) {
      setSelectedAddressId('')
      setCustomerLocation(null)
      setLocationStatus('idle')
      setAddressFields({ recipientName: user?.name || '', flatHouse: '', street: '', landmark: '', area: SERVICE_AREA_NAME, city: 'Visakhapatnam', pincode: '' })
      return
    }
    const saved = savedAddresses.find(address => address._id === addressId)
    if (!saved) return
    setSelectedAddressId(addressId)
    setAddressFields({ recipientName: saved.recipientName || user?.name || '', flatHouse: saved.flatHouse || '', street: saved.street || '', landmark: saved.landmark || '', area: saved.area || '', city: saved.city || '', pincode: saved.pincode || '' })
    if (saved.location?.lat && saved.location?.lng) {
      const distance = haversine(getFarmerCoordinates(cartFarmer).lat, getFarmerCoordinates(cartFarmer).lng, saved.location.lat, saved.location.lng)
      setCustomerLocation({ lat: saved.location.lat, lng: saved.location.lng, distanceKm: distance })
      const serviceDistance = haversine(CENTER_LOCATION.lat, CENTER_LOCATION.lng, saved.location.lat, saved.location.lng)
      setLocationStatus(serviceDistance <= DELIVERY_RADIUS_KM ? 'ready' : 'outside')
    }
  }

  useEffect(() => {
    if (subtotal < freeDeliveryMinimum) {
      setShowFreeDelivery(false)
      return
    }
    setShowFreeDelivery(true)
    const timeout = setTimeout(() => setShowFreeDelivery(false), 2600)
    return () => clearTimeout(timeout)
  }, [subtotal >= freeDeliveryMinimum, freeDeliveryMinimum])

  async function placeOrder() {
   if (!isLoggedIn) { addToast('Please login first', 'error'); return }
  if (locationStatus !== 'ready') { addToast(`Allow current location to confirm ${SERVICE_AREA_NAME} delivery`, 'error'); return }
  if (subtotal < 150) { addToast(`Add ${formatCurrency(150 - subtotal)} more to reach the minimum order`, 'error'); return }
  if (!addressFields.recipientName || !addressFields.flatHouse || !addressFields.street || !addressFields.area || !addressFields.city) { addToast('Complete your delivery address first', 'error'); return }
    setPlacing(true)
    try {
      const f = farmers.find(x => x.farmerId === cartFarmerId)
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id, customerName: user.name, customerPhone: user.phone || '', customerEmail: user.email || '',
          farmerId: cartFarmerId, items: cartItems.map(i => ({ name: i.name, qty: i.qty, unit: i.unit, price: i.price })),
          subtotal, platformFee, platformCommission, deliveryFee, distanceKm, pack: selectedSize, paymentMethod,
          location: { lat: customerLocation.lat, lng: customerLocation.lng },
          address: deliveryAddress, deliveryAddress: addressFields, paymentStatus: 'pending',
        }),
      })
      const order = await res.json()
      setPlacing(false)
      // Open Razorpay
      initiatePayment({
        order, user, amount: paymentMethod === 'cod' ? order.depositAmount : order.total,
        onSuccess: async (paymentId) => {
          addToast('Payment successful! Order confirmed 🎉', 'success')
          const paymentStatus = paymentMethod === 'cod' ? 'deposit_paid' : 'paid'
          setCart({}); setActiveOrder({ ...order, paymentStatus, status: 'confirmed' }); setActiveFarmer(f)
          setOrders(prev => [{ ...order, paymentStatus, status: 'confirmed' }, ...prev])
          setTab('track')
          fetch('/api/farmers').then(r => r.json()).then(data => setFarmers(data))
        },
        onFail: (msg) => {
          addToast(`Payment ${msg} — order saved, pay on delivery`, 'error')
          setCart({}); setActiveOrder(order); setActiveFarmer(f)
          setOrders(prev => [order, ...prev]); setTab('track')
        },
      })
    } catch (err) {
      setPlacing(false); addToast('Order failed: ' + err.message, 'error')
    }
  }

  const filteredFarmers = farmers.filter(f =>
    f.active && (!search || f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.region.toLowerCase().includes(search.toLowerCase()) ||
      f.vegetables?.some(v => v.name.toLowerCase().includes(search.toLowerCase())))
  )
  const sizeFarmers = filteredFarmers.filter(f => (f.availableSizes || ['small']).includes(selectedSize))

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center bg-brand-50"><div className="text-5xl animate-bounce">🌱</div></div>
  if (!isLoggedIn) return <AuthScreen />

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {/* HEADER */}
      <div className="bg-brand-600 text-white px-4 pt-4 pb-3 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-brand-200 text-xs">Delivering to</p>
            <div onClick={() => setTab('cart')} className="flex items-center gap-1 font-bold text-sm cursor-pointer">
              <span className="w-4 h-4"><PinIcon /></span>
              {locationStatus === 'ready' ? `${SERVICE_AREA_NAME} · within ${DELIVERY_RADIUS_KM} km` : 'Set delivery location'}
              <span className="text-brand-300 text-xs ml-1">›</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTab('cart')} className="relative">
              <span className="w-6 h-6 block"><CartIcon /></span>
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <div onClick={() => setTab('account')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold cursor-pointer overflow-hidden">
              {user?.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : getInitials(user?.name || '')}
            </div>
          </div>
        </div>
        {tab === 'home' && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input className="w-full bg-white text-gray-800 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none placeholder-gray-400"
              placeholder="Search farms or vegetables…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="pb-safe">

        {/* HOME */}
        {tab === 'home' && (
          <div className="px-4 py-4 space-y-3">
            <div className="bg-gradient-to-r from-brand-700 to-emerald-500 rounded-2xl p-4 text-white relative overflow-hidden">
              <p className="text-xs font-semibold text-brand-100 mb-1">📍 Fresh produce around {SERVICE_AREA_NAME}</p>
              <h2 className="text-lg font-bold">Free delivery on {selectedSize}<br />orders of {formatCurrency(getFreeDeliveryMinimum(selectedSize))} and above</h2>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20">🥬</div>
            </div>
            <div className="card p-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Choose your farmer size</p>
              <div className="grid grid-cols-3 gap-2">
                {[['small', 'Small', '₹199'], ['medium', 'Medium', '₹399'], ['large', 'Large', '₹599']].map(([id, label, amount]) => <button key={id} onClick={() => setSelectedSize(id)} className={`p-3 rounded-xl border-2 text-left ${selectedSize === id ? 'border-brand-500 bg-brand-50' : 'border-gray-100'}`}><span className="block font-bold">{label}</span><span className="text-xs text-gray-500">{amount} plan</span></button>)}
              </div>
              <p className="text-xs text-gray-400 mt-2">Showing farmers who supply {selectedSize} orders. Some farmers appear in multiple tabs.</p>
            </div>
            <h2 className="font-bold text-gray-800">{selectedSize[0].toUpperCase() + selectedSize.slice(1)} Farmers</h2>
            {loading ? [1, 2, 3].map(i => <div key={i} className="skeleton h-44 rounded-2xl" />)
              : sizeFarmers.length === 0 ? <div className="text-center py-12 text-gray-400"><div className="text-5xl mb-3">👨‍🌾</div><p>No {selectedSize} farmers found</p><p className="text-xs mt-1">Ask a farmer to enable this size in the Farmer panel.</p></div>
                : sizeFarmers.map(f => <FarmerCard key={f._id} farmer={f} onClick={() => { setSelFarmer(f); setTab('farmer') }} />)
            }
          </div>
        )}

        {/* FARMER VEG LIST */}
        {tab === 'farmer' && selFarmer && (
          <div>
            <div className="bg-gradient-to-r from-brand-700 to-emerald-600 text-white px-4 pt-3 pb-4">
              <button onClick={() => setTab('home')} className="flex items-center gap-1 text-brand-200 text-sm mb-3">← Back</button>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">{getInitials(selFarmer.name)}</div>
                <div>
                  <h2 className="text-lg font-bold">{selFarmer.name}'s Farm</h2>
                  <p className="text-brand-200 text-xs mt-0.5">📍 {selFarmer.address || selFarmer.region} · ★ {selFarmer.rating?.toFixed(1)}</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 space-y-3">
              {selFarmer.vegetables?.filter(v => v.available).map(veg => {
                const qty = getQty(selFarmer.farmerId, veg._id?.toString())
                return (
                  <div key={veg._id} className="card p-4 flex items-center gap-3">
                    <div className="text-4xl">{getVegEmoji(veg.name)}</div>
                    <div className="flex-1">
                      <p className="font-bold">{veg.name}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(veg.price)}/{veg.unit}</p>
                      <p className="text-xs text-gray-400">{veg.qty} {veg.unit} available</p>
                    </div>
                    <QtyBtn qty={qty} onInc={() => changeQty(selFarmer.farmerId, veg._id?.toString(), 1)} onDec={() => changeQty(selFarmer.farmerId, veg._id?.toString(), -1)} />
                  </div>
                )
              })}
              {selFarmer.vegetables?.filter(v => !v.available).map(veg => (
                <div key={veg._id} className="card p-4 flex items-center gap-3 opacity-40">
                  <div className="text-4xl grayscale">{getVegEmoji(veg.name)}</div>
                  <div><p className="font-bold">{veg.name}</p><p className="text-xs text-gray-400">Not available today</p></div>
                </div>
              ))}
            </div>
            <div style={{ height: '80px' }} />
          </div>
        )}

        {/* CART */}
        {tab === 'cart' && (
          <div className="px-4 py-4">
            <h2 className="font-bold text-lg mb-4">Your Cart</h2>
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <p className="font-semibold text-gray-500">Your cart is empty</p>
                <button onClick={() => setTab('home')} className="btn-brand mt-6 px-8">Browse Farms</button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cartItems.map(item => (
                    <div key={item._id} className="card p-4 flex items-center gap-3">
                      <div className="text-3xl">{getVegEmoji(item.name)}</div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">from {item.farmerName}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(item.price)} × {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-600 mb-2">{formatCurrency(item.price * item.qty)}</p>
                        <QtyBtn small qty={item.qty} onInc={() => changeQty(item.farmerId, item._id?.toString(), 1)} onDec={() => changeQty(item.farmerId, item._id?.toString(), -1)} />
                      </div>
                    </div>
                  ))}
                </div>
                {showFreeDelivery && subtotal >= freeDeliveryMinimum && (
                  <div className="free-delivery-celebration" role="status">
                    <span className="free-delivery-spark">✦</span>
                    <div>
                      <p className="font-bold text-brand-700">Congratulations!</p>
                      <p className="text-xs text-brand-600">You unlocked free delivery</p>
                    </div>
                    <span className="free-delivery-spark">✦</span>
                  </div>
                )}
                <div className="card p-4 mb-4 space-y-3">
                  <h3 className="font-bold">Delivery details</h3>
                  {savedAddresses.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Saved addresses</label>
                      <select className="input" value={selectedAddressId} onChange={e => selectSavedAddress(e.target.value)}>
                        <option value="">Use a new address</option>
                        {savedAddresses.map(address => <option key={address._id} value={address._id}>{address.label || address.area} · {address.street}</option>)}
                      </select>
                    </div>
                  )}
                  <AddressPicker key={selectedAddressId || 'new'} address={addressFields} initialLocation={customerLocation} onChange={setAddressFields} onLocation={({ lat, lng }) => {
                    const distance = haversine(farmerCoordinates.lat, farmerCoordinates.lng, lat, lng)
                    setCustomerLocation({ lat, lng, distanceKm: distance })
                    const serviceDistance = haversine(CENTER_LOCATION.lat, CENTER_LOCATION.lng, lat, lng)
                    setLocationStatus(serviceDistance <= DELIVERY_RADIUS_KM ? 'ready' : 'outside')
                  }} />
                  <button type="button" onClick={saveCurrentAddress} disabled={savingAddress} className="btn-outline w-full disabled:opacity-50">
                    {savingAddress ? 'Saving address...' : selectedAddressId ? 'Update saved address' : 'Save this address'}
                  </button>
                  {locationStatus === 'outside' && <p className="text-xs text-red-600">This address is outside our {DELIVERY_RADIUS_KM} km {SERVICE_AREA_NAME} delivery radius.</p>}
                  {locationStatus === 'denied' && <p className="text-xs text-amber-600">Location permission is needed to confirm delivery.</p>}
                </div>
                <div className="card p-4 mb-4">
                  <h3 className="font-bold mb-3">Bill details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Items</span><span>{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Distance</span><span>{distanceKm ? `${distanceKm.toFixed(1)} km` : 'Confirm location'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Delivery fee</span><span className={deliveryFee === 0 ? 'text-brand-600 font-semibold' : ''}>{deliveryFee === null ? 'Confirm location' : deliveryFee === 0 ? <><span className="text-gray-400 line-through mr-1">{formatCurrency(calculateDeliveryFee(distanceKm, 0, selectedSize))}</span>FREE</> : formatCurrency(deliveryFee)}</span></div>
                    <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-bold text-base"><span>Total</span><span className="text-brand-600">{formatCurrency(total)}</span></div>
                  </div>
                </div>
                <div className="card p-4 mb-4">
                  <h3 className="font-bold mb-3">Payment</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setPaymentMethod('online')} className={`p-3 rounded-xl border-2 text-left ${paymentMethod === 'online' ? 'border-brand-500 bg-brand-50' : 'border-gray-100'}`}><b>UPI / Online</b><span className="block text-xs text-gray-500">Pay securely now</span></button>
                    <button onClick={() => setPaymentMethod('cod')} className={`p-3 rounded-xl border-2 text-left ${paymentMethod === 'cod' ? 'border-brand-500 bg-brand-50' : 'border-gray-100'}`}><b>Cash on delivery</b><span className="block text-xs text-gray-500">20% deposit required</span></button>
                  </div>
                  {paymentMethod === 'cod' && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mt-2">Pay {formatCurrency(Math.ceil(total * 0.2))} now. This deposit is non-refundable if cancelled after pickup.</p>}
                </div>
                <button onClick={placeOrder} disabled={placing} className="btn-brand w-full disabled:opacity-50">{placing ? 'Processing...' : paymentMethod === 'cod' ? `Pay ${formatCurrency(Math.ceil(total * 0.2))} deposit` : `Pay ${formatCurrency(total)} via UPI`}</button>
                <p className="text-center text-xs text-gray-400 mt-2">Minimum order ₹150 · Delivery fee depends on distance · Free above {formatCurrency(freeDeliveryMinimum)}</p>
              </>
            )}
          </div>
        )}

        {/* TRACK */}
        {tab === 'track' && (
          <div className="px-4 py-4">
            <h2 className="font-bold text-lg mb-4">Track Order</h2>
            {activeOrder ? <><MapTracker order={activeOrder} farmer={activeFarmer} onCancel={async () => {
              if (!window.confirm('Cancel this order?')) return
              const response = await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: activeOrder.orderId, status: 'cancelled' }) })
              const data = await response.json()
              if (!response.ok) { addToast(data.error || 'Unable to cancel order', 'error'); return }
              setActiveOrder(data)
              setOrders(previous => previous.map(order => order.orderId === data.orderId ? data : order))
              addToast('Order cancelled', 'success')
            }} /><DeliveryFeedback order={activeOrder} onSaved={setActiveOrder} /></> : (
              <div className="text-center py-16"><div className="text-6xl mb-4">🚚</div><p className="text-gray-500">No active order</p></div>
            )}
          </div>
        )}

        {/* ACCOUNT */}
        {/* ACCOUNT */}
        {tab === 'account' && (
          <div className="px-4 py-4 space-y-4">
            <CustomerProfile user={user} orders={orders} onUpdate={(updated) => {
              // update session display name
              document.getElementById('header-avatar').textContent = getInitials(updated.name)
            }} />
            <button onClick={() => signOut({ callbackUrl: '/customer' })}
              className="w-full border-2 border-red-200 text-red-500 font-semibold py-3 rounded-xl hover:bg-red-50 transition-colors">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        {[{ id: 'home', label: 'Home', icon: <HomeIcon /> }, { id: 'cart', label: 'Cart', icon: <CartIcon /> }, { id: 'track', label: 'Track', icon: <TrackIcon /> }, { id: 'account', label: 'Me', icon: <UserIcon /> }].map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} className={`bottom-nav-item ${tab === item.id ? 'active' : ''}`}>
            <span className="relative">
              {item.icon}
              {item.id === 'cart' && cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Stock warning toast */}
      {stockWarning && (
        <div className="fixed bottom-28 left-4 right-4 z-50 bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl px-4 py-3 shadow-lg text-sm text-center">
          ⚠️ {stockWarning}
        </div>
      )}

      {/* Floating cart bar */}
      {cartItems.length > 0 && tab !== 'cart' && (
        <div className="fixed bottom-16 left-4 right-4 z-40 fade-in-up">
          <button onClick={() => setTab('cart')} className="w-full bg-brand-600 text-white rounded-2xl px-4 py-3.5 flex items-center shadow-2xl">
            <span className="bg-brand-500 rounded-xl w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">{cartItems.length}</span>
            <span className="flex-1 font-semibold text-left text-sm">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} · View Cart</span>
            <span className="font-bold">{formatCurrency(total)} →</span>
          </button>
        </div>
      )}
    
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}
      </div>
    </div>
  )
}
