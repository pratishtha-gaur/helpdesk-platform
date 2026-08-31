import mongoose from "mongoose";

// Every time a student sends a message and gets a reply, we save it here.
// This single collection will later power:
//  1. The admin analytics dashboard (most-asked questions, usage by language)
//  2. The escalation system (flagging queries the bot couldn't answer)
const chatLogSchema = new mongoose.Schema(
  {
    // Groups messages from the same chat session together
    sessionId: {
      type: String,
      required: true,
    },

    // Exactly what the student typed, in their original language
    studentQuery: {
      type: String,
      required: true,
    },

    // Which language we detected: "en", "hi", "pa" (Punjabi), etc.
    detectedLanguage: {
      type: String,
      required: true,
    },

    // If we matched an FAQ from our knowledge base, we store a reference to it.
    // "ref" tells Mongoose this ID points to a document in the Faq collection —
    // this lets us later "populate" (auto-fetch) the full FAQ details if needed.
    matchedFaq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faq",
      default: null,
    },

    // The chatbot's final reply shown to the student
    botResponse: {
      type: String,
      required: true,
    },

    // How confident we were that matchedFaq was actually relevant (0 to 1).
    // We'll use this in Step 3/4 to decide whether to escalate to a human.
    confidenceScore: {
      type: Number,
      default: 0,
    },

    // If confidence was too low, we mark this true and a staff member
    // can review it later (this is your "human-in-the-loop" innovation point).
    wasEscalated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ChatLog = mongoose.model("ChatLog", chatLogSchema);

export default ChatLog;
