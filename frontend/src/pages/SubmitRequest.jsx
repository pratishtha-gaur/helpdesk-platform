import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const BACKEND_URL = "http://localhost:5050";
const CATEGORIES = [
  "Admissions",
  "Scholarships",
  "Examinations",
  "Fees",
  "Hostel",
  "General",
];

function SubmitRequest() {
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (subject.trim() === "" || description.trim() === "") {
      setError("Please fill in both the subject and detailed description.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address to receive updates.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, description, email }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      navigate(`/track?code=${data.ticket.ticketCode}`);
    } catch {
      setError(
        "Something went wrong submitting your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page submit-page-wrapper">
      <Navbar />

      <main className="form-shell-wide">
        <div className="portal-intro">
          <div className="section-badge-wrapper center-badge">
            <span className="section-badge">
              STUDENT GRIEVANCE &amp; SUPPORT
            </span>
            <h1>Raise an Official Request</h1>
            <p>
              Submit your inquiry or issue directly to the concerned MAIT
              departmental staff.
            </p>
          </div>
        </div>

        <div className="form-layout-grid">
          {/* Main Form */}
          <div className="form-main-card">
            <form onSubmit={handleSubmit} className="submit-form-modern">
              <div className="form-field-group">
                <label htmlFor="ticket-email">
                  <span className="field-label-text">Your Email Address</span>
                  <span className="field-required">*</span>
                </label>
                <input
                  id="ticket-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., yourname@gmail.com"
                  autoComplete="email"
                />
                <span className="field-hint">
                  We will email your ticket ID now, and the answer once it is
                  resolved
                </span>
              </div>
              <div className="form-field-group">
                <label htmlFor="ticket-category">
                  <span className="field-label-text">
                    Category / Department
                  </span>
                  <span className="field-required">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="ticket-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              <div className="form-field-group">
                <label htmlFor="ticket-subject">
                  <span className="field-label-text">
                    Subject / Brief Summary
                  </span>
                  <span className="field-required">*</span>
                </label>
                <input
                  id="ticket-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., 'Hostel room cooler permission' or 'Fee challan verification'"
                  maxLength={120}
                />
                <span className="field-hint">
                  A concise title summarizing your request
                </span>
              </div>

              <div className="form-field-group">
                <label htmlFor="ticket-description">
                  <span className="field-label-text">Detailed Explanation</span>
                  <span className="field-required">*</span>
                </label>
                <textarea
                  id="ticket-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please state your Enrollment Number, Branch/Year, and full details of your request so staff can resolve it efficiently..."
                  rows={6}
                />
                <span className="field-hint">
                  Tip: Include your Enrollment No. &amp; contact info for faster
                  resolution
                </span>
              </div>

              {error && (
                <div className="form-error-alert">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="submit-action-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="btn-loading-state">
                    <span className="btn-spinner" />
                    <span>Submitting Request…</span>
                  </span>
                ) : (
                  <>
                    <span>Submit Official Request</span>
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Side Guidance Card */}
          <aside className="form-side-info">
            <div className="side-info-card">
              <div className="side-card-header">
                <span className="side-icon">💡</span>
                <h4>Student Guidelines</h4>
              </div>

              <ul className="guidance-list">
                <li>
                  <strong>Enrollment Number:</strong> Mention your 11-digit
                  GGSIPU roll number in the description.
                </li>
                <li>
                  <strong>Response Turnaround:</strong> Requests are typically
                  reviewed within 24–48 working hours.
                </li>
                <li>
                  <strong>Instant Tracking:</strong> Upon submission, you will
                  receive a unique ticket ID (e.g. <code>MAIT-1042</code>) to
                  track progress.
                </li>
              </ul>

              <div className="side-callout">
                <p>Need immediate answers right now?</p>
                <Link to="/chat" className="side-callout-link">
                  Try Asking the AI Assistant →
                </Link>
              </div>
            </div>

            <div className="side-info-card mini-hours-card">
              <h5>🏢 Administrative Office</h5>
              <p>Block 1, Ground Floor, MAIT Rohini</p>
              <p className="hours-text">Mon – Sat: 9:00 AM – 5:00 PM</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default SubmitRequest;
