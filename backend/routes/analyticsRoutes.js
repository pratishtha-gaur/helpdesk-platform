import express from "express";
import {
  getSummary,
  getEscalatedQueries,
  resolveEscalation,
} from "../controllers/analyticsController.js";
import { requireStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

// Everything below this line requires a logged-in staff member.
router.use(requireStaff);

router.get("/summary", getSummary);
router.get("/escalated", getEscalatedQueries);
router.patch("/escalated/:id/resolve", resolveEscalation);

export default router;
