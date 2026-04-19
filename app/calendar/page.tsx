import { fetchHebrewCalendar } from "@/lib/hebcal";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  holiday: { label: "חג", color: "bg-[var(--accent)] text-[var(--primary)]", icon: "🕯" },
  parashat: { label: "פרשה", color: "bg-[var(--primary)] text-white", icon: "📖" },
  candles: {
    label: "הדלקת נרות",
    color: "bg-amber-100 text-amber-900",
    icon: "🕯",
  },
  havdalah: {
    label: "צאת השבת",
    color: "bg-indigo-100 text-indigo-900",
    icon: "✨",
  },
  roshchodesh: {
    label: "ראש חודש",
    color: "bg-emerald-100 text-emerald-900",
    icon: "🌙",
  },
  fast: { label: "צום", color: "bg-slate-200 text-slate-800", icon: "🕊" },
};

function categoryStyle(cat: string) {
  return (
    CATEGORY_LABELS[cat] ?? {
      label: cat,
      color: "bg-[var(--surface-alt)] text-[var(--foreground)]",
      icon: "•",
    }
  );
}

export default async function CalendarPage() {
  const settings = await getSettings();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const data = await fetchHebrewCalendar(
    year,
    month,
    settings.latitude,
    settings.longitude,
  );

  const monthName = now.toLocaleString("he-IL", { month: "long" });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">
        לוח שנה עברי
      </h1>
      <p className="text-[var(--muted)] mb-8">
        חגים, פרשות, זמני שבת וזמני הלכה · חודש {monthName} {year}
      </p>

      {!data || data.items.length === 0 ? (
        <div className="bg-[var(--surface)] rounded-lg p-8 text-center border border-[var(--border)]">
          <p className="text-[var(--muted)]">
            לא הצלחנו לטעון את לוח השנה כרגע. אנא נסו שוב.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--surface)] rounded-lg shadow-md gold-border-top overflow-hidden">
          <ul className="divide-y divide-[var(--border)]">
            {data.items.map((item, i) => {
              const style = categoryStyle(item.category);
              const itemDate = new Date(item.date);
              const dateStr = new Intl.DateTimeFormat("he-IL", {
                weekday: "short",
                day: "numeric",
                month: "short",
              }).format(itemDate);
              return (
                <li
                  key={i}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--surface-alt)] transition-colors"
                >
                  <div className="flex-shrink-0 w-24 text-sm text-[var(--muted)] font-mono">
                    {dateStr}
                  </div>
                  <div className="flex-1 font-medium text-[var(--primary)]">
                    {item.hebrew ?? item.title}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${style.color}`}
                  >
                    {style.icon} {style.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
