// import express from "express";
// import cors from "cors";
// import contactRoutes from "./routes/contactSend.js";

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// app.use("/send-email", contactRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// export default app;


import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import signupRoutes from "./routes/signupRoutes.js";
import contactRoutes from "./routes/contactSend.js";

const app = express();
const PORT = 5000;

// Connect to DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api", signupRoutes);
app.use("/send-email", contactRoutes);


// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
