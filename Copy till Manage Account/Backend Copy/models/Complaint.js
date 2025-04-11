import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  customerName: {
    type: String,
    default: 'Anonymous'
  },
  email: {
    type: String,
    default: 'not provided'
  },
  orderNumber: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);

export default Complaint;