import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

const typeLabel = (t: string) =>
  t === "LESSON" ? "שיעור" : t === "COMMUNITY" ? "אירוע קהילתי" : t;

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const date = new Date(event.date);
  const dateStr = new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const timeStr = new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/events"
        className="text-sm text-[var(--primary)] hover:text-[var(--accent-dark)] mb-4 inline-block"
      >
        ← חזרה לכל הפעילויות
      </Link>

      <article className="bg-[var(--surface)] rounded-lg shadow-md gold-border-top p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-[var(--primary)]">
            {event.title}
          </h1>
          <span className="text-sm px-3 py-1 rounded font-semibold bg-[var(--surface-alt)] text-[var(--accent-dark)]">
            {typeLabel(event.type)}
          </span>
        </div>

        <dl className="grid gap-3 mb-6 text-sm">
          <div className="flex gap-3">
            <dt className="text-[var(--muted)] w-20">📅 תאריך:</dt>
            <dd className="font-medium">{dateStr}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-[var(--muted)] w-20">🕒 שעה:</dt>
            <dd className="font-mono font-bold text-[var(--accent-dark)]">
              {timeStr}
            </dd>
          </div>
          {event.location && (
            <div className="flex gap-3">
              <dt className="text-[var(--muted)] w-20">📍 מיקום:</dt>
              <dd className="font-medium">{event.location}</dd>
            </div>
          )}
          {event.lecturer && (
            <div className="flex gap-3">
              <dt className="text-[var(--muted)] w-20">👤 מרצה:</dt>
              <dd className="font-medium">{event.lecturer}</dd>
            </div>
          )}
          {event.isRecurring && (
            <div className="flex gap-3">
              <dt className="text-[var(--muted)] w-20">🔁 תכיפות:</dt>
              <dd className="font-medium">
                {event.recurrence === "weekly"
                  ? "שבועי"
                  : event.recurrence === "monthly"
                    ? "חודשי"
                    : event.recurrence}
              </dd>
            </div>
          )}
        </dl>

        {event.description && (
          <div className="border-t border-[var(--border)] pt-6">
            <h2 className="text-lg font-bold text-[var(--primary)] mb-2">
              תיאור
            </h2>
            <p className="text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}
      </article>
    </div>
  );
}
