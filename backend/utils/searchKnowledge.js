import { embedText } from "../config/embeddings.js";
import { loadChunkCache } from "./chunkCache.js";

export async function findRelevantChunks(query, topK = 3) {
  // Run the embedding API call and the cache load at the same time
  const [queryEmbedding, chunks] = await Promise.all([
    embedText(query),
    loadChunkCache(),
  ]);

  if (chunks.length === 0) return [];

  // Normalize the query vector
  const q = Float32Array.from(queryEmbedding);
  let sum = 0;
  for (let i = 0; i < q.length; i++) sum += q[i] * q[i];
  const norm = Math.sqrt(sum) || 1;
  for (let i = 0; i < q.length; i++) q[i] /= norm;

  const scored = chunks.map((chunk) => {
    let dot = 0;
    for (let i = 0; i < q.length; i++) dot += q[i] * chunk.vec[i];
    return { chunk, score: dot };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}
