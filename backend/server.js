import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contactSend.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/send-email", contactRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
