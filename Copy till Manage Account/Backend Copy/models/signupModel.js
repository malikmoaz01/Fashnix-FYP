import mongoose from "mongoose";
import bcrypt from "bcryptjs";  

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, required: false },
  googleId: { type: String, required: false },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShippingAddress', 
    required: false
  },
  isBlocked: { type: Boolean, default: false },
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("User", userSchema);