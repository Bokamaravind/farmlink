import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Farmer from '@/models/Farmer'
import bcrypt from 'bcryptjs'
import { sendAccountEmail } from '@/lib/email'
import { notifyVerification } from '@/lib/notifications'

export async function GET() {
  await connectDB()
  const farmers = await Farmer.find({}, '-password -aadhaarEncrypted').sort({ createdAt: -1 })
  return NextResponse.json(farmers)
}

export async function POST(req) {
  await connectDB()
  const body = await req.json()
  const count = await Farmer.countDocuments()
  const farmerId = 'FL-' + String(count + 1).padStart(3, '0')
  const { locationLat, locationLng, ...farmerData } = body
  const hashedPass = await bcrypt.hash(farmerData.password, 10)
  const hasLocation = String(locationLat ?? '').trim() !== '' && String(locationLng ?? '').trim() !== ''
  const location = hasLocation && Number.isFinite(Number(locationLat)) && Number.isFinite(Number(locationLng))
    ? { lat: Number(locationLat), lng: Number(locationLng) }
    : undefined
  const farmer = await Farmer.create({
    ...farmerData,
    farmerId,
    password: hashedPass,
    location,
  })
  try {
    await sendAccountEmail({ email: farmerData.email, name: farmerData.name, accountType: 'farmer', accountId: farmerId, password: farmerData.password, loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/farmer` })
  } catch (error) {
    console.error('Farmer account email failed:', error)
  }
  await notifyVerification({ type: 'account_created', role: 'farmer', name: farmerData.name, email: '', phone: farmerData.phone, accountId: farmerId, password: farmerData.password })
  const obj = farmer.toObject()
  delete obj.aadhaarEncrypted
  return NextResponse.json({ ...obj, plainPassword: farmerData.password, farmerId }, { status: 201 })
}
