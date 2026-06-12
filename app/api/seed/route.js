import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Farmer from '@/models/Farmer'
import bcrypt from 'bcryptjs'

export async function POST() {
  await connectDB()
  const existing = await Farmer.countDocuments()
  if (existing > 0) return NextResponse.json({ message: 'Already seeded' })

  const farmers = [
    {
      farmerId: 'FL-001', name: 'Balu Patil', phone: '9876543210',
      region: 'Warangal', address: 'Hanamkonda, Warangal',
      password: await bcrypt.hash('farm001', 10),
      rating: 4.5, active: true,
      vegetables: [
        { name: 'Tomato',  price: 28, unit: 'kg',    qty: 50, available: true  },
        { name: 'Spinach', price: 25, unit: 'bunch', qty: 30, available: true  },
        { name: 'Okra',    price: 32, unit: 'kg',    qty: 20, available: true  },
        { name: 'Brinjal', price: 22, unit: 'kg',    qty: 15, available: false },
      ]
    },
    {
      farmerId: 'FL-002', name: 'Savitri Reddy', phone: '9123456780',
      region: 'Nizamabad', address: 'Bodhan, Nizamabad',
      password: await bcrypt.hash('farm002', 10),
      rating: 4.8, active: true,
      vegetables: [
        { name: 'Carrot', price: 40, unit: 'kg', qty: 60, available: true },
        { name: 'Beans',  price: 35, unit: 'kg', qty: 25, available: true },
        { name: 'Onion',  price: 30, unit: 'kg', qty: 80, available: true },
      ]
    },
    {
      farmerId: 'FL-003', name: 'Kishore Naidu', phone: '9988776655',
      region: 'Kurnool', address: 'Nandyal, Kurnool',
      password: await bcrypt.hash('farm003', 10),
      rating: 4.1, active: true,
      vegetables: [
        { name: 'Potato',   price: 25, unit: 'kg', qty: 100, available: true },
        { name: 'Cucumber', price: 20, unit: 'kg', qty: 40,  available: true },
        { name: 'Chilli',   price: 60, unit: 'kg', qty: 10,  available: true },
      ]
    },
  ]

  await Farmer.insertMany(farmers)
  return NextResponse.json({ message: 'Seeded successfully', count: farmers.length })
}
