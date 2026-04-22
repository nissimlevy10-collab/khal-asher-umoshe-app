import { prisma } from "@/lib/db";
import { getDayType, type DayType, type DayInfo } from "@/lib/day-type";
import { resolvePrayers } from "@/lib/zmanim-calc";

/**
 * Load the synagogue settings (singleton).
 * Creates a default row if missing (shouldn't happen after seed).
 */
export async function getSettings() {
  const s = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (!s) {
    throw new Error(
      "Settings not initialized. Run `npm run db:seed` to initialize.",
    );
  }
  return s;
}

/**
 * Determine the current day type using settings location.
 */
export async function getCurrentDayInfo(now = new Date()): Promise<DayInfo> {
  const settings = await getSettings();
  return getDayType(now, settings.latitude, settings.longitude, settings.timezone);
}

/**
 * Load the PrayerProfile matching the given day type, with prayers ordered.
 * Automatically resolves zmanim-based prayer times for the given date.
 */
export async function getPrayerProfile(type: DayType, date = new Date()) {
  const [profile, settings] = await Promise.all([
    prisma.prayerProfile.findUnique({
      where: { type },
      include: { prayers: { orderBy: { order: "asc" } } },
    }),
    getSettings(),
  ]);
  if (!profile) return null;
  return {
    ...profile,
    prayers: resolvePrayers(
      profile.prayers,
      date,
      settings.latitude,
      settings.longitude,
      settings.timezone,
    ),
  };
}

/**
 * Load all prayer profiles (for the /zmanim page), with zmanim times resolved.
 * Uses "next occurrence" date per profile type so times are always relevant.
 */
export async function getAllPrayerProfiles(date = new Date()) {
  const [profiles, settings] = await Promise.all([
    prisma.prayerProfile.findMany({
      include: { prayers: { orderBy: { order: "asc" } } },
    }),
    getSettings(),
  ]);

  // For each profile, pick the next date that matches that day type
  function nextOccurrence(targetDow: number, from: Date): Date {
    const d = new Date(from);
    const diff = (targetDow - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + diff);
    return d;
  }

  const profileDate: Record<string, Date> = {
    WEEKDAY: nextOccurrence(1, date), // Monday
    FRIDAY: nextOccurrence(5, date),  // Friday
    SHABBAT: nextOccurrence(6, date), // Saturday
    HOLIDAY: date,                    // Use today for holiday
  };

  return profiles.map((p) => ({
    ...p,
    prayers: resolvePrayers(
      p.prayers,
      profileDate[p.type] ?? date,
      settings.latitude,
      settings.longitude,
      settings.timezone,
    ),
  }));
}

/**
 * Upcoming events (default: 20 soonest, starting from today).
 */
export async function getUpcomingEvents(limit = 20) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.event.findMany({
    where: { date: { gte: today } },
    orderBy: { date: "asc" },
    take: limit,
  });
}

/**
 * Latest few events for the homepage.
 */
export async function getHomepageEvents(limit = 3) {
  return getUpcomingEvents(limit);
}
