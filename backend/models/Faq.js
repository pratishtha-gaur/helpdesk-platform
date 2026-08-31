import mongoose from "mongoose";

// This defines the SHAPE of every FAQ document stored in MongoDB.
const faqSchema = new mongoose.Schema(
  {
    // Which category this FAQ belongs to.
    // "enum" means ONLY these exact values are allowed — prevents typos
    // like someone accidentally saving "Addmissions".
    category: {
      type: String,
      required: true,
      enum: ["Admissions", "Scholarships", "Examinations", "Fees", "Hostel", "General"],
    },

    // The question, written in simple English (our "canonical" language).
    // Students may ask this in Hindi/Punjabi — we handle that at query time,
    // not by storing multiple copies of the same FAQ.
    question: {
      type: String,
      required: true,
    },

    // The real, verified answer — this is the "ground truth" the AI
    // is NOT allowed to deviate from.
    answer: {
      type: String,
      required: true,
    },

    // Extra search words that might not appear in the question itself
    // e.g. question = "How do I apply for a scholarship?"
    // keywords = ["financial aid", "fee reimbursement", "SC ST OBC scholarship"]
    // This improves the chances of finding this FAQ from a differently-worded query.
    keywords: {
      type: [String],
      default: [],
    },

    // Where this info came from — good practice for authenticity/traceability
    // (you can literally show this in your defense as a feature!)
    source: {
      type: String,
      default: "MAIT Official Notice",
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields to every document
    timestamps: true,
  }
);

// "mongoose.model" turns our schema into a usable Model —
// an object we can use to create, read, update, delete FAQ entries.
const Faq = mongoose.model("Faq", faqSchema);

export default Faq;
