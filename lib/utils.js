export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount || 0)
}

export function generateFarmerId(count) {
  return 'FL-' + String(count + 1).padStart(3, '0')
}

export function generateDeliveryId(count) {
  return 'DL-' + String(count + 1).padStart(3, '0')
}

export function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'
}

export function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export const VEG_EMOJI = {
  tomato:'🍅', spinach:'🥬', okra:'🫛', brinjal:'🍆',
  carrot:'🥕', beans:'🫘', onion:'🧅', potato:'🥔',
  chilli:'🌶️', cabbage:'🥦', gourd:'🥒', cucumber:'🥒',
  default:'🥦',
}

export function getVegEmoji(name) {
  const k = (name || '').toLowerCase()
  for (const [key, val] of Object.entries(VEG_EMOJI)) {
    if (k.includes(key)) return val
  }
  return VEG_EMOJI.default
}

export const STATUS_CONFIG = {
  placed:     { label: 'Placed',      color: 'amber',  step: 0 },
  confirmed:  { label: 'Confirmed',   color: 'blue',   step: 1 },
  picked_up:  { label: 'Picked up',   color: 'purple', step: 2 },
  on_the_way: { label: 'On the way',  color: 'orange', step: 3 },
  delivered:  { label: 'Delivered',   color: 'green',  step: 4 },
  cancelled:  { label: 'Cancelled',   color: 'red',    step: -1 },
}



export const STATUS_OPTIONS = Object.keys(STATUS_CONFIG)

// ── SERVICE AREAS ─────────────────────────────────────────────────
export const SERVICE_AREAS = [
  { name: 'Lankelapalem',   label: 'Lankelapalem (HQ)',  lat: 17.7284, lng: 83.2104 },
  { name: 'Kurmannapalem',  label: 'Kurmannapalem (East)', lat: 17.7412, lng: 83.2301 },
  { name: 'Anakapalli',     label: 'Anakapalli (West)',   lat: 17.6914, lng: 82.9985 },
  { name: 'Paravada',       label: 'Paravada (South)',    lat: 17.6102, lng: 83.1467 },
]

export const CENTER_LOCATION = { lat: 17.7284, lng: 83.2104 } // Lankelapalem center

export function isServiceableArea(areaName) {
  return SERVICE_AREAS.some(a => a.name.toLowerCase() === areaName.toLowerCase())
}
