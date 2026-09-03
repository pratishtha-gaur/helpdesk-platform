import express from "express";
import {
  createTicket,
  getTicketByCode,
  listTickets,
  updateTicketStatus,
} from "../controllers/ticketController.js";

const router = express.Router();

// Order matters here! Express matches routes top-to-bottom.
// "/:ticketCode" is a flexible pattern that could accidentally swallow
// other paths, so more specific routes should generally come first.
// In our case they don't conflict (different HTTP methods/paths), but
// it's a good habit to be aware of route ordering.
router.post("/", createTicket);
router.get("/", listTickets);
router.get("/:ticketCode", getTicketByCode);
router.patch("/:id/status", updateTicketStatus);

export default router;
