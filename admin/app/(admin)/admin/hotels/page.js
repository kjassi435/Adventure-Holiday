"use client";

import { useEffect, useState } from "react";

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  function loadHotels() {
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (search) params.set("search", search);

    fetch("/api/hotels?" + params.toString())
      .then((r) => r.json())
      .then((data) => { setHotels(data); setLoading(false); })
      .catch(console.error);
  }

  useEffect(() => { loadHotels(); }, [typeFilter]);

  function handleSearch(e) {
    e.preventDefault();
    loadHotels();
  }

  async function handleDelete(uid, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/hotels/${uid}`, { method: "DELETE" });
    loadHotels();
  }

  return (
    <div>
      {/* Banner */}
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
          <h1 style={{ fontSize: "1.6rem", marginBottom: 4, color: "#fff" }}>Hotels &amp; Resorts</h1>
          <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>Manage your hotel listings, room types, and gallery</p>
        </div>
        <a href="/admin/hotels/new" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 20px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.15)",
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.85rem",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Hotel
        </a>
      </div>

      {/* Filters */}
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <div className="table-header">
          <div className="table-actions">
            {["all", "hotel", "resort"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  background: typeFilter === t ? "var(--emerald)" : "var(--surface)",
                  color: typeFilter === t ? "#fff" : "var(--text)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {t === "all" ? "All" : t === "hotel" ? "Hotels" : "Resorts"}
              </button>
            ))}
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginLeft: 8 }}>
              <input type="text" className="search-input" placeholder="Search hotels..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <button type="submit" className="btn btn-outline btn-sm">Search</button>
            </form>
          </div>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #e2e0dc", borderTopColor: "#0c3b2d", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--text-muted)" }}>Loading hotels...</p>
          </div>
        </div>
      ) : hotels.length === 0 ? (
        <div className="empty">
          <h3>No hotels found</h3>
          <p>Add your first hotel to get started.</p>
          <a href="/admin/hotels/new" className="btn btn-primary" style={{ marginTop: 16 }}>+ Add Hotel</a>
        </div>
      ) : (
        <div className="hotels-card-grid">
          {hotels.map((hotel) => (
            <div key={hotel.uid} className="hotels-card">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="hotels-card__image"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='180'%3E%3Crect fill='%23f1f0ec' width='400' height='180'/%3E%3Ctext x='200' y='95' text-anchor='middle' fill='%236b6b6b' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="hotels-card__body">
                <div className="hotels-card__top">
                  <div>
                    <div className="hotels-card__name">{hotel.name}</div>
                    <div className="hotels-card__location">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {hotel.location}
                    </div>
                  </div>
                  <span style={{
                    display: "inline-block",
                    padding: "3px 12px",
                    borderRadius: 100,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    background: hotel.type === "hotel" ? "#e8f5e9" : "#fff3e0",
                    color: hotel.type === "hotel" ? "#2e7d32" : "#e65100",
                  }}>
                    {hotel.type}
                  </span>
                </div>
                <div className="hotels-card__meta">
                  <span className="hotels-card__rating">
                    ★ {hotel.rating || "4.5"}
                  </span>
                  {hotel.featured ? (
                    <span style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 100,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #c9a86a 0%, #e2c98f 100%)",
                      color: "#2a2008",
                    }}>Featured</span>
                  ) : null}
                </div>
                <div className="hotels-card__actions">
                  <a href={`/admin/hotels/${hotel.uid}/edit`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </a>
                  <button onClick={() => handleDelete(hotel.uid, hotel.name)} className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
