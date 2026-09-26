import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import DeliveryPartner from '@/models/DeliveryPartner'
import bcrypt from 'bcryptjs'
import { sendAccountEmail } from '@/lib/email'
import { notifyVerification } from '@/lib/notifications'

export async function GET() {
  await connectDB()
  const partners = await DeliveryPartner.find({}, '-password -aadhaarEncrypted').sort({ createdAt: -1 })
  return NextResponse.json(partners)
}

export async function POST(req) {
  await connectDB()
  const body  = await req.json()
  const count = await DeliveryPartner.countDocuments()
  const partnerId = 'DL-' + String(count + 1).padStart(3, '0')
  const { ...partnerData } = body
  const hashedPass = await bcrypt.hash(partnerData.password, 10)
  const partner = await DeliveryPartner.create({
    ...partnerData,
    region: partnerData.region || 'Lankelapalem',
    partnerId,
    password: hashedPass,
  })
  try {
    await sendAccountEmail({ email: body.email, name: body.name, accountType: 'delivery', accountId: partnerId, password: body.password, loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/delivery` })
  } catch (error) {
    console.error('Delivery partner account email failed:', error)
  }
  await notifyVerification({ type: 'account_created', role: 'delivery', name: body.name, email: '', phone: body.phone, accountId: partnerId, password: body.password })
  const obj = partner.toObject()
  delete obj.password
  delete obj.aadhaarEncrypted
  return NextResponse.json({ ...obj, plainPassword: body.password, partnerId }, { status: 201 })
}
