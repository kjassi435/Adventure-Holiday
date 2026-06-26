"use client";

import { useEffect, useState } from "react";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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
    if (selected && selected.id === id) setSelected({ ...selected, status: newStatus });
  }

  async function deleteEnquiry(id) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    setSelected(null);
    loadEnquiries();
  }

  function parseMessage(msg) {
    if (!msg) return {};
    const parts = {};
    const refMatch = msg.match(/Ref:\s*(AHD-\w+)/);
    if (refMatch) parts.ref = refMatch[1];
    const travelMatch = msg.match(/Travel Date:\s*([^\|]*)/);
    if (travelMatch) parts.travel_date = travelMatch[1].trim();
    const travellersMatch = msg.match(/Travellers?:\s*([^\|]*)/);
    if (travellersMatch) parts.travellers = travellersMatch[1].trim();
    const cleanMsg = msg.replace(/\|\s*Ref:\s*AHD-\w+/, "").replace(/\|\s*Travel Date:\s*[^\|]*/, "").replace(/\|\s*Travellers?:\s*[^\|]*/, "").replace(/^\s*\|\s*/, "").replace(/\s*\|\s*$/, "").trim();
    parts.message = cleanMsg;
    return parts;
  }

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
                        style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 12, background: "var(--bg)" }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{e.created_at}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setSelected(e)} className="btn btn-outline btn-sm">View</button>
                      <button onClick={() => deleteEnquiry(e.id)} className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setSelected(null)}>
          <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border, #e5e7eb)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 18, color: "var(--emerald, #0c3b2e)" }}>Enquiry Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#999", lineHeight: 1 }}>&times;</button>
            </div>
            <div style={{ padding: 24 }}>
              {(() => {
                const parsed = parseMessage(selected.message);
                const fields = [
                  { label: "Reference", value: parsed.ref || "—" },
                  { label: "Name", value: selected.name },
                  { label: "Email", value: selected.email },
                  { label: "Phone", value: selected.phone || "—" },
                  { label: "Package / Destination", value: selected.package || "—" },
                  { label: "Travel Date", value: parsed.travel_date || "—" },
                  { label: "Travellers", value: parsed.travellers || "—" },
                  { label: "Message", value: parsed.message || selected.message || "—" },
                  { label: "Status", value: selected.status },
                  { label: "Submitted", value: selected.created_at },
                ];
                return fields.map((f) => (
                  <div key={f.label} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted, #888)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.5 }}>{f.value}</div>
                  </div>
                ));
              })()}
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border, #e5e7eb)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {selected.phone && (
                <a href={`tel:${selected.phone}`} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border, #e5e7eb)", background: "#fff", color: "#333", fontSize: 13, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
                  Call
                </a>
              )}
              {selected.email && (
                <a href={`mailto:${selected.email}`} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border, #e5e7eb)", background: "#fff", color: "#333", fontSize: 13, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                  Email
                </a>
              )}
              <button onClick={() => setSelected(null)} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--emerald, #0c3b2e)", color: "#fff", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
