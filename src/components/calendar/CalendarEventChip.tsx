import { useState } from 'react';
import { cn } from '@/utils/cn';
import { usePersonnel } from '@/hooks/use-personnel';
import {
  type CalendarBooking,
  STAGE_COLOR_CLASS,
  hashColor,
} from '@/lib/calendar-utils';
import { STAGE_META } from '@/hooks/use-bookings';

interface CalendarEventChipProps {
  calendarBooking: CalendarBooking;
  colorMode: 'status' | 'kund';
  onClick: () => void;
}

export default function CalendarEventChip({
  calendarBooking,
  colorMode,
  onClick,
}: CalendarEventChipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { booking } = calendarBooking;
  const { data: personnel = [] } = usePersonnel();

  const allInitials = booking.assignedPersonnel.map((ap) => {
    const pd = personnel.find((p) => p.id === ap.personnelId);
    return pd?.initialer ?? ap.personnelName.split(' ').map((w) => w[0]).join('').slice(0, 2);
  });
  const hasPersonal = booking.assignedPersonnel.length > 0;

  const storeName =
    booking.butik.length > 15
      ? booking.butik.slice(0, 14) + '\u2026'
      : booking.butik;

  const dotColorClass =
    colorMode === 'status' ? STAGE_COLOR_CLASS[booking.stage] : '';
  const dotColorStyle =
    colorMode === 'kund' ? { backgroundColor: hashColor(booking.kund) } : undefined;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex w-full items-center gap-1.5 rounded-r-sm bg-surface-alt px-1.5 py-[3px] text-left transition-colors hover:bg-border"
      >
        {/* Status dot */}
        <span
          className={cn('h-[5px] w-[5px] flex-shrink-0 rounded-full', dotColorClass)}
          style={dotColorStyle}
        />

        {/* Store name */}
        <span className="min-w-0 flex-1 truncate text-[10px] font-medium leading-tight text-ink">
          {storeName}
        </span>

        {/* Avatar or red dot */}
        {hasPersonal ? (
          <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-gold text-[7px] font-bold text-white">
            {allInitials[0]}
          </span>
        ) : (
          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red" title="Saknar personal" />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-0 z-50 mb-1 w-48 rounded-r border border-border bg-surface p-2 shadow-md">
          <div className="text-[11px] font-bold text-ink">{booking.butik}</div>
          <div className="mt-0.5 text-[10px] text-ink-muted">
            {booking.ort} &middot; {booking.kund}
          </div>
          <div className="mt-0.5 text-[10px] text-ink-muted">
            {booking.dagar} &middot; {booking.timmar}h
          </div>
          <div className="mt-0.5 text-[10px] text-ink-muted">
            {hasPersonal ? booking.assignedPersonnel.map((ap) => ap.personnelName).join(', ') : 'Saknar personal'}
          </div>
          <div className="mt-0.5 text-[10px] text-ink-faint">
            {STAGE_META[booking.stage].label}
          </div>
        </div>
      )}
    </div>
  );
}
