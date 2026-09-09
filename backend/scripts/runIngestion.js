// scripts/runIngestion.js
import "dotenv/config"; // must be first — loads .env before other imports run
import connectDB from "../config/db.js";
import { crawlPage } from "./scrapeHtml.js";

await connectDB();

const seedUrls = [
  // Academics
  "https://mait.ac.in/index.php/portfolio/fees.html",
  "https://mait.ac.in/index.php/portfolio/syllabus.html",
  "https://mait.ac.in/index.php/portfolio/course-of-study.html",
  "https://mait.ac.in/index.php/portfolio/academic-calendar.html",
  "https://mait.ac.in/index.php/portfolio/scholarships.html",
  "https://mait.ac.in/index.php/portfolio/academy-policy.html",

  // Admissions & institute basics
  "https://mait.ac.in/index.php/abouts/about-us.html",
  "https://mait.ac.in/index.php/component/content/article/admissions-2026-27.html?catid=9&Itemid=384",

  // Facilities
  "https://mait.ac.in/index.php/facilities/hostel.html",
  "https://mait.ac.in/index.php/facilities/library.html",
  "https://mait.ac.in/index.php/facilities/computer-center.html",

  // Placements
  "https://mait.ac.in/index.php/placements/about-placements.html",
  "https://mait.ac.in/index.php/placements/placement-details.html",

  // Departments
  "https://cse.mait.ac.in",
  "https://cseaiml.mait.ac.in",
  "https://cst.mait.ac.in",
  "https://ece.mait.ac.in",
  "https://eevlsi.mait.ac.in",
  "https://eee.mait.ac.in",
  "https://it.mait.ac.in",
  "https://me.mait.ac.in",
  "https://apsc.mait.ac.in",
  "https://mgmt.mait.ac.in",
  "https://bba.mait.ac.in",

  // Contact / policies
  "https://mait.ac.in/index.php/contact-us.html",
];

for (const url of seedUrls) {
  try {
    await crawlPage(url, 2);
  } catch (err) {
    console.error(`Failed on seed ${url}: ${err.message}`);
  }
}

console.log("Ingestion complete.");
process.exit(0);