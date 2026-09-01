import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Multilingual Helpdesk Backend (MAIT) is running 🚀" });
});

// Any URL starting with /api/chat is handled by chatRoutes.
// So a POST request to http://localhost:5050/api/chat triggers
// handleChatMessage from our controller.
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
