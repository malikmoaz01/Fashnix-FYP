import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import multer from "multer";
import path from "path";

const router = express.Router();
const SECRET_KEY = "your_secret_key";

// Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/signup", upload.single("profileImage"), async (req, res) => {
  const { name, email, password } = req.body;
  const profileImage = req.file ? req.file.filename : "";

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, profileImage });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

export default router;