import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { loadChunkCache } from "./utils/chunkCache.js";

dotenv.config();

// Fail fast: never run with a missing secret.
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not set in .env");
  process.exit(1);
}

connectDB().then(() => loadChunkCache());

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Multilingual Helpdesk Platform Backend (MAIT) is running 🚀",
  });
});

app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
