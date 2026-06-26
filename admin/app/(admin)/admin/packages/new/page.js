"use client";

import { useRouter } from "next/navigation";
import PackageForm from "../../../../../components/PackageForm";

export default function NewPackagePage() {
  const router = useRouter();

  async function handleSubmit(payload) {
    const res = await fetch("/api/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.error) {
      alert("Error: " + data.error);
      return;
    }
    router.push("/admin/packages");
  }

  return (
    <div>
      <div className="page-header">
        <h1>Add New Package</h1>
      </div>
      <PackageForm onSubmit={handleSubmit} submitLabel="Create Package" />
    </div>
  );
}
