import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

// Each "category" value below must exactly match one of the CATEGORIES
// used in HelpCenter.jsx (and the Faq schema enum in
// backend/models/Faq.js), so clicking a card opens that exact filtered
// section of the Help Center instead of the unfiltered "All" view.
const TOPICS = [
  {
    label: "Admissions",
    category: "Admissions",
    desc: "JEE Main & GGSIPU counselling, eligibility, lateral entry.",
    icon: "🎓",
    bg: "var(--navy-100)",
  },
  {
    label: "Scholarships",
    category: "Scholarships",
    desc: "Fee reimbursement, NSP, SC/ST/OBC/EWS schemes.",
    icon: "🎗️",
    bg: "var(--gold-100)",
  },
  {
    label: "Examinations",
    category: "Examinations",
    desc: "Semester pattern, attendance rules, datesheets.",
    icon: "📝",
    bg: "var(--teal-100)",
  },
  {
    label: "Fees",
    category: "Fees",
    desc: "Fee payment, deadlines, late fee policy.",
    icon: "💳",
    bg: "var(--gold-100)",
  },
  {
    label: "Hostel",
    category: "Hostel",
    desc: "Room types, mess charges, allotment process.",
    icon: "🏠",
    bg: "var(--navy-100)",
  },
  {
    label: "General",
    category: "General",
    desc: "Contact details, campus location, affiliation.",
    icon: "🏛️",
    bg: "var(--teal-100)",
  },
];

