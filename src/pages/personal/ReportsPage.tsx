import { useState } from 'react';
import { ClipboardCheck, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { isPersonAssigned } from '@/lib/mock-data';
import { useAllBookings } from '@/hooks/use-bookings';
import { useCurrentPersonnel } from '@/hooks/use-current-identity';
import ReportForm from '@/components/personal/ReportForm';

export default function ReportsPage() {
  const { data: person } = useCurrentPersonnel();
  const { data: bookings = [] } = useAllBookings();

  const personName = person?.namn ?? 'Stina Bergkvist';
  const minaBokningar = bookings.filter((b) => isPersonAssigned(b, personName));
  const toReport = minaBokningar.filter((b) => b.stage === 'genomford');
  const reported = minaBokningar.filter((b) => b.stage === 'aterrapporterad' || b.stage === 'fakturerad');

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showReported, setShowReported] = useState(false);
  const [, forceUpdate] = useState(0);

  return (
    <div>
      {/* To report */}
      <div className="flex items-center gap-2 mb-3">
        <ClipboardCheck size={16} className="text-ink-muted" />
        <h2 className="text-[14px] font-bold text-ink">Att rapportera</h2>
      </div>

      {toReport.length === 0 ? (
        <p className="text-sm text-ink-muted py-4">Inget att rapportera just nu</p>
      ) : (
        toReport.map((b) => (
          <div key={b.id} className="bg-surface rounded-r-lg border border-border p-4 mb-3">
            <button
              onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
              className="w-full text-left active:opacity-90"
            >
              <p className="text-[14px] font-bold text-ink">{b.butik}</p>
              <p className="text-xs text-ink-muted">
                {b.dagar} &middot; {b.kund} &middot; {b.produkt}
              </p>
              <ChevronDown
                size={14}
                className={cn(
                  'text-ink-muted mt-1 transition-transform duration-200',
                  expandedId === b.id && 'rotate-180'
                )}
              />
            </button>
            {expandedId === b.id && (
              <ReportForm
                booking={b}
                onReported={() => {
                  setExpandedId(null);
                  forceUpdate((n) => n + 1);
                }}
              />
            )}
          </div>
        ))
      )}

      {/* Already reported - accordion */}
      <button
        onClick={() => setShowReported(!showReported)}
        className="flex items-center gap-2 w-full mt-6 mb-3 active:opacity-90"
      >
        <h2 className="text-[14px] font-bold text-ink">
          Redan rapporterade ({reported.length})
        </h2>
        <ChevronDown
          size={16}
          className={cn(
            'text-ink-muted transition-transform duration-200',
            showReported && 'rotate-180'
          )}
        />
      </button>

      {showReported &&
        reported.map((b) => (
          <div key={b.id} className="opacity-60 bg-surface rounded-r-lg border border-border p-4 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[14px] font-bold text-ink">{b.butik}</p>
                <p className="text-xs text-ink-muted">
                  {b.dagar} &middot; {b.kund} &middot; {b.produkt}
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-r-sm px-2 py-0.5 text-[11px] font-semibold bg-green-bg text-green">
                <Check size={12} />
                Rapporterad
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
