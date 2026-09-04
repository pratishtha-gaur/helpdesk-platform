import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const BACKEND_URL = "http://localhost:5050";
const CATEGORIES = ["Admissions", "Scholarships", "Examinations", "Fees", "Hostel", "General"];

function SubmitRequest() {
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (subject.trim() === "" || description.trim() === "") {
      setError("Please fill in both the subject and description.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, description }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      navigate(`/track?code=${data.ticket.ticketCode}`);
    } catch (err) {
      setError("Something went wrong submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Navbar />

      <div className="form-shell">
        <div className="portal-intro">
          <h1>Raise a Request</h1>
          <p>Tell us what you need help with, and we'll get back to you.</p>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label>
            Subject
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary, e.g. 'Hostel room change request'"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your request in detail..."
              rows={5}
            />
          </label>

          {error && <p className="track-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitRequest;
