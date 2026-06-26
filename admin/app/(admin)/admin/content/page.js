"use client";

import { useEffect, useState } from "react";

const SECTION_LABELS = {
  popular: { label: "Popular Destinations", fields: { heading: "Section Heading", subtitle: "Section Subtitle" } },
  spiritual: { label: "Spiritual Journeys", fields: { heading: "Section Heading", subtitle: "Section Subtitle" } },
};

export default function ContentPage() {
  const [form, setForm] = useState({
    popular: { heading: "Popular Destinations", subtitle: "Where India goes to holiday" },
    spiritual: { heading: "Spiritual Journeys", subtitle: "Divine destinations await" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const f = { popular: {}, spiritual: {} };
        data.forEach((item) => {
          if (item.section === "carousels") {
            if (item.key === "popular_heading") f.popular.heading = item.value;
            else if (item.key === "popular_subtitle") f.popular.subtitle = item.value;
            else if (item.key === "spiritual_heading") f.spiritual.heading = item.value;
            else if (item.key === "spiritual_subtitle") f.spiritual.subtitle = item.value;
          }
        });
        setForm((prev) => ({ ...prev, ...f }));
        setLoading(false);
      });
  }, []);

  function handleChange(section, field, value) {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    const payload = [
      { section: "carousels", key: "popular_heading", value: form.popular.heading },
      { section: "carousels", key: "popular_subtitle", value: form.popular.subtitle },
      { section: "carousels", key: "spiritual_heading", value: form.spiritual.heading },
      { section: "carousels", key: "spiritual_subtitle", value: form.spiritual.subtitle },
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Homepage Carousel Content</h1>
        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {Object.entries(SECTION_LABELS).map(([section, cfg]) => (
        <div key={section} className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 16, color: "var(--emerald)" }}>{cfg.label}</h3>
          {Object.entries(cfg.fields).map(([field, label]) => (
            <div key={field} className="form-group">
              <label>{label}</label>
              <input
                type="text"
                value={form[section]?.[field] || ""}
                onChange={(e) => handleChange(section, field, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}

      <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
        These values update the carousel section headings on the homepage. Changes appear after you click "Save Changes" and refresh the homepage.
      </p>
    </div>
  );
}
