import express from 'express';
import User from '../models/signupModel.js'; // Assuming you have a User model
const router = express.Router();

// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch users from the database
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Route to block or unblock a user
router.put('/users/:id/block', async (req, res) => {
  const { id } = req.params;
  const { isBlocked } = req.body; // Expecting { isBlocked: true/false }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = isBlocked;  // Set the block status

    await user.save();  // Save updated user data
    res.json({ message: `User has been ${isBlocked ? 'blocked' : 'unblocked'}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating block status', error });
  }
});

export default router;
