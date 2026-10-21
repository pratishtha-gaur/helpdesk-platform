import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const BACKEND_URL = "http://localhost:5050";

const CATEGORY_ITEMS = [
  { name: "All", icon: "🌐" },
  { name: "Admissions", icon: "🎓" },
  { name: "Scholarships", icon: "🎗️" },
  { name: "Examinations", icon: "📝" },
  { name: "Fees", icon: "💳" },
  { name: "Hostel", icon: "🏠" },
  { name: "General", icon: "🏛️" },
];

const CATEGORIES = CATEGORY_ITEMS.map((c) => c.name);

function HelpCenter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(() => {
    const fromUrl = searchParams.get("category");
    return CATEGORIES.includes(fromUrl) ? fromUrl : "All";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (CATEGORIES.includes(fromUrl) && fromUrl !== activeCategory) {
      setActiveCategory(fromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchFaqs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "All") params.append("category", activeCategory);
        if (searchTerm.trim() !== "") params.append("search", searchTerm.trim());

        const response = await fetch(`${BACKEND_URL}/api/faqs?${params.toString()}`);
        const data = await response.json();
        setFaqs(data.faqs || []);
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(fetchFaqs, 300);
    return () => clearTimeout(timeoutId);
  }, [activeCategory, searchTerm]);

  function handleCategorySelect(cat) {
    setActiveCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  }

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="page portal-page-wrapper">
      <Navbar />

      <main className="portal-shell">
        {/* Knowledge Base Header */}
        <div className="portal-intro">
          <div className="section-badge-wrapper center-badge">
            <span className="section-badge">OFFICIAL REPOSITORY</span>
            <h1>Help Center &amp; Knowledge Base</h1>
            <p>
              Verified guidelines, college circulars, and frequently asked questions for MAIT students.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="portal-search-box">
          <span className="search-box-icon">🔍</span>
          <input
            type="text"
            className="portal-search-input"
            placeholder="Search FAQs (e.g., 'hostel refund', '75% attendance', 'scholarship portal')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search FAQs"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="category-chips" role="tablist" aria-label="FAQ Categories">
          {CATEGORY_ITEMS.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`chip ${isActive ? "active" : ""}`}
                onClick={() => handleCategorySelect(cat.name)}
              >
                <span className="chip-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Results Info Bar */}
        <div className="faq-results-bar">
          <span className="results-count">
            {loading ? "Searching knowledge base…" : `${faqs.length} verified answers found`}
          </span>
          {searchTerm && (
            <span className="search-filter-tag">
              Filtered by: <strong>"{searchTerm}"</strong>
            </span>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="faq-loading-skeleton">
            <div className="skeleton-bar" />
            <div className="skeleton-bar" />
            <div className="skeleton-bar" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No matching answers found</h3>
            <p>We couldn't find an exact match for your search in this category.</p>
            <div className="empty-state-actions">
              <Link to="/chat" className="btn btn-primary">
                Ask AI Assistant
              </Link>
              <Link to="/submit" className="btn btn-secondary">
                Raise an Official Request
              </Link>
            </div>
          </div>
        ) : (
          <div className="faq-accordion">
            {faqs.map((faq) => {
              const isOpen = expandedId === faq._id;
              return (
                <div key={faq._id} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleExpand(faq._id)}
                    aria-expanded={isOpen}
                  >
                    <div className="faq-question-left">
                      <span className="faq-category-tag">{faq.category}</span>
                      <span className="faq-question-text">{faq.question}</span>
                    </div>
                    <span className={`faq-toggle-chevron ${isOpen ? "open" : ""}`}>
                      ▼
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer">
                      <div className="faq-answer-content">{faq.answer}</div>
                      <div className="faq-answer-footer">
                        <span className="official-source-badge">
                          ✓ Verified by MAIT Academic Cell
                        </span>
                        <Link to="/chat" className="faq-clarify-link">
                          Need further clarification? Ask AI →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default HelpCenter;

