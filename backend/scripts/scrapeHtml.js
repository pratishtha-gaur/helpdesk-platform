// scripts/scrapeHtml.js
import axios from "axios";
import * as cheerio from "cheerio";
import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { embedText } from "../config/embeddings.js";
import { scrapePdfDoc } from "./scrapePdf.js";

const ALLOWED_DOMAINS = ["mait.ac.in", "cse.mait.ac.in", "cseaiml.mait.ac.in",
  "cst.mait.ac.in", "ece.mait.ac.in", "eevlsi.mait.ac.in", "eee.mait.ac.in",
  "it.mait.ac.in", "me.mait.ac.in", "apsc.mait.ac.in", "mgmt.mait.ac.in",
  "bba.mait.ac.in"];

const visited = new Set();

function isAllowed(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return ALLOWED_DOMAINS.includes(host);
  } catch {
    return false;
  }
}

function chunkText(text, maxWords = 200) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }
  return chunks;
}

// Guesses a "section" label from the URL path — good enough for filtering later.
function guessSection(url) {
  const u = url.toLowerCase();
  if (u.includes("fee")) return "Fees";
  if (u.includes("syllabus")) return "Syllabus";
  if (u.includes("admission")) return "Admissions";
  if (u.includes("scholarship")) return "Scholarships";
  if (u.includes("hostel")) return "Hostel";
  if (u.includes("placement")) return "Placements";
  if (u.includes("calendar")) return "Academic Calendar";
  if (u.includes("exam")) return "Examinations";
  return "General";
}

// Extracts and resolves all links from a loaded cheerio page.
function extractLinks($, baseUrl) {
  const links = new Set();
  $("a[href]").each((_, el) => {
    let href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      href = new URL(href, baseUrl).href.split("#")[0]; // resolve relative URLs, strip fragments
      links.add(href);
    } catch {
      /* ignore malformed */
    }
  });
  return links;
}

// Follows a set of links: PDFs go to the PDF ingester (skip if already done),
// HTML pages recurse into crawlPage (depth-limited).
async function followLinks(links, depth) {
  for (const link of links) {
    if (!isAllowed(link)) continue;

    if (link.toLowerCase().endsWith(".pdf")) {
      if (visited.has(link)) continue;
      visited.add(link);

      const pdfAlreadyDone = await KnowledgeChunk.exists({ sourceUrl: link });
      if (pdfAlreadyDone) {
        console.log(`[SKIP] PDF already ingested — ${link}`);
        continue;
      }

      await scrapePdfDoc(link, guessSection(link)).catch((e) =>
        console.warn(`Skipped PDF: ${link} — ${e.message}`)
      );
    } else if (link.endsWith(".html") || link.match(/\.html\?/) || !link.match(/\.\w{2,4}$/)) {
      await crawlPage(link, depth - 1);
    }
  }
}

export async function crawlPage(url, depth = 2) {
  if (visited.has(url) || depth < 0 || !isAllowed(url)) return;
  visited.add(url);

  let data;
  try {
    const res = await axios.get(url, { timeout: 15000 });
    data = res.data;
  } catch (err) {
    console.warn(`Skipped (fetch failed): ${url} — ${err.message}`);
    return;
  }

  const $ = cheerio.load(data);

  // If this page's content was already embedded in a previous run, don't
  // re-embed it — but still follow its links so the crawl can continue
  // discovering new pages/PDFs reachable from here.
  const alreadyIngested = await KnowledgeChunk.exists({ sourceUrl: url });
  if (alreadyIngested) {
    console.log(`[SKIP] Already ingested — ${url}`);
    const links = extractLinks($, url);
    await followLinks(links, depth);
    return;
  }

  $("script, style, nav, footer, header").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();

  const section = guessSection(url);
  const chunks = chunkText(text).filter((c) => c.length > 30);

  for (const chunk of chunks) {
    const embedding = await embedText(chunk);
    await KnowledgeChunk.create({ sourceUrl: url, sourceType: "html", section, text: chunk, embedding });
    await new Promise((r) => setTimeout(r, 1000)); // pace embedding calls, avoid 429s
  }
  console.log(`[HTML] ${chunks.length} chunks — ${url}`);

  const links = extractLinks($, url);
  await followLinks(links, depth);
}