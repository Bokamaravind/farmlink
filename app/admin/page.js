'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { formatCurrency, getInitials, STATUS_CONFIG } from '@/lib/utils'

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
  async function handle(e){e.preventDefault();setError('');setLoading(true);const r=await signIn('admin',{username:user,password:pass,redirect:false});setLoading(false);if(r?.error)setError('Invalid credentials')}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8"><div className="text-5xl mb-3">🌿</div><h1 className="text-2xl font-bold text-white">FarmLink Admin</h1><p className="text-gray-400 text-sm mt-1">Platform management portal</p></div>
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          {error&&<div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handle} className="space-y-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Username</label><input className="input" placeholder="admin" value={user} onChange={e=>setUser(e.target.value)} required/></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label><input className="input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} required/></div>
            <button type="submit" disabled={loading} className="btn-brand w-full">{loading?'Signing in...':'Sign In'}</button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">Default: <code className="bg-gray-100 px-1 rounded">admin / farmlink2025</code></p>
        </div>
      </div>
    </div>
  )
}

const STATUS_OPTIONS = ['placed','confirmed','picked_up','on_the_way','delivered','cancelled']

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const [tab,setTab]             = useState('overview')
  const [farmers,setFarmers]     = useState([])
  const [orders,setOrders]       = useState([])
  const [partners,setPartners]   = useState([])
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

  const [farmerForm,setFarmerForm] = useState({name:'',phone:'',region:'',address:'',password:''})
  const [partnerForm,setPartnerForm] = useState({name:'',phone:'',region:'',vehicle:'Bike',password:''})

  const isAdmin = status==='authenticated' && session?.user?.role==='admin'

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(''),3000)}
  const uf=(k,v)=>setFarmerForm(f=>({...f,[k]:v}))
  const up=(k,v)=>setPartnerForm(p=>({...p,[k]:v}))

  useEffect(()=>{
    if(!isAdmin)return
    Promise.all([
      fetch('/api/farmers').then(r=>r.json()),
      fetch('/api/orders').then(r=>r.json()),
      fetch('/api/delivery').then(r=>r.json()),
    ]).then(([f,o,p])=>{setFarmers(f);setOrders(o);setPartners(p);setLoading(false)})
  },[isAdmin])

  async function addFarmer(){
    setSaving(true)
    const res=await fetch('/api/farmers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(farmerForm)})
    const data=await res.json()
    setSaving(false); setFarmers(prev=>[data,...prev]); setAddFarmerModal(false)
    setFarmerForm({name:'',phone:'',region:'',address:'',password:''})
    setSuccessModal({type:'farmer',id:data.farmerId,name:data.name,password:data.plainPassword,url:'/farmer'})
  }

  async function addPartner(){
    setSaving(true)
    const res=await fetch('/api/delivery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(partnerForm)})
    const data=await res.json()
    setSaving(false); setPartners(prev=>[data,...prev]); setAddPartnerModal(false)
    setPartnerForm({name:'',phone:'',region:'',vehicle:'Bike',password:''})
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

  if(status==='loading')return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-bounce">🌿</div></div>
  if(!isAdmin)return <LoginScreen/>

  const activeFarmers    = farmers.filter(f=>f.active).length
  const deliveredOrders  = orders.filter(o=>o.status==='delivered')
  const totalRevenue     = deliveredOrders.reduce((s,o)=>s+o.total,0)
  const platformRevenue  = Math.round(totalRevenue*0.08)
  const liveOrders       = orders.filter(o=>!['delivered','cancelled'].includes(o.status)).length
  const paidOrders       = orders.filter(o=>o.paymentStatus==='paid').length

  const filteredFarmers  = farmers.filter(f=>!search||f.name.toLowerCase().includes(search.toLowerCase())||f.farmerId.includes(search.toUpperCase())||f.region.toLowerCase().includes(search.toLowerCase()))
  const filteredOrders   = orders.filter(o=>!orderFilter||o.status===orderFilter)

  const TABS = [['overview','📊','Overview'],['farmers','👨‍🌾','Farmers'],['delivery','🛵','Delivery'],['orders','📦','Orders'],['revenue','💰','Revenue']]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 bg-gray-900 min-h-screen fixed left-0 top-0">
          <div className="p-5 border-b border-gray-700"><div className="text-xl font-bold text-white">🌿 FarmLink</div><div className="text-gray-400 text-xs mt-0.5">Admin Panel</div></div>
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
          <div className="bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between sticky top-0 z-40">
            <div><h1 className="font-bold text-lg capitalize">{tab}</h1><p className="text-xs text-gray-400">FarmLink Admin</p></div>
            <div className="flex items-center gap-3">
              {farmers.length===0&&<button onClick={seedData} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-200">🌱 Seed Demo Data</button>}
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
                  <StatCard icon="💰" label="Total GMV"      value={`₹${(totalRevenue/1000).toFixed(1)}K`} sub="delivered orders" color="amber"/>
                  <StatCard icon="💳" label="Paid Orders"    value={paidOrders}     sub="via Razorpay"              color="purple"/>
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
                  <button onClick={()=>{setFarmerForm({name:'',phone:'',region:'',address:'',password:''});setAddFarmerModal(true)}} className="btn-brand px-5 py-3 text-sm whitespace-nowrap">+ Add Farmer</button>
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
                          <button onClick={()=>{setEditFarmer(f);setFarmerForm({name:f.name,phone:f.phone,region:f.region,address:f.address||'',password:''});setEditFarmerModal(true)}}
                            className="flex-1 py-2 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50">Edit</button>
                          <button onClick={()=>toggleFarmer(f)}
                            className={`flex-1 py-2 text-xs font-semibold rounded-xl border ${f.active?'border-amber-200 text-amber-600 hover:bg-amber-50':'border-brand-200 text-brand-600 hover:bg-brand-50'}`}>
                            {f.active?'Deactivate':'Activate'}
                          </button>
                          <button onClick={()=>deleteFarmer(f)} className="flex-1 py-2 text-xs font-semibold border border-red-200 text-red-500 rounded-xl hover:bg-red-50">Delete</button>
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
                  <button onClick={()=>{setPartnerForm({name:'',phone:'',region:'',vehicle:'Bike',password:''});setAddPartnerModal(true)}} className="btn-brand px-5 py-2.5 text-sm">+ Add Partner</button>
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
                        <button onClick={()=>deletePartner(p)} className="flex-1 py-2 text-xs font-semibold border border-red-200 text-red-500 rounded-xl hover:bg-red-50">Delete</button>
                      </div>
                    </div>
                  ))}
                  {partners.length===0&&<div className="text-center py-12 text-gray-400"><div className="text-5xl mb-3">🛵</div><p>No delivery partners yet</p></div>}
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
                                  <button key={p._id} onClick={()=>assignDelivery(o.orderId,p)}
                                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${o.deliveryPartnerName===p.name?'bg-brand-600 text-white border-brand-600':'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    🛵 {p.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status buttons */}
                          <div className="flex gap-1.5 flex-wrap pt-2 border-t border-gray-50">
                            {STATUS_OPTIONS.filter(s=>s!==o.status).map(s=>(
                              <button key={s} onClick={()=>updateOrderStatus(o.orderId,s)}
                                className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border badge-${STATUS_CONFIG[s]?.color} hover:opacity-80`}>
                                → {STATUS_CONFIG[s]?.label}
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
                  <StatCard icon="📈" label="Platform (8%)"   value={formatCurrency(platformRevenue)}                    color="blue"/>
                  <StatCard icon="🚚" label="Delivery Rev"    value={formatCurrency(deliveredOrders.length*25)}           color="amber"/>
                  <StatCard icon="🧾" label="Farmer Payouts"  value={formatCurrency(Math.round(totalRevenue*0.85))}       color="purple"/>
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
                      </div>
                    )
                  })}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Fee Breakdown</h3>
                  {[['Platform fee (8%)',Math.round(totalRevenue*0.08),'#1a9e66'],['Delivery fees',deliveredOrders.length*25,'#3b82f6'],['Farmer payouts (85%)',Math.round(totalRevenue*0.85),'#6b7280']].map(([label,val,color])=>(
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
        {[['name','Full Name','Balu Patil','text'],['phone','Phone','9876543210','tel'],['address','Farm Address','Lankelapalem','text'],['password','Login Password','farm001','text']].map(([key,label,ph,type])=>(
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
          <div className="bg-brand-50 text-brand-700 text-xs px-3 py-2 rounded-xl">Unique Farmer ID (FL-XXX) will be auto-generated.</div>
          <button onClick={addFarmer} disabled={saving||!farmerForm.name||!farmerForm.phone||!farmerForm.region||!farmerForm.password} className="btn-brand w-full disabled:opacity-50">{saving?'Creating...':'Create Farmer'}</button>
        </div>
      </Modal>

      {/* EDIT FARMER MODAL */}
      <Modal open={editFarmerModal} onClose={()=>setEditFarmerModal(false)} title={`Edit · ${editFarmer?.farmerId}`}>
        <div className="space-y-4">
          {[['name','Full Name','text'],['phone','Phone','tel'],['region','Region','text'],['address','Address','text']].map(([key,label,type])=>(
            <div key={key}><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label><input className="input" type={type} value={farmerForm[key]} onChange={e=>uf(key,e.target.value)}/></div>
          ))}
          <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password (blank = keep current)</label><input className="input" type="text" placeholder="New password…" value={farmerForm.password} onChange={e=>uf('password',e.target.value)}/></div>
          <button onClick={saveFarmer} disabled={saving} className="btn-brand w-full disabled:opacity-50">{saving?'Saving...':'Save Changes'}</button>
        </div>
      </Modal>

      {/* ADD DELIVERY PARTNER MODAL */}
      <Modal open={addPartnerModal} onClose={()=>setAddPartnerModal(false)} title="Add Delivery Partner">
        <div className="space-y-4">
        {/* Replace the region text input with: */}
<div>
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Area</label>
  <select className="input" value={partnerForm.region} onChange={e=>up('region',e.target.value)}>
    <option value="">Select area</option>
    <option value="Lankelapalem">Lankelapalem (HQ)</option>
    <option value="Kurmannapalem">Kurmannapalem (East)</option>
    <option value="Anakapalli">Anakapalli (West)</option>
    <option value="Paravada">Paravada (South)</option>
  </select>
</div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Vehicle</label>
            <select className="input" value={partnerForm.vehicle} onChange={e=>up('vehicle',e.target.value)}>
              {['Bike','Scooter','Bicycle','Auto'].map(v=><option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-xl">Unique Partner ID (DL-XXX) will be auto-generated.</div>
          <button onClick={addPartner} disabled={saving||!partnerForm.name||!partnerForm.phone||!partnerForm.password} className="btn-brand w-full disabled:opacity-50">{saving?'Creating...':'Create Partner'}</button>
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
            <div className="flex justify-between"><span className="text-gray-500 text-sm">Login URL</span><code className="text-xs text-blue-600">farmlink.in{successModal?.url}</code></div>
          </div>
          <button onClick={()=>setSuccessModal(null)} className="btn-brand w-full">Done</button>
        </div>
      </Modal>

      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl fade-in-up z-50">{toast}</div>}
    </div>
  )
}
