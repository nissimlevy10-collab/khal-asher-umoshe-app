import { getAllPrayerProfiles } from "@/lib/queries";
import { PrayerEditor } from "@/components/admin/PrayerEditor";

export const dynamic = "force-dynamic";

const PROFILE_ORDER = ["WEEKDAY", "FRIDAY", "SHABBAT", "HOLIDAY"] as const;

export default async function AdminZmanimPage() {
  const profiles = await getAllPrayerProfiles();
  const sorted = [...profiles].sort(
    (a, b) =>
      PROFILE_ORDER.indexOf(a.type as (typeof PROFILE_ORDER)[number]) -
      PROFILE_ORDER.indexOf(b.type as (typeof PROFILE_ORDER)[number]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)] mb-2">
          עריכת זמני תפילה
        </h1>
        <p className="text-sm text-[var(--muted)]">
          ניתן לערוך את זמני התפילה לכל סוג יום: ימי חול, יום שישי, שבת וחגים.
          השינויים יוצגו מיד באתר הציבורי בהתאם ליום הנוכחי.
        </p>
      </div>

      {sorted.map((profile) => (
        <PrayerEditor
          key={profile.id}
          profileId={profile.id}
          profileName={profile.name}
          initialPrayers={profile.prayers.map((p) => ({
            id: p.id,
            name: p.name,
            time: p.time,
            notes: p.notes,
          }))}
        />
      ))}
    </div>
  );
}
