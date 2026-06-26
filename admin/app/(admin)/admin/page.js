"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__label">Total Packages</div>
          <div className="stat-card__value">{stats.packages.total}</div>
          <div className="stat-card__sub">{stats.packages.domestic} domestic · {stats.packages.spiritual} spiritual</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Total Enquiries</div>
          <div className="stat-card__value">{stats.enquiries.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">New Enquiries</div>
          <div className="stat-card__value" style={{ color: "#2e7d32" }}>{stats.enquiries.new}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">In Progress</div>
          <div className="stat-card__value" style={{ color: "#1565c0" }}>{stats.enquiries.contacted + stats.enquiries.confirmed}</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <h2>Recent Enquiries</h2>
          <a href="/admin/enquiries" className="btn btn-outline btn-sm">View All</a>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Package</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentEnquiries.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>No enquiries yet</td></tr>
            ) : (
              stats.recentEnquiries.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.package || "—"}</td>
                  <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
                  <td>{e.created_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
