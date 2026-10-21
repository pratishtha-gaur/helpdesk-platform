import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const TOPICS = [
  {
    label: "Admissions",
    category: "Admissions",
    desc: "JEE Main & GGSIPU counselling, cutoffs, eligibility criteria, and lateral entry procedures.",
    icon: "🎓",
    tags: ["JEE Main", "GGSIPU Counselling", "Cutoffs", "Lateral Entry"],
    accent: "navy",
  },
  {
    label: "Scholarships",
    category: "Scholarships",
    desc: "Delhi Govt e-district portal, NSP schemes, merit-cum-means, SC/ST/OBC/EWS fee waivers.",
    icon: "🎗️",
    tags: ["e-District Delhi", "NSP Portal", "Fee Waiver", "EWS Support"],
    accent: "gold",
  },
  {
    label: "Examinations",
    category: "Examinations",
    desc: "Semester datesheets, 75% attendance criteria, admit cards, practicals, and re-evaluation.",
    icon: "📝",
    tags: ["Datesheet", "Admit Cards", "75% Attendance", "Re-eval"],
    accent: "teal",
  },
  {
    label: "Fees & Dues",
    category: "Fees",
    desc: "Academic fee structure, online payment gateways, bank challans, deadlines, and no-dues.",
    icon: "💳",
    tags: ["Payment Portal", "Challan", "Deadlines", "No-Dues"],
    accent: "gold",
  },
  {
    label: "Hostel & Campus",
    category: "Hostel",
    desc: "Hostel room allotment, mess menu & charges, curfew timings, medical room, and leave passes.",
    icon: "🏠",
    tags: ["Allotment", "Mess Fee", "Curfew Rules", "Leave Pass"],
    accent: "navy",
  },
  {
    label: "General Administration",
    category: "General",
    desc: "Bonafide certificates, railway concessions, ID card re-issue, library, and campus amenities.",
    icon: "🏛️",
    tags: ["Bonafide", "ID Cards", "Library", "Bus/Metro Pass"],
    accent: "teal",
  },
];

