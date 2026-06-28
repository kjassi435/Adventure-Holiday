"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [now, setNow] = useState("");

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
    setNow(new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }, []);

  if (!stats)
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "4px solid #e2e0dc", borderTopColor: "#0c3b2d", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-muted)" }}>Loading dashboard...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );

  const newCount = stats.enquiries.new || 0;

  const statCards = [
    {
      label: "Total Packages",
      value: stats.packages.total,
      sub: `${stats.packages.domestic} domestic · ${stats.packages.spiritual} spiritual`,
      color: "#0c3b2d",
      bg: "linear-gradient(135deg, #0c3b2d 0%, #1a5c47 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      label: "Total Enquiries",
      value: stats.enquiries.total,
      sub: "All time",
      color: "#1565c0",
      bg: "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ),
    },
    {
      label: "New Enquiries",
      value: newCount,
      sub: "Awaiting response",
      color: "#e65100",
      bg: "linear-gradient(135deg, #e65100 0%, #f57c00 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
    },
    {
      label: "In Progress",
      value: (stats.enquiries.contacted || 0) + (stats.enquiries.confirmed || 0),
      sub: "Contacted + Confirmed",
      color: "#7b1fa2",
      bg: "linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0c3b2d 0%, #1a5c47 60%, #c9a86a 100%)",
        borderRadius: 12,
        padding: "28px 32px",
        marginBottom: 28,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", marginBottom: 4, color: "#fff" }}>Welcome back, Admin</h1>
          <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>{now}</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/admin/packages/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8, background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600, fontSize: "0.85rem", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.2)", transition: "background 0.2s" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Package
          </a>
          <a href="/admin/enquiries" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8, background: newCount > 0 ? "#e65100" : "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600, fontSize: "0.85rem", border: "1px solid rgba(255,255,255,0.2)", position: "relative" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Enquiries
            {newCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: "#ff1744", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{newCount}</span>}
          </a>
          <a href="/admin/carousels" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8, background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600, fontSize: "0.85rem", border: "1px solid rgba(255,255,255,0.2)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Carousels
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        {statCards.map((c, i) => (
          <div key={i} style={{
            background: c.bg,
            borderRadius: 12,
            padding: "22px 24px",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}>
            <div>
              <div style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.85, fontWeight: 600 }}>{c.label}</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1.1, marginTop: 4 }}>{c.value}</div>
              <div style={{ fontSize: "0.78rem", opacity: 0.7, marginTop: 2 }}>{c.sub}</div>
            </div>
            <div style={{ opacity: 0.8, marginTop: 4 }}>{c.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Enquiries */}
      <div style={{ background: "var(--surface)", borderRadius: 12, boxShadow: "var(--shadow)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: "1.1rem", color: "var(--emerald)" }}>Recent Enquiries</h2>
            {newCount > 0 && <span style={{ background: "#e65100", color: "#fff", borderRadius: 100, padding: "2px 10px", fontSize: "0.75rem", fontWeight: 700 }}>{newCount} new</span>}
          </div>
          <a href="/admin/enquiries" style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid var(--border)", color: "var(--text)", fontWeight: 600, fontSize: "0.8rem", transition: "all 0.2s" }}>View All</a>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Name", "Package", "Status", "Date"].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontWeight: 600, color: "var(--text-muted)", background: "var(--surface-2)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.recentEnquiries.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No enquiries yet</td></tr>
            ) : (
              stats.recentEnquiries.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px" }}><strong>{e.name}</strong></td>
                  <td style={{ padding: "12px 20px" }}>{e.package || "—"}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 100,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: e.status === "new" ? "#e8f5e9" : e.status === "contacted" ? "#e3f2fd" : e.status === "confirmed" ? "#fff3e0" : "#f3e5f5",
                      color: e.status === "new" ? "#2e7d32" : e.status === "contacted" ? "#1565c0" : e.status === "confirmed" ? "#e65100" : "#7b1fa2",
                    }}>{e.status}</span>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "0.82rem", color: "var(--text-muted)" }}>{e.created_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
