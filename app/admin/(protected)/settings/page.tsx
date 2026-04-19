import { getSettings } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)] mb-2">
          הגדרות
        </h1>
        <p className="text-sm text-[var(--muted)]">
          ניהול פרטי בית הכנסת, מיקום לחישוב זמני הלכה, קישור לתרומות ופרטי
          יצירת קשר.
        </p>
      </div>

      <SettingsForm
        initial={{
          synagogueName: settings.synagogueName,
          address: settings.address,
          latitude: settings.latitude,
          longitude: settings.longitude,
          timezone: settings.timezone,
          donationUrl: settings.donationUrl,
          donationNote: settings.donationNote,
          bankName: settings.bankName,
          bankBranch: settings.bankBranch,
          bankAccount: settings.bankAccount,
          bankAccountName: settings.bankAccountName,
          youtubeUrl: settings.youtubeUrl,
          contactPhone: settings.contactPhone,
          contactEmail: settings.contactEmail,
          aboutText: settings.aboutText,
        }}
      />
    </div>
  );
}