function Home() {
  return (
    <div className="page">
      <Navbar />

      {/* ---- HERO SECTION ---- */}
      <section className="hero">
        <div className="hero-ambient-glow hero-glow-1" />
        <div className="hero-ambient-glow hero-glow-2" />

        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-eyebrow-crest">
              <img src="/mait-logo.png" alt="MAIT Crest" />
              <span>Official Student Helpdesk • MAIT Delhi (GGSIPU)</span>
              <span className="hero-eyebrow-pill">24×7 Active</span>
            </div>

            <h1 className="hero-title">
              Your Campus Queries, Solved In <em>Your Language</em>.
            </h1>

            <p className="hero-subtext">
              The unified student support portal for Maharaja Agrasen Institute of
              Technology. Get instant, verified guidance for admissions, examinations,
              fees, and hostel life in English, Hindi, or Punjabi — or raise an official
              ticket tracked right to staff resolution.
            </p>

            <div className="hero-actions">
              <Link to="/chat" className="btn btn-primary">
                <span className="btn-icon">💬</span>
                <span>Ask AI Assistant</span>
              </Link>
              <Link to="/portal" className="btn btn-secondary">
                <span className="btn-icon">📚</span>
                <span>Browse Help Center</span>
              </Link>
              <Link to="/track" className="btn btn-ghost">
                <span className="btn-icon">🔍</span>
                <span>Track Request</span>
              </Link>
            </div>

            {/* University Trust Metrics */}
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>6+</strong>
                <span>Departments Covered</span>
              </div>
              <div className="hero-stat">
                <strong>24×7</strong>
                <span>AI Grounded Answers</span>
              </div>
              <div className="hero-stat">
                <strong>3+</strong>
                <span>Languages (EN, HI, PA)</span>
              </div>
              <div className="hero-stat">
                <strong>100%</strong>
                <span>Trackable Resolution</span>
              </div>
            </div>
          </div>

          {/* Interactive Chat Mockup Card */}
          <div className="hero-preview-wrapper">
            <Link
              to="/chat"
              className="hero-preview"
              aria-label="Start a conversation with the MAIT Assistant"
            >
              <div className="hero-preview-header">
                <div className="hero-preview-avatar">
                  <img src="/mait-logo.png" alt="MAIT" className="preview-avatar-img" />
                </div>
                <div className="hero-preview-info">
                  <div className="hero-preview-title">MAIT Virtual Assistant</div>
                  <div className="hero-preview-status">
                    <span className="pulse-dot-green"></span>
                    <span>Online • Grounded on Official Guidelines</span>
                  </div>
                </div>
                <span className="hero-preview-badge">Multilingual</span>
              </div>

              <div className="hero-preview-body">
                <div className="message-row bot">
                  <div className="message-bubble bot">
                    <span className="bubble-sender">MAIT Assistant</span>
                    Namaste! Ask me about admissions, fees, exams, scholarships, or hostel — in English, हिन्दी, or ਪੰਜਾਬੀ.
                  </div>
                </div>

                <div className="message-row student">
                  <div className="message-bubble student">
                    Hostel fee submission ki deadline kya hai?
                  </div>
                </div>

                <div className="message-row bot">
                  <div className="message-bubble bot">
                    <span className="bubble-sender">MAIT Assistant</span>
                    Odd semester hostel fees are accepted till 31st July without fine. Payment can be made online via the official ERP portal or bank challan.
                  </div>
                </div>
              </div>

              <div className="hero-preview-chips">
                <span className="hero-preview-chip">📅 Exam Datesheet</span>
                <span className="hero-preview-chip">💳 Fee Structure</span>
                <span className="hero-preview-chip">🏠 Hostel Rules</span>
              </div>

              <div className="hero-preview-inputbar">
                <span className="input-placeholder">Type question in Hindi or English...</span>
                <span className="input-action-arrow">↵</span>
              </div>
            </Link>

            <div className="hero-preview-floating-card">
              <span className="floating-card-icon">⚡</span>
              <div>
                <strong>Instant Verified Knowledge</strong>
                <p>Synced with official MAIT &amp; GGSIPU notices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- TOPIC DOMAINS GRID ---- */}
      <section className="topics">
        <div className="topics-head">
          <div className="section-badge-wrapper">
            <span className="section-badge">SUPPORT DOMAINS</span>
            <h2>Browse Knowledge Base by Topic</h2>
          </div>
          <Link to="/portal" className="browse-all-link">
            <span>View All FAQs</span>
            <span className="arrow-icon">→</span>
          </Link>
        </div>

        <div className="topic-grid">
          {TOPICS.map((topic) => (
            <Link
              to={`/portal?category=${encodeURIComponent(topic.category)}`}
              key={topic.label}
              className={`topic-card accent-${topic.accent}`}
            >
              <div className="topic-card-top">
                <div className="topic-icon">
                  {topic.icon}
                </div>
                <span className="topic-category-pill">{topic.category}</span>
              </div>

              <div className="topic-card-content">
                <h4>{topic.label}</h4>
                <p>{topic.desc}</p>
              </div>

              <div className="topic-card-tags">
                {topic.tags.map((tag) => (
                  <span key={tag} className="topic-tag-chip">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="topic-card-footer">
                <span className="topic-action-label">Explore category</span>
                <span className="topic-action-icon">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- THREE PILLARS (CORE SERVICES) ---- */}
      <section className="pillars-section">
        <div className="pillars-container">
          <div className="section-badge-wrapper center-badge">
            <span className="section-badge">HOW WE ASSIST</span>
            <h2>Three Ways to Get Help at MAIT</h2>
            <p className="section-subtext">
              Whether you need an instant answer, want to browse official college policies, or need
              administrative staff escalation — we have you covered.
            </p>
          </div>

          <div className="pillars">
            <div className="pillar pillar-teal">
              <div className="pillar-header">
                <div className="pillar-icon">📚</div>
                <span className="pillar-tag">Self-Service</span>
              </div>
              <h3>Verified Help Center</h3>
              <p>
                Browse verified answers across all categories. Filter by admissions,
                examinations, fees, or hostel rules. No account or conversation required.
              </p>
              <Link to="/portal" className="pillar-link">
                <span>Browse the Help Center</span>
                <span className="arrow-icon">→</span>
              </Link>
            </div>

            <div className="pillar pillar-gold featured-pillar">
              <div className="pillar-header">
                <div className="pillar-icon">🤖</div>
                <span className="pillar-tag gold-tag">Multilingual AI</span>
              </div>
              <h3>Conversational Assistant</h3>
              <p>
                Ask naturally in English, Hindi, or Punjabi. Grounded in official MAIT
                circulars and college guidelines with no guesswork.
              </p>
              <Link to="/chat" className="pillar-link gold-link">
                <span>Start a Conversation</span>
                <span className="arrow-icon">→</span>
              </Link>
            </div>

            <div className="pillar pillar-navy">
              <div className="pillar-header">
                <div className="pillar-icon">🎫</div>
                <span className="pillar-tag">Faculty &amp; Staff</span>
              </div>
              <h3>Track a Request</h3>
              <p>
                Questions that require faculty intervention automatically generate a unique
                ticket code. Follow your issue in real time through to resolution.
              </p>
              <Link to="/track" className="pillar-link">
                <span>Track My Request</span>
                <span className="arrow-icon">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- HOW IT WORKS TIMELINE ---- */}
      <section className="how-it-works">
        <div className="section-badge-wrapper center-badge">
          <span className="section-badge">RESOLUTION LIFECYCLE</span>
          <h2>How Student Queries Get Resolved</h2>
        </div>

        <ol className="steps-timeline">
          <li className="step-card">
            <div className="step-indicator">
              <span className="step-index">01</span>
              <span className="step-line" />
            </div>
            <div className="step-body">
              <div className="step-icon">🗣️</div>
              <h4>Ask in your everyday language</h4>
              <p>
                Type questions like <em>"Hostel refund process kya hai?"</em> or in standard
                English. Our multilingual AI interprets your intent instantly.
              </p>
            </div>
          </li>

          <li className="step-card">
            <div className="step-indicator">
              <span className="step-index">02</span>
              <span className="step-line" />
            </div>
            <div className="step-body">
              <div className="step-icon">🎯</div>
              <h4>Instant verified answer or ticket creation</h4>
              <p>
                If the query matches verified MAIT records, you receive an immediate response. If
                it requires official approval, a ticket is logged automatically.
              </p>
            </div>
          </li>

          <li className="step-card">
            <div className="step-indicator">
              <span className="step-index">03</span>
            </div>
            <div className="step-body">
              <div className="step-icon">✅</div>
              <h4>Staff follow-up &amp; transparent tracking</h4>
              <p>
                Concerned department staff review the ticket in their portal, draft an official
                response, and update your case to Resolved.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* ---- CAMPUS DIRECTORY / QUICK CONTACT SECTION ---- */}
      <section className="campus-directory-section">
        <div className="directory-inner">
          <div className="directory-header">
            <div>
              <span className="section-badge">CAMPUS DESK</span>
              <h3>Need In-Person or Department Assistance?</h3>
              <p>
                Administrative offices are open Monday to Saturday (9:00 AM – 5:00 PM) at Sector 22 Rohini campus.
              </p>
            </div>
            <Link to="/submit" className="btn btn-primary">
              <span className="btn-icon">✍️</span>
              <span>Submit a Direct Request</span>
            </Link>
          </div>

          <div className="directory-cards">
            <div className="directory-card">
              <div className="dir-icon">📍</div>
              <div>
                <h5>Campus Location</h5>
                <p>PSP Area, Plot No. 1, Sector-22, Rohini, Delhi-110086 (Near Rithala Metro)</p>
              </div>
            </div>

            <div className="directory-card">
              <div className="dir-icon">✉️</div>
              <div>
                <h5>Helpdesk Email</h5>
                <p>helpdesk@mait.ac.in • principal@mait.ac.in</p>
              </div>
            </div>

            <div className="directory-card">
              <div className="dir-icon">🛡️</div>
              <div>
                <h5>Student Welfare &amp; Proctorial</h5>
                <p>Anti-Ragging Squad, Dean Student Welfare (Block 1, Ground Floor)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-crest-wrapper">
              <img src="/mait-logo.png" alt="MAIT crest" />
            </div>
            <div>
              <h4>Maharaja Agrasen Institute of Technology</h4>
              <p className="footer-tagline">
                Approved by AICTE &amp; Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi.
              </p>
              <p className="footer-address">
                PSP Area, Plot No. 1, Sector-22, Rohini, Delhi-110086.
              </p>
            </div>
          </div>

          <div className="footer-col">
            <h5>Navigation</h5>
            <ul>
              <li>
                <Link to="/">Home Overview</Link>
              </li>
              <li>
                <Link to="/chat">Ask AI Assistant</Link>
              </li>
              <li>
                <Link to="/portal">Help Center FAQs</Link>
              </li>
              <li>
                <Link to="/submit">Raise a Request</Link>
              </li>
              <li>
                <Link to="/track">Track Ticket</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Support Domains</h5>
            <ul>
              <li><Link to="/portal?category=Admissions">Admissions &amp; Counselling</Link></li>
              <li><Link to="/portal?category=Examinations">Examinations &amp; Datesheets</Link></li>
              <li><Link to="/portal?category=Fees">Fee Structure &amp; Challans</Link></li>
              <li><Link to="/portal?category=Scholarships">Scholarships &amp; Waivers</Link></li>
              <li><Link to="/portal?category=Hostel">Hostel Allotment &amp; Mess</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Staff &amp; Admin</h5>
            <ul>
              <li>
                <Link to="/staff-login" className="footer-staff-link">
                  🔐 Staff Portal Login
                </Link>
              </li>
              <li>
                <Link to="/admin">Staff Dashboard</Link>
              </li>
              <li className="footer-contact-item">
                <strong>Helpdesk Hours:</strong>
                <span>Mon – Sat, 9 AM – 5 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Maharaja Agrasen Institute of Technology. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <span>Official GGSIPU Affiliated Institute</span>
            <span>•</span>
            <span>ISO 9001:2015 Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

