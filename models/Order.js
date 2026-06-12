import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema({
  name: String, qty: Number, unit: String, price: Number,
})

const OrderSchema = new mongoose.Schema({
  orderId:        { type: String, unique: true, required: true },
  customerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName:   String,
  customerPhone:  String,
  farmerId:       String,
  farmerName:     String,
  farmerPhone:    String,
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner', default: null },
  deliveryPartnerName: String,
  items:          [OrderItemSchema],
  status:         { type: String, default: 'placed', enum: ['placed','confirmed','picked_up','on_the_way','delivered','cancelled'] },
  subtotal:       Number,
  platformFee:    { type: Number, default: 15 },
  deliveryFee:    { type: Number, default: 25 },
  total:          Number,
  address:        String,
  deliveryNote:   String,
  paymentId:      { type: String, default: null },
  paymentStatus:  { type: String, default: 'pending', enum: ['pending','paid','failed','refunded'] },
  razorpayOrderId:{ type: String, default: null },
  liveLocation:   {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    updatedAt: { type: Date, default: null },
  },
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
