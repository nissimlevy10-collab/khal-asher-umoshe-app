import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import { fetchZmanim } from "@/lib/hebcal";
import { getAllPrayerProfiles, getSettings } from "@/lib/queries";
import type { DayType } from "@/lib/day-type";

export const dynamic = "force-dynamic";

function formatTime(iso?: string, timezone = "Asia/Jerusalem"): string | undefined {
  if (!iso) return undefined;
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
    });
  } catch {
    return undefined;
  }
}

export default async function ZmanimPage() {
  const [profiles, settings] = await Promise.all([
    getAllPrayerProfiles(),
    getSettings(),
  ]);

  const zmanim = await fetchZmanim(
    settings.latitude,
    settings.longitude,
    new Date(),
  );

  // Order profiles in a natural Jewish week order
  const orderMap: Record<string, number> = {
    WEEKDAY: 1,
    FRIDAY: 2,
    SHABBAT: 3,
    HOLIDAY: 4,
  };
  const sortedProfiles = [...profiles].sort(
    (a, b) => (orderMap[a.type] ?? 99) - (orderMap[b.type] ?? 99),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">
        זמני תפילה
      </h1>
      <p className="text-[var(--muted)] mb-8">
        כל זמני התפילה בבית הכנסת לפי סוג היום
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {sortedProfiles.map((p) => (
          <PrayerTimesCard
            key={p.id}
            dayType={p.type as DayType}
            profileName={p.name}
            prayers={p.prayers}
          />
        ))}
      </div>

      {zmanim && (
        <section className="mt-10 bg-[var(--surface)] rounded-lg shadow-md gold-border-top p-6">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
            זמני הלכה — היום
          </h2>
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {[
              ["עלות השחר", zmanim.times.alotHaShachar],
              ["הנץ החמה", zmanim.times.sunrise],
              ["סוף זמן ק״ש", zmanim.times.sofZmanShma],
              ["סוף זמן תפילה", zmanim.times.sofZmanTfilla],
              ["חצות היום", zmanim.times.chatzot],
              ["מנחה גדולה", zmanim.times.minchaGedola],
              ["מנחה קטנה", zmanim.times.minchaKetana],
              ["פלג המנחה", zmanim.times.plagHaMincha],
              ["שקיעה", zmanim.times.sunset],
              ["צאת הכוכבים", zmanim.times.tzeit7083deg],
            ].map(([label, val]) => {
              const formatted = formatTime(val ?? undefined, settings.timezone);
              return (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-[var(--border)]"
                >
                  <span className="text-[var(--muted)]">{label}</span>
                  <span className="font-mono font-semibold text-[var(--accent-dark)]">
                    {formatted ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[var(--muted)] mt-4">
            זמנים מחושבים אוטומטית ממיקום בית הכנסת (רמת בית שמש ד׳) דרך Hebcal
            API.
          </p>
        </section>
      )}
    </div>
  );
}
