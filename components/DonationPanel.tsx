type Props = {
  donationUrl?: string | null;
  donationNote?: string | null;
  bankName?: string | null;
  bankBranch?: string | null;
  bankAccount?: string | null;
  bankAccountName?: string | null;
  compact?: boolean;
};

/**
 * Public-facing donation panel.
 * Shows (in order, all optional):
 *  - intro note
 *  - external donation button (nedar.im etc.)
 *  - bank transfer details block
 */
export function DonationPanel({
  donationUrl,
  donationNote,
  bankName,
  bankBranch,
  bankAccount,
  bankAccountName,
  compact = false,
}: Props) {
  const hasBank = !!(bankName || bankBranch || bankAccount || bankAccountName);
  const hasAnything = !!donationUrl || hasBank || !!donationNote;

  if (!hasAnything) {
    return (
      <div className="bg-[var(--primary)] text-white rounded-lg p-6 shadow-md text-center">
        <h3 className="text-xl font-bold mb-2">תרומה לבית הכנסת</h3>
        <p className="text-xs opacity-70 italic">
          פרטי תרומה יעודכנו בקרוב
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--primary)] text-white rounded-lg p-6 shadow-md">
      <h3 className={`font-bold mb-3 text-center ${compact ? "text-lg" : "text-xl"}`}>
        תרומה לבית הכנסת
      </h3>

      {donationNote && (
        <p className="text-sm opacity-90 mb-4 text-center leading-relaxed">
          {donationNote}
        </p>
      )}

      {donationUrl && (
        <div className="text-center mb-4">
          <a
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[var(--accent)] text-[var(--primary)] px-6 py-2 rounded font-bold hover:bg-[var(--accent-light)] transition-colors"
          >
            תרומה בנדרים פלוס ←
          </a>
        </div>
      )}

      {hasBank && (
        <div className="border-t border-white/20 pt-4 mt-2">
          <p className="text-xs uppercase tracking-wider text-[var(--accent-light)] mb-2 text-center">
            העברה בנקאית
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            {bankName && (
              <>
                <dt className="opacity-70">בנק:</dt>
                <dd className="font-semibold">{bankName}</dd>
              </>
            )}
            {bankBranch && (
              <>
                <dt className="opacity-70">סניף:</dt>
                <dd className="font-mono">{bankBranch}</dd>
              </>
            )}
            {bankAccount && (
              <>
                <dt className="opacity-70">חשבון:</dt>
                <dd className="font-mono">{bankAccount}</dd>
              </>
            )}
            {bankAccountName && (
              <>
                <dt className="opacity-70">ע״ש:</dt>
                <dd>{bankAccountName}</dd>
              </>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
