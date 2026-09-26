import mongoose from 'mongoose'

const DeliveryVerificationRequestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true, required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true },
  address: { type: String, required: true, trim: true },
  region: { type: String, default: 'Lankelapalem', trim: true },
  vehicle: { type: String, default: 'Bike', trim: true },
  aadhaarNumber: { type: String, required: true, trim: true },
  aadhaarDocument: { type: String, required: true, trim: true },
  photo: { type: String, required: true, trim: true },
  bankName: { type: String, required: true, trim: true },
  bankAccountNumber: { type: String, required: true, trim: true },
  ifscCode: { type: String, required: true, trim: true },
  bankDocument: { type: String, default: '', trim: true },
  notes: { type: String, default: '', trim: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: String, default: '' },
  reviewedAt: { type: Date },
}, { timestamps: true })

export default mongoose.models.DeliveryVerificationRequest || mongoose.model('DeliveryVerificationRequest', DeliveryVerificationRequestSchema)
