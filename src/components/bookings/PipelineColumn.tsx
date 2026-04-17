import { Plus } from 'lucide-react';
import type { Booking, BookingStage } from '@/hooks/use-bookings';
import { STAGE_META } from '@/hooks/use-bookings';
import type { Issue } from '@/lib/issue-detection';
import BookingCard from './BookingCard';

const STAGE_DOT_COLOR: Record<BookingStage, string> = {
  inkommen: 'bg-status-inkommen',
  bokad: 'bg-status-bokad',
  bekraftad: 'bg-status-bekraftad',
  personal: 'bg-status-personal',
  genomford: 'bg-status-genomford',
  aterrapporterad: 'bg-status-aterrapporterad',
  fakturerad: 'bg-status-fakturerad',
};

interface PipelineColumnProps {
  stage: BookingStage;
  bookings: Booking[];
  onCardClick: (booking: Booking) => void;
  onIssueClick?: (booking: Booking, issue: Issue) => void;
}

export default function PipelineColumn({ stage, bookings, onCardClick, onIssueClick }: PipelineColumnProps) {
  return (
    <div className="flex min-h-[420px] min-w-[280px] max-w-[320px] flex-col rounded-r-lg border border-border bg-surface-alt p-3">
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between border-b border-border px-1.5 pb-2 pt-1">
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-ink-soft">
          <span className={`h-2 w-2 rounded-full ${STAGE_DOT_COLOR[stage]}`} />
          {STAGE_META[stage].label}
        </h4>
        <span className="rounded-[10px] border border-border bg-surface px-[9px] py-[2px] text-[11px] font-bold text-ink-muted">
          {bookings.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {bookings.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            onClick={() => onCardClick(b)}
            onIssueClick={onIssueClick}
          />
        ))}
      </div>

      {/* Add button — only in Inkommen */}
      {stage === 'inkommen' && (
        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-r bg-transparent px-3 py-2 text-[13px] font-medium text-ink-muted transition-all hover:bg-surface hover:text-ink">
          <Plus size={14} strokeWidth={2} />
          Lägg till
        </button>
      )}
    </div>
  );
}
