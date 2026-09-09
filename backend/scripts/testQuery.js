// scripts/testQuery.js
import "dotenv/config";
import connectDB from "../config/db.js";
import { findRelevantChunks } from "../utils/searchKnowledge.js";

await connectDB();

const query = process.argv[2]; // pass your test question as a command-line arg

if (!query) {
  console.log('Usage: node scripts/testQuery.js "your test question here"');
  process.exit(1);
}

console.log(`\nQuery: "${query}"\n`);

const results = await findRelevantChunks(query, 5);

if (results.length === 0) {
  console.log("No relevant chunks found.");
} else {
  results.forEach((chunk, i) => {
    console.log(`--- Match ${i + 1} ---`);
    console.log(`Section: ${chunk.section}${chunk.branch ? " | Branch: " + chunk.branch : ""}${chunk.semester ? " | Sem: " + chunk.semester : ""}`);
    console.log(`Source: ${chunk.sourceUrl}`);
    console.log(`Text: ${chunk.text.slice(0, 300)}...`);
    console.log("");
  });
}

process.exit(0);