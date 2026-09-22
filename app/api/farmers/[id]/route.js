import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Farmer from '@/models/Farmer'
import bcrypt from 'bcryptjs'

export async function GET(req, { params }) {
  await connectDB()
  const farmer = await Farmer.findOne({ farmerId: params.id }, '-password')
  if (!farmer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(farmer)
}

export async function PATCH(req, { params }) {
  await connectDB()
  const body = await req.json()
  if (body.settlementRequest) {
    if (new Date().getHours() < 21) return NextResponse.json({ error: 'Settlement requests open after 9:00 PM' }, { status: 400 })
    delete body.settlementRequest
    body.settlementRequestStatus = 'requested'
    body.settlementRequestedAt = new Date()
  }
  const { locationLat, locationLng, ...farmerData } = body
  if (String(locationLat ?? '').trim() !== '' && String(locationLng ?? '').trim() !== '') {
    farmerData.location = {
      lat: Number(locationLat),
      lng: Number(locationLng),
    }
  }
  if (farmerData.password) farmerData.password = await bcrypt.hash(farmerData.password, 10)
  const farmer = await Farmer.findOneAndUpdate(
    { farmerId: params.id }, farmerData, { new: true, select: '-password' }
  )
  return NextResponse.json(farmer)
}

export async function DELETE(req, { params }) {
  await connectDB()
  await Farmer.findOneAndDelete({ farmerId: params.id })
  return NextResponse.json({ success: true })
}
