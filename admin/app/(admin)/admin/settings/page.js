"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLoading(false); })
      .catch(console.error);
  }, []);

  function updateValue(idx, val) {
    setSettings((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], value: val };
      return copy;
    });
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p>Loading settings...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Site Settings</h1>
        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="card">
        {settings.map((item, idx) => (
          <div key={item.key} className="form-group">
            <label>{item.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</label>
            {item.value && item.value.length > 80 ? (
              <textarea
                value={item.value}
                onChange={(e) => updateValue(idx, e.target.value)}
                rows={3}
              />
            ) : (
              <input
                type="text"
                value={item.value || ""}
                onChange={(e) => updateValue(idx, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
