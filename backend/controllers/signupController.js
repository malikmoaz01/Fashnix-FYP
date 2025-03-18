import bcrypt from "bcryptjs";
import User from "../models/signupModel.js";
import multer from "multer";
import path from "path";

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the directory where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
  }
});

// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Only allow image files (e.g., jpg, jpeg, png)
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only images are allowed"), false);
    }
  },
});

// Add multer middleware for image upload to the signup route
export const signupUser = async (req, res) => {
  // Use multer's single image upload handler for the "profileImage" field
  upload.single("profileImage")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name, email, password } = req.body;
      const profileImage = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists!" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profileImage,
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error!" });
    }
  });
};
