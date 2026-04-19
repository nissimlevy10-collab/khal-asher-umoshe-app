"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Prayer = {
  id?: string;
  name: string;
  time: string;
  notes?: string | null;
};

type Props = {
  profileId: string;
  profileName: string;
  initialPrayers: Prayer[];
};

export function PrayerEditor({
  profileId,
  profileName,
  initialPrayers,
}: Props) {
  const router = useRouter();
  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function updatePrayer(i: number, field: keyof Prayer, value: string) {
    setPrayers((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)),
    );
  }

  function addPrayer() {
    setPrayers((prev) => [...prev, { name: "", time: "", notes: "" }]);
  }

  function removePrayer(i: number) {
    setPrayers((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/prayers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          prayers: prayers.map((p) => ({
            name: p.name.trim(),
            time: p.time.trim(),
            notes: p.notes?.trim() || null,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: data.error ?? "שגיאה בשמירה" });
        return;
      }
      setMessage({ type: "ok", text: "נשמר בהצלחה" });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "בעיית תקשורת עם השרת" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5">
      <h2 className="text-lg font-bold text-[var(--primary)] mb-4">
        {profileName}
      </h2>

      <div className="space-y-2 mb-4">
        {prayers.map((p, i) => (
          <div key={i} className="flex items-start gap-2 flex-wrap sm:flex-nowrap">
            <input
              type="text"
              placeholder="שם התפילה"
              value={p.name}
              onChange={(e) => updatePrayer(i, "name", e.target.value)}
              className="flex-1 min-w-[120px] border border-[var(--border)] rounded px-2 py-1 text-sm"
            />
            <input
              type="time"
              value={p.time}
              onChange={(e) => updatePrayer(i, "time", e.target.value)}
              className="border border-[var(--border)] rounded px-2 py-1 text-sm font-mono w-28"
            />
            <input
              type="text"
              placeholder="הערה (אופציונלי)"
              value={p.notes ?? ""}
              onChange={(e) => updatePrayer(i, "notes", e.target.value)}
              className="flex-1 min-w-[120px] border border-[var(--border)] rounded px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => removePrayer(i)}
              className="text-red-700 px-2 hover:text-red-900"
              aria-label="מחק"
            >
              ✕
            </button>
          </div>
        ))}

        {prayers.length === 0 && (
          <p className="text-sm text-[var(--muted)] italic">
            אין תפילות. לחץ &quot;הוספת תפילה&quot; להתחיל.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={addPrayer}
          className="text-sm text-[var(--primary)] hover:text-[var(--accent-dark)] border border-[var(--border)] rounded px-3 py-1"
        >
          + הוספת תפילה
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[var(--primary)] text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50"
        >
          {loading ? "שומר..." : "שמירה"}
        </button>
        {message && (
          <span
            className={`text-sm ${
              message.type === "ok" ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {message.text}
          </span>
        )}
      </div>
    </section>
  );
}
