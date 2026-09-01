import { useState, useRef, useEffect } from "react";
import "./index.css";

// The address of our backend server (from Step 1-3).
const BACKEND_URL = "http://localhost:5050";

// A simple way to give each browser tab/session a unique ID,
// so the backend can group a student's messages together in ChatLog.
// crypto.randomUUID() generates a random unique string.
const SESSION_ID = crypto.randomUUID();

function App() {
  // ---- STATE ----
  // "messages" remembers every message in the conversation (both student's
  // and bot's), so React can redraw the chat window whenever it changes.
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm the MAIT Student Helpdesk Assistant. Ask me about admissions, scholarships, exams, fees, or hostel — in English, Hindi, or Punjabi.",
    },
  ]);

  // "input" remembers what the student is currently typing in the text box.
  const [input, setInput] = useState("");

  // "isLoading" tracks whether we're waiting for the bot's reply,
  // so we can show a "typing..." indicator and disable the send button.
  const [isLoading, setIsLoading] = useState(false);

  // A reference to an invisible element at the bottom of the chat,
  // used to auto-scroll down when new messages arrive.
  const bottomRef = useRef(null);

  // useEffect runs this every time "messages" changes —
  // i.e., scroll to the bottom whenever a new message is added.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- SENDING A MESSAGE ----
  async function sendMessage() {
    const trimmed = input.trim();
    if (trimmed === "" || isLoading) return; // ignore empty sends or double-sends

    // Immediately show the student's own message in the chat (optimistic UI —
    // we don't wait for the server before showing what they typed).
    const studentMessage = { sender: "student", text: trimmed };
    setMessages((prev) => [...prev, studentMessage]);
    setInput(""); // clear the input box
    setIsLoading(true);

    try {
      // fetch() sends an HTTP request to our backend's /api/chat endpoint.
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId: SESSION_ID }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      // Add the bot's reply to the chat.
      const botMessage = {
        sender: "bot",
        text: data.reply,
        escalated: data.escalated,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // If anything goes wrong (server down, network issue), show a
      // friendly error message instead of the app silently breaking.
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't connect to the server. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Allows sending a message by pressing Enter, not just clicking the button.
  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  // ---- WHAT GETS DISPLAYED (JSX) ----
  return (
    <div className="chat-page">
      <header className="chat-header">
        <h1>MAIT Student Helpdesk</h1>
        <p>Maharaja Agrasen Institute of Technology · GGSIPU</p>
      </header>

      <div className="chat-window">
        {/* .map() turns our "messages" array into a list of visual bubbles */}
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

        {/* Typing indicator, shown only while waiting for a reply */}
        {isLoading && (
          <div className="message-row bot">
            <div className="message-bubble bot typing">Typing...</div>
          </div>
        )}

        {/* Invisible anchor element we scroll to */}
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
  );
}

export default App;
