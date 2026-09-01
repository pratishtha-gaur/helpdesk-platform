import Faq from "../models/Faq.js";

// A small list of common "filler" words we should ignore while comparing,
// because they appear in almost every sentence and don't help identify topic.
const STOPWORDS = new Set([
  "the", "is", "at", "which", "on", "a", "an", "and", "or", "for", "to",
  "of", "in", "how", "what", "can", "i", "do", "does", "my", "me", "please",
  "hai", "ka", "ki", "ke", "kya", "kaise", "mera", "mujhe", "ko", "se",
]);

// Breaks a sentence into clean, lowercase, meaningful words.
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation like ? , .
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word));
}

/**
 * Searches all FAQs in the database and returns the single best match
 * for the given student query, along with a confidence score (0 to 1).
 *
 * This is a simple but effective "keyword overlap" scoring method:
 * more shared meaningful words = higher score.
 */
export async function findBestFaqMatch(studentQuery) {
  const queryWords = tokenize(studentQuery);

  // If the query has no meaningful words at all, we can't match anything.
  if (queryWords.length === 0) {
    return { faq: null, score: 0 };
  }

  // Fetch all FAQs once. For a small knowledge base (dozens–hundreds of
  // entries) this is fast. At larger scale, this is where real vector
  // search (e.g. MongoDB Atlas Vector Search) would replace this loop.
  const allFaqs = await Faq.find({});

  let bestMatch = null;
  let bestScore = 0;

  for (const faq of allFaqs) {
    // Combine question + keywords into one searchable text blob
    const faqText = `${faq.question} ${faq.keywords.join(" ")}`;
    const faqWords = new Set(tokenize(faqText));

    // Count how many query words also appear in this FAQ's words
    let overlapCount = 0;
    for (const word of queryWords) {
      if (faqWords.has(word)) overlapCount++;
    }

    // Normalize: what fraction of the STUDENT's words were matched?
    const score = overlapCount / queryWords.length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return { faq: bestMatch, score: bestScore };
}
