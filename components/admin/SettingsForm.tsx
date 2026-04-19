"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type SettingsFormData = {
  synagogueName: string;
  address: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  donationUrl: string | null;
  donationNote: string | null;
  bankName: string | null;
  bankBranch: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  youtubeUrl: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  aboutText: string | null;
};

export function SettingsForm({ initial }: { initial: SettingsFormData }) {
  const router = useRouter();
  const [synagogueName, setSynagogueName] = useState(initial.synagogueName);
  const [address, setAddress] = useState(initial.address ?? "");
  const [latitude, setLatitude] = useState(String(initial.latitude));
  const [longitude, setLongitude] = useState(String(initial.longitude));
  const [timezone, setTimezone] = useState(initial.timezone);
  const [donationUrl, setDonationUrl] = useState(initial.donationUrl ?? "");
  const [donationNote, setDonationNote] = useState(initial.donationNote ?? "");
  const [bankName, setBankName] = useState(initial.bankName ?? "");
  const [bankBranch, setBankBranch] = useState(initial.bankBranch ?? "");
  const [bankAccount, setBankAccount] = useState(initial.bankAccount ?? "");
  const [bankAccountName, setBankAccountName] = useState(
    initial.bankAccountName ?? "",
  );
  const [youtubeUrl, setYoutubeUrl] = useState(initial.youtubeUrl ?? "");
  const [contactPhone, setContactPhone] = useState(initial.contactPhone ?? "");
  const [contactEmail, setContactEmail] = useState(initial.contactEmail ?? "");
  const [aboutText, setAboutText] = useState(initial.aboutText ?? "");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<
    { type: "ok" | "error"; text: string } | null
  >(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    if (isNaN(latNum) || isNaN(lonNum)) {
      setMessage({ type: "error", text: "קואורדינטות לא תקינות" });
      return;
    }

    if (newPasscode && newPasscode !== confirmPasscode) {
      setMessage({ type: "error", text: "קודי הגישה אינם תואמים" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          synagogueName: synagogueName.trim(),
          address: address.trim() || null,
          latitude: latNum,
          longitude: lonNum,
          timezone: timezone.trim(),
          donationUrl: donationUrl.trim() || null,
          donationNote: donationNote.trim() || null,
          bankName: bankName.trim() || null,
          bankBranch: bankBranch.trim() || null,
          bankAccount: bankAccount.trim() || null,
          bankAccountName: bankAccountName.trim() || null,
          youtubeUrl: youtubeUrl.trim() || null,
          contactPhone: contactPhone.trim() || null,
          contactEmail: contactEmail.trim() || null,
          aboutText: aboutText.trim() || null,
          newPasscode: newPasscode || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: data.error ?? "שגיאה בשמירה" });
        return;
      }
      setMessage({ type: "ok", text: "נשמר בהצלחה" });
      setNewPasscode("");
      setConfirmPasscode("");
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "בעיית תקשורת עם השרת" });
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full border border-[var(--border)] rounded px-3 py-2 focus:border-[var(--accent)] bg-white";
  const labelClass =
    "block text-sm font-semibold text-[var(--primary)] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5 space-y-4">
        <h2 className="text-lg font-bold text-[var(--primary)]">פרטי בית הכנסת</h2>

        <div>
          <label className={labelClass}>שם בית הכנסת *</label>
          <input
            type="text"
            required
            value={synagogueName}
            onChange={(e) => setSynagogueName(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>כתובת</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="רמת בית שמש ד׳, בית שמש"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>טקסט אודות</label>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            rows={4}
            placeholder="מידע על בית הכנסת, היסטוריה וכו׳"
            className={fieldClass}
          />
        </div>
      </section>

      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5 space-y-4">
        <h2 className="text-lg font-bold text-[var(--primary)]">
          מיקום (לחישוב זמני הלכה)
        </h2>
        <p className="text-sm text-[var(--muted)]">
          קואורדינטות גיאוגרפיות ואזור זמן. משמש לחישוב זמנים כמו הנץ, שקיעה
          והדלקת נרות.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>קו רוחב (latitude) *</label>
            <input
              type="text"
              inputMode="decimal"
              required
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className={`${fieldClass} font-mono`}
            />
          </div>
          <div>
            <label className={labelClass}>קו אורך (longitude) *</label>
            <input
              type="text"
              inputMode="decimal"
              required
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className={`${fieldClass} font-mono`}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>אזור זמן *</label>
          <input
            type="text"
            required
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="Asia/Jerusalem"
            className={`${fieldClass} font-mono`}
          />
        </div>
      </section>

      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5 space-y-4">
        <h2 className="text-lg font-bold text-[var(--primary)]">תרומות</h2>
        <p className="text-sm text-[var(--muted)]">
          קישור חיצוני לתרומות (נדרים פלוס וכו׳), הסבר קצר, ופרטי העברה בנקאית.
          כל שדה אופציונלי — השאר ריק כדי להסתיר.
        </p>

        <div>
          <label className={labelClass}>קישור לתרומות (URL חיצוני)</label>
          <input
            type="url"
            value={donationUrl}
            onChange={(e) => setDonationUrl(e.target.value)}
            placeholder="https://nedar.im/..."
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>הסבר ליד כפתור התרומות</label>
          <textarea
            value={donationNote}
            onChange={(e) => setDonationNote(e.target.value)}
            rows={2}
            placeholder="להעברת תרומות ותשלום נדבות..."
            className={fieldClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>שם בנק</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="בנק מרכנתיל"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>סניף</label>
            <input
              type="text"
              value={bankBranch}
              onChange={(e) => setBankBranch(e.target.value)}
              placeholder="725"
              className={`${fieldClass} font-mono`}
            />
          </div>
          <div>
            <label className={labelClass}>חשבון</label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="41193"
              className={`${fieldClass} font-mono`}
            />
          </div>
          <div>
            <label className={labelClass}>ע״ש</label>
            <input
              type="text"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              placeholder="היכל אשר ומשה"
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5 space-y-4">
        <h2 className="text-lg font-bold text-[var(--primary)]">יצירת קשר ורשתות חברתיות</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>טלפון</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>אימייל</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>קישור ערוץ YouTube</label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/channel/..."
            className={fieldClass}
          />
        </div>
      </section>

      <section className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-5 space-y-4">
        <h2 className="text-lg font-bold text-[var(--primary)]">שינוי קוד גישה</h2>
        <p className="text-sm text-[var(--muted)]">
          השאר ריק אם לא ברצונך לשנות את קוד הגישה. לפחות 4 תווים.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>קוד גישה חדש</label>
            <input
              type="password"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>אישור קוד גישה</label>
            <input
              type="password"
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--primary)] text-white px-5 py-2 rounded font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50"
        >
          {loading ? "שומר..." : "שמירת הגדרות"}
        </button>
        {message && (
          <span
            className={`text-sm ${
              message.type === "ok" ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}
