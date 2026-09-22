import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'
import bcrypt from 'bcryptjs'

export async function GET(req, { params }) {
  await connectDB()
  const customer = await Customer.findById(params.id, '-password')
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(customer)
}

export async function PATCH(req, { params }) {
  await connectDB()
  const body = await req.json()
  // Don't allow changing email or provider via this route
  delete body.email
  delete body.provider
  delete body.googleId
  if (body.password) {
    if (body.password.length < 6) return NextResponse.json({ error: 'Password too short' }, { status: 400 })
    body.password = await bcrypt.hash(body.password, 10)
  } else {
    delete body.password
  }
  const customer = await Customer.findByIdAndUpdate(params.id, body, { new: true, select: '-password' })
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(customer)
}