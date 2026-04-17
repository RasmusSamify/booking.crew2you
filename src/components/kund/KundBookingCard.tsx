import { cn } from '@/utils/cn';
import { hasPersonnel, getPersonnelDisplay, type Booking } from '@/lib/mock-data';
import type { BookingStage } from '@/hooks/use-bookings';
import KundQualityBadge from './KundQualityBadge';
import { useQualityReviews } from '@/hooks/use-reviews';

const KUND_STAGE_MAP: Record<BookingStage, string> = {
  inkommen: 'Mottagen',
  bokad: 'Mottagen',
  bekraftad: 'Bekr\u00e4ftad',
  personal: 'Bekr\u00e4ftad',
  genomford: 'Genomf\u00f6rd',
  aterrapporterad: 'Rapporterad',
  fakturerad: 'Rapporterad',
};

const KUND_STAGE_COLOR: Record<string, string> = {
  Mottagen: 'bg-blue-bg text-blue',
  'Bekr\u00e4ftad': 'bg-violet-bg text-violet',
  'Genomf\u00f6rd': 'bg-amber-bg text-amber',
  Rapporterad: 'bg-green-bg text-green',
};

const SERVICE_LABEL: Record<string, string> = {
  demo: 'Demo',
  plock: 'Plock',
  sampling: 'Sampling',
  event: 'Event',
};

const WEEKDAYS: Record<string, string> = {
  'm\u00e5n': 'M\u00c5N',
  tis: 'TIS',
  ons: 'ONS',
  tor: 'TOR',
  fre: 'FRE',
  'l\u00f6r': 'L\u00d6R',
  's\u00f6n': 'S\u00d6N',
};

function parseDateBlock(dagar: string): { weekday: string; raw: string } {
  const firstWord = dagar.split(/[\s+]/)[0].toLowerCase();
  const weekday = WEEKDAYS[firstWord] ?? firstWord.toUpperCase().slice(0, 3);
  return { weekday, raw: dagar };
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface KundBookingCardProps {
  booking: Booking;
  onClick?: () => void;
}

export default function KundBookingCard({ booking, onClick }: KundBookingCardProps) {
  const { weekday, raw } = parseDateBlock(booking.dagar);
  const kundLabel = KUND_STAGE_MAP[booking.stage];
  const colorClass = KUND_STAGE_COLOR[kundLabel] ?? 'bg-surface-alt text-ink-muted';
  const { data: reviews = [] } = useQualityReviews();
  const review = reviews.find((r) => r.bookingId === booking.id);

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex gap-4 rounded-r-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Date block */}
      <div className="flex h-16 w-14 flex-shrink-0 flex-col items-center justify-center rounded-r bg-gold-bg text-ink">
        <span className="text-[10px] font-bold uppercase tracking-wider">{weekday}</span>
        <span className="text-sm font-semibold">{raw}</span>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[14px] font-semibold text-ink">{booking.butik}</span>
            <span className="ml-1.5 text-[13px] text-ink-muted">{booking.ort}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {review && <KundQualityBadge score={review.averageScore} />}
            <span
              className={cn(
                'inline-flex items-center gap-[5px] rounded-[20px] px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px]',
                colorClass
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {kundLabel}
            </span>
          </div>
        </div>

        <div className="text-[12.5px] text-ink-muted">
          {SERVICE_LABEL[booking.tjanst] ?? booking.tjanst}
          {booking.produkt && <> &middot; {booking.produkt}</>}
          {' '}&middot; {booking.timmar}h
        </div>

        {/* Personnel */}
        {hasPersonnel(booking) ? (
          <div className="flex items-center gap-2">
            {booking.assignedPersonnel.map((ap, i) => (
              <div key={ap.personnelId} className={cn('flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white', i > 0 && '-ml-2 ring-2 ring-surface')}>
                {getInitials(ap.personnelName)}
              </div>
            ))}
            <span className="text-[12.5px] font-medium text-ink">{getPersonnelDisplay(booking)}</span>
          </div>
        ) : (
          <span className="text-[12.5px] italic text-ink-muted">
            Demov&auml;rd tilldelas inom kort
          </span>
        )}
      </div>
    </div>
  );
}
