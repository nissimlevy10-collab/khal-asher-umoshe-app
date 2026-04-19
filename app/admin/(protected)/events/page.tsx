import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";

export const dynamic = "force-dynamic";

const typeLabel = (t: string) =>
  t === "LESSON" ? "שיעור" : t === "COMMUNITY" ? "אירוע קהילתי" : t;

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });

  return (
    <div>
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">
            ניהול פעילויות ושיעורים
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {events.length} אירועים ברשימה
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-[var(--primary)] text-white px-4 py-2 rounded font-semibold hover:bg-[var(--primary-light)]"
        >
          + הוספת אירוע
        </Link>
      </header>

      {events.length === 0 ? (
        <p className="text-center py-12 bg-[var(--surface)] rounded-lg border border-[var(--border)] text-[var(--muted)]">
          אין אירועים. לחץ על &quot;הוספת אירוע&quot; כדי להתחיל.
        </p>
      ) : (
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-alt)] text-[var(--primary)]">
              <tr>
                <th className="px-4 py-3 text-right font-semibold">כותרת</th>
                <th className="px-4 py-3 text-right font-semibold">סוג</th>
                <th className="px-4 py-3 text-right font-semibold">תאריך</th>
                <th className="px-4 py-3 text-right font-semibold">מיקום</th>
                <th className="px-4 py-3 text-left font-semibold">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {events.map((e) => {
                const date = new Date(e.date);
                return (
                  <tr key={e.id} className="hover:bg-[var(--surface-alt)]">
                    <td className="px-4 py-3 font-medium">{e.title}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {typeLabel(e.type)}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)] font-mono text-xs">
                      {date.toLocaleString("he-IL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {e.location ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/admin/events/${e.id}`}
                          className="text-[var(--primary)] hover:text-[var(--accent-dark)] text-sm font-medium"
                        >
                          עריכה
                        </Link>
                        <DeleteEventButton id={e.id} title={e.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
