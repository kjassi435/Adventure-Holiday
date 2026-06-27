"use client";

import { useEffect, useState } from "react";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
  }

  async function deleteEnquiry(id) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    loadEnquiries();
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
                    <td>
                      <button onClick={() => deleteEnquiry(e.id)} className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
