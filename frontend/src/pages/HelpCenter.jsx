import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const BACKEND_URL = "http://localhost:5050";

const CATEGORIES = [
  "All",
  "Admissions",
  "Scholarships",
  "Examinations",
  "Fees",
  "Hostel",
  "General",
];

function HelpCenter() {
  // useSearchParams reads the "?category=..." part of the URL. Home's
  // topic cards link here with a category already attached, e.g.
  // "/portal?category=Hostel", so this page should open pre-filtered
  // to that exact section instead of always starting on "All".
  const [searchParams] = useSearchParams();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(() => {
    const fromUrl = searchParams.get("category");
    return CATEGORIES.includes(fromUrl) ? fromUrl : "All";
  });
  const [searchTerm, setSearchTerm] = useState("");
  // Tracks which FAQ's answer is currently expanded (accordion behavior) —
  // storing just the ID means only one (or none) is open at a time.
  const [expandedId, setExpandedId] = useState(null);

  // If the URL's category changes after this page has already mounted
  // (e.g. the student clicks another topic card while already on
  // /portal), keep the active tab in sync with it.
  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (CATEGORIES.includes(fromUrl) && fromUrl !== activeCategory) {
      setActiveCategory(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
        if (searchTerm.trim() !== "")
          params.append("search", searchTerm.trim());

        const response = await fetch(
          `${BACKEND_URL}/api/faqs?${params.toString()}`,
        );
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
    <div className="page">
      <Navbar />

      <div className="portal-shell">
        <div className="portal-intro">
          <h1>Help Center</h1>
          <p>Search or browse verified answers, organized by category.</p>
        </div>

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
              Can't find your answer? Raise a request instead
            </Link>
          </div>
        ) : (
          <div className="faq-accordion">
            {faqs.map((faq) => (
              <div key={faq._id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleExpand(faq._id)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-toggle-icon">
                    {expandedId === faq._id ? "−" : "+"}
                  </span>
                </button>
                {expandedId === faq._id && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HelpCenter;
