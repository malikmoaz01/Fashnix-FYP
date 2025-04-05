// import express from 'express';
// import User from '../models/signupModel.js'; 
// const router = express.Router();

// router.get('/users', async (req, res) => {
//   try {
//     const users = await User.find(); 
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error });
//   }
// });

// router.put('/users/:id/block', async (req, res) => {
//   const { id } = req.params;
//   const { isBlocked } = req.body; 

//   try {
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.isBlocked = isBlocked; 

//     await user.save();
//     res.json({ message: `User has been ${isBlocked ? 'blocked' : 'unblocked'}` });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating block status', error });
//   }
// });

// export default router;
import express from 'express';
import User from '../models/signupModel.js';
import ShippingAddress from '../models/shippingAddressModel.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

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

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
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
    res.status(500).json({ message: 'Error updating block status', error });
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
    res.json({ message: 'User profile updated successfully!', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
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
      user.shippingAddress.address = address || user.shippingAddress.address;
      user.shippingAddress.street = street || user.shippingAddress.street;
      user.shippingAddress.city = city || user.shippingAddress.city;

      await user.shippingAddress.save();
    } else {
      const newShippingAddress = new ShippingAddress({
        address,
        street,
        city,
      });

      await newShippingAddress.save();
      user.shippingAddress = newShippingAddress;
      await user.save();
    }

    res.json({ message: 'Shipping address updated successfully!', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating shipping address', error });
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

    user.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Profile image uploaded successfully!', profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile image', error });
  }
});

export default router;
