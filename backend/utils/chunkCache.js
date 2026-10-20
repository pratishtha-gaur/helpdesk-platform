import KnowledgeChunk from "../models/KnowledgeChunk.js";

let cache = null;
let loadingPromise = null;

// Loads all chunks ONCE and keeps them in memory.
export async function loadChunkCache() {
  if (cache) return cache;

  if (!loadingPromise) {
    loadingPromise = (async () => {
      const docs = await KnowledgeChunk.find(
        {},
        "text section branch semester sourceUrl embedding",
      ).lean(); // lean() = plain JS objects, much faster than Mongoose documents

      cache = docs.map((d) => {
        const vec = Float32Array.from(d.embedding);
        let sum = 0;
        for (let i = 0; i < vec.length; i++) sum += vec[i] * vec[i];
        const norm = Math.sqrt(sum) || 1;
        // Pre-normalize: later, similarity = just a dot product
        for (let i = 0; i < vec.length; i++) vec[i] /= norm;

        return {
          text: d.text,
          section: d.section,
          branch: d.branch,
          semester: d.semester,
          sourceUrl: d.sourceUrl,
          vec,
        };
      });

      console.log(`✅ Chunk cache ready: ${cache.length} chunks`);
      return cache;
    })();
  }

  return loadingPromise;
}

// Call this if you re-run ingestion without restarting the server.
export function clearChunkCache() {
  cache = null;
  loadingPromise = null;
}
