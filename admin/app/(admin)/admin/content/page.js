"use client";

import { useEffect, useState } from "react";

const TABS = ["Homepage", "Testimonials", "Hero & Logo"];

function toDirectImageUrl(url) {
  if (!url) return url;
  var m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return "https://drive.google.com/uc?export=download&id=" + m[1];
  var m2 = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (m2) return "https://drive.google.com/uc?export=download&id=" + m2[1];
  return url;
}

export default function ContentPage() {
  const [tab, setTab] = useState("Homepage");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [homepage, setHomepage] = useState({
    popular_heading: "Popular Destinations",
    popular_subtitle: "Where India goes to holiday",
    spiritual_heading: "Spiritual Journeys",
    spiritual_subtitle: "Divine destinations await",
  });

  const [hero, setHero] = useState({
    hero_heading: "Explore More. Create Memories.",
    hero_sub: "From the wild forests of Jim Corbett to the serene backwaters of Kerala — curated holidays, personalized itineraries, and memorable experiences across India.",
    hero_video: "",
    logo_url: "",
  });

  const [testimonials, setTestimonials] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testForm, setTestForm] = useState({ name: "", location: "", rating: "5", text: "" });

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const hp = {}, ht = {}, heroData = {};
        data.forEach((item) => {
          if (item.section === "carousels") {
            if (item.key === "popular_heading") hp.popular_heading = item.value;
            else if (item.key === "popular_subtitle") hp.popular_subtitle = item.value;
            else if (item.key === "spiritual_heading") hp.spiritual_heading = item.value;
            else if (item.key === "spiritual_subtitle") hp.spiritual_subtitle = item.value;
          }
          if (item.section === "hero") {
            heroData[item.key] = item.value;
          }
          if (item.section === "testimonials") {
            try { ht[item.key] = JSON.parse(item.value); } catch(e) { ht[item.key] = item.value; }
          }
        });
        setHomepage((p) => ({ ...p, ...hp }));
        setHero((p) => ({ ...p, ...heroData }));
        if (ht.list) setTestimonials(ht.list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function saveAll() {
    setSaving(true);
    const payload = [
      { section: "carousels", key: "popular_heading", value: homepage.popular_heading },
      { section: "carousels", key: "popular_subtitle", value: homepage.popular_subtitle },
      { section: "carousels", key: "spiritual_heading", value: homepage.spiritual_heading },
      { section: "carousels", key: "spiritual_subtitle", value: homepage.spiritual_subtitle },
      { section: "hero", key: "hero_heading", value: hero.hero_heading },
      { section: "hero", key: "hero_sub", value: hero.hero_sub },
      { section: "hero", key: "hero_video", value: hero.hero_video },
      { section: "hero", key: "logo_url", value: hero.logo_url },
      { section: "testimonials", key: "list", value: JSON.stringify(testimonials) },
    ];
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addTestimonial() {
    setEditingTestimonial(null);
    setTestForm({ name: "", location: "", rating: "5", text: "" });
  }

  function editTestimonial(idx) {
    setEditingTestimonial(idx);
    setTestForm({ ...testimonials[idx] });
  }

  function saveTestimonial() {
    if (!testForm.name || !testForm.text) return;
    const updated = [...testimonials];
    if (editingTestimonial !== null) {
      updated[editingTestimonial] = { ...testForm };
    } else {
      updated.push({ ...testForm });
    }
    setTestimonials(updated);
    setEditingTestimonial(null);
    setTestForm({ name: "", location: "", rating: "5", text: "" });
  }

  function deleteTestimonial(idx) {
    setTestimonials(testimonials.filter((_, i) => i !== idx));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Content Management</h1>
        <button onClick={saveAll} className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "2px solid var(--border)" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 20px", border: "none", background: "none", fontWeight: 600,
            fontSize: "0.9rem", color: tab === t ? "var(--emerald)" : "var(--text-muted)",
            borderBottom: tab === t ? "2px solid var(--emerald)" : "2px solid transparent",
            marginBottom: -2, cursor: "pointer", transition: "all 0.2s",
          }}>{t}</button>
        ))}
      </div>

      {/* Homepage Tab */}
      {tab === "Homepage" && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 16, color: "var(--emerald)" }}>Carousel Section Headings</h3>
          <div className="form-group">
            <label>Popular Destinations — Heading</label>
            <input type="text" value={homepage.popular_heading} onChange={(e) => setHomepage({ ...homepage, popular_heading: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Popular Destinations — Subtitle</label>
            <input type="text" value={homepage.popular_subtitle} onChange={(e) => setHomepage({ ...homepage, popular_subtitle: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Spiritual Journeys — Heading</label>
            <input type="text" value={homepage.spiritual_heading} onChange={(e) => setHomepage({ ...homepage, spiritual_heading: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Spiritual Journeys — Subtitle</label>
            <input type="text" value={homepage.spiritual_subtitle} onChange={(e) => setHomepage({ ...homepage, spiritual_subtitle: e.target.value })} />
          </div>
        </div>
      )}

      {/* Hero & Logo Tab */}
      {tab === "Hero & Logo" && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16, color: "var(--emerald)" }}>Hero Section</h3>
            <div className="form-group">
              <label>Hero Heading</label>
              <input type="text" value={hero.hero_heading} onChange={(e) => setHero({ ...hero, hero_heading: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hero Subtitle</label>
              <textarea rows={2} value={hero.hero_sub} onChange={(e) => setHero({ ...hero, hero_sub: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Background Video URL (MP4 or YouTube embed — optional)</label>
              <input type="text" placeholder="https://example.com/video.mp4" value={hero.hero_video} onChange={(e) => setHero({ ...hero, hero_video: e.target.value })} />
              <small style={{ color: "var(--text-muted)", fontSize: 12 }}>Paste a direct video URL (.mp4) or leave empty for image background.</small>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 16, color: "var(--emerald)" }}>Logo Management</h3>
            <div className="form-group">
              <label>Logo Image URL</label>
              <input type="text" placeholder="https://example.com/logo.png or /images/logo.jpg" value={hero.logo_url} onChange={(e) => setHero({ ...hero, logo_url: e.target.value })} />
              <small style={{ color: "var(--text-muted)", fontSize: 12 }}>Paste a direct image URL. Use <code>/images/logo.jpg</code> for the current logo. Google Drive links won't work — use a direct image URL instead.</small>
            </div>
            {hero.logo_url && (
              <div style={{ marginTop: 12, padding: 16, background: "var(--surface-2)", borderRadius: 8, textAlign: "center" }}>
                <img src={toDirectImageUrl(hero.logo_url)} alt="Logo preview" style={{ maxHeight: 60, maxWidth: 200, objectFit: "contain" }} />
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Logo Preview</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {tab === "Testimonials" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "var(--emerald)" }}>Manage Testimonials ({testimonials.length})</h3>
            <button onClick={addTestimonial} className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Testimonial
            </button>
          </div>

          {/* Add/Edit Form */}
          {(editingTestimonial !== null || testForm.name !== "" || testForm.text !== "") && (
            <div className="card" style={{ marginBottom: 16, border: "2px solid var(--gold)" }}>
              <h4 style={{ marginBottom: 12, color: "var(--emerald)" }}>{editingTestimonial !== null ? "Edit Testimonial" : "New Testimonial"}</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" value={testForm.name} onChange={(e) => setTestForm({ ...testForm, name: e.target.value })} placeholder="e.g., Priya Sharma" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" value={testForm.location} onChange={(e) => setTestForm({ ...testForm, location: e.target.value })} placeholder="e.g., New Delhi" />
                </div>
              </div>
              <div className="form-group">
                <label>Rating</label>
                <select value={testForm.rating} onChange={(e) => setTestForm({ ...testForm, rating: e.target.value })} style={{ width: 120 }}>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>
              <div className="form-group">
                <label>Review Text *</label>
                <textarea rows={3} value={testForm.text} onChange={(e) => setTestForm({ ...testForm, text: e.target.value })} placeholder="What the guest said..." />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveTestimonial} className="btn btn-primary btn-sm">{editingTestimonial !== null ? "Update" : "Add"}</button>
                <button onClick={() => { setEditingTestimonial(null); setTestForm({ name: "", location: "", rating: "5", text: "" }); }} className="btn btn-outline btn-sm">Cancel</button>
              </div>
            </div>
          )}

          {/* Testimonial List */}
          {testimonials.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
              <p>No testimonials yet. Click &quot;Add Testimonial&quot; to create one.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {testimonials.map((t, i) => (
                <div key={i} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <strong>{t.name}</strong>
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{t.location}</span>
                      <span style={{ color: "#f59e0b" }}>{"★".repeat(parseInt(t.rating) || 5)}</span>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>&ldquo;{t.text}&rdquo;</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => editTestimonial(i)} className="btn btn-outline btn-sm">Edit</button>
                    <button onClick={() => deleteTestimonial(i)} className="btn btn-danger btn-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
