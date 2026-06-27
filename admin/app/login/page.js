"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Adventure Holiday</h1>
        <p>Admin Panel — Sign in to continue</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@adventureholidaydestination.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          <a href="/" style={{
            display: "block",
            textAlign: "center",
            padding: "12px 20px",
            background: "var(--gold)",
            color: "#000",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 15,
            transition: "background 0.3s"
          }}
          onMouseOver={(e) => e.target.style.background = "#b8952f"}
          onMouseOut={(e) => e.target.style.background = "var(--gold)"}
          >
            ← Back to Website
          </a>
          <p style={{ textAlign: "center", margin: "12px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
            Return to the public site
          </p>
        </div>
      </div>
    </div>
  );
}
