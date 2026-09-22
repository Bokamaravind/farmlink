import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import DeliveryPartner from '@/models/DeliveryPartner'

// PATCH /api/location — delivery partner pushes their GPS location
export async function PATCH(req) {
  try {
    await connectDB()
    const { orderId, partnerId, lat, lng } = await req.json()

    const location = { lat, lng, updatedAt: new Date() }

    // Update order's live location
    if (orderId) {
      await Order.findOneAndUpdate({ orderId }, { liveLocation: location })
    }

    // Update partner's last known location
    if (partnerId) {
      await DeliveryPartner.findOneAndUpdate({ partnerId }, { liveLocation: location })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET /api/location?orderId=ORD-xxx — customer polls for rider location
export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

    const order = await Order.findOne({ orderId }, 'liveLocation status deliveryPartnerName deliveryPhone')
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    return NextResponse.json({
      location: order.liveLocation,
      status:   order.status,
      rider:    order.deliveryPartnerName,
      phone:    order.deliveryPhone,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
