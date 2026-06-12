import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  await connectDB()
  const { name, email, password, phone } = await req.json()
  const existing = await Customer.findOne({ email: email.toLowerCase() })
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
  const hashed = await bcrypt.hash(password, 10)
  const customer = await Customer.create({ name, email: email.toLowerCase(), password: hashed, phone, provider: 'email' })
  return NextResponse.json({ id: customer._id, name: customer.name, email: customer.email }, { status: 201 })
}
