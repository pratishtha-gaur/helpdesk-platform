import Faq from "../models/Faq.js";

/**
 * GET /api/faqs
 * Optional query params:
 *   ?category=Hostel        -> only FAQs in that category
 *   ?search=fee deadline    -> only FAQs matching this text
 * Used by the self-service portal to browse/search FAQs directly,
 * without going through the chatbot at all.
 */
export async function getFaqs(req, res) {
  try {
    const { category, search } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search && search.trim() !== "") {
      // $regex with "i" option = case-INsensitive text search.
      // $or means "match if EITHER the question OR keywords contain this text."
      filter.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
        { keywords: { $regex: search, $options: "i" } },
      ];
    }

    const faqs = await Faq.find(filter).sort({ category: 1 });
    return res.status(200).json({ faqs });
  } catch (error) {
    console.error("Get FAQs error:", error.message);
    return res.status(500).json({ error: "Failed to fetch FAQs." });
  }
}

/**
 * GET /api/faqs/categories
 * Returns the list of distinct categories that actually exist in the
 * database — so the frontend's filter tabs always match real data.
 */
export async function getCategories(req, res) {
  try {
    const categories = await Faq.distinct("category");
    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Get categories error:", error.message);
    return res.status(500).json({ error: "Failed to fetch categories." });
  }
}
