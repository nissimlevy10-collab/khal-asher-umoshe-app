export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import { EventCard } from "@/components/EventCard";
import { DonationPanel } from "@/components/DonationPanel";
import {
  getCurrentDayInfo,
  getHomepageEvents,
  getPrayerProfile,
  getSettings,
} from "@/lib/queries";

export default async function HomePage() {
  const [dayInfo, settings, events] = await Promise.all([
    getCurrentDayInfo(),
    getSettings(),
    getHomepageEvents(3),
  ]);
  const profile = await getPrayerProfile(dayInfo.type);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-10 py-10 px-4 bg-gradient-to-b from-[var(--surface-alt)] to-transparent rounded-lg">
        <Image
          src="/logo-light.png"
          alt="לוגו היכל אשר ומשה"
          width={200}
          height={190}
          className="mx-auto mb-4 w-36 sm:w-44 h-auto"
          priority
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-2">
          ברוכים הבאים להיכל אשר ומשה
        </h1>
        <p className="text-[var(--muted)] text-lg">
          בית הכנסת הספרדי המרכזי ברמת בית שמש ד׳
        </p>
        {dayInfo.holiday && (
          <p className="mt-4 inline-block px-4 py-2 bg-[var(--accent)] text-[var(--primary)] rounded-full font-semibold">
            🕯 {dayInfo.holiday}
          </p>
        )}
      </section>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Prayer times (takes 2/3) */}
        <div className="lg:col-span-2">
          <PrayerTimesCard
            dayType={dayInfo.type}
            profileName={profile?.name ?? ""}
            prayers={profile?.prayers ?? []}
            hebrewDate={dayInfo.hebrewDate}
            parasha={dayInfo.parasha}
          />
          <div className="mt-4 text-center">
            <Link
              href="/zmanim"
              className="inline-block text-[var(--primary)] hover:text-[var(--accent-dark)] font-medium text-sm"
            >
              צפייה בכל זמני התפילה (ימי חול, שישי, שבת, חגים) ←
            </Link>
          </div>
        </div>

        {/* Donation CTA (takes 1/3) */}
        <aside className="space-y-4">
          <DonationPanel
            donationUrl={settings.donationUrl}
            donationNote={settings.donationNote}
            bankName={settings.bankName}
            bankBranch={settings.bankBranch}
            bankAccount={settings.bankAccount}
            bankAccountName={settings.bankAccountName}
            compact
          />

          {(settings.address || settings.contactPhone || settings.contactName) && (
            <div className="bg-[var(--surface)] rounded-lg p-5 border border-[var(--border)] text-sm">
              <h3 className="font-bold text-[var(--primary)] mb-2">
                📍 פרטי יצירת קשר
              </h3>
              {settings.address && (
                <p className="text-[var(--muted)] mb-1">{settings.address}</p>
              )}
              {settings.contactName && (
                <p className="text-[var(--muted)] mb-1">👤 {settings.contactName}</p>
              )}
              {settings.contactPhone && (
                <p className="text-[var(--muted)]">📞 {settings.contactPhone}</p>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Upcoming events */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--primary)]">
            פעילויות קרובות
          </h2>
          <Link
            href="/events"
            className="text-sm text-[var(--primary)] hover:text-[var(--accent-dark)]"
          >
            כל האירועים ←
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-[var(--muted)] text-center py-8">
            אין פעילויות עתידיות כעת
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
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
                compact
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
