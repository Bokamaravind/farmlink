import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import FarmerVerificationRequest from '@/models/FarmerVerificationRequest'
import { notifyVerification } from '@/lib/notifications'

function normalizeAadhaar(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export async function GET() {
  await connectDB()
  const requests = await FarmerVerificationRequest.find({}).sort({ createdAt: -1 })
  return NextResponse.json(requests)
}

export async function POST(req) {
  await connectDB()
  const body = await req.json()
  const aadhaarNumber = normalizeAadhaar(body.aadhaarNumber)

  if (!body.name || !body.phone || !body.address || !body.region) {
    return NextResponse.json({ error: 'Name, phone, address and region are required.' }, { status: 400 })
  }
  if (!/^(\d{12})$/.test(aadhaarNumber)) {
    return NextResponse.json({ error: 'Aadhaar number must contain exactly 12 digits.' }, { status: 400 })
  }
  if (!body.aadhaarDocument || !body.farmAreaPhoto || !body.photo || !body.bankName || !body.bankAccountNumber || !body.ifscCode) {
    return NextResponse.json({ error: 'Aadhaar document, farm area photo, profile photo, bank name, account number and IFSC are required.' }, { status: 400 })
  }

  const count = await FarmerVerificationRequest.countDocuments()
  const requestId = `FVR-${String(count + 1).padStart(3, '0')}`

  const request = await FarmerVerificationRequest.create({
    requestId,
    name: body.name,
    phone: body.phone,
    email: body.email || '',
    address: body.address,
    region: body.region,
    aadhaarNumber,
    aadhaarDocument: body.aadhaarDocument,
    farmAreaPhoto: body.farmAreaPhoto,
    photo: body.photo,
    bankName: body.bankName,
    bankAccountNumber: body.bankAccountNumber,
    ifscCode: body.ifscCode,
    bankDocument: body.bankDocument || '',
    notes: body.notes || '',
    status: 'pending',
  })

  await notifyVerification({
    type: 'submitted',
    role: 'farmer',
    name: request.name,
    email: request.email,
    phone: request.phone,
    requestId: request.requestId,
  })

  return NextResponse.json({ message: 'Farmer verification request sent successfully.', request }, { status: 201 })
}

export async function PATCH(req) {
  await connectDB()
  const body = await req.json()
  const { requestId, status, reviewedBy } = body

  if (!requestId || !status) {
    return NextResponse.json({ error: 'requestId and status are required.' }, { status: 400 })
  }

  const existingRequest = await FarmerVerificationRequest.findOne({ requestId })
  if (!existingRequest) {
    return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  }

  const request = await FarmerVerificationRequest.findOneAndUpdate(
    { requestId },
    {
      status,
      reviewedBy: reviewedBy || '',
      reviewedAt: new Date(),
    },
    { new: true }
  )

  if (status === 'approved' && existingRequest.status !== 'approved') {
    await notifyVerification({
      type: 'approved',
      role: 'farmer',
      name: request.name,
      email: request.email,
      phone: request.phone,
      requestId: request.requestId,
    })
  }

  return NextResponse.json(request)
}
