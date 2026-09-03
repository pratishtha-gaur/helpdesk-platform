import express from "express";
import {
  getSummary,
  getEscalatedQueries,
  resolveEscalation,
} from "../controllers/analyticsController.js";

const router = express.Router();

// GET  /api/analytics/summary            -> dashboard stats + charts
// GET  /api/analytics/escalated          -> list of escalated queries
// PATCH /api/analytics/escalated/:id/resolve -> mark one as resolved
router.get("/summary", getSummary);
router.get("/escalated", getEscalatedQueries);
router.patch("/escalated/:id/resolve", resolveEscalation);

export default router;
