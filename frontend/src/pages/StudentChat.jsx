import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

const BACKEND_URL = "http://localhost:5050";
const SESSION_ID = crypto.randomUUID();

function StudentChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm the MAIT Student Helpdesk Assistant. Ask me about admissions, scholarships, exams, fees, or hostel — in English, Hindi, or Punjabi.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (trimmed === "" || isLoading) return;

    setMessages((prev) => [...prev, { sender: "student", text: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId: SESSION_ID }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply, escalated: data.escalated },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't connect to the server. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="page">
      <Navbar />

      <div className="chat-shell">
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.sender}`}>
              <div className={`message-bubble ${msg.sender}`}>
                {msg.text}
                {msg.escalated && (
                  <div className="escalated-tag">
                    Not fully confident — a staff member may follow up.
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-row bot">
              <div className="message-bubble bot typing">Typing...</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question in English, Hindi, or Punjabi..."
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentChat;
