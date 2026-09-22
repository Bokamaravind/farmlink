function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[character]))
}

export async function sendAccountEmail({ email, name, accountType, accountId, password, loginUrl }) {
  if (!email) return false

  if (!process.env.RESEND_API_KEY) {
    console.warn('Account email not sent: RESEND_API_KEY is not configured')
    return false
  }

  const label = accountType === 'farmer' ? 'Farmer' : 'Delivery Partner'
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.FARMLINK_FROM_EMAIL || 'Kisavi <onboarding@resend.dev>',
      to: [email],
      subject: `Your Kisavi ${label} account is ready`,
      text: `Hello ${name},\n\nYour Kisavi ${label} account has been created.\n\nID: ${accountId}\nPassword: ${password}\nLogin: ${loginUrl}\n\nPlease change your password after signing in.`,
      html: `<p>Hello ${escapeHtml(name)},</p><p>Your Kisavi ${label} account has been created.</p><p><strong>ID:</strong> ${escapeHtml(accountId)}<br><strong>Password:</strong> ${password}<br><strong>Login:</strong> <a href="${escapeHtml(loginUrl)}">${escapeHtml(loginUrl)}</a></p><p>Please change your password after signing in.</p>`,
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend returned ${response.status}: ${await response.text()}`)
  }
  return true
}