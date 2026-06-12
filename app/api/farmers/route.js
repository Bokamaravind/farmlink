import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Farmer from '@/models/Farmer'
import bcrypt from 'bcryptjs'

export async function GET() {
  await connectDB()
  const farmers = await Farmer.find({}, '-password').sort({ createdAt: -1 })
  return NextResponse.json(farmers)
}

export async function POST(req) {
  await connectDB()
  const body = await req.json()
  const count = await Farmer.countDocuments()
  const farmerId = 'FL-' + String(count + 1).padStart(3, '0')
  const hashedPass = await bcrypt.hash(body.password, 10)
  const farmer = await Farmer.create({ ...body, farmerId, password: hashedPass })
  const obj = farmer.toObject()
  return NextResponse.json({ ...obj, plainPassword: body.password, farmerId }, { status: 201 })
}
