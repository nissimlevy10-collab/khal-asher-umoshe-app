/**
 * Determine the "Jewish day type" at a given moment:
 * - WEEKDAY (Sunday night – Friday before candle lighting)
 * - FRIDAY  (Friday from some point in afternoon until candle lighting)
 * - SHABBAT (Friday candle lighting – Saturday after havdalah)
 * - HOLIDAY (major yom tov days)
 *
 * Uses the Shabbat API candle lighting time as the boundary for Shabbat.
 */

import { HDate, HebrewCalendar, Location, flags } from "@hebcal/core";

export type DayType = "WEEKDAY" | "FRIDAY" | "SHABBAT" | "HOLIDAY";

export type DayInfo = {
  type: DayType;
  hebrewDate: string;
  gregorianDate: Date;
  parasha?: string;
  holiday?: string;
};

/**
 * Returns the current day type based on the given moment + location.
 *
 * Logic:
 * - If it's a yom tov day → HOLIDAY
 * - If it's Saturday (before havdalah) or Friday after candle lighting → SHABBAT
 * - If it's Friday (before candle lighting) → FRIDAY
 * - Otherwise → WEEKDAY
 */
export function getDayType(
  now: Date,
  latitude: number,
  longitude: number,
  timezone = "Asia/Jerusalem",
): DayInfo {
  const location = new Location(
    latitude,
    longitude,
    true, // Israel
    timezone,
    "בית שמש",
    "IL",
  );

  const hDate = new HDate(now);
  const dow = now.getDay(); // 0 = Sunday ... 6 = Saturday

  // Check for yom tov (major holidays that count like Shabbat)
  const events = HebrewCalendar.calendar({
    start: hDate,
    end: hDate,
    location,
    candlelighting: true,
    il: true,
  });

  const yomTov = events.find((e) => e.getFlags() & flags.CHAG);
  const parashaEvent = events.find((e) => e.getFlags() & flags.PARSHA_HASHAVUA);
  const parasha = parashaEvent?.render("he");

  // Find candle lighting event (if today has one)
  const candleEvent = events.find((e) => e.getFlags() & flags.LIGHT_CANDLES);
  const havdalahEvent = events.find((e) => e.getFlags() & flags.LIGHT_CANDLES_TZEIS || e.getDesc() === "Havdalah");

  if (yomTov) {
    return {
      type: "HOLIDAY",
      hebrewDate: hDate.render("he"),
      gregorianDate: now,
      parasha,
      holiday: yomTov.render("he"),
    };
  }

  // Saturday
  if (dow === 6) {
    // If we have a havdalah event today and now is past it → weekday (Saturday night)
    if (havdalahEvent) {
      const havdalahTime = havdalahEvent.eventTime;
      if (havdalahTime && now >= havdalahTime) {
        return {
          type: "WEEKDAY",
          hebrewDate: hDate.render("he"),
          gregorianDate: now,
          parasha,
        };
      }
    }
    return {
      type: "SHABBAT",
      hebrewDate: hDate.render("he"),
      gregorianDate: now,
      parasha,
    };
  }

  // Friday
  if (dow === 5) {
    // If we have a candle lighting event today and now is past it → Shabbat
    if (candleEvent) {
      const candleTime = candleEvent.eventTime;
      if (candleTime && now >= candleTime) {
        return {
          type: "SHABBAT",
          hebrewDate: hDate.render("he"),
          gregorianDate: now,
          parasha,
        };
      }
    }
    return {
      type: "FRIDAY",
      hebrewDate: hDate.render("he"),
      gregorianDate: now,
      parasha,
    };
  }

  return {
    type: "WEEKDAY",
    hebrewDate: hDate.render("he"),
    gregorianDate: now,
    parasha,
  };
}

/**
 * Human-readable label for a day type (Hebrew).
 */
export function dayTypeLabel(type: DayType): string {
  switch (type) {
    case "WEEKDAY":
      return "ימי חול";
    case "FRIDAY":
      return "ערב שבת";
    case "SHABBAT":
      return "שבת";
    case "HOLIDAY":
      return "חג";
  }
}
