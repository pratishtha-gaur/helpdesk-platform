import Ticket from "../models/Ticket.js";
import ChatLog from "../models/ChatLog.js";
import { getNextSequence } from "../models/Counter.js";
import {
  sendTicketCreatedEmail,
  sendTicketResolvedEmail,
} from "../utils/mailer.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createTicketInternal({
  category,
  subject,
  firstMessage,
  email = null,
  sessionId = null,
  sourceChatLog = null,
  sender = "student",
}) {
  const nextNumber = await getNextSequence("ticket");
  const ticketCode = `MAIT-${String(nextNumber).padStart(4, "0")}`;

  const ticket = await Ticket.create({
    ticketCode,
    category,
    subject,
    email,
    sessionId,
    sourceChatLog,
    thread: [{ sender, text: firstMessage }],
  });

  return ticket;
}

/**
 * POST /api/tickets
 * Student raises a request. Email is mandatory so we can notify them.
 */
export async function createTicket(req, res) {
  try {
    const { category, subject, description, email } = req.body;

    if (!subject || !description) {
      return res
        .status(400)
        .json({ error: "Subject and description are required." });
    }
    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return res
        .status(400)
        .json({ error: "A valid email address is required." });
    }

    const ticket = await createTicketInternal({
      category: category || "General",
      subject,
      firstMessage: description,
      email: email.trim(),
      sender: "student",
    });

    // Fire-and-forget: the student doesn't wait for the mail server,
    // and a mail failure never fails the ticket.
    sendTicketCreatedEmail(ticket).catch((err) =>
      console.error("Ticket-created email failed:", err.message),
    );

    // Don't echo the email back in the response.
    const safeTicket = ticket.toObject();
    delete safeTicket.email;
    return res.status(201).json({ ticket: safeTicket });
  } catch (error) {
    console.error("Create ticket error:", error.message);
    return res.status(500).json({ error: "Failed to create ticket." });
  }
}

/**
 * GET /api/tickets/:ticketCode  (public)
 * "-email" keeps the student's email private.
 */
export async function getTicketByCode(req, res) {
  try {
    const { ticketCode } = req.params;
    const ticket = await Ticket.findOne({
      ticketCode: ticketCode.toUpperCase(),
    }).select("-email");

    if (!ticket) {
      return res.status(404).json({ error: "No ticket found with that code." });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Get ticket error:", error.message);
    return res.status(500).json({ error: "Failed to fetch ticket." });
  }
}

export async function listTickets(req, res) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .limit(200);
    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("List tickets error:", error.message);
    return res.status(500).json({ error: "Failed to fetch tickets." });
  }
}

/**
 * PATCH /api/tickets/:id/status  (staff only)
 * Updates status, appends staff reply, and emails the student on resolution.
 */
export async function updateTicketStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, staffReply } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    const wasResolved = ticket.status === "Resolved";
    const reply = typeof staffReply === "string" ? staffReply.trim() : "";

    if (status) {
      ticket.status = status;
      if (ticket.sourceChatLog) {
        const updateData = { resolved: status === "Resolved" };
        if (reply) updateData.staffNote = reply;
        await ChatLog.findByIdAndUpdate(ticket.sourceChatLog, updateData);
      }
    }

    if (reply) {
      ticket.thread.push({ sender: "staff", text: reply });
    }

    await ticket.save();

    // Email only on the moment it BECOMES resolved (no duplicate emails).
    if (status === "Resolved" && !wasResolved && ticket.email) {
      // Use this reply, or fall back to the latest staff message in the thread.
      const lastStaffMsg = [...ticket.thread]
        .reverse()
        .find((m) => m.sender === "staff");
      const answer =
        reply ||
        lastStaffMsg?.text ||
        "Your request has been reviewed and closed by MAIT staff.";

      sendTicketResolvedEmail(ticket, answer).catch((err) =>
        console.error("Ticket-resolved email failed:", err.message),
      );
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Update ticket status error:", error.message);
    return res.status(500).json({ error: "Failed to update ticket." });
  }
}
