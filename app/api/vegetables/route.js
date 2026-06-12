import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Farmer from '@/models/Farmer'

// PUT /api/vegetables — reduce stock after order
export async function PUT(req) {
  await connectDB()
  const { farmerId, items } = await req.json()
  const farmer = await Farmer.findOne({ farmerId })
  if (!farmer) return NextResponse.json({ error: 'Farmer not found' }, { status: 404 })

  items.forEach(({ vegId, qty }) => {
    const veg = farmer.vegetables.id(vegId)
    if (veg) {
      veg.qty = Math.max(0, veg.qty - qty)
      if (veg.qty === 0) veg.available = false
    }
  })

  await farmer.save()
  return NextResponse.json({ success: true })
}

export async function POST(req) {
  await connectDB()
  const { farmerId, vegetable } = await req.json()
  const farmer = await Farmer.findOneAndUpdate(
    { farmerId },
    { $push: { vegetables: vegetable } },
    { new: true, select: '-password' }
  )
  return NextResponse.json(farmer)
}

export async function PATCH(req) {
  await connectDB()
  const { farmerId, vegId, updates } = await req.json()
  const farmer = await Farmer.findOne({ farmerId })
  if (!farmer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const veg = farmer.vegetables.id(vegId)
  if (veg) Object.assign(veg, updates)
  await farmer.save()
  return NextResponse.json({ success: true })
}

export async function DELETE(req) {
  await connectDB()
  const { farmerId, vegId } = await req.json()
  await Farmer.findOneAndUpdate({ farmerId }, { $pull: { vegetables: { _id: vegId } } })
  return NextResponse.json({ success: true })
}
