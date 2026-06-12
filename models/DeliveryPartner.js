import mongoose from 'mongoose'

const DeliveryPartnerSchema = new mongoose.Schema({
  partnerId:   { type: String, unique: true, required: true },
  name:        { type: String, required: true },
  phone:       { type: String, required: true },
  password:    { type: String, required: true },
  vehicle:     { type: String, default: 'Bike' },
  region:      { type: String, default: '' },
  active:      { type: Boolean, default: true },
  available:   { type: Boolean, default: true },
  totalOrders: { type: Number, default: 0 },
  earnings:    { type: Number, default: 0 },
  liveLocation:{ lat: Number, lng: Number, updatedAt: Date },
  rating:      { type: Number, default: 4.5 },
}, { timestamps: true })

export default mongoose.models.DeliveryPartner || mongoose.model('DeliveryPartner', DeliveryPartnerSchema)
