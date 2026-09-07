
import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { embedText } from "../config/embeddings.js";

export async function findRelevantChunks(query, topK = 5) {
  const queryEmbedding = await embedText(query);
  const allChunks = await KnowledgeChunk.find({}, "text section branch semester sourceUrl embedding");

  if (allChunks.length === 0) return [];

  const scored = allChunks.map((chunk) => ({
    chunk,
    score: KnowledgeChunk.cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}