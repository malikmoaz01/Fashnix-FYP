// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   orderId: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
//   status: { 
//     type: String,
//     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   items: [{
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//     productName: String,
//     price: Number,
//     quantity: Number,
//     size: String,
//     image: String
//   }],
//   subtotal: Number,
//   deliveryCost: Number,
//   total: Number,
//   customer: {
//     firstName: String,
//     lastName: String,
//     email: String,
//     phone: String,
//     address: {
//       line1: String,
//       line2: String,
//       city: String,
//       state: String,
//       postalCode: String,
//       country: String
//     }
//   },
//   payment: {
//     method: { type: String, enum: ['cod', 'card'] },
//     status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
//     cardLast4: String,
//     transactionId: String
//   },
//   delivery: {
//     method: String,
//     trackingNumber: String,
//     estimatedDelivery: Date,
//     shippedDate: Date,          // New field: when the order was actually shipped
//     carrier: String,            // New field: shipping carrier (UPS, FedEx, etc.)
//     deliveredDate: Date,        // New field: when the order was delivered
//     signedBy: String,           // New field: who signed for the delivery
//     notes: String               // New field: delivery notes
//   },
//   notes: String,
//   statusHistory: [{             // New field: track status changes
//     status: String,
//     timestamp: { type: Date, default: Date.now },
//     comment: String
//   }]
// });

// // Pre-save middleware to track status changes
// orderSchema.pre('save', function(next) {
//   // If this is a new document, initialize statusHistory
//   if (this.isNew) {
//     this.statusHistory = [{
//       status: this.status,
//       timestamp: new Date(),
//       comment: 'Order created'
//     }];
//   } 
//   // If status has changed, add it to history
//   else if (this.isModified('status')) {
//     this.statusHistory.push({
//       status: this.status,
//       timestamp: new Date(),
//       comment: `Status changed to ${this.status}`
//     });
    
//     // If status is changed to shipped, set the shippedDate
//     if (this.status === 'shipped' && !this.delivery.shippedDate) {
//       this.delivery.shippedDate = new Date();
//     }
    
//     // If status is changed to delivered, set the deliveredDate
//     if (this.status === 'delivered' && !this.delivery.deliveredDate) {
//       this.delivery.deliveredDate = new Date();
//     }
//   }
  
//   next();
// });

// const Order = mongoose.model('Order', orderSchema);

// export default Order;
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  // Add userId to link orders to specific users
  userId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  status: { 
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    price: Number,
    quantity: Number,
    size: String,
    image: String
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
    },
    billingAddress: {
      sameAsShipping: { type: Boolean, default: true },
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  payment: {
    method: { type: String, enum: ['cod', 'card'] },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    cardLast4: String,
    transactionId: String
  },
  delivery: {
    method: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    shippedDate: Date,
    carrier: String,
    deliveredDate: Date,
    signedBy: String,
    notes: String
  },
  notes: String,
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    comment: String
  }]
});

// Pre-save middleware to track status changes
orderSchema.pre('save', function(next) {
  // If this is a new document, initialize statusHistory
  if (this.isNew) {
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      comment: 'Order created'
    }];
  } 
  // If status has changed, add it to history
  else if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      comment: `Status changed to ${this.status}`
    });
    
    // If status is changed to shipped, set the shippedDate
    if (this.status === 'shipped' && !this.delivery.shippedDate) {
      this.delivery.shippedDate = new Date();
    }
    
    // If status is changed to delivered, set the deliveredDate
    if (this.status === 'delivered' && !this.delivery.deliveredDate) {
      this.delivery.deliveredDate = new Date();
    }
  }
  
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;