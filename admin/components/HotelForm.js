"use client";

import { useState } from "react";

function parseJSON(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}

function parseRoomTypes(val) {
  if (!val) return [];
  let arr = [];
  if (typeof val === "string") {
    try { arr = JSON.parse(val); } catch { return []; }
  } else if (Array.isArray(val)) {
    arr = val;
  } else return [];
  return arr.map((r) => ({
    name: r.name || "",
    price: r.price || "",
    plan: r.plan || "EP",
    guests: r.guests || "2",
    bed: r.bed || "",
    size: r.size || "",
    amenities: Array.isArray(r.amenities) ? r.amenities.join(", ") : (r.amenities || ""),
  }));
}

function parseMealPlans(val) {
  if (!val) return [];
  let arr = [];
  if (typeof val === "string") {
    try { arr = JSON.parse(val); } catch { return []; }
  } else if (Array.isArray(val)) {
    arr = val;
  } else return [];
  return arr.map((m) => ({
    name: m.name || "",
    description: m.description || "",
    price: m.price || "",
  }));
}

function SectionIcon({ d }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function HotelForm({ initial, onSubmit, submitLabel = "Save Hotel" }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    type: initial?.type || "hotel",
    location: initial?.location || "",
    region: initial?.region || "",
    image: initial?.image || "",
    description: initial?.description || "",
    rating: initial?.rating || 4.5,
    featured: initial?.featured === 1 || initial?.featured === true,
    policies: initial?.policies || "",
    how_to_reach: initial?.how_to_reach || "",
    amenities: parseJSON(initial?.amenities),
    highlights: parseJSON(initial?.highlights),
    roomTypes: parseRoomTypes(initial?.room_types),
    mealPlans: parseMealPlans(initial?.meal_plans),
    gallery: parseJSON(initial?.gallery),
  });

  const [galleryInput, setGalleryInput] = useState("");

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleArrayField(field, index, value) {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  }

  function addArrayItem(field, defaultValue = "") {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], defaultValue] }));
  }

  function removeArrayItem(field, index) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  function handleRoomTypeField(index, field, value) {
    setForm((prev) => {
      const arr = [...prev.roomTypes];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, roomTypes: arr };
    });
  }

  function addRoomType() {
    setForm((prev) => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { name: "", price: "", plan: "EP", guests: "2", bed: "", size: "", amenities: "" }],
    }));
  }

  function removeRoomType(index) {
    setForm((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index),
    }));
  }

  function handleMealPlanField(index, field, value) {
    setForm((prev) => {
      const arr = [...prev.mealPlans];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, mealPlans: arr };
    });
  }

  function addMealPlan() {
    setForm((prev) => ({
      ...prev,
      mealPlans: [...prev.mealPlans, { name: "", description: "", price: "" }],
    }));
  }

  function removeMealPlan(index) {
    setForm((prev) => ({
      ...prev,
      mealPlans: prev.mealPlans.filter((_, i) => i !== index),
    }));
  }

  function addGalleryImage() {
    if (!galleryInput.trim()) return;
    setForm((prev) => ({ ...prev, gallery: [...prev.gallery, galleryInput.trim()] }));
    setGalleryInput("");
  }

  function removeGalleryImage(index) {
    setForm((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      type: form.type,
      location: form.location,
      region: form.region,
      image: form.image,
      description: form.description,
      rating: form.rating,
      featured: form.featured ? 1 : 0,
      policies: form.policies,
      how_to_reach: form.how_to_reach,
      amenities: form.amenities.filter((a) => a.trim()),
      highlights: form.highlights.filter((h) => h.trim()),
      gallery: form.gallery.filter((g) => g.trim()),
      room_types: form.roomTypes.map((r) => ({
        name: r.name,
        price: r.price,
        plan: r.plan,
        guests: r.guests,
        bed: r.bed,
        size: r.size,
        amenities: r.amenities.split(",").map((a) => a.trim()).filter(Boolean),
      })),
      meal_plans: form.mealPlans.map((m) => ({
        name: m.name,
        description: m.description,
        price: m.price,
      })),
    };
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Banner */}
      <div className="hotel-form-banner">
        <h1>{initial ? "Edit Hotel" : "Add New Hotel"}</h1>
        <p>{initial ? "Update hotel details below" : "Fill in the details to add a new hotel or resort"}</p>
      </div>

      {/* Basic Info */}
      <div className="hotel-form-section">
        <div className="hotel-form-section__header">
          <SectionIcon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <h2>Basic Information</h2>
        </div>
        <div className="hotel-form-grid">
          <div className="hotel-form-field">
            <label>Hotel Name *</label>
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Taj Lake Palace" />
          </div>
          <div className="hotel-form-field">
            <label>Type *</label>
            <select value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="hotel">Hotel</option>
              <option value="resort">Resort</option>
            </select>
          </div>
          <div className="hotel-form-field">
            <label>Location *</label>
            <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} required placeholder="e.g. Har Ki Pauri, Haridwar" />
          </div>
          <div className="hotel-form-field">
            <label>Region</label>
            <input type="text" value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="e.g. Uttarakhand" />
          </div>
          <div className="hotel-form-field">
            <label>Rating (out of 5)</label>
            <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set("rating", parseFloat(e.target.value) || 0)} />
          </div>
          <div className="hotel-form-field">
            <label>Hero Image URL</label>
            <input type="text" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
          </div>
        </div>
        {form.image && (
          <img src={form.image} alt="Preview" className="hotel-form-image-preview" onError={(e) => { e.target.style.display = "none"; }} />
        )}
        <div className="hotel-form-field" style={{ marginTop: 18 }}>
          <label>Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the hotel, its ambiance, and what makes it special..." />
        </div>
        <div style={{ marginTop: 16 }}>
          <label className="hotel-form-toggle">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
            <span>Featured Hotel</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 400, marginLeft: 4 }}>(shown on homepage carousel)</span>
          </label>
        </div>
      </div>

      {/* Amenities */}
      <div className="hotel-form-section">
        <div className="hotel-form-section__header">
          <SectionIcon d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          <h2>Amenities</h2>
        </div>
        {form.amenities.map((item, i) => (
          <div key={i} className="hotel-form-chip">
            <input type="text" value={item} onChange={(e) => handleArrayField("amenities", i, e.target.value)} placeholder="e.g. Free WiFi, Pool, Spa..." />
            <button type="button" className="btn-remove" onClick={() => removeArrayItem("amenities", i)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
        <button type="button" className="hotel-form-add" onClick={() => addArrayItem("amenities")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Amenity
        </button>
      </div>

      {/* Highlights */}
      <div className="hotel-form-section">
        <div className="hotel-form-section__header">
          <SectionIcon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <h2>Highlights</h2>
        </div>
        {form.highlights.map((item, i) => (
          <div key={i} className="hotel-form-chip">
            <input type="text" value={item} onChange={(e) => handleArrayField("highlights", i, e.target.value)} placeholder="e.g. River facing rooms, Bonfire area..." />
            <button type="button" className="btn-remove" onClick={() => removeArrayItem("highlights", i)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
        <button type="button" className="hotel-form-add" onClick={() => addArrayItem("highlights")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Highlight
        </button>
      </div>

      {/* Room Types */}
      <div className="hotel-form-section">
        <div className="hotel-form-section__header">
          <SectionIcon d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14" />
          <h2>Room Types</h2>
        </div>
        {form.roomTypes.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>No room types added yet. Click the button below to add one.</p>
        )}
        {form.roomTypes.map((room, i) => (
          <div key={i} className="hotel-room-card">
            <div className="hotel-room-card__header">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="hotel-room-card__number">{i + 1}</span>
                <span className="hotel-room-card__title">{room.name || "New Room"}</span>
              </div>
              <button type="button" className="btn-remove-room" onClick={() => removeRoomType(i)}>Remove</button>
            </div>
            <div className="hotel-form-grid hotel-form-grid--3">
              <div className="hotel-form-field">
                <label>Room Name</label>
                <input type="text" value={room.name} onChange={(e) => handleRoomTypeField(i, "name", e.target.value)} placeholder="e.g. Deluxe Room" />
              </div>
              <div className="hotel-form-field">
                <label>Price / Night</label>
                <input type="text" value={room.price} onChange={(e) => handleRoomTypeField(i, "price", e.target.value)} placeholder="e.g. ₹7,500" />
              </div>
              <div className="hotel-form-field">
                <label>Meal Plan</label>
                <select value={room.plan} onChange={(e) => handleRoomTypeField(i, "plan", e.target.value)}>
                  <option value="EP">EP (Room Only)</option>
                  <option value="CP">CP (Breakfast)</option>
                  <option value="MAP">MAP (Breakfast + Dinner)</option>
                  <option value="AP">AP (All Meals)</option>
                </select>
              </div>
              <div className="hotel-form-field">
                <label>Max Guests</label>
                <input type="text" value={room.guests} onChange={(e) => handleRoomTypeField(i, "guests", e.target.value)} placeholder="2" />
              </div>
              <div className="hotel-form-field">
                <label>Bed Type</label>
                <input type="text" value={room.bed} onChange={(e) => handleRoomTypeField(i, "bed", e.target.value)} placeholder="e.g. King Bed" />
              </div>
              <div className="hotel-form-field">
                <label>Room Size</label>
                <input type="text" value={room.size} onChange={(e) => handleRoomTypeField(i, "size", e.target.value)} placeholder="e.g. 350 sq ft" />
              </div>
            </div>
            <div className="hotel-form-field" style={{ marginTop: 12 }}>
              <label>Room Amenities (comma-separated)</label>
              <input type="text" value={room.amenities} onChange={(e) => handleRoomTypeField(i, "amenities", e.target.value)} placeholder="e.g. AC, WiFi, TV, Balcony" />
            </div>
          </div>
        ))}
        <button type="button" className="hotel-form-add" onClick={addRoomType}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Room Type
        </button>
      </div>

      {/* Meal Plans */}
      <div className="hotel-form-section">
        <div className="hotel-form-section__header">
          <SectionIcon d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <h2>Meal Plans</h2>
        </div>
        {form.mealPlans.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>No meal plans added yet.</p>
        )}
        {form.mealPlans.map((plan, i) => (
          <div key={i} className="hotel-meal-card">
            <div className="hotel-meal-card__header">
              <span style={{ fontWeight: 700, color: "var(--emerald)", fontSize: "0.95rem" }}>Plan {i + 1}</span>
              <button type="button" className="btn-remove-room" onClick={() => removeMealPlan(i)}>Remove</button>
            </div>
            <div className="hotel-form-grid">
              <div className="hotel-form-field">
                <label>Plan Name</label>
                <input type="text" value={plan.name} onChange={(e) => handleMealPlanField(i, "name", e.target.value)} placeholder="e.g. EP / CP / MAP / AP" />
              </div>
              <div className="hotel-form-field">
                <label>Extra Cost</label>
                <input type="text" value={plan.price} onChange={(e) => handleMealPlanField(i, "price", e.target.value)} placeholder="e.g. +₹500/night" />
              </div>
            </div>
            <div className="hotel-form-field" style={{ marginTop: 12 }}>
              <label>Description</label>
              <textarea rows={2} value={plan.description} onChange={(e) => handleMealPlanField(i, "description", e.target.value)} placeholder="What's included in this meal plan..." />
            </div>
          </div>
        ))}
        <button type="button" className="hotel-form-add" onClick={addMealPlan}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Meal Plan
        </button>
      </div>

      {/* Gallery */}
      <div className="hotel-form-section">
        <div className="hotel-form-section__header">
          <SectionIcon d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <h2>Gallery</h2>
        </div>
        {form.gallery.length > 0 && (
          <div className="hotel-gallery-grid">
            {form.gallery.map((url, i) => (
              <div key={i} className="hotel-gallery-item">
                <img src={url} alt={`Gallery ${i + 1}`} onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Crect fill='%23f1f0ec' width='100' height='60'/%3E%3Ctext x='50' y='34' text-anchor='middle' fill='%236b6b6b' font-size='11'%3ENo Image%3C/text%3E%3C/svg%3E"; }} />
                <button type="button" className="hotel-gallery-item__remove" onClick={() => removeGalleryImage(i)}>×</button>
              </div>
            ))}
          </div>
        )}
        <div className="hotel-gallery-url">
          <input
            type="text"
            value={galleryInput}
            onChange={(e) => setGalleryInput(e.target.value)}
            placeholder="Paste image URL and press Add"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGalleryImage(); } }}
          />
          <button type="button" className="btn btn-outline btn-sm" onClick={addGalleryImage}>Add</button>
        </div>
      </div>

      {/* Policies & Access */}
      <div className="hotel-form-section">
        <div className="hotel-form-section__header">
          <SectionIcon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <h2>Policies &amp; How to Reach</h2>
        </div>
        <div className="hotel-form-field" style={{ marginBottom: 18 }}>
          <label>Hotel Policies</label>
          <textarea rows={3} value={form.policies} onChange={(e) => set("policies", e.target.value)} placeholder="Check-in/out times, cancellation policy, ID requirements..." />
        </div>
        <div className="hotel-form-field">
          <label>How to Reach</label>
          <textarea rows={3} value={form.how_to_reach} onChange={(e) => set("how_to_reach", e.target.value)} placeholder="Nearest airport, railway station, driving directions..." />
        </div>
      </div>

      {/* Submit */}
      <div className="hotel-form-submit">
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        <a href="/admin/hotels" style={{ color: "var(--text-muted)", fontWeight: 500, fontSize: "0.9rem" }}>Cancel</a>
      </div>
    </form>
  );
}
