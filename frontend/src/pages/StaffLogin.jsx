import { useState } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { saveAuth, getToken } from "../utils/auth.js";

const BACKEND_URL = "http://localhost:5050";

function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/admin";

  // Already logged in? Skip the form.
  if (getToken()) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both your university email and password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login credentials could not be verified.");
        return;
      }

      saveAuth(data.token, data.staff);
      navigate(redirectTo, { replace: true });
    } catch {
      setError("Could not establish connection to the MAIT authentication service.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page login-page-wrapper">
      <Navbar />

      <main className="login-shell">
        <div className="login-card-container">
          {/* Card Top Brand */}
          <div className="login-header-section">
            <div className="login-crest-wrapper">
              <img src="/mait-logo.png" alt="MAIT Crest" className="login-crest-img" />
            </div>
            <div className="login-badge">
              <span className="lock-icon">🔒</span>
              <span>Authorized Faculty &amp; Staff Only</span>
            </div>
            <h1>Staff Management Portal</h1>
            <p>
              Sign in with your official university credentials to manage tickets and view helpdesk analytics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form-box">
            <div className="form-field-group">
              <label htmlFor="staff-email">
                <span className="field-label-text">Institutional Email</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  id="staff-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  placeholder="faculty@mait.ac.in"
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="staff-password">
                <span className="field-label-text">Password</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon">🔑</span>
                <input
                  id="staff-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="form-error-alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={submitting}>
              {submitting ? (
                <span className="btn-loading-state">
                  <span className="btn-spinner" />
                  <span>Signing In…</span>
                </span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <span className="arrow-icon">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer-note">
            <p>
              Are you a student seeking assistance?{" "}
              <Link to="/chat" className="login-student-link">
                Go to Student Assistant →
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StaffLogin;

