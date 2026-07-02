"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import HotelForm from "../../../../../../components/HotelForm";

export default function EditHotelPage() {
  const router = useRouter();
  const { uid } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/hotels/" + uid + "?t=" + Date.now())
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setHotel(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [uid]);

  async function handleSubmit(payload) {
    try {
      const res = await fetch("/api/hotels/" + uid, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        alert("Error: " + data.error);
        return;
      }
      router.push("/admin/hotels");
    } catch (e) {
      alert("Error saving hotel: " + e.message);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #e2e0dc", borderTopColor: "#0c3b2d", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-muted)" }}>Loading hotel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h3 style={{ color: "var(--danger)", marginBottom: 8 }}>Error loading hotel</h3>
        <p style={{ color: "var(--text-muted)" }}>{error}</p>
        <a href="/admin/hotels" className="btn btn-outline" style={{ marginTop: 16 }}>Back to Hotels</a>
      </div>
    );
  }

  return (
    <div>
      <HotelForm initial={hotel} onSubmit={handleSubmit} submitLabel="Update Hotel" />
    </div>
  );
}
