import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const BACKEND_URL = "http://localhost:5050";

const STATUS_CONFIG = {
  Open: { label: "Open / Submitted", className: "status-open", step: 1 },
  "In Progress": { label: "In Progress", className: "status-progress", step: 2 },
  Resolved: { label: "Resolved", className: "status-resolved", step: 3 },
};

function TrackTicket() {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefilledCode = searchParams.get("code") || "";

  const [code, setCode] = useState(prefilledCode);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSearch(codeToSearch) {
    const trimmed = (codeToSearch ?? code).trim().toUpperCase();
    if (trimmed === "") return;

    setLoading(true);
    setError("");
    setTicket(null);

    // Keep URL parameter synchronized
    setSearchParams({ code: trimmed });

    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets/${trimmed}`);

      if (response.status === 404) {
        setError("No request found with code '" + trimmed + "'. Please check the ticket ID format (e.g. MAIT-1042).");
        return;
      }
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setTicket(data.ticket);
    } catch {
      setError("Unable to connect to the MAIT server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (prefilledCode) handleSearch(prefilledCode);
  }, [prefilledCode]);

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  function handleCopyCode() {
    if (!ticket?.ticketCode) return;
    navigator.clipboard?.writeText(ticket.ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const currentStep = STATUS_CONFIG[ticket?.status]?.step || 1;

  return (
    <div className="page track-page-wrapper">
      <Navbar />

      <main className="track-shell">
        <div className="portal-intro">
          <div className="section-badge-wrapper center-badge">
            <span className="section-badge">REAL-TIME STATUS</span>
            <h1>Track Support Request</h1>
            <p>Enter your 8-digit MAIT ticket code to inspect case progress and staff replies.</p>
          </div>
        </div>

        {/* Search Row */}
        <div className="track-search-card">
          <div className="track-search-inner">
            <span className="track-input-prefix">🎫</span>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="e.g. MAIT-1042"
              aria-label="Enter ticket code"
            />
            <button
              type="button"
              className="track-search-btn"
              onClick={() => handleSearch()}
              disabled={loading || !code.trim()}
            >
              {loading ? (
                <span className="btn-loading-state">
                  <span className="btn-spinner" />
                  <span>Tracking…</span>
                </span>
              ) : (
                <>
                  <span>Track Request</span>
                  <span className="arrow-icon">→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="track-error-card">
            <span className="error-icon">⚠️</span>
            <div>
              <p>{error}</p>
              <Link to="/submit" className="error-card-link">
                Need to submit a new ticket instead?
              </Link>
            </div>
          </div>
        )}

        {ticket && (
          <div className="ticket-detail-container">
            {/* Ticket Card Header */}
            <div className="ticket-card-header-bar">
              <div className="ticket-code-group">
                <span className="ticket-code-label">Ticket ID:</span>
                <span className="ticket-code-value">{ticket.ticketCode}</span>
                <button
                  type="button"
                  className="copy-code-btn"
                  onClick={handleCopyCode}
                  title="Copy Ticket ID"
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>

              <div className="ticket-status-pill-group">
                <span className="ticket-category-badge">{ticket.category}</span>
                <span
                  className={`status-badge ${
                    STATUS_CONFIG[ticket.status]?.className || "status-open"
                  }`}
                >
                  <span className="status-dot" />
                  {STATUS_CONFIG[ticket.status]?.label || ticket.status}
                </span>
              </div>
            </div>

            {/* Visual Resolution Pipeline */}
            <div className="ticket-pipeline-wrapper">
              <div className="pipeline-steps">
                <div className={`pipeline-step ${currentStep >= 1 ? "completed" : ""}`}>
                  <div className="step-circle">1</div>
                  <div className="step-label">Submitted</div>
                </div>
                <div className={`pipeline-bar ${currentStep >= 2 ? "active" : ""}`} />
                <div className={`pipeline-step ${currentStep >= 2 ? "completed" : ""}`}>
                  <div className="step-circle">2</div>
                  <div className="step-label">Under Review</div>
                </div>
                <div className={`pipeline-bar ${currentStep >= 3 ? "active" : ""}`} />
                <div className={`pipeline-step ${currentStep >= 3 ? "completed" : ""}`}>
                  <div className="step-circle">3</div>
                  <div className="step-label">Resolved</div>
                </div>
              </div>
            </div>

            {/* Ticket Content */}
            <div className="ticket-content-body">
              <div className="ticket-meta-info">
                <div className="meta-item">
                  <span className="meta-label">Subject</span>
                  <h3 className="meta-value-title">{ticket.subject}</h3>
                </div>
              </div>

              {/* Conversation Thread */}
              <div className="ticket-thread-section">
                <div className="thread-section-title">
                  <span>Conversation History ({ticket.thread?.length || 0})</span>
                </div>

                <div className="thread-timeline">
                  {ticket.thread?.map((msg, i) => {
                    const isStaff = msg.sender === "staff";
                    const isStudent = msg.sender === "student";

                    return (
                      <div
                        key={i}
                        className={`thread-item-card ${
                          isStaff ? "staff-reply" : isStudent ? "student-msg" : "system-msg"
                        }`}
                      >
                        <div className="thread-header">
                          <div className="thread-sender-badge">
                            <span className="sender-avatar">
                              {isStaff ? "🏛️" : isStudent ? "🎓" : "🤖"}
                            </span>
                            <span className="sender-name">
                              {isStaff ? "MAIT Department Staff" : isStudent ? "Student (You)" : "System Assistant"}
                            </span>
                          </div>
                          {isStaff && <span className="official-reply-tag">Official Reply</span>}
                        </div>
                        <div className="thread-text-content">{msg.text}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="ticket-footer-help">
              <p>
                Have additional questions or updates? Mention ticket ID <strong>{ticket.ticketCode}</strong> in your email to{" "}
                <code>helpdesk@mait.ac.in</code>.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TrackTicket;

