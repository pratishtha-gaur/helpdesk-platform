import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Creates a connection object using your secret API key from .env.
// (Note: Google replaced the old "@google/generative-ai" package with this
// new unified "@google/genai" SDK — if you ever see a 404 "model not found"
// error again in the future, it usually means Google renamed/retired a
// model version. Check https://ai.google.dev/gemini-api/docs/models for
// the current list and update MODEL_NAME below.)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const MODEL_NAME = "gemini-3.6-flash";
export default ai;
