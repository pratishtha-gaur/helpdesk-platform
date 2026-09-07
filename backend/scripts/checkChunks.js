import "dotenv/config";
import connectDB from "../config/db.js";
import KnowledgeChunk from "../models/KnowledgeChunk.js";

await connectDB();

const total = await KnowledgeChunk.countDocuments();
const sections = await KnowledgeChunk.distinct("section");
const sourceTypes = await KnowledgeChunk.distinct("sourceType");

console.log(`Total chunks: ${total}`);
console.log(`Sections found: ${sections.join(", ")}`);
console.log(`Source types: ${sourceTypes.join(", ")}`);

process.exit(0);