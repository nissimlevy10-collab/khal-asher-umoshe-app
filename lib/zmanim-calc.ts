/**
 * Local zmanim calculation using @hebcal/core's Zmanim class.
 * No external API calls — fully computed from lat/lng/timezone.
 */

import { GeoLocation, Zmanim } from "@hebcal/core";

export type ZmanimBase = "sunset" | "seaLevelSunrise" | "tzeit" | "chatzot";

export type PrayerWithZmanim = {
  name: string;
  time: string;
  notes?: string | null;
  zmanimBase?: string | null;
  offsetMinutes?: number | null;
};

/**
 * Calculate a single prayer time based on a zmanim formula.
 * Returns an HH:MM string (in the given timezone), or null if calculation fails.
 *
 * @param zmanimBase  - which zman is the anchor ("sunset" | "seaLevelSunrise" | "tzeit" | "chatzot")
 * @param offsetMinutes - minutes to add (+) or subtract (-) from the base zman
 * @param date        - the Gregorian date to calculate for
 * @param latitude    - decimal degrees
 * @param longitude   - decimal degrees
 * @param timezone    - IANA timezone string (e.g. "Asia/Jerusalem")
 */
export function calcPrayerTime(
  zmanimBase: string,
  offsetMinutes: number,
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string,
): string | null {
  try {
    const gloc = new GeoLocation(null, latitude, longitude, 0, timezone);
    const zmanim = new Zmanim(gloc, date, false);

    let baseTime: Date | null = null;
    switch (zmanimBase as ZmanimBase) {
      case "sunset":
        baseTime = zmanim.sunset();
        break;
      case "seaLevelSunrise":
        baseTime = zmanim.seaLevelSunrise();
        break;
      case "tzeit":
        baseTime = zmanim.tzeit(); // default 8.5° — ~40 min after sunset in Israel
        break;
      case "chatzot":
        baseTime = zmanim.chatzot();
        break;
      default:
        return null;
    }

    if (!baseTime) return null;

    const result = new Date(baseTime.getTime() + offsetMinutes * 60 * 1000);

    // Format as HH:MM in the synagogue timezone
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
    }).formatToParts(result);

    const h = parts.find((p) => p.type === "hour")?.value ?? "00";
    const m = parts.find((p) => p.type === "minute")?.value ?? "00";
    return `${h}:${m}`;
  } catch (err) {
    console.error("zmanim-calc error:", err);
    return null;
  }
}

/**
 * Resolve a list of prayers: for each prayer with zmanimBase set,
 * replace its static `time` with the calculated time for the given date.
 * Prayers without zmanimBase keep their stored time unchanged.
 */
export function resolvePrayers<T extends PrayerWithZmanim>(
  prayers: T[],
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string,
): T[] {
  return prayers.map((p) => {
    if (!p.zmanimBase) return p;
    const calculated = calcPrayerTime(
      p.zmanimBase,
      p.offsetMinutes ?? 0,
      date,
      latitude,
      longitude,
      timezone,
    );
    if (!calculated) return p; // fallback to static time
    return { ...p, time: calculated };
  });
}
