import mongoose from 'mongoose'

const VegetableSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  unit:      { type: String, default: 'kg' },
  qty:       { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  image:     { type: String, default: '' },
}, { _id: true })

const FarmerSchema = new mongoose.Schema({
  farmerId:   { type: String, unique: true, required: true },
  name:       { type: String, required: true },
  phone:      { type: String, required: true },
  region:     { type: String, required: true },
  address:    { type: String, default: '' },
  password:   { type: String, required: true },
  active:     { type: Boolean, default: true },
  rating:     { type: Number, default: 4.2 },
  totalOrders:{ type: Number, default: 0 },
  vegetables: [VegetableSchema],
  avatar:     { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.Farmer || mongoose.model('Farmer', FarmerSchema)
