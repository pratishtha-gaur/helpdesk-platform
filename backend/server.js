import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load variables from .env into process.env
dotenv.config();

// Connect to MongoDB before anything else
connectDB();

// Create the Express app — this is our "server" object
const app = express();

// ---- MIDDLEWARE ----
// Middleware = code that runs on EVERY request, before it reaches our routes.
app.use(cors()); // allow frontend (different address) to talk to us
app.use(express.json()); // automatically parse incoming JSON data into JS objects

// ---- A TEST ROUTE ----
// This is just to confirm the server works. When someone visits
// http://localhost:5000/ in a browser, this code runs and sends a reply.
app.get("/", (req, res) => {
  res.json({ message: "Multilingual Helpdesk Backend is running 🚀" });
});

// ---- START THE SERVER ----
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
