import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const adminLinks = [
  { href: "/admin", label: "סקירה" },
  { href: "/admin/events", label: "פעילויות" },
  { href: "/admin/zmanim", label: "זמני תפילה" },
  { href: "/admin/settings", label: "הגדרות" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-[var(--surface-alt)] rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/admin"
            className="font-bold text-[var(--primary)] text-lg"
          >
            ⚙ דשבורד גבאים
          </Link>
          <nav className="flex gap-1 flex-wrap text-sm">
            {adminLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1 rounded hover:bg-[var(--surface)] text-[var(--primary)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-sm text-[var(--muted)] hover:text-[var(--primary)]"
          >
            ← לאתר הציבורי
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
