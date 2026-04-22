"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ZMANIM_OPTIONS = [
  { value: "", label: "ידני (שעה קבועה)" },
  { value: "sunset", label: "שקיעה" },
  { value: "seaLevelSunrise", label: "הנץ מישורי" },
  { value: "tzeit", label: "צאת הכוכבים" },
  { value: "chatzot", label: "חצות היום" },
];

type Prayer = {
  id?: string;
  name: string;
  time: string;
  notes?: string | null;
  zmanimBase?: string | null;
  offsetMinutes?: number | null;
};

type Props = {
  profileId: string;
  profileName: string;
  initialPrayers: Prayer[];
};

function offsetLabel(offsetMinutes: number): string {
  if (offsetMinutes === 0) return "בדיוק";
  const abs = Math.abs(offsetMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const parts = [];
  if (h > 0) parts.push(`${h} שעות`);
  if (m > 0) parts.push(`${m} דקות`);
  const timeStr = parts.join(" ו");
  return offsetMinutes < 0 ? `${timeStr} לפני` : `${timeStr} אחרי`;
}

export function PrayerEditor({ profileId, profileName, initialPrayers }: Props) {
  const router = useRouter();
  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function updatePrayer(i: number, field: keyof Prayer, value: string | number | null) {
    setPrayers((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)),
    );
  }

  function addPrayer() {
    setPrayers((prev) => [
      ...prev,
      { name: "", time: "", notes: "", zmanimBase: null, offsetMinutes: 0 },
    ]);
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
            zmanimBase: p.zmanimBase || null,
            offsetMinutes: p.offsetMinutes ?? 0,
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
      <h2 className="text-lg font-bold text-[var(--primary)] mb-4">{profileName}</h2>

      <div className="space-y-3 mb-4">
        {prayers.map((p, i) => {
          const isAuto = !!p.zmanimBase;
          return (
            <div key={i} className="border border-[var(--border)] rounded-lg p-3 bg-[var(--surface-alt)]">
              {/* Row 1: name + delete */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="שם התפילה"
                  value={p.name}
                  onChange={(e) => updatePrayer(i, "name", e.target.value)}
                  className="flex-1 border border-[var(--border)] rounded px-2 py-1 text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => removePrayer(i)}
                  className="text-red-700 px-2 hover:text-red-900 text-lg"
                  aria-label="מחק"
                >
                  ✕
                </button>
              </div>

              {/* Row 2: time mode toggle */}
              <div className="flex gap-2 mb-2 flex-wrap items-center">
                <select
                  value={p.zmanimBase ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    updatePrayer(i, "zmanimBase", val || null);
                    if (!val) updatePrayer(i, "offsetMinutes", 0);
                  }}
                  className="border border-[var(--border)] rounded px-2 py-1 text-sm bg-white"
                >
                  {ZMANIM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                {isAuto ? (
                  /* Auto: offset input */
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={p.offsetMinutes ?? 0}
                      onChange={(e) =>
                        updatePrayer(i, "offsetMinutes", parseInt(e.target.value) || 0)
                      }
                      className="w-24 border border-[var(--border)] rounded px-2 py-1 text-sm font-mono bg-white"
                      placeholder="דקות"
                    />
                    <span className="text-xs text-[var(--muted)]">דקות (- לפני, + אחרי)</span>
                    {/* Preview label */}
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
                      {offsetLabel(p.offsetMinutes ?? 0)}{" "}
                      {ZMANIM_OPTIONS.find((o) => o.value === p.zmanimBase)?.label}
                    </span>
                  </div>
                ) : (
                  /* Manual: time picker */
                  <input
                    type="time"
                    value={p.time}
                    onChange={(e) => updatePrayer(i, "time", e.target.value)}
                    className="border border-[var(--border)] rounded px-2 py-1 text-sm font-mono w-28 bg-white"
                  />
                )}
              </div>

              {/* Row 3: notes */}
              <input
                type="text"
                placeholder="הערה (אופציונלי)"
                value={p.notes ?? ""}
                onChange={(e) => updatePrayer(i, "notes", e.target.value)}
                className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm bg-white"
              />
            </div>
          );
        })}

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
          <span className={`text-sm ${message.type === "ok" ? "text-emerald-700" : "text-red-700"}`}>
            {message.text}
          </span>
        )}
      </div>
    </section>
  );
}
