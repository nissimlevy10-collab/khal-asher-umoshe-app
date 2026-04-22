import Link from "next/link";

type Props = {
  id: string;
  title: string;
  description?: string | null;
  type: string; // "LESSON" | "COMMUNITY"
  date: Date;
  location?: string | null;
  lecturer?: string | null;
  compact?: boolean;
};

const typeLabel = (t: string) =>
  t === "LESSON" ? "שיעור" : t === "COMMUNITY" ? "אירוע קהילתי" : t;

const typeBadgeColor = (t: string) =>
  t === "LESSON"
    ? "bg-[var(--primary)] text-white"
    : "bg-[var(--accent)] text-[var(--primary)]";

function formatHebrewDateTime(date: Date) {
  const tz = "Asia/Jerusalem";
  const dateStr = new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: tz,
  }).format(date);
  const timeStr = new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  }).format(date);
  return { dateStr, timeStr };
}

export function EventCard({
  id,
  title,
  description,
  type,
  date,
  location,
  lecturer,
  compact = false,
}: Props) {
  const { dateStr, timeStr } = formatHebrewDateTime(new Date(date));

  return (
    <article className="bg-[var(--surface)] rounded-lg shadow-sm hover:shadow-md transition-shadow border border-[var(--border)] overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-[var(--primary)] text-lg leading-tight">
            <Link
              href={`/events/${id}`}
              className="hover:text-[var(--accent-dark)]"
            >
              {title}
            </Link>
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded font-semibold shrink-0 ${typeBadgeColor(type)}`}
          >
            {typeLabel(type)}
          </span>
        </div>

        <div className="text-sm text-[var(--muted)] space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-dark)]">📅</span>
            <span>{dateStr}</span>
            <span className="font-mono font-semibold text-[var(--primary)]">
              {timeStr}
            </span>
          </div>
          {location && (
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent-dark)]">📍</span>
              <span>{location}</span>
            </div>
          )}
          {lecturer && (
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent-dark)]">👤</span>
              <span>{lecturer}</span>
            </div>
          )}
        </div>

        {description && !compact && (
          <p className="text-sm text-[var(--foreground)] leading-relaxed opacity-85">
            {description}
          </p>
        )}
      </div>
    </article>
  );
}
