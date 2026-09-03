import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = "http://localhost:5050";

const CATEGORIES = ["All", "Admissions", "Scholarships", "Examinations", "Fees", "Hostel", "General"];

function HelpCenter() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  // Tracks which FAQ's answer is currently expanded (accordion behavior) —
  // storing just the ID means only one (or none) is open at a time.
  const [expandedId, setExpandedId] = useState(null);

  // Re-fetch FAQs whenever the category or search term changes.
  // useEffect's dependency array [activeCategory, searchTerm] means:
  // "re-run this function whenever either of these values changes."
  useEffect(() => {
    async function fetchFaqs() {
      setLoading(true);
      try {
        // URLSearchParams safely builds a query string like
        // "?category=Hostel&search=fee" from an object.
        const params = new URLSearchParams();
        if (activeCategory !== "All") params.append("category", activeCategory);
        if (searchTerm.trim() !== "") params.append("search", searchTerm.trim());

        const response = await fetch(`${BACKEND_URL}/api/faqs?${params.toString()}`);
        const data = await response.json();
        setFaqs(data.faqs);
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      } finally {
        setLoading(false);
      }
    }

    // A small debounce: wait 300ms after the user stops typing before
    // actually searching, so we don't fire a request on every keystroke.
    const timeoutId = setTimeout(fetchFaqs, 300);
    return () => clearTimeout(timeoutId); // cancel the previous timer if still typing
  }, [activeCategory, searchTerm]);

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="portal-page">
      <header className="chat-header">
        <div>
          <h1>Help Center</h1>
          <p>MAIT Student Helpdesk · Self-Service</p>
        </div>
        <div className="header-links">
          <Link to="/" className="admin-link">
            Chat Instead
          </Link>
          <Link to="/submit" className="admin-link">
            Raise a Request
          </Link>
        </div>
      </header>

      <div className="portal-body">
        <input
          type="text"
          className="portal-search"
          placeholder="Search for a topic, e.g. hostel fee, scholarship..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : faqs.length === 0 ? (
          <div className="empty-state">
            <p>No matching FAQs found.</p>
            <Link to="/submit" className="inline-link">
              Can't find your answer? Raise a request instead →
            </Link>
          </div>
        ) : (
          <div className="faq-accordion">
            {faqs.map((faq) => (
              <div key={faq._id} className="faq-item">
                <button className="faq-question" onClick={() => toggleExpand(faq._id)}>
                  <span>{faq.question}</span>
                  <span className="faq-toggle-icon">{expandedId === faq._id ? "−" : "+"}</span>
                </button>
                {expandedId === faq._id && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HelpCenter;
