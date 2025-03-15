const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const resend = new Resend("re_BexFYimB_A389F58aqcFUbGwvAnAp3m8L");

app.post("/send-email", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import contactRoute from "./routes/contactSend.js";

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// app.use("/api", contactRoute);

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
