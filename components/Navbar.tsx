import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "דף הבית" },
  { href: "/zmanim", label: "זמני תפילה" },
  { href: "/events", label: "פעילויות ושיעורים" },
  { href: "/calendar", label: "לוח שנה" },
  { href: "/about", label: "אודות" },
];

export function Navbar() {
  return (
    <header className="bg-[var(--primary)] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo-dark.png"
            alt="לוגו היכל אשר ומשה"
            width={56}
            height={56}
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            priority
          />
          <div className="leading-tight">
            <div className="font-bold text-base sm:text-lg">היכל אשר ומשה</div>
            <div className="text-xs text-[var(--accent-light)] opacity-90">
              בית הכנסת הספרדי המרכזי
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 flex-wrap text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded hover:bg-[var(--primary-light)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
