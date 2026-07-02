"use client";

import { useRouter } from "next/navigation";
import HotelForm from "../../../../../components/HotelForm";

export default function NewHotelPage() {
  const router = useRouter();

  async function handleSubmit(payload) {
    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
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
      alert("Error creating hotel: " + e.message);
    }
  }

  return (
    <div>
      <HotelForm onSubmit={handleSubmit} submitLabel="Create Hotel" />
    </div>
  );
}
