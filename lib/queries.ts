import { prisma } from "@/lib/db";
import { getDayType, type DayType, type DayInfo } from "@/lib/day-type";

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
 */
export async function getPrayerProfile(type: DayType) {
  return prisma.prayerProfile.findUnique({
    where: { type },
    include: {
      prayers: {
        orderBy: { order: "asc" },
      },
    },
  });
}

/**
 * Load all prayer profiles (for the /zmanim page).
 */
export async function getAllPrayerProfiles() {
  return prisma.prayerProfile.findMany({
    include: {
      prayers: { orderBy: { order: "asc" } },
    },
  });
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
