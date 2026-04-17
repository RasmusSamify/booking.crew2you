import { ArrowRight } from 'lucide-react';
import type { Booking } from '@/hooks/use-bookings';

interface MissingInfoActionProps {
  booking: Booking;
  onClose: () => void;
  onOpenDetail: () => void;
}

export default function MissingInfoAction({
  booking: _booking,
  onClose,
  onOpenDetail,
}: MissingInfoActionProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-r border border-border bg-surface-alt px-4 py-4 text-[13px] text-ink-soft">
        Kompletteringsmail kommer i Phase 2. Öppna full detalj för att
        redigera bokningen manuellt.
      </div>
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-r px-3 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
        >
          Avbryt
        </button>
        <button
          type="button"
          onClick={onOpenDetail}
          className="inline-flex items-center gap-1.5 rounded-r bg-gold px-3 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-gold-dark"
        >
          Öppna full detalj
          <ArrowRight size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
