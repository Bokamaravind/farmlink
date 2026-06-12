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
  if (body.password) body.password = await bcrypt.hash(body.password, 10)
  const farmer = await Farmer.findOneAndUpdate(
    { farmerId: params.id }, body, { new: true, select: '-password' }
  )
  return NextResponse.json(farmer)
}

export async function DELETE(req, { params }) {
  await connectDB()
  await Farmer.findOneAndDelete({ farmerId: params.id })
  return NextResponse.json({ success: true })
}
