import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import DeliveryPartner from '@/models/DeliveryPartner'
import bcrypt from 'bcryptjs'

export async function GET(req, { params }) {
  await connectDB()
  const partner = await DeliveryPartner.findOne({ partnerId: params.id }, '-password')
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(partner)
}

export async function PATCH(req, { params }) {
  await connectDB()
  const body = await req.json()
  if (body.password) body.password = await bcrypt.hash(body.password, 10)
  const partner = await DeliveryPartner.findOneAndUpdate(
    { partnerId: params.id }, body, { new: true, select: '-password' }
  )
  return NextResponse.json(partner)
}

export async function DELETE(req, { params }) {
  await connectDB()
  await DeliveryPartner.findOneAndDelete({ partnerId: params.id })
  return NextResponse.json({ success: true })
}
