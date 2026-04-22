"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type EventFormData = {
  id?: string;
  title?: string | null;
  description?: string | null;
  type?: string;
  date?: string | Date | null;
  location?: string | null;
  lecturer?: string | null;
  isRecurring?: boolean;
  recurrence?: string | null;
};

function toDateInputValue(d: string | Date | null | undefined): string {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EventForm({ initial }: { initial?: EventFormData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "LESSON");
  const [dateValue, setDateValue] = useState(toDateInputValue(initial?.date));
  const [location, setLocation] = useState(initial?.location ?? "");
  const [lecturer, setLecturer] = useState(initial?.lecturer ?? "");
  const [isRecurring, setIsRecurring] = useState(initial?.isRecurring ?? false);
  const [recurrence, setRecurrence] = useState(initial?.recurrence ?? "weekly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      description: description || null,
      type,
      date: new Date(dateValue).toISOString(),
      location: location || null,
      lecturer: lecturer || null,
      isRecurring,
      recurrence: isRecurring ? recurrence : null,
    };

    try {
      const url = isEdit
        ? `/api/admin/events/${initial!.id}`
        : "/api/admin/events";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "שגיאה בשמירה");
        return;
      }
      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("בעיית תקשורת עם השרת");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full border border-[var(--border)] rounded px-3 py-2 focus:border-[var(--accent)] bg-white";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6 space-y-4 max-w-2xl"
    >
      <div>
        <label className="block text-sm font-semibold text-[var(--primary)] mb-1">
          כותרת *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--primary)] mb-1">
          תיאור
        </label>
        <textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-[var(--primary)] mb-1">
            סוג *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={fieldClass}
          >
            <option value="LESSON">שיעור</option>
            <option value="COMMUNITY">אירוע קהילתי</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--primary)] mb-1">
            תאריך ושעה *
          </label>
          <input
            type="datetime-local"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-[var(--primary)] mb-1">
            מיקום
          </label>
          <input
            type="text"
            value={location ?? ""}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="בית הכנסת - אולם מרכזי"
            className={fieldClass}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--primary)] mb-1">
            מרצה / אחראי
          </label>
          <input
            type="text"
            value={lecturer ?? ""}
            onChange={(e) => setLecturer(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <span className="text-sm">אירוע חוזר</span>
        </label>

        {isRecurring && (
          <select
            value={recurrence ?? "weekly"}
            onChange={(e) => setRecurrence(e.target.value)}
            className={`${fieldClass} w-auto`}
          >
            <option value="daily">יומי</option>
            <option value="weekly">שבועי</option>
            <option value="monthly">חודשי</option>
          </select>
        )}
      </div>

      {error && (
        <p className="text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--primary)] text-white px-5 py-2 rounded font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50"
        >
          {loading ? "שומר..." : isEdit ? "עדכון" : "יצירה"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-[var(--border)] px-5 py-2 rounded text-[var(--primary)] hover:bg-[var(--surface-alt)]"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
