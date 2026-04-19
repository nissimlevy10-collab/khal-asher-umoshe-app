/**
 * Hebcal API wrapper
 * Docs: https://www.hebcal.com/home/195/jewish-calendar-rest-api
 *       https://www.hebcal.com/home/197/zmanim-halachic-times-rest-api
 */

export type ZmanimResponse = {
  date: string;
  times: {
    chatzot?: string;
    chatzotNight?: string;
    alotHaShachar?: string;
    misheyakir?: string;
    sunrise?: string;
    sofZmanShma?: string;
    sofZmanTfilla?: string;
    minchaGedola?: string;
    minchaKetana?: string;
    plagHaMincha?: string;
    sunset?: string;
    tzeit7083deg?: string;
    tzeit85deg?: string;
  };
};

export type CalendarItem = {
  title: string;
  date: string;
  category: string; // "holiday" | "parashat" | "candles" | "havdalah" | "zmanim" ...
  hebrew?: string;
  yomtov?: boolean;
};

export type CalendarResponse = {
  items: CalendarItem[];
};

const BASE = "https://www.hebcal.com";

/**
 * Fetch zmanim for a specific date and location.
 * Returns sunrise, sunset, and other halachic times.
 */
export async function fetchZmanim(
  latitude: number,
  longitude: number,
  date: Date,
): Promise<ZmanimResponse | null> {
  const iso = date.toISOString().slice(0, 10);
  const url = `${BASE}/zmanim?cfg=json&latitude=${latitude}&longitude=${longitude}&date=${iso}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache 1 hour
    });
    if (!res.ok) return null;
    return (await res.json()) as ZmanimResponse;
  } catch (err) {
    console.error("Hebcal zmanim fetch failed:", err);
    return null;
  }
}

/**
 * Fetch Shabbat times (candle lighting, havdalah, parsha) for a location.
 */
export async function fetchShabbatTimes(
  latitude: number,
  longitude: number,
): Promise<CalendarResponse | null> {
  const url = `${BASE}/shabbat?cfg=json&latitude=${latitude}&longitude=${longitude}&M=on&lg=he`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as CalendarResponse;
  } catch (err) {
    console.error("Hebcal shabbat fetch failed:", err);
    return null;
  }
}

/**
 * Fetch Hebrew calendar (month view) with holidays and parashot.
 */
export async function fetchHebrewCalendar(
  year: number,
  month: number, // 1-12 Gregorian
  latitude?: number,
  longitude?: number,
): Promise<CalendarResponse | null> {
  const locParams =
    latitude !== undefined && longitude !== undefined
      ? `&latitude=${latitude}&longitude=${longitude}&c=on&M=on`
      : "";
  const url = `${BASE}/hebcal?cfg=json&year=${year}&month=${month}&maj=on&min=on&mod=on&lg=he${locParams}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 * 6 }, // 6 hours
    });
    if (!res.ok) return null;
    return (await res.json()) as CalendarResponse;
  } catch (err) {
    console.error("Hebcal calendar fetch failed:", err);
    return null;
  }
}
