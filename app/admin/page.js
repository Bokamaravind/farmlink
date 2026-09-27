'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { formatCurrency, getInitials, STATUS_CONFIG } from '@/lib/utils'
import { useActionLock } from '@/components/ui'

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white w-full max-w-lg rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold text-sm">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color='brand' }) {
  const g={brand:'from-brand-500 to-emerald-600',amber:'from-amber-400 to-orange-500',blue:'from-blue-500 to-indigo-600',purple:'from-purple-500 to-violet-600',red:'from-red-500 to-rose-600'}
  return (
    <div className={`bg-gradient-to-br ${g[color]||g.brand} rounded-2xl p-4 text-white`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-white/80 text-xs mt-0.5">{label}</div>
      {sub && <div className="text-white/60 text-[11px] mt-1">{sub}</div>}
    </div>
  )
}

function LoginScreen() {
  const [user,setUser]=useState(''); const [pass,setPass]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
  const actionLock=useRef(false)
  async function handle(e){e.preventDefault();if(actionLock.current)return;actionLock.current=true;setError('');setLoading(true);try{const r=await signIn('admin',{username:user,password:pass,redirect:false});if(r?.error)setError('Invalid credentials')}catch(_){setError('Unable to sign in. Please try again.')}finally{actionLock.current=false;setLoading(false)}}
  return (
    <div className="login-page min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8"><div className="text-5xl mb-3">🌿</div><h1 className="text-2xl font-bold text-white">Kisavi Admin</h1><p className="text-gray-400 text-sm mt-1">Platform management portal</p></div>
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          {error&&<div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handle} className="space-y-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Username</label><input className="input" placeholder="admin" value={user} onChange={e=>setUser(e.target.value)} required/></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label><input className="input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} required/></div>
            <button type="submit" disabled={loading} className="btn-brand w-full">{loading?'Signing in...':'Sign In'}</button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">Use the admin credentials configured in your environment.</p>
        </div>
      </div>
    </div>
  )
}

