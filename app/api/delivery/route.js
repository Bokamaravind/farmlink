import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import DeliveryPartner from '@/models/DeliveryPartner'
import bcrypt from 'bcryptjs'

export async function GET() {
  await connectDB()
  const partners = await DeliveryPartner.find({}, '-password').sort({ createdAt: -1 })
  return NextResponse.json(partners)
}

export async function POST(req) {
  await connectDB()
  const body  = await req.json()
  const count = await DeliveryPartner.countDocuments()
  const partnerId = 'DL-' + String(count + 1).padStart(3, '0')
  const hashedPass = await bcrypt.hash(body.password, 10)
  const partner = await DeliveryPartner.create({ ...body, partnerId, password: hashedPass })
  const obj = partner.toObject()
  delete obj.password
  return NextResponse.json({ ...obj, plainPassword: body.password, partnerId }, { status: 201 })
}
