import express from "express";
import rateLimit from "express-rate-limit";
import { login, me } from "../controllers/authController.js";
import { requireStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

// Max 10 login attempts per IP per 15 minutes, which blocks password guessing.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again in 15 minutes.",
  },
});

router.post("/login", loginLimiter, login);
router.get("/me", requireStaff, me);

export default router;
