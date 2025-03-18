import mongoose from "mongoose";

const signupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  isBlocked: { type: Boolean, default: false },
});

export default mongoose.model("User", signupSchema);



