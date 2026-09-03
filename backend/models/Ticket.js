import mongoose from "mongoose";

// Every message exchanged on a ticket — this is what makes a ticket feel
// like a real conversation thread, not just a single question and answer.
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["student", "staff", "bot"],
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true } // each message gets its own timestamp
);

const ticketSchema = new mongoose.Schema(
  {
    // The human-friendly ID, e.g. "MAIT-0001" — this is what students
    // actually see and use to track their request.
    ticketCode: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      enum: ["Admissions", "Scholarships", "Examinations", "Fees", "Hostel", "General"],
      default: "General",
    },

    subject: {
      type: String,
      required: true,
    },

    // The FULL lifecycle of a real support case — this is what a plain
    // chatbot has no concept of at all.
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },

    // Which chat session this came from (if it was auto-created by an
    // escalation), so we can trace it back if needed.
    sessionId: {
      type: String,
      default: null,
    },

    // If a chat message triggered this ticket, we link to that log entry.
    sourceChatLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatLog",
      default: null,
    },

    // The full conversation thread on this ticket.
    thread: {
      type: [messageSchema],
      default: [],
    },

    // Which staff member is handling it (simple text for now — in a fuller
    // system this would reference a real Staff/User model with login).
    assignedTo: {
      type: String,
      default: "Unassigned",
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
