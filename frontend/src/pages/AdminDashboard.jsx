import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { authHeaders, clearAuth, getStaff } from "../utils/auth.js";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const BACKEND_URL = "http://localhost:5050";

// Chart colors pulled from the same design tokens as the rest of the UI
// (index.css :root), so the charts don't look like a mismatched, bolted-on
// library default — they read as part of the same visual system.
const COLORS = ["#1c2b4a", "#c1852e", "#2f6f63", "#35486b", "#f3e4c8"];

function AdminDashboard() {
  // ---- STATE ----
  const [summary, setSummary] = useState(null);
  // "tickets" now replaces the old raw escalated-chat-log list — this is
  // the real, actionable case queue staff work from.
  const [tickets, setTickets] = useState([]);
  // Tracks what each staff member is currently typing as a reply,
  // keyed by ticket ID, so multiple reply boxes don't interfere.
  const [replyDrafts, setReplyDrafts] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const staff = getStaff();

  function handleLogout() {
    clearAuth();
    navigate("/staff-login", { replace: true });
  }

  async function loadDashboardData(showLoading = false) {
    if (showLoading) setLoading(true);
    try {
      const headers = authHeaders();
      const [summaryRes, ticketsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/analytics/summary`, { headers }),
        fetch(`${BACKEND_URL}/api/tickets`, { headers }),
      ]);

      // Token expired or invalid, so send them back to login.
      if (summaryRes.status === 401 || ticketsRes.status === 401) {
        handleLogout();
        return;
      }

      const summaryData = await summaryRes.json();
      const ticketsData = await ticketsRes.json();
      setSummary(summaryData);
      setTickets(ticketsData.tickets || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData(true);
  }, []);

  // Called when staff changes a ticket's status dropdown and/or writes a reply.
  async function handleUpdateTicket(ticketId, newStatus) {
    const staffReply = replyDrafts[ticketId] || "";

    try {
      const res = await fetch(`${BACKEND_URL}/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status: newStatus, staffReply }),
      });
      if (res.status === 401) return handleLogout();

      // Clear that ticket's draft reply box and refresh the list.
      setReplyDrafts((prev) => ({ ...prev, [ticketId]: "" }));
      await loadDashboardData(false);
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  }

  if (loading || !summary) {
    return (
      <div className="page">
        <Navbar />
        <div className="dashboard-shell">
          <p className="empty-state">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <div className="dashboard-shell">
        <div className="dashboard-intro">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div>
              <h1>Staff dashboard</h1>
              <p>
                Signed in as {staff?.name}. Usage overview and the support
                ticket queue.
              </p>
            </div>
            <button className="resolve-btn secondary" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        {/* ---- SUMMARY CARDS ---- */}
        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-number">{summary.totalChats}</span>
            <span className="stat-label">Total Conversations</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{summary.escalatedCount}</span>
            <span className="stat-label">Escalated to Staff</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-number">{summary.unresolvedCount}</span>
            <span className="stat-label">Still Unresolved</span>
          </div>
        </div>

        {/* ---- CHARTS ---- */}
        <div className="charts-row">
          <div className="chart-box">
            <h3>Queries by Language</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={summary.languageBreakdown}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => entry._id}
                >
                  {summary.languageBreakdown.map((entry, index) => (
                    <Cell
                      key={entry._id}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>Queries by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={summary.categoryBreakdown}>
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1c2b4a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---- TOP QUESTIONS ---- */}
        <div className="top-questions-box">
          <h3>Most Frequently Asked</h3>
          {summary.topQuestions && summary.topQuestions.length > 0 ? (
            <ol>
              {summary.topQuestions.map((q) => (
                <li key={q._id}>
                  {q._id} <span className="count-badge">{q.count}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-state">No question trends recorded yet.</p>
          )}
        </div>

        {/* ---- TICKET / CASE MANAGEMENT ---- */}
        <div className="escalation-box">
          <h3>Support Tickets ({tickets.length})</h3>
          {tickets.length === 0 ? (
            <p className="empty-state">No tickets yet 🎉</p>
          ) : (
            <div className="ticket-list">
              {tickets.map((t) => (
                <div key={t._id} className="ticket-row">
                  <div className="ticket-row-top">
                    <span className="ticket-code">{t.ticketCode}</span>
                    <span className="ticket-category-tag">{t.category}</span>
                    <span
                      className={`status-badge status-${t.status.toLowerCase().replace(" ", "")}`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="ticket-subject">{t.subject}</p>

                  <div className="ticket-thread-mini">
                    {(t.thread || []).map((msg, i) => (
                      <p key={i} className={`thread-line ${msg.sender}`}>
                        <strong>{msg.sender}:</strong> {msg.text}
                      </p>
                    ))}
                  </div>

                  <div className="ticket-actions">
                    <textarea
                      placeholder="Write a reply to the student (optional)..."
                      value={replyDrafts[t._id] || ""}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [t._id]: e.target.value,
                        }))
                      }
                    />
                    <div className="ticket-action-buttons">
                      <button
                        className="resolve-btn secondary"
                        onClick={() => handleUpdateTicket(t._id, "In Progress")}
                      >
                        Mark In Progress
                      </button>
                      <button
                        className="resolve-btn"
                        onClick={() => handleUpdateTicket(t._id, "Resolved")}
                      >
                        Reply &amp; Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
