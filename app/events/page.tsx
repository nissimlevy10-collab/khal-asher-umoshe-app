import { EventCard } from "@/components/EventCard";
import { getUpcomingEvents } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const filter = params.type?.toUpperCase();

  const all = await getUpcomingEvents(100);
  const events =
    filter === "LESSON" || filter === "COMMUNITY"
      ? all.filter((e) => e.type === filter)
      : all;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">
        פעילויות ושיעורים
      </h1>
      <p className="text-[var(--muted)] mb-6">
        כל השיעורים והאירועים הקהילתיים הקרובים
      </p>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <FilterLink active={!filter} href="/events" label="הכל" />
        <FilterLink
          active={filter === "LESSON"}
          href="/events?type=LESSON"
          label="שיעורים"
        />
        <FilterLink
          active={filter === "COMMUNITY"}
          href="/events?type=COMMUNITY"
          label="אירועים קהילתיים"
        />
      </div>

      {events.length === 0 ? (
        <p className="text-[var(--muted)] text-center py-12 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
          אין פעילויות עתידיות בקטגוריה זו
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((e) => (
            <EventCard
              key={e.id}
              id={e.id}
              title={e.title}
              description={e.description}
              type={e.type}
              date={e.date}
              location={e.location}
              lecturer={e.lecturer}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-[var(--primary)] text-white"
          : "bg-[var(--surface)] text-[var(--primary)] border border-[var(--border)] hover:bg-[var(--surface-alt)]"
      }`}
    >
      {label}
    </a>
  );
}
