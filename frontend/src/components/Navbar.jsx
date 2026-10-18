import { Link, useLocation } from "react-router-dom";
import { getToken } from "../utils/auth.js";

// A single shared navigation bar, used on every page, so navigation feels
// consistent instead of every page inventing its own header.
function Navbar() {
  // useLocation tells us the current URL, so we can highlight
  // whichever nav link matches where the student currently is.
  const location = useLocation();

  const loggedIn = !!getToken();

  const links = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "Ask a Question" },
    { to: "/portal", label: "Help Center" },
    { to: "/track", label: "Track a Request" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        {/* Place the crest file at frontend/public/mait-logo.png */}
        <img src="/mait-logo.png" alt="MAIT crest" className="navbar-crest" />
        <span className="navbar-wordmark">
          MAIT Student Helpdesk
          <span className="navbar-subtext">GGSIPU, ROHINI DELHI</span>
        </span>
      </Link>

      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`navbar-link ${location.pathname === link.to ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link to={loggedIn ? "/admin" : "/staff-login"} className="navbar-staff">
        {loggedIn ? "Staff Dashboard" : "Staff Login"}
      </Link>
    </nav>
  );
}

export default Navbar;
