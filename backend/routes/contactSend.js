import express from "express";
import resend from "../config/emailConfig.js"; 

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "mlkmoaz01@gmail.com",
      subject: "New Contact Form Submission",
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    });

    console.log("Email sent:", response);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email.");
  }
});

export default router;
