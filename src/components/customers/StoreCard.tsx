import { Building2 } from 'lucide-react';
import type { Butik } from '@/lib/mock-data';
import ContactChip from './ContactChip';

interface StoreCardProps {
  butik: Butik;
  uppdragCount: number;
}

export default function StoreCard({ butik, uppdragCount }: StoreCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-r-lg border border-border bg-surface p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Building2 size={16} strokeWidth={2} className="flex-shrink-0 text-ink-muted" />
          <span className="text-[15px] font-bold text-ink">{butik.namn}</span>
        </div>
        <div className="mt-0.5 pl-6 text-xs text-ink-muted">
          {butik.ort} &middot; {butik.region}
        </div>
      </div>

      {/* Contacts */}
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-faint">
          Kontakter:
        </div>
        <div className="space-y-0.5">
          {butik.kontakter.map((k) => (
            <ContactChip key={k.namn} contact={k} />
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border pt-3 text-xs text-ink-muted">
        {uppdragCount} uppdrag genomforda
      </div>
    </div>
  );
}
