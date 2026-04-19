import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">
        אודות בית הכנסת
      </h1>
      <p className="text-[var(--muted)] mb-8">{settings.synagogueName}</p>

      {settings.aboutText && (
        <article className="bg-[var(--surface)] rounded-lg shadow-md gold-border-top p-6 sm:p-8 mb-6 leading-relaxed whitespace-pre-wrap">
          {settings.aboutText}
        </article>
      )}

      <section className="bg-[var(--surface)] rounded-lg shadow-sm border border-[var(--border)] p-6 sm:p-8">
        <h2 className="text-xl font-bold text-[var(--primary)] mb-4">
          פרטי יצירת קשר
        </h2>
        <dl className="space-y-3 text-sm">
          {settings.address && (
            <div className="flex gap-3">
              <dt className="text-[var(--muted)] w-20">📍 כתובת:</dt>
              <dd className="font-medium">{settings.address}</dd>
            </div>
          )}
          {settings.contactPhone && (
            <div className="flex gap-3">
              <dt className="text-[var(--muted)] w-20">📞 טלפון:</dt>
              <dd className="font-medium">
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="hover:text-[var(--accent-dark)]"
                >
                  {settings.contactPhone}
                </a>
              </dd>
            </div>
          )}
          {settings.contactEmail && (
            <div className="flex gap-3">
              <dt className="text-[var(--muted)] w-20">✉ אימייל:</dt>
              <dd className="font-medium">
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:text-[var(--accent-dark)]"
                >
                  {settings.contactEmail}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {settings.donationUrl && (
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <a
              href={settings.donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[var(--accent)] text-[var(--primary)] px-6 py-2 rounded font-bold hover:bg-[var(--accent-dark)] hover:text-white transition-colors"
            >
              תרומה לבית הכנסת →
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
