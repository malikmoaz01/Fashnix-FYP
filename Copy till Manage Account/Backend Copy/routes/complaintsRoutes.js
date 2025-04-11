import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// Get all complaints - for admin dashboard
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new complaint - from customer chatbot
router.post('/', async (req, res) => {
  try {
    const { customerName, email, orderNumber, message } = req.body;
    
    // Validate only the message is required
    if (!message) {
      return res.status(400).json({ message: 'Please provide a complaint message' });
    }

    const newComplaint = new Complaint({
      customerName: customerName || 'Anonymous',
      email: email || 'not provided',
      orderNumber,
      message,
      status: 'new'
    });

    const savedComplaint = await newComplaint.save();
    
    // Send a response with a customer-friendly message
    res.status(201).json({ 
      success: true, 
      complaintId: savedComplaint._id,
      reply: `Thank you for your feedback! Your complaint has been recorded with ID: ${savedComplaint._id.toString().substring(0, 8)}. We'll look into this matter as soon as possible.`
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a complaint status - for admin dashboard
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['new', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(updatedComplaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a complaint - optional admin functionality
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;