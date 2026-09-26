import crypto from 'crypto'

const algorithm = 'aes-256-gcm'

function getKey() {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET is required for Aadhaar encryption')
  return crypto.createHash('sha256').update(secret).digest()
}

export function normalizeAadhaar(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function validateAadhaar(value) {
  const aadhaarNumber = normalizeAadhaar(value)
  if (!/^\d{12}$/.test(aadhaarNumber)) {
    return { error: 'Aadhaar number must contain exactly 12 digits' }
  }
  return { aadhaarNumber, last4: aadhaarNumber.slice(-4) }
}

export function encryptAadhaar(aadhaarNumber) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(aadhaarNumber, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, encrypted].map(value => value.toString('base64url')).join('.')
}