import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Home() {
  return (
    <div className="page">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>
            Student support, in the language
            <br />
            you're most comfortable in.
          </h1>
          <p className="hero-subtext">
            One place for admissions, scholarships, exams, fees, and hostel
            queries at MAIT — ask a question, browse answers yourself, or
            raise a request and track it through to resolution.
          </p>
          <div className="hero-actions">
            <Link to="/chat" className="btn btn-primary">
              Ask a question
            </Link>
            <Link to="/portal" className="btn btn-secondary">
              Browse the Help Center
            </Link>
          </div>
        </div>
      </section>

      <section className="pillars">
        <div className="pillar pillar-teal">
          <h3>Help Center</h3>
          <p>
            Search or browse verified answers on admissions, scholarships,
            exams, fees, and hostel life — organized by category, no
            conversation required.
          </p>
          <Link to="/portal" className="pillar-link">
            Browse the Help Center
          </Link>
        </div>

        <div className="pillar pillar-gold">
          <h3>Ask the Assistant</h3>
          <p>
            Type your question in English, Hindi, or Punjabi and get an
            answer grounded in official college information — not a guess.
          </p>
          <Link to="/chat" className="pillar-link">
            Start a conversation
          </Link>
        </div>

        <div className="pillar pillar-navy">
          <h3>Track a Request</h3>
          <p>
            Anything the assistant can't resolve becomes a real ticket with
            its own ID, so you can follow it through to a staff response.
          </p>
          <Link to="/track" className="pillar-link">
            Track my request
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <span className="step-index">1</span>
            <div>
              <h4>Ask, in your own language</h4>
              <p>Type your question the way you'd naturally ask it — no need to translate to English first.</p>
            </div>
          </li>
          <li>
            <span className="step-index">2</span>
            <div>
              <h4>Get a grounded answer, or a ticket</h4>
              <p>If the knowledge base has a verified answer, you get it immediately. If not, a ticket is raised automatically.</p>
            </div>
          </li>
          <li>
            <span className="step-index">3</span>
            <div>
              <h4>Follow it through to resolution</h4>
              <p>Track your ticket's status anytime, and see the staff's reply the moment it's added.</p>
            </div>
          </li>
        </ol>
      </section>

      <footer className="site-footer">
        <p>Maharaja Agrasen Institute of Technology, Rohini, Delhi — affiliated to GGSIPU.</p>
      </footer>
    </div>
  );
}

export default Home;
