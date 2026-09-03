import mongoose from "mongoose";

const chatLogSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    studentQuery: { type: String, required: true },
    detectedLanguage: { type: String, required: true },
    matchedFaq: { type: mongoose.Schema.Types.ObjectId, ref: "Faq", default: null },
    botResponse: { type: String, required: true },
    confidenceScore: { type: Number, default: 0 },
    wasEscalated: { type: Boolean, default: false },

    // NEW: Once a staff member reviews an escalated query, they mark it resolved.
    // This is what turns "escalation" from a log entry into an actual workflow.
    resolved: {
      type: Boolean,
      default: false,
    },

    // NEW: Optional note a staff member can leave — e.g. the real answer they
    // gave the student, useful later for improving the knowledge base.
    staffNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ChatLog = mongoose.model("ChatLog", chatLogSchema);

export default ChatLog;
