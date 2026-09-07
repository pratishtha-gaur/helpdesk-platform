import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema(
  {
    sourceUrl: { type: String, required: true },
    sourceType: { type: String, enum: ["html", "pdf"], required: true },
    section: { type: String, default: "General" }, // e.g. "Fees", "Syllabus", "Admissions"
    branch: { type: String, default: null },        // e.g. "CSE", "IT" — null if not branch-specific
    semester: { type: Number, default: null },       // null if not semester-specific
    text: { type: String, required: true },          // the actual chunk content
    embedding: { type: [Number], default: [] },      // vector for semantic search
  },
  { timestamps: true }
);

// Plain cosine similarity — fine until you outgrow it and move to Atlas Vector Search
knowledgeChunkSchema.statics.cosineSimilarity = function (a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const KnowledgeChunk = mongoose.model("KnowledgeChunk", knowledgeChunkSchema);
export default KnowledgeChunk;