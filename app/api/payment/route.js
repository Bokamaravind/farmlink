import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// POST /api/payment  → create Razorpay order
export async function POST(req) {
  try {
    const { amount, orderId } = await req.json()

    const rzpOrder = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // paise
      currency: 'INR',
      receipt:  orderId,
      notes:    { farmlink_order_id: orderId },
    })

    // Save razorpayOrderId to our DB order
    await connectDB()
    await Order.findOneAndUpdate(
      { orderId },
      { razorpayOrderId: rzpOrder.id, paymentStatus: 'pending' }
    )

    return NextResponse.json({
      rzpOrderId: rzpOrder.id,
      amount:     rzpOrder.amount,
      currency:   rzpOrder.currency,
      keyId:      process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('Razorpay create order error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/payment  → verify payment signature
export async function PUT(req) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = await req.json()

    // Verify signature
    const body      = razorpayOrderId + '|' + razorpayPaymentId
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpaySignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Update order as paid
    await connectDB()
    const existingOrder = await Order.findOne({ orderId })
    const order = await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: existingOrder?.paymentMethod === 'cod' ? 'deposit_paid' : 'paid', paymentId: razorpayPaymentId, status: 'confirmed' },
      { new: true }
    )

    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.error('Razorpay verify error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
