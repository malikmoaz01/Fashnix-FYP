// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const signupSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   profileImage: { type: String },
//   isBlocked: { type: Boolean, default: false },
// });

// signupSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// signupSchema.methods.matchPassword = async function (enteredPassword) {
//   try {
//     return await bcrypt.compare(enteredPassword, this.password);
//   } catch (error) {
//     throw error;
//   }
// };

// export default mongoose.model("User", signupSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";  // Changed to bcryptjs to match controllers

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