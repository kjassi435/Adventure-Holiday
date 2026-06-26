"use client";

import { useEffect, useState } from "react";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  function loadPackages() {
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (search) params.set("search", search);

    fetch("/api/packages?" + params.toString())
      .then((r) => r.json())
      .then((data) => { setPackages(data); setLoading(false); })
      .catch(console.error);
  }

  useEffect(() => { loadPackages(); }, [typeFilter]);

  function handleSearch(e) {
    e.preventDefault();
    loadPackages();
  }

  async function handleDelete(uid, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/packages/${uid}`, { method: "DELETE" });
    loadPackages();
  }

  return (
    <div>
      <div className="page-header">
        <h1>Packages ({packages.length})</h1>
        <a href="/admin/packages/new" className="btn btn-primary">+ Add Package</a>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <div className="table-actions">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="search-input" style={{ minWidth: 130 }}>
              <option value="all">All Types</option>
              <option value="domestic">Domestic</option>
              <option value="spiritual">Spiritual</option>
            </select>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
              <input type="text" className="search-input" placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <th>Image</th>
                <th>Title</th>
                <th>Type</th>
                <th>Region</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.uid}>
                  <td>
                    <img src={pkg.img} alt="" style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }} />
                  </td>
                  <td><strong>{pkg.title}</strong></td>
                  <td><span className={`badge badge-${pkg.type}`}>{pkg.type}</span></td>
                  <td>{pkg.region}</td>
                  <td>{pkg.price}</td>
                  <td>{pkg.duration}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <a href={`/admin/packages/${pkg.uid}/edit`} className="btn btn-outline btn-sm">Edit</a>
                      <button onClick={() => handleDelete(pkg.uid, pkg.title)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No packages found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
