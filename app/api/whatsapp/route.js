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
            `🌿 *Kisavi — New Order!*\n\n` +
            `📦 Order: ${order.orderId}\n` +
            `👤 Customer: ${order.customerName}\n` +
            `🛒 Items: ${order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}\n` +
            `💰 Total: ₹${order.total}\n` +
            `📍 Deliver to: ${order.address}\n\n` +
            `Login to Kisavi to confirm: kisavi.in/farmer`
          ))
        }
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `✅ *Kisavi — Order Confirmed!*\n\n` +
            `Your order *${order.orderId}* has been placed.\n` +
            `🌾 Farm: ${order.farmerName}\n` +
            `🛒 Items: ${order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}\n` +
            `💰 Total Paid: ₹${order.total}\n\n` +
            `Track your order: kisavi.in/customer`
          ))
        }
        break

      case 'delivery_order_available':
        if (deliveryPhone) {
          promises.push(sendWhatsApp(deliveryPhone,
            `🛵 *Kisavi — Delivery Available!* 

` +
            `Order: *${order.orderId}*
` +
            `🌾 Pick up from: ${order.farmerName} — ${order.farmerAddress || ''}
` +
            `📍 Deliver to: ${order.address}
` +
            `💰 Your earning: ₹${order.deliveryAgentFee || order.deliveryFee || 0}

` +
            `Open Kisavi Delivery to accept first. Our first available partner can take this order. Login: kisavi.in/delivery`
          ))
        }
        break

      // ── Order confirmed by farmer ────────────────────────────────
      case 'order_confirmed':
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `🌾 *Kisavi — Order Confirmed!*\n\n` +
            `${order.farmerName} has confirmed your order *${order.orderId}*.\n` +
            `Fresh vegetables are being prepared 🥬\n\n` +
            `Track here: kisavi.in/customer`
          ))
        }
        break

      // ── Rider picked up ──────────────────────────────────────────
      case 'picked_up':
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `🛵 *Kisavi — Rider Picked Up!*\n\n` +
            `Your order *${order.orderId}* has been picked up from the farm.\n` +
            `Rider: ${order.deliveryPartnerName || 'Our delivery partner'}\n` +
            `ETA: ~30 minutes 🕐\n\n` +
            `Track here: kisavi.in/customer`
          ))
        }
        if (farmerPhone) {
          promises.push(sendWhatsApp(farmerPhone,
            `✅ *Kisavi — Order Picked Up*\n\n` +
            `Order *${order.orderId}* has been picked up by the rider.\n` +
            `Your payout ₹${(order.subtotal || 0) - (order.platformCommission || Math.round((order.subtotal || 0) * 0.05))} will be credited within 24 hours.`
          ))
        }
        break

      // ── On the way ───────────────────────────────────────────────
      case 'on_the_way':
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `🛵 *Kisavi — Your Order is on the Way!*\n\n` +
            `Order *${order.orderId}* is headed to you!\n` +
            `📍 Address: ${order.address}\n\n` +
            `Track live: kisavi.in/customer`
          ))
        }
        break

      // ── Delivered ────────────────────────────────────────────────
      case 'delivered':
        if (customerPhone) {
          promises.push(sendWhatsApp(customerPhone,
            `🎉 *Kisavi — Delivered!*\n\n` +
            `Your order *${order.orderId}* has been delivered!\n` +
            `Enjoy your fresh vegetables 🥬🍅🥕\n\n` +
            `Thank you for supporting local farmers! 🌾\n` +
            `Order again: kisavi.in/customer`
          ))
        }
        if (farmerPhone) {
          promises.push(sendWhatsApp(farmerPhone,
            `✅ *Kisavi — Delivery Completed*\n\n` +
            `Order *${order.orderId}* from your farm was delivered successfully.\n` +
            `Farmer payout: ₹${(order.subtotal || 0) - (order.platformCommission || Math.round((order.subtotal || 0) * 0.05))}\n` +
            `Settlement requests open after 9:00 PM.`
          ))
        }
        if (deliveryPhone) {
          promises.push(sendWhatsApp(deliveryPhone,
            `✅ *Kisavi — Delivery Completed*\n\n` +
            `Order *${order.orderId}* was delivered successfully.\n` +
            `Your delivery earning: ₹${order.deliveryAgentFee || order.deliveryFee || 0}\n` +
            `Settlement requests open after 9:00 PM.`
          ))
        }
        break

      // ── New delivery assigned ────────────────────────────────────
      case 'delivery_assigned':
        if (deliveryPhone) {
          promises.push(sendWhatsApp(deliveryPhone,
            `🛵 *Kisavi — New Delivery!*\n\n` +
            `Order: *${order.orderId}*\n` +
            `📦 Pick up from: ${order.farmerName} (${order.farmerRegion || ''})\n` +
            `📍 Deliver to: ${order.address}\n` +
            `💰 Your earning: ₹${order.deliveryFee || 50}\n\n` +
            `Login: kisavi.in/delivery`
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
