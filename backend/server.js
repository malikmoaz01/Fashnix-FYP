import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/User.js"; 

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));


mongoose
  .connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists!" });

    // Create and save new user
    const newUser = new User({ name, email, password, profileImage });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
