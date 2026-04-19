"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm px-3 py-1 rounded border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--surface)] disabled:opacity-50"
    >
      {loading ? "..." : "יציאה"}
    </button>
  );
}
