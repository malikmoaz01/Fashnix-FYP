import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/userDB";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error:", err));
