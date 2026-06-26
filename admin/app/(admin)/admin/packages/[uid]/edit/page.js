"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PackageForm from "../../../../../../components/PackageForm";

export default function EditPackagePage() {
  const router = useRouter();
  const { uid } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/packages/${uid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          alert("Package not found");
          router.push("/admin/packages");
          return;
        }
        setPkg(data);
        setLoading(false);
      });
  }, [uid, router]);

  async function handleSubmit(payload) {
    const res = await fetch(`/api/packages/${uid}`, {
      method: "PUT",
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

  if (loading) return <p>Loading package...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Edit: {pkg.title}</h1>
      </div>
      <PackageForm initial={pkg} onSubmit={handleSubmit} submitLabel="Update Package" />
    </div>
  );
}
