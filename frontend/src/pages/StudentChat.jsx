import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const BACKEND_URL = "http://localhost:5050";
const SESSION_ID = crypto.randomUUID();

const SUGGESTIONS = [
  "Hostel fee payment deadline kya hai?",
  "What is the 75% attendance rule?",
  "How to apply for Delhi Govt scholarship?",
  "B.Tech semester exam datesheet kab aayegi?",
  "Where can I get a Bonafide Certificate?",
];

function StudentChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! I am the MAIT Student Helpdesk Assistant. You can ask me questions about admissions, semester exams, fee submission, scholarships, or hostel accommodation in English, हिन्दी, or ਪੰਜਾਬੀ.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend(textToSend) {
    const messageText = (textToSend ?? input).trim();
    if (messageText === "" || isLoading) return;

    setMessages((prev) => [...prev, { sender: "student", text: messageText }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, sessionId: SESSION_ID }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
          escalated: data.escalated,
          ticketCode: data.ticketCode,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I couldn't reach the MAIT helpdesk server. Please check your internet connection or try again in a few moments.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="page chat-page-wrapper">
      <Navbar />

      <main className="chat-shell">
        {/* Chat Header Card */}
        <div className="chat-card-header">
          <div className="chat-header-left">
            <div className="chat-header-avatar">
              <img src="/mait-logo.png" alt="MAIT Emblem" />
              <span className="online-indicator-dot" />
            </div>
            <div>
              <div className="chat-header-title-row">
                <h2>MAIT Virtual Assistant</h2>
                <span className="verified-badge">Official AI</span>
              </div>
              <p className="chat-header-desc">
                Instant college guidance • Grounded on GGSIPU &amp; MAIT regulations
              </p>
            </div>
          </div>

          <div className="chat-header-right">
            <div className="lang-support-pills">
              <span className="lang-pill">English</span>
              <span className="lang-pill">हिन्दी</span>
              <span className="lang-pill">ਪੰਜਾਬੀ</span>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="chat-quick-suggestions">
            <span className="suggestions-label">💡 Common queries:</span>
            <div className="suggestions-slider">
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  className="chat-suggestion-chip"
                  onClick={() => handleSend(sug)}
                  disabled={isLoading}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div className="chat-window" role="log" aria-live="polite">
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.sender}`}>
              {msg.sender === "bot" && (
                <div className="message-avatar bot-avatar">
                  <img src="/mait-logo.png" alt="Bot" />
                </div>
              )}

              <div className={`message-bubble ${msg.sender}`}>
                <div className="message-sender-name">
                  {msg.sender === "bot" ? "MAIT Assistant" : "You"}
                </div>
                <div className="message-body-text">{msg.text}</div>

                {msg.escalated && (
                  <div className="escalated-card">
                    <div className="escalated-icon">⚠️</div>
                    <div className="escalated-content">
                      <div className="escalated-title">Requires Official Review</div>
                      <p>
                        This query needs manual intervention from MAIT department staff.
                      </p>
                      <Link to="/submit" className="escalated-cta-btn">
                        <span>Raise an Official Request</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === "student" && (
                <div className="message-avatar student-avatar">
                  <span>🎓</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="message-row bot">
              <div className="message-avatar bot-avatar">
                <img src="/mait-logo.png" alt="Bot" />
              </div>
              <div className="message-bubble bot typing-bubble">
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="typing-text">Checking official MAIT records…</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Always-visible escape hatch */}
        <div className="chat-footer-helper">
          <span className="helper-icon">ℹ️</span>
          <span>
            Didn't receive the exact response needed? You can{" "}
            <Link to="/submit" className="helper-link">
              Raise a Direct Ticket
            </Link>{" "}
            for staff resolution.
          </span>
        </div>

        {/* Chat Input Bar */}
        <div className="chat-input-area">
          <div className="chat-input-box">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question in English or Hindi (e.g. 'Scholarship eligibility kya hai?')..."
              disabled={isLoading}
              aria-label="Ask your question"
            />
            {input.trim() && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => setInput("")}
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            className="chat-send-btn"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <span className="send-btn-text">Send</span>
            <span className="send-btn-icon">➤</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default StudentChat;

