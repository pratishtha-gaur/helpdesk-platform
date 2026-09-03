import ChatLog from "../models/ChatLog.js";

/**
 * GET /api/analytics/summary
 * Returns overall stats + breakdowns for dashboard cards and charts.
 */
export async function getSummary(req, res) {
  try {
    // ---- Simple counts ----
    // countDocuments({}) = count everything.
    // countDocuments({ wasEscalated: true }) = count only matching documents.
    const totalChats = await ChatLog.countDocuments({});
    const escalatedCount = await ChatLog.countDocuments({ wasEscalated: true });
    const unresolvedCount = await ChatLog.countDocuments({
      wasEscalated: true,
      resolved: false,
    });

    // ---- Language breakdown (aggregation pipeline) ----
    // Think of this like: "group all chat logs by their detectedLanguage,
    // and count how many are in each group."
    const languageBreakdown = await ChatLog.aggregate([
      {
        $group: {
          _id: "$detectedLanguage", // group by this field
          count: { $sum: 1 }, // add 1 for every document in the group
        },
      },
      { $sort: { count: -1 } }, // sort by count, highest first
    ]);

    // ---- Category breakdown ----
    // matchedFaq only stores an ID, not the full FAQ. $lookup is MongoDB's
    // version of a SQL "JOIN" — it fetches the linked Faq document so we
    // can group by its category.
    const categoryBreakdown = await ChatLog.aggregate([
      {
        $lookup: {
          from: "faqs", // the actual MongoDB collection name (lowercase, plural)
          localField: "matchedFaq",
          foreignField: "_id",
          as: "faqDetails",
        },
      },
      // $lookup always returns an array (even if 1 match) — $unwind flattens
      // it back into a single object per document, skipping ones with no match.
      { $unwind: { path: "$faqDetails", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: "$faqDetails.category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // ---- Most frequently asked questions ----
    // Groups by the matched FAQ's question text, so staff can see what
    // students ask most — useful for prioritizing what to update/expand.
    const topQuestions = await ChatLog.aggregate([
      {
        $lookup: {
          from: "faqs",
          localField: "matchedFaq",
          foreignField: "_id",
          as: "faqDetails",
        },
      },
      { $unwind: { path: "$faqDetails", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: "$faqDetails.question",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 }, // only the top 5
    ]);

    return res.status(200).json({
      totalChats,
      escalatedCount,
      unresolvedCount,
      languageBreakdown,
      categoryBreakdown,
      topQuestions,
    });
  } catch (error) {
    console.error("Analytics summary error:", error.message);
    return res.status(500).json({ error: "Failed to fetch analytics." });
  }
}

/**
 * GET /api/analytics/escalated
 * Returns the list of escalated queries staff need to review,
 * most recent first. Supports an optional ?status=unresolved filter.
 */
export async function getEscalatedQueries(req, res) {
  try {
    const { status } = req.query; // e.g. /api/analytics/escalated?status=unresolved

    const filter = { wasEscalated: true };
    if (status === "unresolved") filter.resolved = false;
    if (status === "resolved") filter.resolved = true;

    const queries = await ChatLog.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .limit(100); // safety cap, avoid pulling huge amounts of data

    return res.status(200).json({ queries });
  } catch (error) {
    console.error("Fetch escalated queries error:", error.message);
    return res.status(500).json({ error: "Failed to fetch escalated queries." });
  }
}

/**
 * PATCH /api/analytics/escalated/:id/resolve
 * Marks one escalated chat log as resolved, optionally with a staff note.
 */
export async function resolveEscalation(req, res) {
  try {
    const { id } = req.params; // the ChatLog document's ID, from the URL
    const { staffNote } = req.body;

    // findByIdAndUpdate: find the document by ID and update given fields.
    // { new: true } means "return the UPDATED document, not the old one."
    const updated = await ChatLog.findByIdAndUpdate(
      id,
      { resolved: true, staffNote: staffNote || "" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Chat log not found." });
    }

    return res.status(200).json({ message: "Marked as resolved.", chatLog: updated });
  } catch (error) {
    console.error("Resolve escalation error:", error.message);
    return res.status(500).json({ error: "Failed to resolve escalation." });
  }
}
