// models/chatbotModel.js
import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "new",
    enum: ["new", "in-progress", "resolved"],
  },
  userType: {
    type: String,
    enum: ["guest", "authenticated"],
    default: "guest",
  },
  customerName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  orderNumber: {
    type: String,
    default: "",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userschema",
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.model("chatbot", chatbotSchema);