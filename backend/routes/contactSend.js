import express from "express";
import { sendEmail } from "../config/emailConfig.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    const response = await sendEmail({ firstName, lastName, email, phone, message });
    console.log("Email sent:", response);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email.");
  }
});

export default router;