// routes/chatbotRoutes.js
import express from "express";
import {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint
} from "../controllers/chatbotController.js";

const router = express.Router();

// Add a test route to debug
router.get("/test-chatbot", (req, res) => {
  res.json({ message: "Chatbot routes are working!" });
});

// Public route for creating complaints (no auth required)
router.post("/complaints", createComplaint);

// Admin-only routes
router.get("/complaints", getAllComplaints);
router.put("/complaints/:id", updateComplaintStatus);
router.delete("/complaints/:id", deleteComplaint);

export default router;