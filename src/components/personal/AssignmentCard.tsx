import { Package, MapPin, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Booking } from '@/lib/mock-data';
import type { BookingStage, ServiceType } from '@/hooks/use-bookings';
import { STAGE_META } from '@/hooks/use-bookings';

const SERVICE_COLORS: Record<ServiceType, string> = {
  demo: 'bg-blue-bg text-blue',
  plock: 'bg-violet-bg text-violet',
  sampling: 'bg-pink-bg text-pink',
  event: 'bg-amber-bg text-amber',
};

const STAGE_COLORS: Record<BookingStage, string> = {
  inkommen: 'bg-status-inkommen-bg text-status-inkommen',
  bokad: 'bg-status-bokad-bg text-status-bokad',
  bekraftad: 'bg-status-bekraftad-bg text-status-bekraftad',
  personal: 'bg-status-personal-bg text-status-personal',
  genomford: 'bg-status-genomford-bg text-status-genomford',
  aterrapporterad: 'bg-status-aterrapporterad-bg text-status-aterrapporterad',
  fakturerad: 'bg-status-fakturerad-bg text-status-fakturerad',
};

export interface DateInfo {
  day: string;
  date: number;
  month: string;
}

// Map booking dagar field to a realistic date block
const DAY_MAP: Record<string, string> = {
  'mon': 'M\u00c5N', 'mån': 'M\u00c5N', 'man': 'M\u00c5N',
  'tis': 'TIS',
  'ons': 'ONS',
  'tor': 'TOR',
  'fre': 'FRE',
  'lor': 'L\u00d6R', 'lör': 'L\u00d6R',
  'son': 'S\u00d6N', 'sön': 'S\u00d6N',
};

// Date offsets for April 2026 for each weekday abbreviation
const DATE_OFFSETS: Record<string, number[]> = {
  'mån': [13, 20],
  'man': [13, 20],
  'mon': [13, 20],
  'tis': [14, 21],
  'ons': [15, 22],
  'tor': [16, 23],
  'fre': [17, 24],
  'lör': [18, 25],
  'lor': [18, 25],
  'sön': [19, 26],
  'son': [19, 26],
};

export function parseDateInfo(dagar: string, bookingId: string): DateInfo {
  // Extract first weekday abbreviation from the dagar field
  const cleaned = dagar.toLowerCase().replace(/\+/g, ' ');
  const firstWord = cleaned.split(/\s+/)[0];

  const dayLabel = DAY_MAP[firstWord] || firstWord.toUpperCase().slice(0, 3);
  const offsets = DATE_OFFSETS[firstWord] || [15, 22];

  // Use booking id to pick a deterministic date
  const numericPart = parseInt(bookingId.replace(/\D/g, ''), 10) || 0;
  const dateNum = offsets[numericPart % offsets.length];

  return { day: dayLabel, date: dateNum, month: 'APR' };
}

interface AssignmentCardProps {
  booking: Booking;
  dateInfo?: DateInfo;
}

export default function AssignmentCard({ booking, dateInfo }: AssignmentCardProps) {
  const di = dateInfo || parseDateInfo(booking.dagar, booking.id);

  return (
    <div className="bg-surface rounded-r-lg border border-border shadow-xs p-4 mb-3 active:scale-[0.98] active:opacity-90">
      <div className="flex gap-3">
        {/* Date block */}
        <div className="bg-ink text-white rounded-r w-14 h-16 flex-shrink-0 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase font-semibold tracking-wide">{di.day}</span>
          <span className="text-xl font-black leading-none">{di.date}</span>
          <span className="text-[10px] uppercase">{di.month}</span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-[15px] font-bold text-ink truncate">{booking.butik}</p>
          <p className="text-xs text-ink-muted flex items-center gap-1">
            <MapPin size={11} />
            {booking.ort}
            <span className="mx-0.5">&middot;</span>
            <Clock size={11} />
            {booking.timmar}h
          </p>
          <p className="text-sm text-ink-soft mt-1">{booking.kund}</p>
          {booking.produkt && (
            <p className="text-sm text-ink mt-0.5">{booking.produkt}</p>
          )}

          {booking.assignedPersonnel.length > 1 && (
            <p className="text-xs text-ink-muted mt-1">
              Tillsammans med: {booking.assignedPersonnel
                .filter((ap) => ap.personnelName !== 'Stina Bergkvist')
                .map((ap) => ap.personnelName)
                .join(', ')}
            </p>
          )}

          {booking.material && (
            <>
              <div className="border-t border-dashed border-border my-2" />
              <div className="flex items-start gap-1.5">
                <Package size={12} className="text-ink-muted mt-0.5 flex-shrink-0" />
                <span className="text-xs text-ink-muted">{booking.material}</span>
              </div>
            </>
          )}

          <div className="flex justify-between items-center mt-2">
            <span
              className={cn(
                'rounded-r-sm px-2 py-0.5 text-[11px] font-semibold capitalize',
                SERVICE_COLORS[booking.tjanst]
              )}
            >
              {booking.tjanst}
            </span>
            <span
              className={cn(
                'rounded-r-sm px-2 py-0.5 text-[11px] font-semibold',
                STAGE_COLORS[booking.stage]
              )}
            >
              {STAGE_META[booking.stage].shortLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
