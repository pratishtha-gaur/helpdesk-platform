import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const BACKEND_URL = "http://localhost:5050";

const STATUS_STYLES = {
  Open: { label: "Open", className: "status-open" },
  "In Progress": { label: "In progress", className: "status-progress" },
  Resolved: { label: "Resolved", className: "status-resolved" },
};

function TrackTicket() {
  // useSearchParams reads the "?code=..." part of the URL, so if a
  // student arrives here right after submitting a request, we can
  // automatically look up their new ticket without them retyping it.
  const [searchParams] = useSearchParams();
  const prefilledCode = searchParams.get("code") || "";

  const [code, setCode] = useState(prefilledCode);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(codeToSearch) {
    const trimmed = (codeToSearch ?? code).trim();
    if (trimmed === "") return;

    setLoading(true);
    setError("");
    setTicket(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets/${trimmed}`);

      if (response.status === 404) {
        setError("No ticket found with that code. Please double-check and try again.");
        return;
      }
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setTicket(data.ticket);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // If we arrived here with a ?code=... in the URL, search automatically
  // as soon as the page loads.
  useEffect(() => {
    if (prefilledCode) handleSearch(prefilledCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledCode]);

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="track-page">
      <header className="chat-header">
        <div>
          <h1>Track My Request</h1>
          <p>MAIT Student Helpdesk</p>
        </div>
        <Link to="/" className="admin-link">
          ← Back to Chat
        </Link>
      </header>

      <div className="track-body">
        <p className="track-instructions">
          Enter the ticket code you received (e.g. <code>MAIT-0001</code>) to check its status.
        </p>

        <div className="track-search-row">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="MAIT-0001"
          />
          <button onClick={() => handleSearch()} disabled={loading}>
            {loading ? "Searching..." : "Track"}
          </button>
        </div>

        {error && <p className="track-error">{error}</p>}

        {ticket && (
          <div className="ticket-card">
            <div className="ticket-card-header">
              <span className="ticket-code">{ticket.ticketCode}</span>
              <span className={`status-badge ${STATUS_STYLES[ticket.status]?.className}`}>
                {STATUS_STYLES[ticket.status]?.label || ticket.status}
              </span>
            </div>

            <p className="ticket-meta">
              Category: <strong>{ticket.category}</strong>
            </p>
            <p className="ticket-subject">{ticket.subject}</p>

            <div className="ticket-thread">
              <h4>Conversation</h4>
              {ticket.thread.map((msg, i) => (
                <div key={i} className={`thread-message ${msg.sender}`}>
                  <span className="thread-sender">
                    {msg.sender === "student" ? "You" : msg.sender === "staff" ? "Staff" : "Assistant"}
                  </span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackTicket;
