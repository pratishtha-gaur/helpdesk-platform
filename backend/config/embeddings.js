// config/embeddings.js
import ai from "./gemini.js";

const EMBED_MODEL = "gemini-embedding-2";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function embedText(text, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.embedContent({
        model: EMBED_MODEL,
        contents: text,
      });
      return response.embeddings[0].values;
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes("RESOURCE_EXHAUSTED");
      if (is429 && attempt < retries) {
        const waitMs = 5000 * (attempt + 1); // 5s, 10s, 15s backoff
        console.warn(`Rate limited — waiting ${waitMs}ms before retry ${attempt + 1}/${retries}`);
        await sleep(waitMs);
      } else {
        throw err;
      }
    }
  }
}