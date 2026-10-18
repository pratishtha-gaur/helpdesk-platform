import express from "express";
import {
  createTicket,
  getTicketByCode,
  listTickets,
  updateTicketStatus,
} from "../controllers/ticketController.js";
import { requireStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createTicket); // public: students raise requests
router.get("/", requireStaff, listTickets); // STAFF ONLY: full ticket list
router.get("/:ticketCode", getTicketByCode); // public: track by code
router.patch("/:id/status", requireStaff, updateTicketStatus); // STAFF ONLY: reply / change status

export default router;
