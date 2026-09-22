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
  savedAddresses: [{
    label: { type: String, default: 'Home' },
    recipientName: String,
    flatHouse: String,
    street: String,
    landmark: String,
    area: String,
    city: String,
    pincode: String,
    location: { lat: Number, lng: Number },
  }],
  totalOrders:{ type: Number, default: 0 },
  active:     { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)
