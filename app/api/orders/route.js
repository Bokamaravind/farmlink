import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import Farmer from '@/models/Farmer'
import DeliveryPartner from '@/models/DeliveryPartner'
import { calculateDeliveryFee } from '@/lib/utils'

// Helper — fire WhatsApp without blocking response
async function notifyWhatsApp(event, order) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}/api/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        order,
        farmerPhone:   order.farmerPhone,
        customerPhone: order.customerPhone,
        deliveryPhone: order.deliveryPhone,
      }),
    })
  } catch (e) {
    console.warn('WhatsApp notification failed (non-blocking):', e.message)
  }
}

async function notifyEmail(event, order, recipients) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Email notification skipped: RESEND_API_KEY is not configured')
    return
  }
  const uniqueRecipients = recipients
    .filter(recipient => recipient?.email)
    .filter((recipient, index, list) => list.findIndex(item => item.email === recipient.email && item.role === recipient.role) === index)
  if (!uniqueRecipients.length) {
    console.warn(`Email notification skipped for ${order.orderId}: no recipient email addresses found`)
    return
  }
  const supportPhone = process.env.FARMLINK_SUPPORT_PHONE || ''
  const items = order.items?.map(item => `${item.name} x${item.qty}`).join(', ')
  await Promise.all(uniqueRecipients.map(async recipient => {
    const { email: to, role } = recipient
    const subject = event === 'order_placed'
      ? `${role === 'customer' ? 'Your' : 'New'} Kisavi order ${order.orderId}`
      : event === 'order_cancelled'
        ? `Kisavi order ${order.orderId} cancelled`
        : `Kisavi order ${order.orderId} delivered`
    const text = role === 'customer'
      ? event === 'order_placed'
        ? `Hello ${order.customerName},\n\nYour Kisavi order ${order.orderId} has been placed.\nItems: ${items}\nDelivery address: ${order.address}\n\nKisavi contact: ${supportPhone}`
        : event === 'order_cancelled'
          ? `Hello ${order.customerName},\n\nYour Kisavi order ${order.orderId} has been cancelled.\nKisavi contact: ${supportPhone}`
          : `Hello ${order.customerName},\n\nYour Kisavi order ${order.orderId} has been delivered successfully.\nKisavi contact: ${supportPhone}`
      : role === 'farmer'
        ? event === 'order_placed'
          ? `Hello ${order.farmerName},\n\nA new order ${order.orderId} was placed for your farm.\nItems: ${items}\nCustomer delivery address: ${order.address}\nKisavi contact: ${supportPhone}`
          : event === 'order_cancelled'
            ? `Hello ${order.farmerName},\n\nOrder ${order.orderId} for your farm has been cancelled.\nKisavi contact: ${supportPhone}`
            : `Hello ${order.farmerName},\n\nOrder ${order.orderId} from your farm has been delivered successfully.\nKisavi contact: ${supportPhone}`
        : event === 'order_placed'
          ? `Hello delivery partner,\n\nA new Kisavi delivery is available for order ${order.orderId}.\nPickup: ${order.farmerAddress || 'Farmer farm'}\nDelivery: ${order.address}\nKisavi contact: ${supportPhone}`
          : event === 'order_cancelled'
            ? `Hello delivery partner,\n\nOrder ${order.orderId} has been cancelled. No delivery is required.\nKisavi contact: ${supportPhone}`
            : `Hello delivery partner,\n\nOrder ${order.orderId} has been delivered successfully.\nKisavi contact: ${supportPhone}`
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.FARMLINK_FROM_EMAIL || 'Kisavi <onboarding@resend.dev>', to, subject, text }),
      })
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Resend rejected ${to}: ${response.status} ${error}`)
      }
      console.info(`Email notification sent to ${to} for ${order.orderId}`)
    } catch (error) {
      console.error('Email notification failed:', error.message)
    }
  }))
}

async function notifyAll(event, order, partners = []) {
  const whatsappPromises = [notifyWhatsApp(event, order)]
  if (event === 'order_placed') {
    whatsappPromises.push(...partners.map(partner => notifyWhatsApp('delivery_order_available', { ...order, deliveryPhone: partner.phone, farmerPhone: '', customerPhone: '' })))
  }
  await Promise.allSettled(whatsappPromises)
  const emails = event === 'order_placed'
    ? [
        { email: order.customerEmail, role: 'customer' },
        { email: order.farmerEmail, role: 'farmer' },
        ...partners.map(partner => ({ email: partner.email, role: 'delivery' })),
      ]
    : [
        { email: order.customerEmail, role: 'customer' },
        { email: order.farmerEmail, role: 'farmer' },
        { email: order.deliveryEmail, role: 'delivery' },
      ]
  await notifyEmail(event, order, emails)
}

// GET /api/orders
export async function GET(req) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const farmerId    = searchParams.get('farmerId')
  const customerId  = searchParams.get('customerId')
  const partnerId   = searchParams.get('partnerId')
  const status      = searchParams.get('status')
  const available   = searchParams.get('available')

  const query = {}
  if (farmerId)   query.farmerId           = farmerId
  if (customerId) query.customerId         = customerId
  if (partnerId)  query.deliveryPartnerId  = partnerId
  if (status)     query.status             = status
  if (available === 'true') {
    query.status = 'confirmed'
    query.deliveryPartnerId = null
  }

  const orders = await Order.find(query).sort({ createdAt: -1 })
  const enrichedOrders = await Promise.all(orders.map(async order => {
    if (order.farmerAddress) return order
    const farmer = await Farmer.findOne({ farmerId: order.farmerId }, 'address region')
    return { ...order.toObject(), farmerAddress: farmer?.address || farmer?.region || '' }
  }))
  return NextResponse.json(enrichedOrders)
}

// POST /api/orders — place new order
export async function POST(req) {
  await connectDB()
  const body = await req.json()

  if (!body.location?.lat || !body.location?.lng) {
    return NextResponse.json({ error: 'Current location is required' }, { status: 400 })
  }
  const toRad = value => value * Math.PI / 180
  const centerLat = Number(process.env.NEXT_PUBLIC_SERVICE_CENTER_LAT || 17.7284)
  const centerLng = Number(process.env.NEXT_PUBLIC_SERVICE_CENTER_LNG || 83.2104)
  const serviceRadius = Number(process.env.NEXT_PUBLIC_SERVICE_RADIUS_KM || 15)
  const farmer = await Farmer.findOne({ farmerId: body.farmerId })
  if (!farmer) return NextResponse.json({ error: 'Farmer not found' }, { status: 404 })

  const distanceBetween = (fromLat, fromLng, toLat, toLng) => {
    const latDelta = toRad(toLat - fromLat)
    const lngDelta = toRad(toLng - fromLng)
    const radius = 6371
    const haversineValue = Math.sin(latDelta / 2) ** 2 + Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(lngDelta / 2) ** 2
    return 2 * radius * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue))
  }
  const serviceDistance = distanceBetween(centerLat, centerLng, body.location.lat, body.location.lng)
  if (serviceDistance > serviceRadius) return NextResponse.json({ error: `Delivery is available within ${serviceRadius} km of the service area` }, { status: 400 })

  const farmerLat = Number(farmer.location?.lat) || centerLat
  const farmerLng = Number(farmer.location?.lng) || centerLng
  const distance = distanceBetween(farmerLat, farmerLng, body.location.lat, body.location.lng)

  const stockErrors = []
  body.items.forEach(({ name, qty }) => {
    const veg = farmer.vegetables.find(v => v.name.toLowerCase() === name.toLowerCase())
    if (!veg || !veg.available) {
      stockErrors.push(`${name} is unavailable`)
      return
    }
    if (qty > veg.qty) {
      stockErrors.push(`Only ${veg.qty} ${veg.unit || 'kg'} of ${name} available`)
    }
  })

  if (stockErrors.length) {
    return NextResponse.json({ error: stockErrors.join(', ') }, { status: 400 })
  }

  const orderId = 'ORD-' + Date.now()
  if (Number(body.subtotal) < 150) {
    return NextResponse.json({ error: 'Minimum order amount is ₹150' }, { status: 400 })
  }
  const deliveryAgentFee = calculateDeliveryFee(distance, 0, body.pack)
  const deliveryFee = calculateDeliveryFee(distance, body.subtotal, body.pack)
  const platformCommission = Math.round(Number(body.subtotal) * 0.05)
  const total = Number(body.subtotal) + deliveryFee
  const depositAmount = body.paymentMethod === 'cod' ? Math.ceil(total * 0.2) : 0

  const order = await Order.create({
    ...body,
    orderId,
    farmerName:  farmer.name || '',
    farmerPhone: farmer.phone || '',
    farmerEmail: farmer.email || '',
    customerEmail: body.customerEmail || '',
    farmerAddress: farmer.address || farmer.region || '',
    farmerLocation: farmer.location || undefined,
    platformFee: 0,
    platformCommission,
    deliveryFee,
    deliveryAgentFee,
    distanceKm: distance,
    total,
    depositAmount,
    paymentStatus: body.paymentStatus || 'pending',
  })

  // Increment farmer order count
  await Farmer.findOneAndUpdate({ farmerId: body.farmerId }, { $inc: { totalOrders: 1 } })

  // Reduce stock for each ordered item
  body.items.forEach(({ name, qty }) => {
    const veg = farmer.vegetables.find(v => v.name.toLowerCase() === name.toLowerCase())
    if (veg) {
      veg.qty = Math.max(0, veg.qty - qty)
      if (veg.qty === 0) veg.available = false
    }
  })
  await farmer.save()

  // WhatsApp notification to farmer + customer
  const partners = await DeliveryPartner.find({ active: true }, 'phone email')
  await notifyAll('order_placed', {
    ...order.toObject(),
    farmerPhone:   farmer.phone || '',
    customerPhone: body.customerPhone || '',
  }, partners)

  return NextResponse.json(order, { status: 201 })
}

// PATCH /api/orders — update status or assign delivery partner
export async function PATCH(req) {
  await connectDB()
  const body = await req.json()
  const { orderId, status, deliveryPartnerId, deliveryPartnerName, deliveryPhone } = body

  const existingOrder = await Order.findOne({ orderId })
  if (!existingOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (status === 'cancelled' && !['placed', 'confirmed'].includes(existingOrder.status)) {
    return NextResponse.json({ error: 'This order can no longer be cancelled' }, { status: 400 })
  }

  if (body.partnerId && ['picked_up', 'delivered'].includes(status)) {
    if (!existingOrder.deliveryPartnerId || String(existingOrder.deliveryPartnerId) !== String(body.partnerId)) {
      return NextResponse.json({ error: 'This order is not assigned to you' }, { status: 403 })
    }
    const requiredPreviousStatus = status === 'picked_up' ? 'confirmed' : 'on_the_way'
    if (existingOrder.status !== requiredPreviousStatus) {
      return NextResponse.json({ error: `Order must be ${requiredPreviousStatus.replace('_', ' ')} before this action` }, { status: 400 })
    }
    const currentLocation = body.currentLocation
    if (!currentLocation?.lat || !currentLocation?.lng) {
      return NextResponse.json({ error: 'Current GPS location is required' }, { status: 400 })
    }
    const farmer = await Farmer.findOne({ farmerId: existingOrder.farmerId }, 'location')
    const destination = status === 'picked_up' ? farmer?.location : existingOrder.location
    if (!destination?.lat || !destination?.lng) {
      return NextResponse.json({ error: 'Delivery destination location is unavailable' }, { status: 400 })
    }
    const toRad = value => value * Math.PI / 180
    const latDelta = toRad(Number(destination.lat) - Number(currentLocation.lat))
    const lngDelta = toRad(Number(destination.lng) - Number(currentLocation.lng))
    const distanceKm = 6371 * 2 * Math.atan2(
      Math.sqrt(Math.sin(latDelta / 2) ** 2 + Math.cos(toRad(Number(currentLocation.lat))) * Math.cos(toRad(Number(destination.lat))) * Math.sin(lngDelta / 2) ** 2),
      Math.sqrt(1 - (Math.sin(latDelta / 2) ** 2 + Math.cos(toRad(Number(currentLocation.lat))) * Math.cos(toRad(Number(destination.lat))) * Math.sin(lngDelta / 2) ** 2))
    )
    if (distanceKm > 0.3) {
      return NextResponse.json({ error: status === 'picked_up' ? 'Please reach the farmer farm before marking pickup' : 'Please reach the customer location before marking as delivered' }, { status: 400 })
    }
  }

  if (body.claimPartnerId) {
    const partner = await DeliveryPartner.findOne({ partnerId: body.claimPartnerId, active: true })
    if (!partner) return NextResponse.json({ error: 'Delivery partner not found' }, { status: 404 })
    const claimed = await Order.findOneAndUpdate(
      { orderId, status: 'confirmed', deliveryPartnerId: null },
      { deliveryPartnerId: partner._id, deliveryPartnerName: partner.name, deliveryPhone: partner.phone, deliveryEmail: partner.email || '' },
      { new: true }
    )
    if (!claimed) return NextResponse.json({ error: 'This order was already accepted by another partner' }, { status: 409 })
    notifyWhatsApp('delivery_assigned', { ...claimed.toObject(), deliveryPhone: partner.phone })
    return NextResponse.json(claimed)
  }

  const updates = {}
  if (status)               updates.status              = status
  if (deliveryPartnerId)    updates.deliveryPartnerId   = deliveryPartnerId
  if (deliveryPartnerName)  updates.deliveryPartnerName = deliveryPartnerName
  if (deliveryPhone)        updates.deliveryPhone = deliveryPhone
  if (body.feedbackRating) {
    updates.feedbackRating = body.feedbackRating
    updates.feedbackComment = body.feedbackComment || ''
    updates.feedbackAt = new Date()
  }
  if (body.settlementType === 'farmer' || body.settlementType === 'delivery') {
    const field = body.settlementType === 'farmer' ? 'farmerSettlementStatus' : 'deliverySettlementStatus'
    const settledAt = body.settlementType === 'farmer' ? 'farmerSettledAt' : 'deliverySettledAt'
    if (existingOrder.status !== 'delivered') return NextResponse.json({ error: 'Only delivered orders can be settled' }, { status: 400 })
    updates[field] = 'settled'
    updates[settledAt] = new Date()
  }

  const order = await Order.findOneAndUpdate({ orderId }, updates, { new: true })

  if (status === 'cancelled' && existingOrder.status !== 'cancelled') {
    const farmer = await Farmer.findOne({ farmerId: existingOrder.farmerId })
    if (farmer) {
      existingOrder.items?.forEach(({ name, qty }) => {
        const vegetable = farmer.vegetables.find(v => v.name.toLowerCase() === name.toLowerCase())
        if (vegetable) {
          vegetable.qty += qty
          vegetable.available = true
        }
      })
      await farmer.save()
      await Farmer.findOneAndUpdate({ farmerId: existingOrder.farmerId }, { $inc: { totalOrders: -1 } })
    }
  }

  // WhatsApp on status change
  if (status) {
    const eventMap = {
      confirmed:  'order_confirmed',
      picked_up:  'picked_up',
      on_the_way: 'on_the_way',
      delivered:  'delivered',
      cancelled:  'order_cancelled',
    }
    if (eventMap[status]) {
      const notificationOrder = {
        ...order.toObject(),
        customerEmail: order.customerEmail,
        farmerEmail: order.farmerEmail,
        deliveryEmail: order.deliveryEmail,
        farmerPhone: order.farmerPhone,
        customerPhone: order.customerPhone,
        deliveryPhone: order.deliveryPhone || deliveryPhone || '',
      }
      if (status === 'delivered' || status === 'cancelled') {
        await notifyAll(status === 'cancelled' ? 'order_cancelled' : 'delivered', notificationOrder)
      } else {
        notifyWhatsApp(eventMap[status], notificationOrder)
      }
    }
  }

  // WhatsApp to delivery partner when assigned
  if (deliveryPartnerId && deliveryPhone) {
    const partner = await DeliveryPartner.findOne({ _id: deliveryPartnerId }, 'email')
    updates.deliveryEmail = partner?.email || ''
    notifyWhatsApp('delivery_assigned', {
      ...order.toObject(),
      deliveryPhone,
      deliveryEmail: partner?.email || '',
    })
  }

  return NextResponse.json(order)
}
