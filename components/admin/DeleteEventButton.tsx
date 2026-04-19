"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteEventButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`למחוק את האירוע "${title}"? פעולה זו אינה ניתנת לביטול.`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("שגיאה במחיקה");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-700 hover:text-red-900 text-sm font-medium disabled:opacity-50"
    >
      {loading ? "..." : "מחיקה"}
    </button>
  );
}
