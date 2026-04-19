import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const [upcomingCount, profileCount, settings] = await Promise.all([
    prisma.event.count({ where: { date: { gte: now } } }),
    prisma.prayerProfile.count(),
    getSettings(),
  ]);

  const cards = [
    {
      href: "/admin/events",
      title: "פעילויות ושיעורים",
      icon: "📅",
      stat: `${upcomingCount} אירועים קרובים`,
      description: "הוספה, עריכה ומחיקה של שיעורים ואירועים קהילתיים",
    },
    {
      href: "/admin/zmanim",
      title: "זמני תפילה",
      icon: "🕰",
      stat: `${profileCount} פרופילים`,
      description: "עדכון זמני שחרית, מנחה, ערבית לפי סוג יום",
    },
    {
      href: "/admin/settings",
      title: "הגדרות כלליות",
      icon: "⚙",
      stat: settings.donationUrl ? "קישור תרומות מוגדר" : "קישור תרומות לא מוגדר",
      description: "קואורדינטות, פרטי קשר, קישור תרומות וקוד גישה",
    },
  ];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--primary)]">
          שלום הגבאי 👋
        </h1>
        <p className="text-[var(--muted)]">
          ברוך הבא לדשבורד הניהול של {settings.synagogueName}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 hover:shadow-md hover:border-[var(--accent)] transition-all"
          >
            <div className="text-3xl mb-2">{c.icon}</div>
            <h2 className="font-bold text-lg text-[var(--primary)] mb-1">
              {c.title}
            </h2>
            <p className="text-sm font-semibold text-[var(--accent-dark)] mb-2">
              {c.stat}
            </p>
            <p className="text-xs text-[var(--muted)]">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
