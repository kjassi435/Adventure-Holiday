"use client";

import { useEffect, useState } from "react";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewEnquiry, setViewEnquiry] = useState(null);

  function loadEnquiries() {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search) params.set("search", search);

    fetch("/api/enquiries?" + params.toString())
      .then((r) => r.json())
      .then((data) => { setEnquiries(data); setLoading(false); })
      .catch(console.error);
  }

  useEffect(() => { loadEnquiries(); }, [statusFilter]);

  function handleSearch(e) {
    e.preventDefault();
    loadEnquiries();
  }

  async function updateStatus(id, newStatus) {
    await fetch(`/api/enquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadEnquiries();
    if (viewEnquiry && viewEnquiry.id === id) {
      setViewEnquiry({ ...viewEnquiry, status: newStatus });
    }
  }

  async function deleteEnquiry(id) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    setViewEnquiry(null);
    loadEnquiries();
  }

  const statusColor = (s) => {
    const map = { new: "#2e7d32", contacted: "#1565c0", confirmed: "#e65100", completed: "#7b1fa2" };
    return map[s] || "#666";
  };
  const statusBg = (s) => {
    const map = { new: "#e8f5e9", contacted: "#e3f2fd", confirmed: "#fff3e0", completed: "#f3e5f5" };
    return map[s] || "#f5f5f5";
  };

  return (
    <div>
      <div className="page-header">
        <h1>Enquiries ({enquiries.length})</h1>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <div className="table-actions">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="search-input" style={{ minWidth: 130 }}>
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
              <input type="text" className="search-input" placeholder="Search by name, email, package..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <button type="submit" className="btn btn-outline btn-sm">Search</button>
            </form>
          </div>
        </div>

        {loading ? (
          <p style={{ padding: 40, textAlign: "center" }}>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Package</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No enquiries found</td></tr>
              ) : (
                enquiries.map((e) => (
                  <tr key={e.id}>
                    <td><strong>{e.name}</strong></td>
                    <td>{e.email}</td>
                    <td>{e.phone || "—"}</td>
                    <td>{e.package || "—"}</td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.message || "—"}</td>
                    <td>
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e.id, ev.target.value)}
                        style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${statusColor(e.status)}40`, fontSize: 12, background: statusBg(e.status), color: statusColor(e.status), fontWeight: 600 }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{e.created_at}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setViewEnquiry(e)} className="btn btn-outline btn-sm" style={{ fontSize: 12, padding: "4px 10px" }}>View</button>
                      <button onClick={() => deleteEnquiry(e.id)} className="btn btn-danger btn-sm" style={{ fontSize: 12, padding: "4px 10px" }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* View Enquiry Modal */}
      {viewEnquiry && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }} onClick={() => setViewEnquiry(null)}>
          <div style={{
            background: "var(--surface)", borderRadius: 12, maxWidth: 560, width: "100%",
            maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--emerald)" }}>Enquiry Details</h2>
              <button onClick={() => setViewEnquiry(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Name</label>
                  <p style={{ fontWeight: 600, marginTop: 2 }}>{viewEnquiry.name}</p>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Phone</label>
                  <p style={{ marginTop: 2 }}>{viewEnquiry.phone || "—"}</p>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Email</label>
                  <p style={{ marginTop: 2 }}>{viewEnquiry.email || "—"}</p>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Package</label>
                  <p style={{ fontWeight: 600, marginTop: 2, color: "var(--emerald)" }}>{viewEnquiry.package || "—"}</p>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Travel Date</label>
                  <p style={{ marginTop: 2 }}>{viewEnquiry.travel_date || "Not specified"}</p>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Travellers</label>
                  <p style={{ marginTop: 2 }}>{viewEnquiry.travellers || "—"}</p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Status</label>
                <div style={{ marginTop: 6 }}>
                  <select
                    value={viewEnquiry.status}
                    onChange={(ev) => updateStatus(viewEnquiry.id, ev.target.value)}
                    style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${statusColor(viewEnquiry.status)}40`, fontSize: 13, background: statusBg(viewEnquiry.status), color: statusColor(viewEnquiry.status), fontWeight: 600 }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Message</label>
                <div style={{ marginTop: 6, padding: 16, background: "var(--surface-2)", borderRadius: 8, fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {viewEnquiry.message || "No message provided."}
                </div>
              </div>

              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Submitted: {viewEnquiry.created_at}
              </div>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setViewEnquiry(null)} className="btn btn-outline btn-sm">Close</button>
              <button onClick={() => deleteEnquiry(viewEnquiry.id)} className="btn btn-danger btn-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
