import { useState } from 'react';
import type { Kund } from '@/lib/mock-data';
import ContactChip from './ContactChip';

interface CustomerCardProps {
  kund: Kund;
  uppdragCount: number;
}

function KundLogo({ kund }: { kund: Kund }) {
  const [failed, setFailed] = useState(false);
  const initials = kund.namn
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (!kund.domain || failed) {
    return (
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-r bg-gold-bg text-sm font-bold text-gold-dark">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={`https://logo.clearbit.com/${kund.domain}`}
      alt={kund.namn}
      className="h-10 w-10 flex-shrink-0 rounded-r border border-border object-contain bg-white p-0.5"
      onError={() => setFailed(true)}
    />
  );
}

export default function CustomerCard({ kund, uppdragCount }: CustomerCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-r-lg border border-border bg-surface p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <KundLogo kund={kund} />
        <div className="flex-1 min-w-0">
          <span className="text-[15px] font-bold text-ink">{kund.namn}</span>
        </div>
        <span className="flex-shrink-0 rounded-[10px] bg-surface-alt px-2 py-[2px] text-[11px] font-semibold text-ink-muted">
          {uppdragCount} uppdrag
        </span>
      </div>

      {/* Contacts */}
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-faint">
          Kontakter:
        </div>
        <div className="space-y-0.5">
          {kund.kontakter.map((k) => (
            <ContactChip key={k.namn} contact={k} />
          ))}
        </div>
      </div>
    </div>
  );
}