function Home() {
  return (
    <div className="page">
      <Navbar />

      {/* ---- HERO ---- */}
      <section className="hero">
        <svg
          className="hero-rings"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="100"
            cy="100"
            rx="95"
            ry="38"
            stroke="#d4a24f"
            strokeWidth="1.4"
            transform="rotate(20 100 100)"
          />
          <ellipse
            cx="100"
            cy="100"
            rx="95"
            ry="38"
            stroke="#d4a24f"
            strokeWidth="1.4"
            transform="rotate(80 100 100)"
          />
          <ellipse
            cx="100"
            cy="100"
            rx="95"
            ry="38"
            stroke="#d4a24f"
            strokeWidth="1.4"
            transform="rotate(140 100 100)"
          />
          <circle cx="100" cy="100" r="8" fill="#d4a24f" />
        </svg>

        <div className="hero-inner">
          <div>
            <span className="hero-eyebrow-crest">
              <img src="/mait-logo.png" alt="" />
              <span>Official student helpdesk of MAIT, GGSIPU</span>
            </span>

            <h1>
              Ask once, in <em>your language</em> — get an answer you can trust.
            </h1>
            <p className="hero-subtext">
              One place for admissions, exams, fees, scholarships, and hostel
              queries. Ask the assistant in the language you're most comfortable
              in, browse verified answers yourself, or raise a request and track
              it through to resolution.
            </p>

            <div className="hero-actions">
              <Link to="/chat" className="btn btn-primary">
                Ask a question
              </Link>
              <Link to="/portal" className="btn btn-secondary">
                Browse the Help Center
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>6</strong>
                <span>departments covered</span>
              </div>
              <div className="hero-stat">
                <strong>24×7</strong>
                <span>assistant availability</span>
              </div>
            </div>
          </div>

          <Link
            to="/chat"
            className="hero-preview"
            aria-label="Start a conversation with the MAIT Assistant"
          >
            <div className="hero-preview-header">
              <div className="hero-preview-avatar">M</div>
              <div>
                <h4>MAIT Assistant</h4>
                <div className="hero-preview-status">Online</div>
              </div>
            </div>
            <div className="hero-preview-body">
              <div className="message-row bot">
                <div className="message-bubble bot">
                  Hi! Ask me about admissions, fees, exams, or hostel — in
                  whichever language you're comfortable in.
                </div>
              </div>
              <div className="message-row student">
                <div className="message-bubble student">
                  What's the hostel fee?
                </div>
              </div>
              <div className="message-row bot">
                <div className="message-bubble bot">
                  Hostel fees include mess charges plus a refundable security
                  deposit — the exact amount depends on the room type you
                  choose.
                </div>
              </div>
            </div>
            <div className="hero-preview-chips">
              <span className="hero-preview-chip">Fee structure</span>
              <span className="hero-preview-chip">Track my request</span>
            </div>
            <div className="hero-preview-inputbar">
              Type your question here…
            </div>
          </Link>
        </div>
      </section>

      {/* ---- TOPIC GRID ---- */}
      <section className="topics">
        <div className="topics-head">
          <h2>Browse by topic</h2>
          <Link to="/portal" className="pillar-link">
            View the full Help Center
          </Link>
        </div>
        <div className="topic-grid">
          {TOPICS.map((topic) => (
            <Link
              to={`/portal?category=${encodeURIComponent(topic.category)}`}
              key={topic.label}
              className="topic-card"
            >
              <div className="topic-icon" style={{ background: topic.bg }}>
                {topic.icon}
              </div>
              <div>
                <h4>{topic.label}</h4>
                <p>{topic.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- THREE PILLARS ---- */}
      <section className="pillars">
        <div className="pillar pillar-teal">
          <h3>Help Center</h3>
          <p>
            Search or browse verified answers on admissions, scholarships,
            exams, fees, and hostel life — organized by category, no
            conversation required.
          </p>
          <Link to="/portal" className="pillar-link">
            Browse the Help Center
          </Link>
        </div>

        <div className="pillar pillar-gold">
          <h3>Ask the Assistant</h3>
          <p>
            Type your question in English, Hindi, or Punjabi and get an answer
            grounded in official college information — not a guess.
          </p>
          <Link to="/chat" className="pillar-link">
            Start a conversation
          </Link>
        </div>

        <div className="pillar pillar-navy">
          <h3>Track a Request</h3>
          <p>
            Anything the assistant can't resolve becomes a real ticket with its
            own ID, so you can follow it through to a staff response.
          </p>
          <Link to="/track" className="pillar-link">
            Track my request
          </Link>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className="how-it-works">
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <span className="step-index">1</span>
            <div>
              <h4>Ask, in your own language</h4>
              <p>
                Type your question the way you'd naturally ask it — no need to
                translate to English first.
              </p>
            </div>
          </li>
          <li>
            <span className="step-index">2</span>
            <div>
              <h4>Get a grounded answer, or a ticket</h4>
              <p>
                If the knowledge base has a verified answer, you get it
                immediately. If not, a ticket is raised automatically.
              </p>
            </div>
          </li>
          <li>
            <span className="step-index">3</span>
            <div>
              <h4>Follow it through to resolution</h4>
              <p>
                Track your ticket's status anytime, and see the staff's reply
                the moment it's added.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/mait-logo.png" alt="MAIT crest" />
            <div>
              <h4>Maharaja Agrasen Institute of Technology</h4>
              <p>
                PSP Area, Plot No. 1, Sector-22, Rohini, Delhi-110086.
                Affiliated to GGSIPU.
              </p>
            </div>
          </div>

          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/portal">Help Center</Link>
              </li>
              <li>
                <Link to="/track">Track Request</Link>
              </li>
              <li>
                <Link to="/chat">Ask a Question</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Student Services</h5>
            <ul>
              <li>Admissions</li>
              <li>Examinations</li>
              <li>Fees &amp; Scholarships</li>
              <li>Hostel</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li>helpdesk@mait.ac.in</li>
              <li>Sector 22, Rohini, Delhi – 110086</li>
              <li>Mon – Sat, 9:00 AM – 5:00 PM</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Staff</h5>
            <ul>
              <li>
                <Link to="/admin">Staff Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer-bottom">
          © {new Date().getFullYear()} MAIT Student Helpdesk. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
