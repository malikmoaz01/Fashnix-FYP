import User from '../models/userModel.js';
import ShippingAddress from '../models/ShippingAddress.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/profiles';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage for profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `user-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('shippingAddress');
  
  if (user) {
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
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    // Update basic user info
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }
    
    // Handle shipping address
    if (req.body.address || req.body.street || req.body.city) {
      // If user already has a shipping address, update it
      if (user.shippingAddress) {
        const address = await ShippingAddress.findById(user.shippingAddress);
        if (address) {
          address.address = req.body.address || address.address;
          address.street = req.body.street || address.street;
          address.city = req.body.city || address.city;
          await address.save();
        } else {
          // Create new address if the reference exists but the actual document doesn't
          const newAddress = await ShippingAddress.create({
            address: req.body.address || '',
            street: req.body.street || '',
            city: req.body.city || ''
          });
          user.shippingAddress = newAddress._id;
        }
      } else {
        // Create new address if user doesn't have one
        const newAddress = await ShippingAddress.create({
          address: req.body.address || '',
          street: req.body.street || '',
          city: req.body.city || ''
        });
        user.shippingAddress = newAddress._id;
      }
    }
    
    const updatedUser = await user.save();
    
    // Fetch the updated user with populated address
    const populatedUser = await User.findById(updatedUser._id).populate('shippingAddress');
    
    res.json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      phone: populatedUser.phone || '',
      profileImage: populatedUser.profileImage || '',
      address: populatedUser.shippingAddress ? populatedUser.shippingAddress.address : '',
      street: populatedUser.shippingAddress ? populatedUser.shippingAddress.street : '',
      city: populatedUser.shippingAddress ? populatedUser.shippingAddress.city : '',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upload profile image
// @route   POST /api/users/upload-profile-image
// @access  Private
export const uploadProfileImage = asyncHandler(async (req, res) => {
  const uploadSingle = upload.single('profileImage');
  
  uploadSingle(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      res.status(400);
      throw new Error(`Multer upload error: ${err.message}`);
    } else if (err) {
      // An unknown error occurred
      res.status(500);
      throw new Error(`Unknown upload error: ${err.message}`);
    }
    
    // If file upload was successful
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }
    
    try {
      // Update user profile with new image path
      const user = await User.findById(req.user._id);
      
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }
      
      // Set the image URL (adjust based on your server setup)
      const imageUrl = `/uploads/profiles/${req.file.filename}`;
      user.profileImage = imageUrl;
      await user.save();
      
      res.json({ 
        message: 'Profile image uploaded successfully',
        imageUrl: imageUrl
      });
    } catch (error) {
      console.error('Error saving image reference:', error);
      res.status(500);
      throw new Error('Failed to update profile with new image');
    }
  });
});