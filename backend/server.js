import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import signupRoutes from "./routes/signupRoutes.js";
import contactRoutes from "./routes/contactSend.js";
import loginRoutes from "./routes/loginRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ordersRoutes from './routes/ordersRoutes.js';
import chatbotRoutes from "./routes/chatbotRoutes.js";
import path from "path"; 
import { fileURLToPath } from "url";

const app = express();
const PORT = 5000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Static files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/users', userRoutes);
app.use("/api", signupRoutes);
app.use("/api", loginRoutes);
app.use("/send-email", contactRoutes);
app.use("/api", productRoutes);
app.use("/api", userRoutes);
app.use("/api", ordersRoutes);
app.use("/api", chatbotRoutes); 

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);