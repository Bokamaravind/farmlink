import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, default: null },
  phone:      { type: String, default: '' },
  provider:   { type: String, default: 'email' },
  googleId:   { type: String, default: null },
  avatar:     { type: String, default: '' },
  address:    { type: String, default: 'Hyderabad, Telangana' },
  totalOrders:{ type: Number, default: 0 },
  active:     { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)
