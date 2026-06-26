"use client";

import { useEffect, useState } from "react";

export default function CarouselsPage() {
  const [items, setItems] = useState([]);
  const [section, setSection] = useState("popular");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  function loadItems() {
    setLoading(true);
    fetch("/api/carousel-items?section=" + section)
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(console.error);
  }

  useEffect(() => { loadItems(); }, [section]);

  async function handleSave(form) {
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? "/api/carousel-items/" + form.id : "/api/carousel-items";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setEditing(null);
    loadItems();
  }

  async function handleDelete(id, name) {
    if (!confirm('Delete "' + name + '" from carousel?')) return;
    await fetch("/api/carousel-items/" + id, { method: "DELETE" });
    loadItems();
  }

  function handleMove(id, dir) {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const swap = idx + dir;
    if (swap < 0 || swap >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swap];
    Promise.all([
      fetch("/api/carousel-items/" + a.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...a, sort_order: b.sort_order }) }),
      fetch("/api/carousel-items/" + b.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...b, sort_order: a.sort_order }) }),
    ]).then(() => loadItems());
  }

  return (
    <div>
      <div className="page-header">
        <h1>Carousel Items</h1>
        <button onClick={() => setEditing({ section, sort_order: items.length + 1, data_dest: "", name: "", tag: "", meta: "", image: "", link: "" })} className="btn btn-primary">+ Add Card</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className={"btn " + (section === "popular" ? "btn-primary" : "btn-outline")} onClick={() => setSection("popular")}>Popular Destinations</button>
        <button className={"btn " + (section === "spiritual" ? "btn-primary" : "btn-outline")} onClick={() => setSection("spiritual")}>Spiritual Journeys</button>
      </div>

      {editing && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 16, color: "var(--emerald)" }}>{editing.id ? "Edit Card" : "New Card"}</h3>
          <CarouselItemForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div className="empty"><h3>No cards yet</h3><p>Add your first carousel card using the button above.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Tag</th>
                <th>Meta</th>
                <th>Link</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.sort((a, b) => a.sort_order - b.sort_order).map((item, i) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image} alt="" style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }} />
                  </td>
                  <td><strong>{item.name}</strong></td>
                  <td><span className="badge badge-new">{item.tag}</span></td>
                  <td>{item.meta}</td>
                  <td style={{ fontSize: 12 }}>{item.link}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => handleMove(item.id, -1)} className="btn btn-outline btn-sm" disabled={i === 0}>&uarr;</button>
                      <button onClick={() => handleMove(item.id, 1)} className="btn btn-outline btn-sm" disabled={i === items.length - 1}>&darr;</button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setEditing(item)} className="btn btn-outline btn-sm">Edit</button>
                      <button onClick={() => handleDelete(item.id, item.name)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CarouselItemForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...form,
      section: form.section || initial.section,
      sort_order: parseInt(form.sort_order) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Jim Corbett" required />
        </div>
        <div className="form-group">
          <label>Data ID</label>
          <input name="data_dest" value={form.data_dest} onChange={handleChange} placeholder="e.g. corbett" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Tag</label>
          <input name="tag" value={form.tag} onChange={handleChange} placeholder="e.g. Wildlife" />
        </div>
        <div className="form-group">
          <label>Meta / Location</label>
          <input name="meta" value={form.meta} onChange={handleChange} placeholder="e.g. Uttarakhand" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Image URL *</label>
          <input name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." required />
        </div>
        <div className="form-group">
          <label>Sort Order</label>
          <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} />
        </div>
      </div>
      <div className="form-group">
        <label>Link URL</label>
        <input name="link" value={form.link} onChange={handleChange} placeholder="e.g. domestic.html or detail.html?id=d1" />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" className="btn btn-primary">{form.id ? "Update" : "Add"} Card</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
