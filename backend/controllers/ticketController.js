import Ticket from "../models/Ticket.js";
import { getNextSequence } from "../models/Counter.js";

/**
 * Internal helper (NOT an HTTP route) — used by other parts of our code
 * (like the chat controller) to create a ticket programmatically.
 * We export this separately so both the chatbot AND a manual "raise a
 * request" form can create tickets through the exact same logic.
 */
export async function createTicketInternal({
  category,
  subject,
  firstMessage,
  sessionId = null,
  sourceChatLog = null,
  sender = "student",
}) {
  const nextNumber = await getNextSequence("ticket");
  // padStart(4, "0") turns 7 into "0007" — keeps ticket codes tidy and consistent.
  const ticketCode = `MAIT-${String(nextNumber).padStart(4, "0")}`;

  const ticket = await Ticket.create({
    ticketCode,
    category,
    subject,
    sessionId,
    sourceChatLog,
    thread: [{ sender, text: firstMessage }],
  });

  return ticket;
}

/**
 * POST /api/tickets
 * Lets a student directly raise a request through a form on the
 * self-service portal — not just via an escalated chat.
 */
export async function createTicket(req, res) {
  try {
    const { category, subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ error: "Subject and description are required." });
    }

    const ticket = await createTicketInternal({
      category: category || "General",
      subject,
      firstMessage: description,
      sender: "student",
    });

    return res.status(201).json({ ticket });
  } catch (error) {
    console.error("Create ticket error:", error.message);
    return res.status(500).json({ error: "Failed to create ticket." });
  }
}

/**
 * GET /api/tickets/:ticketCode
 * Public tracking — a student enters their ticket code (e.g. "MAIT-0007")
 * and sees its current status and full conversation thread.
 * No login required, since we haven't built authentication yet — the
 * ticket code itself acts as the "key" to view it.
 */
export async function getTicketByCode(req, res) {
  try {
    const { ticketCode } = req.params;
    const ticket = await Ticket.findOne({ ticketCode: ticketCode.toUpperCase() });

    if (!ticket) {
      return res.status(404).json({ error: "No ticket found with that code." });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Get ticket error:", error.message);
    return res.status(500).json({ error: "Failed to fetch ticket." });
  }
}

/**
 * GET /api/tickets
 * Staff view — lists all tickets, optionally filtered by status,
 * most recent first.
 */
export async function listTickets(req, res) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("List tickets error:", error.message);
    return res.status(500).json({ error: "Failed to fetch tickets." });
  }
}

/**
 * PATCH /api/tickets/:id/status
 * Staff updates a ticket's status and optionally adds a reply message
 * to the thread — this is the core "human-in-the-loop" workflow action.
 */
export async function updateTicketStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, staffReply } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    if (status) ticket.status = status;

    // If staff wrote a reply, append it to the thread array.
    if (staffReply && staffReply.trim() !== "") {
      ticket.thread.push({ sender: "staff", text: staffReply.trim() });
    }

    await ticket.save();

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Update ticket status error:", error.message);
    return res.status(500).json({ error: "Failed to update ticket." });
  }
}
