import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
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
      setError("Please enter your email and password.");
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
        setError(data.error || "Login failed.");
        return;
      }

      saveAuth(data.token, data.staff);
      navigate(redirectTo, { replace: true });
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Navbar />
      <div className="form-shell">
        <div className="portal-intro">
          <h1>Staff Login</h1>
          <p>
            Authorised MAIT staff only. Use the account provided by the
            administrator.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="name@mait.ac.in"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <p className="track-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
