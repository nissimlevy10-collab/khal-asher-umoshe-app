import type { DayType } from "@/lib/day-type";
import { dayTypeLabel } from "@/lib/day-type";

type Prayer = {
  name: string;
  time: string;
  notes?: string | null;
};

type Props = {
  dayType: DayType;
  profileName: string;
  prayers: Prayer[];
  hebrewDate?: string;
  parasha?: string;
};

export function PrayerTimesCard({
  dayType,
  profileName,
  prayers,
  hebrewDate,
  parasha,
}: Props) {
  return (
    <section className="bg-[var(--surface)] rounded-lg shadow-md gold-border-top p-6">
      <header className="flex items-baseline justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-[var(--border)]">
        <div>
          <h2 className="text-2xl font-bold text-[var(--primary)]">
            זמני תפילה · {profileName}
          </h2>
          {hebrewDate && (
            <p className="text-sm text-[var(--muted)] mt-1">
              {hebrewDate}
              {parasha && <span className="mx-2">·</span>}
              {parasha && (
                <span className="text-[var(--accent-dark)] font-medium">
                  {parasha}
                </span>
              )}
            </p>
          )}
        </div>
        <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--surface-alt)] text-[var(--accent-dark)] font-semibold">
          {dayTypeLabel(dayType)}
        </span>
      </header>

      {prayers.length === 0 ? (
        <p className="text-[var(--muted)] text-center py-4">
          אין זמני תפילה מוגדרים לפרופיל זה
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {prayers.map((p, i) => (
            <li
              key={i}
              className="flex justify-between items-center py-3 hover:bg-[var(--surface-alt)] transition-colors px-2 rounded"
            >
              <div>
                <div className="font-semibold text-[var(--primary)]">
                  {p.name}
                </div>
                {p.notes && (
                  <div className="text-xs text-[var(--muted)] mt-0.5">
                    {p.notes}
                  </div>
                )}
              </div>
              <div className="text-xl font-mono font-bold text-[var(--accent-dark)]">
                {p.time}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
