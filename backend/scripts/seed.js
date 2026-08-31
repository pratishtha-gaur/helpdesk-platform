import mongoose from "mongoose";
import dotenv from "dotenv";
import Faq from "../models/Faq.js";

dotenv.config();

// ⚠️ IMPORTANT NOTE FOR YOU (the student):
// The figures below (fees, dates, counts) are approximate/illustrative,
// based on publicly available info about MAIT. Before your final
// submission/demo, replace them with the CURRENT, OFFICIAL figures from
// your college notices, mait.ac.in, or the Examination/Accounts branch.
// This matters for your project's credibility in the viva.

const faqData = [
  // ---------------- ADMISSIONS ----------------
  {
    category: "Admissions",
    question: "How can I get admission into MAIT for B.Tech?",
    answer:
      "Admission to the B.Tech program at MAIT is granted through centralized counselling based on your JEE Main rank, conducted under Guru Gobind Singh Indraprastha University (GGSIPU) admission process. Lateral entry (into 2nd year) is available for diploma holders and B.Sc. graduates through a separate counselling round.",
    keywords: ["admission process", "JEE Main", "GGSIPU counselling", "how to join MAIT", "lateral entry"],
  },
  {
    category: "Admissions",
    question: "What is the eligibility criteria for B.Tech admission?",
    answer:
      "Candidates must have passed Class XII with Physics, Chemistry, and Mathematics, securing at least 55% aggregate marks (as per GGSIPU norms), along with a valid JEE Main score.",
    keywords: ["eligibility", "class 12 marks", "PCM"],
  },

  // ---------------- SCHOLARSHIPS ----------------
  {
    category: "Scholarships",
    question: "What scholarships are available for MAIT students?",
    answer:
      "MAIT students from SC/ST/OBC/EWS categories can apply for the GGSIPU Fee Reimbursement Scheme through the Delhi Government's Department of Higher Education. Students can also apply via the National Scholarship Portal (NSP) for central government scholarships. Merit-based scholarships/fee concessions may also be announced by the college — check with the Accounts Office for current schemes.",
    keywords: ["fee reimbursement", "SC ST OBC EWS", "NSP", "financial aid", "scholarship apply"],
  },
  {
    category: "Scholarships",
    question: "How do I apply for the fee reimbursement scholarship?",
    answer:
      "You need to apply online through the Delhi Government's e-District portal or the National Scholarship Portal (scholarships.gov.in), and submit the required category/income certificates. Keep your GGSIPU enrollment number and college bonafide certificate ready before applying.",
    keywords: ["e-district", "scholarships.gov.in", "income certificate", "bonafide certificate"],
  },

  // ---------------- EXAMINATIONS ----------------
  {
    category: "Examinations",
    question: "How are semester exams conducted at MAIT?",
    answer:
      "MAIT follows the GGSIPU semester system. Each semester has Internal Assessment (through class tests, assignments, and attendance) plus an End-Term Examination conducted by the university. Exam datesheets are released by the GGSIPU Examination Division and shared by the college through official notices.",
    keywords: ["exam pattern", "internal assessment", "end term", "datesheet", "GGSIPU exams"],
  },
  {
    category: "Examinations",
    question: "What is the minimum attendance required to sit for exams?",
    answer:
      "As per GGSIPU norms, students must maintain a minimum of 75% attendance in each subject to be eligible to appear for the end-term examination, unless relaxed by the university for valid medical/other reasons.",
    keywords: ["attendance criteria", "75 percent", "detained", "shortage of attendance"],
  },

  // ---------------- FEES ----------------
  {
    category: "Fees",
    question: "How can I pay my semester fee?",
    answer:
      "Semester fees at MAIT are paid online through the college's fee payment portal (linked on mait.ac.in) using net banking, debit/credit card, or UPI, within the deadline announced at the start of each semester. Keep your fee receipt safely as proof of payment.",
    keywords: ["fee payment", "online payment", "fee portal", "fee deadline"],
  },
  {
    category: "Fees",
    question: "What happens if I miss the fee payment deadline?",
    answer:
      "A late fee penalty is usually applicable if the semester fee is paid after the due date. In case of genuine difficulty, students should immediately contact the Accounts Office or their Faculty Counselor to request an extension before the deadline passes.",
    keywords: ["late fee", "fee deadline missed", "fee extension"],
  },

  // ---------------- HOSTEL ----------------
  {
    category: "Hostel",
    question: "Does MAIT provide hostel facilities?",
    answer:
      "MAIT provides on-campus hostel facilities for male students, with single, double, and four-seater rooms available in both AC and non-AC options. Hostel fees include mess charges, and a refundable security deposit is required at the time of admission to the hostel. Seats are limited and allotted on a first-come-first-served basis.",
    keywords: ["boys hostel", "hostel rooms", "hostel fee", "mess", "AC non-AC rooms"],
  },
  {
    category: "Hostel",
    question: "Is hostel accommodation available for female students?",
    answer:
      "Currently, MAIT's on-campus hostel is available for male students only. Female outstation students typically opt for nearby PG (paying guest) accommodations close to the campus in Rohini Sector-22. Contact the Student Welfare Office for a list of recommended options.",
    keywords: ["girls hostel", "female accommodation", "PG near MAIT"],
  },

  // ---------------- GENERAL ----------------
  {
    category: "General",
    question: "Where is MAIT located and how do I contact the college?",
    answer:
      "Maharaja Agrasen Institute of Technology is located at PSP Area, Plot No. 1, Sector-22, Rohini, Delhi-110086. For queries, you can contact the respective department office or email the college through the contact details listed on mait.ac.in.",
    keywords: ["MAIT address", "location", "contact", "Rohini Sector 22"],
  },
  {
    category: "General",
    question: "Which university is MAIT affiliated to?",
    answer:
      "MAIT is affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi, and is approved by AICTE.",
    keywords: ["GGSIPU affiliation", "university", "AICTE approved"],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear existing FAQs first, so re-running this script doesn't create duplicates
    await Faq.deleteMany({});
    console.log("🗑️  Old FAQ data cleared");

    // insertMany saves the whole array in one efficient batch operation
    await Faq.insertMany(faqData);
    console.log(`✅ Inserted ${faqData.length} FAQs into the knowledge base`);

    process.exit(0); // success
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1); // failure
  }
};

seedDatabase();
