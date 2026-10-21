import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getToken } from "../utils/auth.js";

function Navbar() {
  const location = useLocation();
  const loggedIn = !!getToken();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", icon: "🏛️" },
    { to: "/chat", label: "Ask AI Assistant", icon: "💬" },
    { to: "/portal", label: "Help Center", icon: "📚" },
    { to: "/submit", label: "Raise Ticket", icon: "✍️" },
    { to: "/track", label: "Track Request", icon: "🔍" },
  ];

  return (
    <header className="site-header">
      {/* Top Institutional Notification Ticker */}
      <div className="top-banner">
        <div className="top-banner-inner">
          <div className="top-banner-left">
            <span className="campus-badge">MAIT DELHI</span>
            <span className="banner-text">
              Maharaja Agrasen Institute of Technology • GGSIPU Affiliated
            </span>
          </div>
          <div className="top-banner-right">
            <span className="status-live-indicator">
              <span className="pulse-dot"></span>
              24×7 Multilingual Helpdesk Active
            </span>
            <span className="banner-divider">•</span>
            <span className="helpline-hint">Campus: Sector 22, Rohini</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
            <div className="navbar-crest-wrapper">
              <img src="/mait-logo.png" alt="MAIT Logo Crest" className="navbar-crest" />
            </div>
            <div className="navbar-wordmark">
              <span className="navbar-title">MAIT Student Helpdesk</span>
              <span className="navbar-subtext">Maharaja Agrasen Institute of Technology</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`navbar-link ${isActive ? "active" : ""}`}
                >
                  <span className="nav-link-icon">{link.icon}</span>
                  <span className="nav-link-text">{link.label}</span>
                  {isActive && <span className="nav-active-glow" />}
                </Link>
              );
            })}
          </div>

          {/* Action Area */}
          <div className="navbar-actions">
            <Link
              to={loggedIn ? "/admin" : "/staff-login"}
              className="navbar-staff-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="staff-btn-icon">🔐</span>
              <span>{loggedIn ? "Staff Portal" : "Staff Login"}</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="navbar-mobile-toggle"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
              <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
              <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-menu">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`navbar-mobile-link ${isActive ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-link-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="navbar-mobile-footer">
              <Link
                to={loggedIn ? "/admin" : "/staff-login"}
                className="navbar-mobile-staff-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🔐</span>
                <span>{loggedIn ? "Staff Dashboard" : "Staff Login"}</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;

