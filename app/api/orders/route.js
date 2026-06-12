import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import Farmer from '@/models/Farmer'

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

// GET /api/orders
export async function GET(req) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const farmerId    = searchParams.get('farmerId')
  const customerId  = searchParams.get('customerId')
  const partnerId   = searchParams.get('partnerId')
  const status      = searchParams.get('status')

  const query = {}
  if (farmerId)   query.farmerId           = farmerId
  if (customerId) query.customerId         = customerId
  if (partnerId)  query.deliveryPartnerId  = partnerId
  if (status)     query.status             = status

  const orders = await Order.find(query).sort({ createdAt: -1 })
  return NextResponse.json(orders)
}

// POST /api/orders — place new order
export async function POST(req) {
  await connectDB()
  const body = await req.json()

  const farmer = await Farmer.findOne({ farmerId: body.farmerId })
  if (!farmer) return NextResponse.json({ error: 'Farmer not found' }, { status: 404 })

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
  const total   = body.subtotal + (body.platformFee || 15) + (body.deliveryFee || 25)

  const order = await Order.create({
    ...body,
    orderId,
    farmerName:  farmer.name || '',
    farmerPhone: farmer.phone || '',
    total,
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
  notifyWhatsApp('order_placed', {
    ...order.toObject(),
    farmerPhone:   farmer.phone || '',
    customerPhone: body.customerPhone || '',
  })

  return NextResponse.json(order, { status: 201 })
}

// PATCH /api/orders — update status or assign delivery partner
export async function PATCH(req) {
  await connectDB()
  const body = await req.json()
  const { orderId, status, deliveryPartnerId, deliveryPartnerName, deliveryPhone } = body

  const updates = {}
  if (status)               updates.status              = status
  if (deliveryPartnerId)    updates.deliveryPartnerId   = deliveryPartnerId
  if (deliveryPartnerName)  updates.deliveryPartnerName = deliveryPartnerName

  const order = await Order.findOneAndUpdate({ orderId }, updates, { new: true })

  // WhatsApp on status change
  if (status) {
    const eventMap = {
      confirmed:  'order_confirmed',
      picked_up:  'picked_up',
      on_the_way: 'on_the_way',
      delivered:  'delivered',
    }
    if (eventMap[status]) {
      notifyWhatsApp(eventMap[status], {
        ...order.toObject(),
        deliveryPhone: deliveryPhone || '',
      })
    }
  }

  // WhatsApp to delivery partner when assigned
  if (deliveryPartnerId && deliveryPhone) {
    notifyWhatsApp('delivery_assigned', {
      ...order.toObject(),
      deliveryPhone,
    })
  }

  return NextResponse.json(order)
}
