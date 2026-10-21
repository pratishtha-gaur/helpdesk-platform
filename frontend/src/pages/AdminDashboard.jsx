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

// Chart colors matching the MAIT institutional design palette
const COLORS = ["#0a1128", "#c1852e", "#0d9488", "#2563eb", "#d4a24f", "#64748b"];

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [ticketFilter, setTicketFilter] = useState("All");

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

  async function handleUpdateTicket(ticketId, newStatus) {
    const staffReply = replyDrafts[ticketId] || "";

    try {
      const res = await fetch(`${BACKEND_URL}/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status: newStatus, staffReply }),
      });
      if (res.status === 401) return handleLogout();

      setReplyDrafts((prev) => ({ ...prev, [ticketId]: "" }));
      await loadDashboardData(false);
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  }

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === "All") return true;
    return t.status.toLowerCase() === ticketFilter.toLowerCase();
  });

  if (loading || !summary) {
    return (
      <div className="page dashboard-page-wrapper">
        <Navbar />
        <main className="dashboard-shell">
          <div className="dashboard-loading-state">
            <div className="btn-spinner large-spinner" />
            <p>Loading MAIT administrative analytics and ticket queue…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page dashboard-page-wrapper">
      <Navbar />

      <main className="dashboard-shell">
        {/* Top Staff Navigation / Profile Header */}
        <div className="dashboard-profile-header">
          <div className="profile-left">
            <div className="profile-avatar">
              <span>👨‍🏫</span>
            </div>
            <div>
              <div className="profile-title-row">
                <h1>Staff Administration Console</h1>
                <span className="profile-role-badge">Faculty / Admin Staff</span>
              </div>
              <p className="profile-subtitle">
                Signed in as <strong>{staff?.name || "MAIT Administrator"}</strong> ({staff?.email || "helpdesk@mait.ac.in"})
              </p>
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="button"
              className="dashboard-refresh-btn"
              onClick={() => loadDashboardData(true)}
              title="Refresh data"
            >
              🔄 Refresh
            </button>
            <button
              type="button"
              className="dashboard-logout-btn"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>

        {/* ---- SUMMARY STATS CARDS ---- */}
        <div className="stats-cards-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-icon-wrapper">💬</span>
              <span className="stat-growth-tag">AI Assisted</span>
            </div>
            <span className="stat-number">{summary.totalChats}</span>
            <span className="stat-label">Total Student Conversations</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-icon-wrapper amber-icon">⚠️</span>
              <span className="stat-growth-tag">Pending Review</span>
            </div>
            <span className="stat-number">{summary.escalatedCount}</span>
            <span className="stat-label">Escalated to Staff</span>
          </div>

          <div className="stat-card warning">
            <div className="stat-card-top">
              <span className="stat-icon-wrapper red-icon">⏳</span>
              <span className="stat-growth-tag urgent-tag">Action Needed</span>
            </div>
            <span className="stat-number">{summary.unresolvedCount}</span>
            <span className="stat-label">Active Unresolved Cases</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-icon-wrapper teal-icon">🎫</span>
              <span className="stat-growth-tag">Total Logged</span>
            </div>
            <span className="stat-number">{tickets.length}</span>
            <span className="stat-label">Support Tickets Logged</span>
          </div>
        </div>

        {/* ---- CHARTS ROW ---- */}
        <div className="charts-grid-row">
          <div className="chart-box">
            <div className="chart-box-header">
              <div className="chart-box-title">
                <span className="chart-icon">🌐</span>
                <h3>Queries by Language</h3>
              </div>
              <span className="chart-badge">Multilingual Metrics</span>
            </div>
            <div className="chart-container-inner">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={summary.languageBreakdown}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={4}
                    label={(entry) => `${entry._id} (${entry.count})`}
                  >
                    {summary.languageBreakdown.map((entry, index) => (
                      <Cell
                        key={entry._id}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-box">
            <div className="chart-box-header">
              <div className="chart-box-title">
                <span className="chart-icon">📊</span>
                <h3>Queries by Domain Category</h3>
              </div>
              <span className="chart-badge">Department Trends</span>
            </div>
            <div className="chart-container-inner">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={summary.categoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="_id"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0a1128" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ---- TOP QUESTIONS TRENDS ---- */}
        <div className="top-questions-box">
          <div className="box-title-row">
            <div className="box-left">
              <span className="box-icon">🔥</span>
              <h3>Most Frequently Asked Questions (Trending Trends)</h3>
            </div>
            <span className="box-badge">AI Knowledge Insights</span>
          </div>

          {summary.topQuestions && summary.topQuestions.length > 0 ? (
            <div className="top-questions-list">
              {summary.topQuestions.map((q, index) => (
                <div key={q._id} className="top-question-item">
                  <span className="trend-rank">{index + 1}</span>
                  <span className="trend-question-text">{q._id}</span>
                  <span className="trend-count-badge">
                    {q.count} {q.count === 1 ? "query" : "queries"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No question trends recorded yet.</p>
          )}
        </div>

        {/* ---- TICKET / CASE MANAGEMENT QUEUE ---- */}
        <div className="escalation-box">
          <div className="escalation-header-row">
            <div>
              <h3>Support Ticket Queue ({tickets.length})</h3>
              <p className="escalation-subtext">
                Review, respond to student inquiries, and update case statuses.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="ticket-filter-tabs">
              {["All", "Open", "In Progress", "Resolved"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`ticket-tab-btn ${ticketFilter === tab ? "active" : ""}`}
                  onClick={() => setTicketFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h4>No tickets matching "{ticketFilter}"</h4>
              <p>Everything in this view is up to date.</p>
            </div>
          ) : (
            <div className="ticket-list">
              {filteredTickets.map((t) => (
                <div key={t._id} className="ticket-row-card">
                  <div className="ticket-row-top">
                    <div className="ticket-code-group">
                      <span className="ticket-code-tag">{t.ticketCode}</span>
                      <span className="ticket-category-tag">{t.category}</span>
                    </div>

                    <span
                      className={`status-badge status-${t.status.toLowerCase().replace(" ", "")}`}
                    >
                      <span className="status-dot" />
                      {t.status}
                    </span>
                  </div>

                  <h4 className="ticket-subject-title">{t.subject}</h4>

                  {/* Thread messages snippet */}
                  <div className="ticket-thread-mini">
                    {(t.thread || []).map((msg, i) => (
                      <div key={i} className={`thread-mini-item ${msg.sender}`}>
                        <span className="thread-mini-sender">
                          {msg.sender === "staff" ? "🏛️ Staff" : msg.sender === "student" ? "🎓 Student" : "🤖 AI"}:
                        </span>
                        <span className="thread-mini-text">{msg.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Staff Response Actions */}
                  <div className="ticket-actions-area">
                    <label htmlFor={`reply-${t._id}`} className="ticket-reply-label">
                      <span>Official Staff Reply to Student</span>
                    </label>
                    <textarea
                      id={`reply-${t._id}`}
                      placeholder="Write verified guidance or instructions for the student..."
                      value={replyDrafts[t._id] || ""}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [t._id]: e.target.value,
                        }))
                      }
                      rows={2}
                    />
                    <div className="ticket-action-buttons">
                      <button
                        type="button"
                        className="resolve-btn secondary"
                        onClick={() => handleUpdateTicket(t._id, "In Progress")}
                      >
                        ⏳ Mark In Progress
                      </button>
                      <button
                        type="button"
                        className="resolve-btn primary-resolve"
                        onClick={() => handleUpdateTicket(t._id, "Resolved")}
                      >
                        ✓ Send Reply &amp; Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

