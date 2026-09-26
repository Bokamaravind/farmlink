import mongoose from 'mongoose'

const DeliveryPartnerSchema = new mongoose.Schema({
  partnerId:   { type: String, unique: true, required: true },
  name:        { type: String, required: true },
  phone:       { type: String, required: true },
  email:       { type: String, default: '' },
  password:    { type: String, required: true },
  aadhaarEncrypted: { type: String, default: '', select: false },
  aadhaarLast4: { type: String, default: '', match: /^\d{4}$/ },
  aadhaarDocumentUrl: { type: String, default: '', trim: true },
  aadhaarVerified: { type: Boolean, default: false },
  aadhaarVerifiedAt: { type: Date },
  vehicle:     { type: String, default: 'Bike' },
  region:      { type: String, default: 'Lankelapalem' },
  active:      { type: Boolean, default: true },
  available:   { type: Boolean, default: true },
  totalOrders: { type: Number, default: 0 },
  earnings:    { type: Number, default: 0 },
  settlementRequestStatus: { type: String, enum: ['none', 'requested', 'settled'], default: 'none' },
  settlementRequestedAt: Date,
  liveLocation:{ lat: Number, lng: Number, updatedAt: Date },
  rating:      { type: Number, default: 4.5 },
}, { timestamps: true })

export default mongoose.models.DeliveryPartner || mongoose.model('DeliveryPartner', DeliveryPartnerSchema)
