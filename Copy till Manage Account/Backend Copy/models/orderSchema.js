// models/orderSchema.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'confirmed' },
  items: [{
    productName: String,
    price: Number,
    quantity: Number,
    size: String
  }],
  subtotal: Number,
  deliveryCost: Number,
  total: Number,
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  payment: {
    method: String,
    cardLast4: String
  },
  delivery: {
    method: String
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
