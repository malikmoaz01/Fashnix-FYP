import express from 'express';
import User from '../models/signupModel.js'; 
const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

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

export default router;
