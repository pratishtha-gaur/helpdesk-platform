// scripts/scrapePdf.js
import axios from "axios";
import { createRequire } from "module";
import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { embedText } from "../config/embeddings.js";

const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");
const pdf = pdfModule.default || pdfModule; // handles both export shapes across versions

export async function scrapePdfDoc(url, section, branch = null, semester = null) {
  // Skip if this PDF was already ingested in a previous run
  const alreadyIngested = await KnowledgeChunk.exists({ sourceUrl: url });
  if (alreadyIngested) {
    console.log(`[SKIP] PDF already ingested — ${url}`);
    return;
  }

  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  const parsed = await pdf(data);
  const text = parsed.text.replace(/\s+/g, " ").trim();

  const chunks = text.match(/.{1,1200}(\s|$)/g) || [text];

  for (const chunk of chunks) {
    if (chunk.trim().length < 30) continue;
    const embedding = await embedText(chunk);
    await KnowledgeChunk.create({
      sourceUrl: url,
      sourceType: "pdf",
      section,
      branch,
      semester,
      text: chunk,
      embedding,
    });
    await new Promise((r) => setTimeout(r, 1000)); // pace embedding calls, avoid 429s
  }
  console.log(`[PDF] ${chunks.length} chunks — ${url}`);
}