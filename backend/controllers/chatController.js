import ai, { MODEL_NAME } from "../config/gemini.js";
import ChatLog from "../models/ChatLog.js";
import { findBestFaqMatch } from "../utils/searchFaq.js";
import { createTicketInternal } from "./ticketController.js";

const ESCALATION_THRESHOLD = 0.15;

export async function handleChatMessage(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Message text is required." });
    }

    const { faq, score } = await findBestFaqMatch(message);
    const shouldEscalate = score < ESCALATION_THRESHOLD;

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
   information yet and that you're forwarding this to the college staff.
   Do NOT make up facts, numbers, or dates.
4. Keep the answer short, clear, and friendly (2-4 sentences).

${contextText}

Student's message: "${message}"

Respond ONLY with valid JSON in exactly this format, nothing else,
no markdown code fences:
{"language": "en", "answer": "your reply here"}
`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

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

    // ---- Save the chat log first, so we have an ID to link the ticket to ----
    const chatLog = await ChatLog.create({
      sessionId: sessionId || "anonymous",
      studentQuery: message,
      detectedLanguage: parsed.language || "en",
      matchedFaq: faq ? faq._id : null,
      botResponse: parsed.answer,
      confidenceScore: score,
      wasEscalated: shouldEscalate,
    });

    // ---- KEY NEW LOGIC: auto-create a real ticket on escalation ----
    let ticketCode = null;
    if (shouldEscalate) {
      const ticket = await createTicketInternal({
        category: faq ? faq.category : "General",
        subject: message.slice(0, 80), // use the start of the message as a short subject
        firstMessage: message,
        sessionId: sessionId || "anonymous",
        sourceChatLog: chatLog._id,
        sender: "student",
      });
      // Also log the bot's auto-reply into the same thread, for context.
      ticket.thread.push({ sender: "bot", text: parsed.answer });
      await ticket.save();

      ticketCode = ticket.ticketCode;
    }

    // If we escalated, make the reply mention the ticket ID so the student
    // has something concrete to hold onto — this is what makes the platform
    // feel reliable even when the AI itself doesn't know the answer.
    const finalReply = ticketCode
      ? `${parsed.answer}\n\nI've created ticket ${ticketCode} for you — you can track its status anytime on the "Track My Request" page.`
      : parsed.answer;

    return res.status(200).json({
      reply: finalReply,
      language: parsed.language,
      escalated: shouldEscalate,
      ticketCode,
    });
  } catch (error) {
    console.error("Chat controller error:", error.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
