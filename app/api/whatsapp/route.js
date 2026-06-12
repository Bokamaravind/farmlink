import { NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'

// Helper to send one WhatsApp message
async function sendWhatsApp(to, message) {
  // Ensure number has country code
  const phone = to.startsWith('+') ? to : `+91${to}`
  return client.messages.create({
    from: FROM,
    to:   `whatsapp:${phone}`,
    body: message,
  })
}

// POST /api/whatsapp
// body: { event, order, farmerPhone, customerPhone, deliveryPhone }
export async function POST(req) {
  try {
    const { event, order, farmerPhone, customerPhone, deliveryPhone } = await req.json()
    const promises = []

    switch (event) {

      // ── New order placed ─────────────────────────────────────────
      case 'order_placed':
        if (farmerPhone) {
          promises.push(sendWhatsApp(farmerPhone,
            `🌿 *FarmLink — New Order!*\n\n` +
            `📦 Order: ${order.orderId}\n` +
            `👤 Customer: ${order.customerName}\n` +
            `🛒 Items: ${order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}\n` +
            `💰 Total: ₹${order.total}\n` +
            `📍 Deliver to: ${order.address}\n\n` +
            `Login to FarmLink to confirm: farmlink.in/farmer`
          ))
        }
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `✅ *FarmLink — Order Confirmed!*\n\n` +
            `Your order *${order.orderId}* has been placed.\n` +
            `🌾 Farm: ${order.farmerName}\n` +
            `🛒 Items: ${order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}\n` +
            `💰 Total Paid: ₹${order.total}\n\n` +
            `Track your order: farmlink.in/customer`
          ))
        }
        break

      // ── Order confirmed by farmer ────────────────────────────────
      case 'order_confirmed':
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `🌾 *FarmLink — Order Confirmed!*\n\n` +
            `${order.farmerName} has confirmed your order *${order.orderId}*.\n` +
            `Fresh vegetables are being prepared 🥬\n\n` +
            `Track here: farmlink.in/customer`
          ))
        }
        break

      // ── Rider picked up ──────────────────────────────────────────
      case 'picked_up':
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `🛵 *FarmLink — Rider Picked Up!*\n\n` +
            `Your order *${order.orderId}* has been picked up from the farm.\n` +
            `Rider: ${order.deliveryPartnerName || 'Our delivery partner'}\n` +
            `ETA: ~30 minutes 🕐\n\n` +
            `Track here: farmlink.in/customer`
          ))
        }
        if (farmerPhone) {
          promises.push(sendWhatsApp(farmerPhone,
            `✅ *FarmLink — Order Picked Up*\n\n` +
            `Order *${order.orderId}* has been picked up by the rider.\n` +
            `Your earnings ₹${Math.round(order.total * 0.85)} will be credited within 24 hours.`
          ))
        }
        break

      // ── On the way ───────────────────────────────────────────────
      case 'on_the_way':
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `🛵 *FarmLink — Your Order is on the Way!*\n\n` +
            `Order *${order.orderId}* is headed to you!\n` +
            `📍 Address: ${order.address}\n\n` +
            `Track live: farmlink.in/customer`
          ))
        }
        break

      // ── Delivered ────────────────────────────────────────────────
      case 'delivered':
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `🎉 *FarmLink — Delivered!*\n\n` +
            `Your order *${order.orderId}* has been delivered!\n` +
            `Enjoy your fresh vegetables 🥬🍅🥕\n\n` +
            `Thank you for supporting local farmers! 🌾\n` +
            `Order again: farmlink.in/customer`
          ))
        }
        break

      // ── New delivery assigned ────────────────────────────────────
      case 'delivery_assigned':
        if (deliveryPhone) {
          promises.push(sendWhatsApp(deliveryPhone,
            `🛵 *FarmLink — New Delivery!*\n\n` +
            `Order: *${order.orderId}*\n` +
            `📦 Pick up from: ${order.farmerName} (${order.farmerRegion || ''})\n` +
            `📍 Deliver to: ${order.address}\n` +
            `💰 Your earning: ₹${Math.round(order.deliveryFee * 0.8)}\n\n` +
            `Login: farmlink.in/delivery`
          ))
        }
        break

      default:
        return NextResponse.json({ error: 'Unknown event' }, { status: 400 })
    }

    const results = await Promise.allSettled(promises)
    const sent    = results.filter(r => r.status === 'fulfilled').length
    const failed  = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({ success: true, sent, failed })

  } catch (err) {
    console.error('WhatsApp error:', err)
    // Don't fail the whole request if WhatsApp fails
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