function FarmerLocationPicker({ latitude, longitude, onChange }) {
  const mapRef = useRef(null)
  const mapObj = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'; link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    const init = () => {
      if (!mapRef.current || !window.L || mapObj.current) return
      const lat = Number(latitude) || 17.7284
      const lng = Number(longitude) || 83.2104
      mapObj.current = window.L.map(mapRef.current).setView([lat, lng], 13)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapObj.current)
      const setPin = async (nextLat, nextLng) => {
        if (markerRef.current) markerRef.current.setLatLng([nextLat, nextLng])
        else markerRef.current = window.L.marker([nextLat, nextLng], { draggable: true }).addTo(mapObj.current)
        markerRef.current.off('dragend').on('dragend', event => { const pos = event.target.getLatLng(); setPin(pos.lat, pos.lng) })
        mapObj.current.setView([nextLat, nextLng], 16)
        onChange({ locationLat: nextLat.toFixed(6), locationLng: nextLng.toFixed(6) })
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${nextLat}&lon=${nextLng}`)
          const data = await response.json()
          const address = data.address || {}
          onChange({
            locationLat: nextLat.toFixed(6),
            locationLng: nextLng.toFixed(6),
            address: [address.road, address.suburb || address.village || address.town].filter(Boolean).join(', '),
            region: address.suburb || address.village || address.town || address.city_district || '',
          })
        } catch (_) {}
      }
      mapObj.current.on('click', event => setPin(event.latlng.lat, event.latlng.lng))
      if (latitude && longitude) setPin(lat, lng)
    }
    if (window.L) init()
    else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = init
      document.head.appendChild(script)
    }
    return () => { if (mapObj.current) { mapObj.current.remove(); mapObj.current = null } }
  }, [])

  return <>
    <div ref={mapRef} className="rounded-xl overflow-hidden" style={{ height: '210px', width: '100%' }} />
    <p className="text-xs text-gray-400">Tap the farm location or drag the pin to fill the coordinates.</p>
  </>
}

const STATUS_OPTIONS = ['placed','confirmed','picked_up','on_the_way','delivered','cancelled']

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const { runAction, isPending } = useActionLock()
  const [tab,setTab]             = useState('overview')
  const [farmers,setFarmers]     = useState([])
  const [orders,setOrders]       = useState([])
  const [partners,setPartners]   = useState([])
  const [farmerVerificationRequests,setFarmerVerificationRequests] = useState([])
  const [deliveryVerificationRequests,setDeliveryVerificationRequests] = useState([])
  const [loading,setLoading]     = useState(true)
  const [saving,setSaving]       = useState(false)
  const [search,setSearch]       = useState('')
  const [orderFilter,setOrderFilter] = useState('')
  const [toast,setToast]         = useState('')

  // Modals state
  const [addFarmerModal,setAddFarmerModal]   = useState(false)
  const [editFarmerModal,setEditFarmerModal] = useState(false)
  const [addPartnerModal,setAddPartnerModal] = useState(false)
  const [successModal,setSuccessModal]       = useState(null)
  const [editFarmer,setEditFarmer]           = useState(null)

  const [farmerForm,setFarmerForm] = useState({name:'',phone:'',email:'',region:'',address:'',locationLat:'',locationLng:'',availableSizes:['small'],password:''})
  const [partnerForm,setPartnerForm] = useState({name:'',phone:'',email:'',region:'Lankelapalem',vehicle:'Bike',password:''})

  const isAdmin = status==='authenticated' && session?.user?.role==='admin'

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(''),3000)}
  const uf=(k,v)=>setFarmerForm(f=>({...f,[k]:v}))
  const up=(k,v)=>setPartnerForm(p=>({...p,[k]:v}))

  function requestHasAccount(request, accounts) {
    return accounts.some(account => (
      request.phone && account.phone === request.phone
    ) || (
      request.email && account.email && account.email.toLowerCase() === request.email.toLowerCase()
    ))
  }

  useEffect(()=>{
    if(!isAdmin)return
    Promise.all([
      fetch('/api/farmers').then(r=>r.json()),
      fetch('/api/orders').then(r=>r.json()),
      fetch('/api/delivery').then(r=>r.json()),
      fetch('/api/verification/farmers').then(r=>r.json()),
      fetch('/api/verification/delivery').then(r=>r.json()),
    ]).then(([f,o,p,fr,dr])=>{setFarmers(f);setOrders(o);setPartners(p);setFarmerVerificationRequests(fr);setDeliveryVerificationRequests(dr);setLoading(false)})
  },[isAdmin])

  async function addFarmer(){
    setSaving(true)
    const res=await fetch('/api/farmers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(farmerForm)})
    const data=await res.json()
    setSaving(false)
    if (!res.ok) {
      showToast(data?.error || 'Farmer creation failed')
      return
    }
    setFarmers(prev=>[data,...prev]); setAddFarmerModal(false)
    setFarmerForm({name:'',phone:'',email:'',region:'',address:'',locationLat:'',locationLng:'',availableSizes:['small'],password:''})
    setSuccessModal({type:'farmer',id:data.farmerId,name:data.name,password:data.plainPassword,url:'/farmer'})
  }

  async function addPartner(){
    setSaving(true)
    const res=await fetch('/api/delivery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(partnerForm)})
    const data=await res.json()
    setSaving(false)
    if (!res.ok) {
      showToast(data?.error || 'Delivery partner creation failed')
      return
    }
    setPartners(prev=>[data,...prev]); setAddPartnerModal(false)
    setPartnerForm({name:'',phone:'',email:'',region:'Lankelapalem',vehicle:'Bike',password:''})
    setSuccessModal({type:'delivery',id:data.partnerId,name:data.name,password:data.plainPassword,url:'/delivery'})
  }

  async function saveFarmer(){
    setSaving(true)
    await fetch(`/api/farmers/${editFarmer.farmerId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(farmerForm)})
    const updated=await fetch('/api/farmers').then(r=>r.json())
    setFarmers(updated); setSaving(false); setEditFarmerModal(false); showToast('Farmer updated!')
  }

  async function toggleFarmer(farmer){
    await fetch(`/api/farmers/${farmer.farmerId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({active:!farmer.active})})
    setFarmers(prev=>prev.map(f=>f.farmerId===farmer.farmerId?{...f,active:!f.active}:f))
    showToast(`${farmer.name} ${farmer.active?'deactivated':'activated'}`)
  }

  async function deleteFarmer(farmer){
    if(!confirm(`Delete ${farmer.name}? This cannot be undone.`))return
    await fetch(`/api/farmers/${farmer.farmerId}`,{method:'DELETE'})
    setFarmers(prev=>prev.filter(f=>f.farmerId!==farmer.farmerId)); showToast('Farmer deleted')
  }

  async function deletePartner(partner){
    if(!confirm(`Delete ${partner.name}? This cannot be undone.`))return
    await fetch(`/api/delivery/${partner.partnerId}`,{method:'DELETE'})
    setPartners(prev=>prev.filter(p=>p.partnerId!==partner.partnerId)); showToast('Partner deleted')
  }

  async function updateOrderStatus(orderId,newStatus){
    await fetch('/api/orders',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId,status:newStatus})})
    setOrders(prev=>prev.map(o=>o.orderId===orderId?{...o,status:newStatus}:o))
  }

  async function settleOrders(type, orderIds) {
    if (!orderIds.length) return
    setSaving(true)
    await Promise.all(orderIds.map(orderId => fetch('/api/orders', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, settlementType: type }),
    })))
    const refreshed = await fetch('/api/orders').then(r => r.json())
    setOrders(refreshed); setSaving(false)
    showToast(`${type === 'farmer' ? 'Farmer' : 'Delivery agent'} settlement completed`)
  }

  async function assignDelivery(orderId,partner){
    await fetch('/api/orders',{method:'PATCH',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({orderId,deliveryPartnerId:partner._id,deliveryPartnerName:partner.name,deliveryPhone:partner.phone})})
    setOrders(prev=>prev.map(o=>o.orderId===orderId?{...o,deliveryPartnerName:partner.name}:o))
    showToast(`Assigned to ${partner.name}`)
  }

  async function seedData(){
    await fetch('/api/seed',{method:'POST'})
    const f=await fetch('/api/farmers').then(r=>r.json()); setFarmers(f); showToast('Demo data seeded!')
  }

  function openFarmerRequest(req) {
    setFarmerForm({
      name:req.name,
      phone:req.phone,
      email:req.email||'',
      region:req.region,
      address:req.address||'',
      locationLat:'',
      locationLng:'',
      availableSizes:['small'],
      password:''
    })
    setAddFarmerModal(true)
    showToast('Farmer form pre-filled from request')
  }

  function openDeliveryRequest(req) {
    setPartnerForm({
      name:req.name,
      phone:req.phone,
      email:req.email||'',
      region:req.region||'Lankelapalem',
      vehicle:req.vehicle||'Bike',
      password:''
    })
    setAddPartnerModal(true)
    showToast('Delivery form pre-filled from request')
  }

  async function approveFarmerRequest(requestId) {
    await fetch('/api/verification/farmers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, status: 'approved' })
    })
    const updated = await fetch('/api/verification/farmers').then(r => r.json())
    setFarmerVerificationRequests(updated)
    showToast('Farmer request approved')
  }

  async function approveDeliveryRequest(requestId) {
    await fetch('/api/verification/delivery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, status: 'approved' })
    })
    const updated = await fetch('/api/verification/delivery').then(r => r.json())
    setDeliveryVerificationRequests(updated)
    showToast('Delivery request approved')
  }

  if(status==='loading')return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-bounce">🌿</div></div>
  if(!isAdmin)return <LoginScreen/>

  const activeFarmers    = farmers.filter(f=>f.active).length
  const deliveredOrders  = orders.filter(o=>o.status==='delivered')
  const totalRevenue     = deliveredOrders.reduce((s,o)=>s+(o.subtotal || 0),0)
  const platformRevenue  = deliveredOrders.reduce((s,o)=>s+(o.platformCommission || Math.round((o.subtotal || 0)*0.05)),0)
  const liveOrders       = orders.filter(o=>!['delivered','cancelled'].includes(o.status)).length
  const paidOrders       = orders.filter(o=>o.paymentStatus==='paid').length

  const filteredFarmers  = farmers.filter(f=>!search||f.name.toLowerCase().includes(search.toLowerCase())||f.farmerId.includes(search.toUpperCase())||f.region.toLowerCase().includes(search.toLowerCase()))
  const filteredOrders   = orders.filter(o=>!orderFilter||o.status===orderFilter)
  const farmerSettlement = farmer => orders.filter(o=>o.farmerId===farmer.farmerId && o.status==='delivered')
  const partnerSettlement = partner => orders.filter(o=>o.deliveryPartnerId===partner._id && o.status==='delivered')

  const TABS = [['overview','📊','Overview'],['farmers','👨‍🌾','Farmers'],['delivery','🛵','Delivery'],['verification','✅','Verification'],['orders','📦','Orders'],['revenue','💰','Revenue']]
  const pendingVerificationCount = (farmerVerificationRequests.filter(r=>r.status==='pending').length + deliveryVerificationRequests.filter(r=>r.status==='pending').length)

  return (
    <div className="panel-page min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="panel-sidebar hidden lg:flex flex-col w-56 bg-gray-900 min-h-screen fixed left-0 top-0">
          <div className="p-5 border-b border-white/10"><div className="flex items-center gap-3"><span className="panel-logo"/><div><div className="text-xl font-bold text-white">Kisavi</div><div className="text-white/50 text-xs mt-0.5">Admin Panel</div></div></div></div>
          <nav className="flex-1 p-3 space-y-1">
            {TABS.map(([id,icon,label])=>(
              <button key={id} onClick={()=>setTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab===id?'bg-brand-600 text-white':'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button onClick={()=>signOut({callbackUrl:'/admin'})} className="w-full text-gray-400 hover:text-red-400 text-sm font-medium transition-colors">🚪 Logout</button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 lg:ml-56">
          {/* Topbar */}
          <div className="panel-tabs bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between sticky top-0 z-40">
            <div><h1 className="font-bold text-lg capitalize">{tab}</h1><p className="text-xs text-gray-400">Kisavi Admin</p></div>
            <div className="flex items-center gap-3">
              {farmers.length===0&&<button onClick={()=>runAction('seed',seedData)} disabled={isPending('seed')} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-200 disabled:opacity-50 disabled:cursor-wait">{isPending('seed')?'Processing…':'🌱 Seed Demo Data'}</button>}
              <a href="/verification/farmer" target="_blank" className="text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-brand-200">+ New Farmer Request</a>
              <a href="/verification/delivery" target="_blank" className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-200">+ New Delivery Request</a>
              <div className="flex lg:hidden gap-1">
                {TABS.map(([id,icon])=>(
                  <button key={id} onClick={()=>setTab(id)} className={`w-9 h-9 rounded-xl text-sm ${tab===id?'bg-brand-600 text-white':'bg-gray-100 text-gray-500'}`}>{icon}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 max-w-5xl mx-auto">

            {/* ── OVERVIEW ── */}
            {tab==='overview'&&(
              <div className="space-y-5 fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard icon="👨‍🌾" label="Active Farmers"  value={activeFarmers}  sub={`${farmers.length} total`}  color="brand"/>
                  <StatCard icon="📦" label="Live Orders"    value={liveOrders}     sub={`${orders.length} total`}   color="blue"/>
                  <StatCard icon="✅" label="Pending Verification" value={pendingVerificationCount} sub="farmer & delivery requests" color="amber"/>
                  <StatCard icon="💰" label="Total GMV"      value={`₹${(totalRevenue/1000).toFixed(1)}K`} sub="delivered orders" color="purple"/>
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between">
                    <h3 className="font-bold text-gray-800">Recent Orders</h3>
                    <button onClick={()=>setTab('orders')} className="text-brand-600 text-xs font-semibold">View all →</button>
                  </div>
                  {loading?<div className="p-5 text-center text-gray-400 text-sm">Loading…</div>:(
                    <div className="divide-y divide-gray-50">
                      {orders.slice(0,8).map(o=>{
                        const sc=STATUS_CONFIG[o.status]
                        return(
                          <div key={o._id} className="px-5 py-3 flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{o.customerName}</p>
                              <p className="text-xs text-gray-400">{o.orderId} · {o.farmerName}</p>
                            </div>
                            <span className={`badge badge-${sc?.color} hidden sm:inline-flex`}>{sc?.label}</span>
                            <span className={`text-xs font-medium ${o.paymentStatus==='paid'?'text-green-600':'text-amber-600'}`}>{o.paymentStatus==='paid'?'Paid':'Unpaid'}</span>
                            <span className="font-bold text-sm">{formatCurrency(o.total)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Delivery partners */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between">
                    <h3 className="font-bold text-gray-800">Delivery Partners ({partners.length})</h3>
                    <button onClick={()=>setTab('delivery')} className="text-brand-600 text-xs font-semibold">Manage →</button>
                  </div>
                  {partners.slice(0,4).map(p=>(
                    <div key={p._id} className="px-5 py-3 flex items-center gap-3 border-b border-gray-50 last:border-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">{getInitials(p.name)}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.partnerId} · {p.vehicle} · {p.region}</p>
                      </div>
                      <span className={`badge ${p.active?'badge-green':'badge-red'}`}>{p.active?'Active':'Inactive'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FARMERS ── */}
            {tab==='farmers'&&(
              <div className="fade-in-up">
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input className="input flex-1 text-sm" placeholder="Search name, ID or region…" value={search} onChange={e=>setSearch(e.target.value)}/>
                  <button onClick={()=>{setFarmerForm({name:'',phone:'',email:'',region:'',address:'',locationLat:'',locationLng:'',availableSizes:['small'],password:''});setAddFarmerModal(true)}} className="btn-brand px-5 py-3 text-sm whitespace-nowrap">+ Add Farmer</button>
                </div>
                {loading?[1,2,3].map(i=><div key={i} className="skeleton h-24 rounded-2xl mb-3"/>):(
                  <div className="space-y-3">
                    {filteredFarmers.map(f=>(
                      <div key={f._id} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center font-bold text-brand-700">{getInitials(f.name)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold">{f.name}</h3>
                              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded-lg font-mono text-gray-600">{f.farmerId}</code>
                              <span className={`badge ${f.active?'badge-green':'badge-red'}`}>{f.active?'Active':'Inactive'}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-0.5">📍 {f.region} · 📞 {f.phone}</p>
                            <p className="text-xs text-gray-400">{f.vegetables?.length||0} vegetables · {f.totalOrders||0} orders</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button onClick={()=>{setEditFarmer(f);setFarmerForm({name:f.name,phone:f.phone,email:f.email||'',region:f.region,address:f.address||'',locationLat:f.location?.lat||'',locationLng:f.location?.lng||'',availableSizes:f.availableSizes||['small'],password:''});setEditFarmerModal(true)}}
                            className="flex-1 py-2 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50">Edit</button>
                          <button onClick={()=>runAction(`toggle-farmer-${f.farmerId}`,()=>toggleFarmer(f))} disabled={isPending(`toggle-farmer-${f.farmerId}`)}
                            className={`flex-1 py-2 text-xs font-semibold rounded-xl border disabled:opacity-50 disabled:cursor-wait ${f.active?'border-amber-200 text-amber-600 hover:bg-amber-50':'border-brand-200 text-brand-600 hover:bg-brand-50'}`}>
                            {isPending(`toggle-farmer-${f.farmerId}`)?'Processing…':f.active?'Deactivate':'Activate'}
                          </button>
                          <button onClick={()=>runAction(`delete-farmer-${f.farmerId}`,()=>deleteFarmer(f))} disabled={isPending(`delete-farmer-${f.farmerId}`)} className="flex-1 py-2 text-xs font-semibold border border-red-200 text-red-500 rounded-xl hover:bg-red-50 disabled:opacity-50 disabled:cursor-wait">{isPending(`delete-farmer-${f.farmerId}`)?'Processing…':'Delete'}</button>
                        </div>
                      </div>
                    ))}
                    {filteredFarmers.length===0&&<div className="text-center py-12 text-gray-400"><div className="text-5xl mb-3">👨‍🌾</div><p>No farmers found</p></div>}
                  </div>
                )}
              </div>
            )}

            {/* ── DELIVERY PARTNERS ── */}
            {tab==='delivery'&&(
              <div className="fade-in-up">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-800">Delivery Partners ({partners.length})</h2>
                  <button onClick={()=>{setPartnerForm({name:'',phone:'',email:'',region:'Lankelapalem',vehicle:'Bike',password:''});setAddPartnerModal(true)}} className="btn-brand px-5 py-2.5 text-sm">+ Add Partner</button>
                </div>
                <div className="space-y-3">
                  {partners.map(p=>(
                    <div key={p._id} className="bg-white rounded-2xl border border-gray-100 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center font-bold text-amber-700">{getInitials(p.name)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold">{p.name}</h3>
                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded-lg font-mono text-gray-600">{p.partnerId}</code>
                            <span className={`badge ${p.active?'badge-green':'badge-red'}`}>{p.active?'Active':'Inactive'}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-0.5">📍 {p.region} · 🛵 {p.vehicle} · 📞 {p.phone}</p>
                          <p className="text-xs text-gray-400">{p.totalOrders||0} deliveries · ★ {p.rating?.toFixed(1)||'4.5'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button onClick={()=>runAction(`delete-partner-${p.partnerId}`,()=>deletePartner(p))} disabled={isPending(`delete-partner-${p.partnerId}`)} className="flex-1 py-2 text-xs font-semibold border border-red-200 text-red-500 rounded-xl hover:bg-red-50 disabled:opacity-50 disabled:cursor-wait">{isPending(`delete-partner-${p.partnerId}`)?'Processing…':'Delete'}</button>
                      </div>
                    </div>
                  ))}
                  {partners.length===0&&<div className="text-center py-12 text-gray-400"><div className="text-5xl mb-3">🛵</div><p>No delivery partners yet</p></div>}
                </div>
              </div>
            )}

            {/* ── VERIFICATION REQUESTS ── */}
            {tab==='verification'&&(
              <div className="space-y-5 fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800">Farmer verification requests</h3>
                      <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full">{farmerVerificationRequests.filter(r=>r.status==='pending').length} pending</span>
                    </div>
                    <div className="space-y-3">
                      {farmerVerificationRequests.map(req => (
                        <div key={req._id} className="border border-gray-100 rounded-xl p-3">
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm">{req.name}</p>
                              <p className="text-xs text-gray-500">{req.phone} · {req.region}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full ${req.status==='pending'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{req.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Aadhaar: {req.aadhaarNumber?.slice(-4)} · Bank: {req.bankName} · {req.bankAccountNumber?.slice(-4)}</p>
                          <div className="flex gap-2 mt-3">
                            {requestHasAccount(req, farmers) ? (
                              <button disabled className="flex-1 py-2 text-xs font-semibold border border-emerald-200 rounded-xl text-emerald-600 bg-emerald-50">Farmer added to panel</button>
                            ) : (
                              <button onClick={() => openFarmerRequest(req)} className="flex-1 py-2 text-xs font-semibold border border-brand-200 rounded-xl text-brand-600 hover:bg-brand-50">Create Farmer</button>
                            )}
                            {req.status === 'approved' ? (
                              <button disabled className="flex-1 py-2 text-xs font-semibold border border-emerald-200 rounded-xl text-emerald-600 bg-emerald-50">Approved</button>
                            ) : (
                              <button onClick={() => runAction(`approve-farmer-${req.requestId}`,()=>approveFarmerRequest(req.requestId))} disabled={isPending(`approve-farmer-${req.requestId}`)} className="flex-1 py-2 text-xs font-semibold border border-emerald-200 rounded-xl text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-wait">{isPending(`approve-farmer-${req.requestId}`)?'Processing…':'Approve'}</button>
                            )}
                          </div>
                        </div>
                      ))}
                      {!farmerVerificationRequests.length && <p className="text-sm text-gray-400 py-6 text-center">No farmer verification requests yet.</p>}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800">Delivery verification requests</h3>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{deliveryVerificationRequests.filter(r=>r.status==='pending').length} pending</span>
                    </div>
                    <div className="space-y-3">
                      {deliveryVerificationRequests.map(req => (
                        <div key={req._id} className="border border-gray-100 rounded-xl p-3">
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm">{req.name}</p>
                              <p className="text-xs text-gray-500">{req.phone} · {req.vehicle}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full ${req.status==='pending'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{req.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Aadhaar: {req.aadhaarNumber?.slice(-4)} · Bank: {req.bankName} · {req.bankAccountNumber?.slice(-4)}</p>
                          <div className="flex gap-2 mt-3">
                            {requestHasAccount(req, partners) ? (
                              <button disabled className="flex-1 py-2 text-xs font-semibold border border-emerald-200 rounded-xl text-emerald-600 bg-emerald-50">Partner added to panel</button>
                            ) : (
                              <button onClick={() => openDeliveryRequest(req)} className="flex-1 py-2 text-xs font-semibold border border-amber-200 rounded-xl text-amber-600 hover:bg-amber-50">Create Partner</button>
                            )}
                            {req.status === 'approved' ? (
                              <button disabled className="flex-1 py-2 text-xs font-semibold border border-emerald-200 rounded-xl text-emerald-600 bg-emerald-50">Approved</button>
                            ) : (
                              <button onClick={() => runAction(`approve-delivery-${req.requestId}`,()=>approveDeliveryRequest(req.requestId))} disabled={isPending(`approve-delivery-${req.requestId}`)} className="flex-1 py-2 text-xs font-semibold border border-emerald-200 rounded-xl text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-wait">{isPending(`approve-delivery-${req.requestId}`)?'Processing…':'Approve'}</button>
                            )}
                          </div>
                        </div>
                      ))}
                      {!deliveryVerificationRequests.length && <p className="text-sm text-gray-400 py-6 text-center">No delivery verification requests yet.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ORDERS ── */}
            {tab==='orders'&&(
              <div className="fade-in-up">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  <button onClick={()=>setOrderFilter('')} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${!orderFilter?'bg-gray-900 text-white':'bg-white border border-gray-200 text-gray-600'}`}>All ({orders.length})</button>
                  {Object.entries(STATUS_CONFIG).map(([s,sc])=>{
                    const count=orders.filter(o=>o.status===s).length
                    return <button key={s} onClick={()=>setOrderFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${orderFilter===s?'bg-gray-900 text-white':'bg-white border border-gray-200 text-gray-600'}`}>{sc.label} ({count})</button>
                  })}
                </div>
                {loading?[1,2,3,4].map(i=><div key={i} className="skeleton h-24 rounded-2xl mb-3"/>):(
                  <div className="space-y-3">
                    {filteredOrders.map(o=>{
                      const sc=STATUS_CONFIG[o.status]
                      return(
                        <div key={o._id} className="bg-white rounded-2xl border border-gray-100 p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <code className="text-xs font-mono text-gray-500">{o.orderId}</code>
                                <span className={`badge badge-${sc?.color}`}>{sc?.label}</span>
                                <span className={`text-xs font-medium ${o.paymentStatus==='paid'?'text-green-600':'text-amber-600'}`}>
                                  {o.paymentStatus==='paid'?'💳 Paid':'⏳ Unpaid'}
                                </span>
                              </div>
                              <p className="font-bold text-sm mt-1">{o.customerName}</p>
                              <p className="text-xs text-gray-400">{o.farmerName} · {new Date(o.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
                            </div>
                            <span className="font-bold text-brand-600 shrink-0">{formatCurrency(o.total)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{o.items?.map(i=>`${i.name} ×${i.qty}`).join(' · ')}</p>

                          {/* Assign delivery partner */}
                          {['confirmed','picked_up','on_the_way'].includes(o.status) && partners.length>0 && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-400 mb-1">Assign delivery partner:</p>
                              <div className="flex gap-1.5 flex-wrap">
                                {partners.filter(p=>p.active).map(p=>(
                                  <button key={p._id} onClick={()=>runAction(`assign-${o.orderId}`,()=>assignDelivery(o.orderId,p))} disabled={isPending(`assign-${o.orderId}`)}
                                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-wait ${o.deliveryPartnerName===p.name?'bg-brand-600 text-white border-brand-600':'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    {isPending(`assign-${o.orderId}`)?'Processing…':`🛵 ${p.name}`}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status buttons */}
                          <div className="flex gap-1.5 flex-wrap pt-2 border-t border-gray-50">
                            {STATUS_OPTIONS.filter(s=>s!==o.status).map(s=>(
                              <button key={s} onClick={()=>runAction(`order-status-${o.orderId}`,()=>updateOrderStatus(o.orderId,s))} disabled={isPending(`order-status-${o.orderId}`)}
                                className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border badge-${STATUS_CONFIG[s]?.color} hover:opacity-80 disabled:opacity-50 disabled:cursor-wait`}>
                                {isPending(`order-status-${o.orderId}`)?'Processing…':`→ ${STATUS_CONFIG[s]?.label}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                    {filteredOrders.length===0&&<div className="text-center py-12 text-gray-400"><div className="text-5xl mb-3">📦</div><p>No orders found</p></div>}
                  </div>
                )}
              </div>
            )}

            {/* ── REVENUE ── */}
            {tab==='revenue'&&(
              <div className="space-y-4 fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard icon="💰" label="Total GMV"        value={formatCurrency(totalRevenue)}                       color="brand"/>
                  <StatCard icon="📈" label="Platform (5%)"   value={formatCurrency(platformRevenue)}                    color="blue"/>
                  <StatCard icon="🚚" label="Delivery Paid"   value={formatCurrency(deliveredOrders.reduce((s,o)=>s+(o.deliveryAgentFee || o.deliveryFee || 0),0))} color="amber"/>
                  <StatCard icon="🧾" label="Farmer Payouts"  value={formatCurrency(totalRevenue-platformRevenue)}       color="purple"/>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-bold text-gray-800">Revenue by Farmer</h3></div>
                  {farmers.map(f=>{
                    const fo=deliveredOrders.filter(o=>o.farmerId===f.farmerId)
                    const gmv=fo.reduce((s,o)=>s+o.total,0)
                    const pct=totalRevenue>0?Math.round(gmv/totalRevenue*100):0
                    return(
                      <div key={f._id} className="px-5 py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div><span className="font-semibold text-sm">{f.name}</span><span className="text-xs text-gray-400 ml-2">{f.farmerId}</span></div>
                          <div className="text-right"><span className="font-bold text-sm">{formatCurrency(gmv)}</span><span className="text-xs text-gray-400 ml-1">GMV</span></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{width:`${pct}%`,transition:'width 0.8s ease'}}/>
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                        </div>
                        {(() => {
                          const farmerOrders = farmerSettlement(f)
                          const pending = farmerOrders.filter(o => o.farmerSettlementStatus !== 'settled')
                          const payout = pending.reduce((sum, o) => sum + (o.subtotal || 0) - (o.platformCommission || Math.round((o.subtotal || 0) * 0.05)), 0)
                          return <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 text-xs"><span className="text-gray-500">Pending settlement: <b>{formatCurrency(payout)}</b></span><button disabled={!pending.length || saving || isPending(`settle-farmer-${farmer.farmerId}`)} onClick={() => runAction(`settle-farmer-${farmer.farmerId}`, () => settleOrders('farmer', pending.map(o => o.orderId)))} className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-semibold disabled:opacity-40 disabled:cursor-wait">{isPending(`settle-farmer-${farmer.farmerId}`)?'Processing…':pending.length ? 'Settle farmer' : 'Settled'}</button></div>
                        })()}
                      </div>
                    )
                  })}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Delivery agent settlements</h3>
                  {partners.map(p => {
                    const partnerOrders = partnerSettlement(p)
                    const pending = partnerOrders.filter(o => o.deliverySettlementStatus !== 'settled')
                    const payout = pending.reduce((sum, o) => sum + (o.deliveryAgentFee || o.deliveryFee || 0), 0)
                    return <div key={p._id} className="flex items-center justify-between gap-3 py-3 border-b border-gray-50 last:border-0"><div><p className="font-semibold text-sm">{p.name}</p><p className="text-xs text-gray-400">{p.partnerId} · Pending: {formatCurrency(payout)}</p></div><button disabled={!pending.length || saving || isPending(`settle-delivery-${p.partnerId}`)} onClick={() => runAction(`settle-delivery-${p.partnerId}`, () => settleOrders('delivery', pending.map(o => o.orderId)))} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-wait">{isPending(`settle-delivery-${p.partnerId}`)?'Processing…':pending.length ? 'Settle agent' : 'Settled'}</button></div>
                  })}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Fee Breakdown</h3>
                  {[['Platform commission (5%)',platformRevenue,'#1a9e66'],['Delivery agent payouts',deliveredOrders.reduce((s,o)=>s+(o.deliveryAgentFee || o.deliveryFee || 0),0),'#3b82f6'],['Farmer payouts',totalRevenue-platformRevenue,'#6b7280']].map(([label,val,color])=>(
                    <div key={label} className="flex items-center gap-3 mb-3 last:mb-0">
                      <span className="text-xs text-gray-500 w-36 shrink-0">{label}</span>
                      <div className="flex-1 h-5 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="h-full rounded-lg" style={{width:totalRevenue>0?`${Math.round(val/totalRevenue*100)}%`:'0%',background:color,transition:'width 0.8s ease'}}/>
                      </div>
                      <span className="text-sm font-bold text-gray-800 w-20 text-right">{formatCurrency(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD FARMER MODAL */}
      <Modal open={addFarmerModal} onClose={()=>setAddFarmerModal(false)} title="Add New Farmer">
        <div className="space-y-4">
        {[['name','Full Name','Balu Patil','text'],['phone','Phone','9876543210','tel'],['email','Email','farmer@example.com','email'],['address','Farm Address','Lankelapalem','text'],['password','Login Password','farm001','text']].map(([key,label,ph,type])=>(
  <div key={key}><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label><input className="input" type={type} placeholder={ph} value={farmerForm[key]} onChange={e=>uf(key,e.target.value)}/></div>
))}
{/* Region as dropdown */}
<div>
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Area / Region</label>
  <select className="input" value={farmerForm.region} onChange={e=>uf('region',e.target.value)}>
    <option value="">Select area</option>
    <option value="Lankelapalem">Lankelapalem (HQ)</option>
    <option value="Kurmannapalem">Kurmannapalem (East)</option>
    <option value="Anakapalli">Anakapalli (West)</option>
    <option value="Paravada">Paravada (South)</option>
  </select>
</div>
<div>
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Farmer sizes</label>
  <div className="grid grid-cols-3 gap-2">
    {['small','medium','large'].map(size => <label key={size} className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 cursor-pointer"><input type="checkbox" checked={farmerForm.availableSizes.includes(size)} onChange={() => setFarmerForm(form => ({ ...form, availableSizes: form.availableSizes.includes(size) ? form.availableSizes.filter(value => value !== size) : [...form.availableSizes, size] }))} /><span className="text-sm font-semibold capitalize">{size}</span></label>)}
  </div>
  {!farmerForm.availableSizes.length && <p className="text-xs text-red-500 mt-1">Select at least one size.</p>}
</div>
<FarmerLocationPicker latitude={farmerForm.locationLat} longitude={farmerForm.locationLng} onChange={values => setFarmerForm(form => ({ ...form, ...values }))} />
<div className="grid grid-cols-2 gap-2">
  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Farm latitude</label><input className="input" type="number" step="any" placeholder="17.7284" value={farmerForm.locationLat} onChange={e=>uf('locationLat',e.target.value)}/></div>
  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Farm longitude</label><input className="input" type="number" step="any" placeholder="83.2104" value={farmerForm.locationLng} onChange={e=>uf('locationLng',e.target.value)}/></div>
</div>
          <div className="bg-brand-50 text-brand-700 text-xs px-3 py-2 rounded-xl">Unique Farmer ID (FL-XXX) will be auto-generated.</div>
          <button onClick={()=>runAction('add-farmer',addFarmer)} disabled={saving||isPending('add-farmer')||!farmerForm.name||!farmerForm.phone||!farmerForm.region||!farmerForm.password||!farmerForm.availableSizes.length} className="btn-brand w-full disabled:opacity-50 disabled:cursor-wait">{saving||isPending('add-farmer')?'Processing…':'Create Farmer'}</button>
        </div>
      </Modal>

      {/* EDIT FARMER MODAL */}
      <Modal open={editFarmerModal} onClose={()=>setEditFarmerModal(false)} title={`Edit · ${editFarmer?.farmerId}`}>
        <div className="space-y-4">
          {[['name','Full Name','text'],['phone','Phone','tel'],['email','Email','email'],['region','Region','text'],['address','Address','text']].map(([key,label,type])=>(
            <div key={key}><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label><input className="input" type={type} value={farmerForm[key]} onChange={e=>uf(key,e.target.value)}/></div>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Farm latitude</label><input className="input" type="number" step="any" value={farmerForm.locationLat} onChange={e=>uf('locationLat',e.target.value)}/></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Farm longitude</label><input className="input" type="number" step="any" value={farmerForm.locationLng} onChange={e=>uf('locationLng',e.target.value)}/></div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Farmer sizes</label>
            <div className="grid grid-cols-3 gap-2">
              {['small','medium','large'].map(size => <label key={size} className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 cursor-pointer"><input type="checkbox" checked={farmerForm.availableSizes.includes(size)} onChange={() => setFarmerForm(form => ({ ...form, availableSizes: form.availableSizes.includes(size) ? form.availableSizes.filter(value => value !== size) : [...form.availableSizes, size] }))} /><span className="text-sm font-semibold capitalize">{size}</span></label>)}
            </div>
          </div>
          <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password (blank = keep current)</label><input className="input" type="text" placeholder="New password…" value={farmerForm.password} onChange={e=>uf('password',e.target.value)}/></div>
          <button onClick={()=>runAction('save-farmer',saveFarmer)} disabled={saving||isPending('save-farmer')} className="btn-brand w-full disabled:opacity-50 disabled:cursor-wait">{saving||isPending('save-farmer')?'Processing…':'Save Changes'}</button>
        </div>
      </Modal>

      {/* ADD DELIVERY PARTNER MODAL */}
      <Modal open={addPartnerModal} onClose={()=>setAddPartnerModal(false)} title="Add Delivery Partner">
        <div className="space-y-4">
        {[['name','Full Name','Ravi Kumar','text'],['phone','Phone','9876543210','tel'],['email','Email','delivery@example.com','email'],['password','Login Password','delivery001','password']].map(([key,label,placeholder,type])=>(
          <div key={key}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
            <input className="input" type={type} placeholder={placeholder} value={partnerForm[key]} onChange={e=>up(key,e.target.value)} />
          </div>
        ))}
          <div className="bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-xl">Default area: Lankelapalem. Delivery availability is based on the partner's live location.</div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Vehicle</label>
            <select className="input" value={partnerForm.vehicle} onChange={e=>up('vehicle',e.target.value)}>
              {['Bike','Scooter','Bicycle','Auto'].map(v=><option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-xl">Unique Partner ID (DL-XXX) will be auto-generated.</div>
          <button onClick={()=>runAction('add-partner',addPartner)} disabled={saving||isPending('add-partner')||!partnerForm.name||!partnerForm.phone||!partnerForm.password} className="btn-brand w-full disabled:opacity-50 disabled:cursor-wait">{saving||isPending('add-partner')?'Processing…':'Create Partner'}</button>
        </div>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal open={!!successModal} onClose={()=>setSuccessModal(null)} title="✅ Created Successfully!">
        <div className="text-center">
          <div className="text-5xl mb-4">{successModal?.type==='farmer'?'👨‍🌾':'🛵'}</div>
          <p className="text-gray-600 mb-4">Share these login credentials:</p>
          <div className="bg-brand-50 rounded-2xl p-5 text-left space-y-3 mb-5">
            <div className="flex justify-between"><span className="text-gray-500 text-sm">ID</span><code className="font-mono font-bold text-brand-700 text-lg">{successModal?.id}</code></div>
            <div className="flex justify-between"><span className="text-gray-500 text-sm">Password</span><code className="font-mono font-bold text-gray-800">{successModal?.password}</code></div>
            <div className="flex justify-between"><span className="text-gray-500 text-sm">Name</span><span className="font-semibold">{successModal?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 text-sm">Login URL</span><code className="text-xs text-blue-600">kisavi.in{successModal?.url}</code></div>
          </div>
          <button onClick={()=>setSuccessModal(null)} className="btn-brand w-full">Done</button>
        </div>
      </Modal>

      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl fade-in-up z-50">{toast}</div>}
    </div>
  )
}
