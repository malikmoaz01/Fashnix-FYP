// userRoutes.js - Modified version

import express from 'express';
import User from '../models/signupModel.js';
import ShippingAddress from '../models/ShippingAddress.js';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken'; 
const router = express.Router();

// JWT middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      
      // Attach user info to request
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only images are allowed'), false);
    }
  },
});

// Get user profile data
router.get('/users/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('shippingAddress');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      profileImage: user.profileImage || '',
      address: user.shippingAddress ? user.shippingAddress.address : '',
      street: user.shippingAddress ? user.shippingAddress.street : '',
      city: user.shippingAddress ? user.shippingAddress.city : '',
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// Get all users (admin functionality)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Block or Unblock user
router.put('/users/:id/block', async (req, res) => {
  const { id } = req.params;
  const { isBlocked } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = isBlocked;
    await user.save();
    res.json({ message: `User has been ${isBlocked ? 'blocked' : 'unblocked'}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating block status', error: error.message });
  }
});

// Update User Profile
router.put('/users/:id/profile', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, profileImage } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    res.json({ 
      message: 'User profile updated successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        profileImage: user.profileImage || '',
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Update Shipping Address
router.put('/users/:id/shipping-address', async (req, res) => {
  const { id } = req.params;
  const { address, street, city } = req.body;

  try {
    const user = await User.findById(id).populate('shippingAddress');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.shippingAddress) {
      // Update existing address
      user.shippingAddress.address = address || user.shippingAddress.address;
      user.shippingAddress.street = street || user.shippingAddress.street;
      user.shippingAddress.city = city || user.shippingAddress.city;

      await user.shippingAddress.save();
    } else {
      // Create new address
      const newShippingAddress = new ShippingAddress({
        address: address || '',
        street: street || '',
        city: city || '',
      });

      await newShippingAddress.save();
      user.shippingAddress = newShippingAddress._id; // Important: store the ObjectId
      await user.save();
    }

    // Re-populate the user with the updated shipping address
    const updatedUser = await User.findById(id).populate('shippingAddress');

    res.json({ 
      message: 'Shipping address updated successfully!',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.shippingAddress ? updatedUser.shippingAddress.address : '',
        street: updatedUser.shippingAddress ? updatedUser.shippingAddress.street : '',
        city: updatedUser.shippingAddress ? updatedUser.shippingAddress.city : '',
      }
    });
  } catch (error) {
    console.error('Error updating shipping address:', error);
    res.status(500).json({ message: 'Error updating shipping address', error: error.message });
  }
});

// Upload Profile Image Endpoint
router.post('/users/:id/upload-profile-image', upload.single('profileImage'), async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the image URL (adjust based on your server setup)
    user.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
    await user.save();

    res.json({ 
      message: 'Profile image uploaded successfully!', 
      profileImage: user.profileImage 
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Error uploading profile image', error: error.message });
  }
});

export default router;