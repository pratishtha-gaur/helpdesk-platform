import ai, { MODEL_NAME } from "../config/gemini.js";
import ChatLog from "../models/ChatLog.js";
import { findBestFaqMatch } from "../utils/searchFaq.js";
import { findRelevantChunks } from "../utils/searchKnowledge.js";
import { createTicketInternal } from "./ticketController.js";

const ESCALATION_THRESHOLD = 0.15;

export async function handleChatMessage(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Message text is required." });
    }

    console.time("total"); // CHANGED: timing, remove later

    // CHANGED: run both searches at the same time, and use only 3 chunks
    const [{ faq, score }, relevantChunks] = await Promise.all([
      findBestFaqMatch(message),
      findRelevantChunks(message, 3),
    ]);
    console.timeLog("total", "- search done");

    const contextParts = [];
    if (faq) {
      contextParts.push(`Verified FAQ:\nQ: ${faq.question}\nA: ${faq.answer}`);
    }
    relevantChunks.forEach((c) => {
      const tag = [c.section, c.branch, c.semester ? `Sem ${c.semester}` : null]
        .filter(Boolean)
        .join(" - ");
      // CHANGED: trim each chunk so the prompt stays short
      contextParts.push(
        `[${tag}] (source: ${c.sourceUrl}):\n${c.text.slice(0, 800)}`,
      );
    });

    const contextText = contextParts.length
      ? contextParts.join("\n\n")
      : "No matching information was found in the knowledge base for this query.";

    const hasGoodChunkMatch = relevantChunks.length > 0;
    const shouldEscalate = score < ESCALATION_THRESHOLD && !hasGoodChunkMatch;

    const prompt = `
You are a helpful, polite student helpdesk assistant for Maharaja Agrasen
Institute of Technology (MAIT), Delhi, affiliated to GGSIPU.

Rules you MUST follow:
1. Detect the language the student wrote their message in (respond with
   its ISO code, e.g. "en" for English, "hi" for Hindi, "pa" for Punjabi).
2. Reply to the student in THAT SAME language and script.
3. Base your answer ONLY on the context given below (verified FAQ +
   information scraped from the MAIT website). If nothing relevant is
   provided, politely say you don't have that information yet and that
   you're forwarding this to the college staff. Do NOT make up facts,
   numbers, dates, or fee amounts.
4. Keep the answer short, clear, and friendly (2-4 sentences).

Context:
${contextText}

Student's message: "${message}"

Respond ONLY with valid JSON in exactly this format:
{"language": "en", "answer": "your reply here"}
`;

    // CHANGED: ask for JSON directly, cap the length, reduce "thinking"
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 500,
        temperature: 0.3,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    console.timeLog("total", "- gemini done");

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

    const logData = {
      sessionId: sessionId || "anonymous",
      studentQuery: message,
      detectedLanguage: parsed.language || "en",
      matchedFaq: faq ? faq._id : null,
      botResponse: parsed.answer,
      confidenceScore: score,
      wasEscalated: shouldEscalate,
    };

    let ticketCode = null;

    if (shouldEscalate) {
      // Ticket needs the chat log's ID, so we must wait here
      const chatLog = await ChatLog.create(logData);
      const ticket = await createTicketInternal({
        category: faq ? faq.category : "General",
        subject: message.slice(0, 80),
        firstMessage: message,
        sessionId: sessionId || "anonymous",
        sourceChatLog: chatLog._id,
        sender: "student",
      });
      ticket.thread.push({ sender: "bot", text: parsed.answer });
      await ticket.save();
      ticketCode = ticket.ticketCode;
    } else {
      // CHANGED: save the log in the background, don't make the student wait
      ChatLog.create(logData).catch((err) =>
        console.error("ChatLog save failed:", err.message),
      );
    }

    const finalReply = ticketCode
      ? `${parsed.answer}\n\nI've created ticket ${ticketCode} for you — you can track its status anytime on the "Track My Request" page.`
      : parsed.answer;

    console.timeEnd("total");

    return res.status(200).json({
      reply: finalReply,
      language: parsed.language,
      escalated: shouldEscalate,
      ticketCode,
    });
  } catch (error) {
    console.error("Chat controller error:", error.message);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
}
