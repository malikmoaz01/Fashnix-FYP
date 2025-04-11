// controllers/chatbotController.js
import Chatbot from "../models/chatbotModel.js";

// Handle complaint submission
export const createComplaint = async (req, res) => {
  try {
    const { message, customerName, email, orderNumber } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const user = req.user || null;
    const userType = user ? "authenticated" : "guest";

    const newComplaint = new Chatbot({
      message,
      customerName,
      email,
      orderNumber,
      user,
      userType,
      status: "new", // Set default status to "new" instead of "pending"
    });

    await newComplaint.save();
    
    // Send back a response that includes a reply message for the chatbot
    res.status(201).json({ 
      success: true, 
      message: "Complaint submitted successfully",
      reply: "Thank you for your complaint. Our team will review it and get back to you soon."
    });

  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch all complaints (admin use)
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Chatbot.find().populate("user", "username email").sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Chatbot.findById(id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    complaint.status = status || complaint.status;
    await complaint.save();

    res.status(200).json({ message: "Complaint status updated" });

  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

// Delete a complaint
export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComplaint = await Chatbot.findByIdAndDelete(id);

    if (!deletedComplaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ success: true, message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ success: false, message: "Failed to delete complaint" });
  }
};