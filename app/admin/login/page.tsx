"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "שגיאה לא ידועה");
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("בעיית תקשורת עם השרת");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-[var(--surface)] rounded-lg shadow-md gold-border-top p-6 sm:p-8"
    >
      <h1 className="text-2xl font-bold text-[var(--primary)] mb-2 text-center">
        כניסת גבאים
      </h1>
      <p className="text-sm text-[var(--muted)] text-center mb-6">
        הזן את קוד הגישה כדי לנהל את האתר
      </p>

      <label className="block mb-4">
        <span className="text-sm font-semibold text-[var(--primary)] block mb-1">
          קוד גישה
        </span>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full border border-[var(--border)] rounded px-3 py-2 font-mono focus:border-[var(--accent)]"
          required
        />
      </label>

      {error && (
        <p className="text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm mb-4">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--primary)] text-white py-2 rounded font-semibold hover:bg-[var(--primary-light)] transition-colors disabled:opacity-50"
      >
        {loading ? "מתחבר..." : "כניסה"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-[var(--surface)] rounded-lg shadow-md gold-border-top p-6 sm:p-8 text-center text-[var(--muted)]">
            טוען...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
