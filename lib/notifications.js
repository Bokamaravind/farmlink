import twilio from 'twilio'

const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'

function getWhatsAppClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
}

function formatPhone(phone) {
  const value = String(phone || '').trim()
  if (!value) return ''
  return value.startsWith('+') ? value : `+91${value}`
}

export async function sendWhatsAppMessage({ phone, message }) {
  const client = getWhatsAppClient()
  const formattedPhone = formatPhone(phone)
  if (!client || !formattedPhone) return false

  await client.messages.create({
    from: whatsappFrom,
    to: `whatsapp:${formattedPhone}`,
    body: message,
  })
  return true
}

async function sendNotificationEmail({ email, subject, text }) {
  if (!email || !process.env.RESEND_API_KEY) return false

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.FARMLINK_FROM_EMAIL || 'Kisavi <onboarding@resend.dev>',
      to: [email],
      subject,
      text,
    }),
  })

  if (!response.ok) throw new Error(`Resend returned ${response.status}: ${await response.text()}`)
  return true
}

export async function notifyVerification({ type, role, name, email, phone, requestId, accountId, password }) {
  const label = role === 'farmer' ? 'farmer' : 'delivery partner'
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${role === 'farmer' ? 'farmer' : 'delivery'}`
  let subject
  let message

  if (type === 'submitted') {
    subject = 'Kisavi verification request received'
    message = `Hello ${name},\n\nThanks for applying to become a Kisavi ${label}. We have received your request ${requestId} and our team will review it. We will get back to you after verification.\n\nKisavi Team`
  } else if (type === 'approved') {
    subject = 'Your Kisavi verification request is approved'
    message = `Hello ${name},\n\nGood news: your Kisavi ${label} verification request ${requestId} has been approved. Our admin team will add your account to the Kisavi panel and send your login details shortly.\n\nKisavi Team`
  } else {
    subject = 'Your Kisavi account has been added'
    message = `Hello ${name},\n\nYou have been added to the Kisavi ${label} panel.\n\nID: ${accountId}\nPassword: ${password}\nLogin: ${loginUrl}\n\nPlease change your password after signing in.\n\nKisavi Team`
  }

  const whatsappMessage = message
  const results = await Promise.allSettled([
    sendNotificationEmail({ email, subject, text: message }),
    sendWhatsAppMessage({ phone, message: whatsappMessage }),
  ])

  results.filter(result => result.status === 'rejected').forEach(result => {
    console.error(`Kisavi ${type} notification failed:`, result.reason)
  })
  return results.some(result => result.status === 'fulfilled' && result.value === true)
}