import ai, { MODEL_NAME } from "../config/gemini.js";
import ChatLog from "../models/ChatLog.js";
import { findBestFaqMatch } from "../utils/searchFaq.js";

const ESCALATION_THRESHOLD = 0.15;

export async function handleChatMessage(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Message text is required." });
    }

    // ---- STEP 1: RETRIEVAL ----
    const { faq, score } = await findBestFaqMatch(message);
    const shouldEscalate = score < ESCALATION_THRESHOLD;

    // ---- STEP 2: BUILD THE PROMPT ----
    const contextText = faq
      ? `Relevant college FAQ:\nQ: ${faq.question}\nA: ${faq.answer}`
      : "No matching FAQ was found in the knowledge base for this query.";

    const prompt = `
You are a helpful, polite student helpdesk assistant for Maharaja Agrasen
Institute of Technology (MAIT), Delhi, affiliated to GGSIPU.

Rules you MUST follow:
1. Detect the language the student wrote their message in (respond with
   its ISO code, e.g. "en" for English, "hi" for Hindi, "pa" for Punjabi).
2. Reply to the student in THAT SAME language and script.
3. Base your answer ONLY on the "Relevant college FAQ" context given below.
   If no relevant FAQ is provided, politely say you don't have that
   information yet and suggest the student contact the college office —
   do NOT make up facts, numbers, or dates.
4. Keep the answer short, clear, and friendly (2-4 sentences).

${contextText}

Student's message: "${message}"

Respond ONLY with valid JSON in exactly this format, nothing else,
no markdown code fences:
{"language": "en", "answer": "your reply here"}
`;

    // ---- STEP 3: GENERATION ----
    // New SDK syntax: ai.models.generateContent({ model, contents })
    // instead of the old model.generateContent(prompt).
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    // In the new SDK, the generated text is available directly as
    // result.text (a property, not a function call like the old SDK).
    const rawText = result.text;

    const cleanedText = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", rawText);
      parsed = {
        language: "en",
        answer:
          "Sorry, I had trouble understanding that. Could you please rephrase your question?",
      };
    }

    // ---- STEP 4: LOG THE CONVERSATION ----
    await ChatLog.create({
      sessionId: sessionId || "anonymous",
      studentQuery: message,
      detectedLanguage: parsed.language || "en",
      matchedFaq: faq ? faq._id : null,
      botResponse: parsed.answer,
      confidenceScore: score,
      wasEscalated: shouldEscalate,
    });

    // ---- STEP 5: RESPOND TO THE FRONTEND ----
    return res.status(200).json({
      reply: parsed.answer,
      language: parsed.language,
      escalated: shouldEscalate,
    });
  } catch (error) {
    console.error("Chat controller error:", error.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
