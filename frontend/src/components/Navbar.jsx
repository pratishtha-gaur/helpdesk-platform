import { Link, useLocation } from "react-router-dom";

// A single shared navigation bar, used on every page, so navigation feels
// consistent instead of every page inventing its own header.
function Navbar() {
  // useLocation tells us the current URL, so we can highlight
  // whichever nav link matches where the student currently is.
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "Ask a Question" },
    { to: "/portal", label: "Help Center" },
    { to: "/track", label: "Track a Request" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-mark">M</span>
        <span className="navbar-wordmark">
          MAIT Helpdesk
          <span className="navbar-subtext">GGSIPU</span>
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

      <Link to="/admin" className="navbar-staff">
        Staff Login
      </Link>
    </nav>
  );
}

export default Navbar;
