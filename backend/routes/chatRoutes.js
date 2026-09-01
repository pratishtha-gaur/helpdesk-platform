import express from "express";
import { handleChatMessage } from "../controllers/chatController.js";

// A "Router" is a mini version of the Express app, just for grouping
// related routes together — keeps server.js clean.
const router = express.Router();

// When the frontend sends a POST request to /api/chat,
// run handleChatMessage (imported from our controller).
// POST is used (not GET) because the student is SENDING data (their message),
// not just retrieving something.
router.post("/", handleChatMessage);

export default router;
