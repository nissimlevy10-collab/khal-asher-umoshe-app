import Link from "next/link";
import { getSettings } from "@/lib/queries";

export async function Footer() {
  const settings = await getSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--primary)] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-sm">
        <div>
          <h3 className="font-bold text-[var(--accent)] text-base mb-2">
            היכל אשר ומשה
          </h3>
          <p className="leading-relaxed opacity-90">
            בית הכנסת הספרדי המרכזי
            <br />
            {settings.address ?? "רמת בית שמש ד׳, בית שמש"}
          </p>
          {settings.contactName && (
            <p className="mt-2 opacity-90">👤 {settings.contactName}</p>
          )}
          {settings.contactPhone && (
            <p className="mt-1 opacity-90">📞 {settings.contactPhone}</p>
          )}
          {settings.contactEmail && (
            <p className="mt-1 opacity-90">✉ {settings.contactEmail}</p>
          )}
          {settings.youtubeUrl && (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-[var(--accent-light)] hover:text-white transition-colors"
              aria-label="ערוץ YouTube"
            >
              {/* YouTube icon */}
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
              </svg>
              <span className="text-sm">ערוץ YouTube</span>
            </a>
          )}
        </div>

        <div>
          <h3 className="font-bold text-[var(--accent)] text-base mb-2">
            ניווט מהיר
          </h3>
          <ul className="space-y-1 opacity-90">
            <li>
              <Link href="/zmanim" className="hover:text-[var(--accent-light)]">
                זמני תפילה
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-[var(--accent-light)]">
                פעילויות ושיעורים
              </Link>
            </li>
            <li>
              <Link href="/calendar" className="hover:text-[var(--accent-light)]">
                לוח שנה עברי
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[var(--accent-light)]">
                אודות
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-[var(--accent)] text-base mb-2">
            ניהול
          </h3>
          <Link
            href="/admin/login"
            className="hover:text-[var(--accent-light)] opacity-90"
          >
            כניסת גבאים
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {year} היכל אשר ומשה · כל הזכויות שמורות
      </div>
    </footer>
  );
}
