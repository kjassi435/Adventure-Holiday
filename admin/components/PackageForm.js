"use client";

import { useState } from "react";

export default function PackageForm({ initial, onSubmit, submitLabel }) {
  const [form, setForm] = useState({
    title: "", type: "domestic", region: "", price: "", orig_price: "",
    duration: "", guests: "2", tag: "", img: "", rating: 4.5, reviews: 0,
    description: "", highlights: "", inclusions: "", exclusions: "",
    itinerary: "", how_to_reach: "", things_to_carry: "", important_info: "",
    eligibility: "", location: "", cancellation: "",
    ...initial,
  });

  const [highlightsList, setHighlightsList] = useState(() => {
    if (Array.isArray(initial?.highlights)) return initial.highlights.join("\n");
    return "";
  });
  const [inclusionsList, setInclusionsList] = useState(() => {
    if (Array.isArray(initial?.inclusions)) return initial.inclusions.join("\n");
    return "";
  });
  const [exclusionsList, setExclusionsList] = useState(() => {
    if (Array.isArray(initial?.exclusions)) return initial.exclusions.join("\n");
    return "";
  });
  const [itineraryList, setItineraryList] = useState(() => {
    if (Array.isArray(initial?.itinerary)) return initial.itinerary.map((i) => `${i.day}: ${i.desc}`).join("\n");
    return "";
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      rating: parseFloat(form.rating) || 4.5,
      reviews: parseInt(form.reviews) || 0,
      highlights: highlightsList.split("\n").map((s) => s.trim()).filter(Boolean),
      inclusions: inclusionsList.split("\n").map((s) => s.trim()).filter(Boolean),
      exclusions: exclusionsList.split("\n").map((s) => s.trim()).filter(Boolean),
      itinerary: itineraryList.split("\n").map((s) => s.trim()).filter(Boolean).map((line) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0) return { day: line.substring(0, colonIdx).trim(), desc: line.substring(colonIdx + 1).trim() };
        return { day: "Note", desc: line };
      }),
    };
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16, color: "var(--emerald)" }}>Basic Info</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Kashmir Paradise" />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="domestic">Domestic</option>
              <option value="spiritual">Spiritual</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Region</label>
            <input name="region" value={form.region} onChange={handleChange} placeholder="e.g. North India" />
          </div>
          <div className="form-group">
            <label>Tag</label>
            <input name="tag" value={form.tag} onChange={handleChange} placeholder="e.g. Domestic, Honeymoon, Wildlife" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Duration</label>
            <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 5N / 6D" />
          </div>
          <div className="form-group">
            <label>Guests</label>
            <input name="guests" value={form.guests} onChange={handleChange} placeholder="e.g. 2, Couple, Family" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. ₹15,000" />
          </div>
          <div className="form-group">
            <label>Original Price</label>
            <input name="orig_price" value={form.orig_price} onChange={handleChange} placeholder="e.g. ₹22,000" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Rating</label>
            <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Reviews Count</label>
            <input name="reviews" type="number" min="0" value={form.reviews} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input name="img" value={form.img} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
          {form.img && <img src={form.img} alt="Preview" className="img-preview" />}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16, color: "var(--emerald)" }}>Description & Lists</h3>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Full package description..." />
        </div>
        <div className="form-group">
          <label>Highlights (one per line)</label>
          <textarea value={highlightsList} onChange={(e) => setHighlightsList(e.target.value)} rows={4} placeholder="Dal Lake Shikara Ride&#10;Mughal Gardens Visit" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Inclusions (one per line)</label>
            <textarea value={inclusionsList} onChange={(e) => setInclusionsList(e.target.value)} rows={4} placeholder="Hotel Stay&#10;Breakfast & Dinner" />
          </div>
          <div className="form-group">
            <label>Exclusions (one per line)</label>
            <textarea value={exclusionsList} onChange={(e) => setExclusionsList(e.target.value)} rows={4} placeholder="Flights&#10;Personal expenses" />
          </div>
        </div>
        <div className="form-group">
          <label>Itinerary (one per line, format: Day X: Description)</label>
          <textarea value={itineraryList} onChange={(e) => setItineraryList(e.target.value)} rows={6} placeholder="Day 1: Arrival in Srinagar. Airport pickup.&#10;Day 2: Srinagar to Gulmarg." />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16, color: "var(--emerald)" }}>Additional Info</h3>
        <div className="form-group">
          <label>How to Reach</label>
          <textarea name="how_to_reach" value={form.how_to_reach} onChange={handleChange} rows={2} />
        </div>
        <div className="form-group">
          <label>Things to Carry</label>
          <textarea name="things_to_carry" value={form.things_to_carry} onChange={handleChange} rows={2} />
        </div>
        <div className="form-group">
          <label>Important Info</label>
          <textarea name="important_info" value={form.important_info} onChange={handleChange} rows={2} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Eligibility</label>
            <input name="eligibility" value={form.eligibility} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Cancellation Policy</label>
          <textarea name="cancellation" value={form.cancellation} onChange={handleChange} rows={2} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button type="submit" className="btn btn-primary">{submitLabel || "Save Package"}</button>
        <a href="/admin/packages" className="btn btn-outline">Cancel</a>
      </div>
    </form>
  );
}
