import { addDays, isSameDay, format, getDate } from 'date-fns';
import { sv } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  type CalendarBooking,
  getBookingsForDate,
  hasConflict,
  STAGE_BG_CLASS,
  STAGE_BORDER_CLASS,
  hashColor,
} from '@/lib/calendar-utils';
import { getPersonnelDisplay, hasPersonnel as hasPersonnelFn } from '@/lib/mock-data';
import type { Booking } from '@/lib/mock-data';

interface CalendarWeekViewProps {
  weekStart: Date;
  calendarBookings: CalendarBooking[];
  colorMode: 'status' | 'kund';
  onSelectBooking: (booking: Booking) => void;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07-20
const ROW_HEIGHT = 48; // px per hour

export default function CalendarWeekView({
  weekStart,
  calendarBookings,
  colorMode,
  onSelectBooking,
}: CalendarWeekViewProps) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex overflow-auto">
      {/* Time axis */}
      <div className="flex-shrink-0 border-r border-border pt-[52px]">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="flex h-12 w-14 items-start justify-end pr-2 text-[11px] text-ink-faint"
          >
            {String(hour).padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div className="grid flex-1 grid-cols-7">
        {days.map((day) => {
          const dayBookings = getBookingsForDate(calendarBookings, day);
          const conflicts = hasConflict(calendarBookings, day);
          const isToday = isSameDay(day, today);

          return (
            <div
              key={day.toISOString()}
              className="relative border-r border-border"
            >
              {/* Column header */}
              <div
                className={cn(
                  'sticky top-0 z-10 flex flex-col items-center border-b border-border bg-surface px-1 py-2',
                  isToday && 'bg-gold-bg'
                )}
              >
                <span className="text-[10px] font-semibold uppercase text-ink-muted">
                  {format(day, 'EEE', { locale: sv })}
                </span>
                <span
                  className={cn(
                    'mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold',
                    isToday ? 'bg-gold text-white' : 'text-ink'
                  )}
                >
                  {getDate(day)}
                </span>
                {dayBookings.length > 0 && (
                  <span className="mt-0.5 text-[9px] text-ink-faint">
                    {dayBookings.length} bokn.
                  </span>
                )}
              </div>

              {/* Hour grid */}
              <div className="relative" style={{ height: HOURS.length * ROW_HEIGHT }}>
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full border-b border-border/50"
                    style={{ top: (hour - 7) * ROW_HEIGHT, height: ROW_HEIGHT }}
                  />
                ))}

                {/* Booking blocks */}
                {dayBookings.map((cb) => {
                  const top = (cb.startHour - 7) * ROW_HEIGHT;
                  const height = (cb.endHour - cb.startHour) * ROW_HEIGHT;
                  const personConflict = conflicts.some(
                    (c) => cb.booking.assignedPersonnel.some((ap) => ap.personnelName === c.person)
                  );

                  const bgClass =
                    colorMode === 'status' ? STAGE_BG_CLASS[cb.booking.stage] : '';
                  const borderClass =
                    colorMode === 'status'
                      ? STAGE_BORDER_CLASS[cb.booking.stage]
                      : '';
                  const bgStyle =
                    colorMode === 'kund'
                      ? { backgroundColor: hashColor(cb.booking.kund) + '18' }
                      : undefined;
                  const borderStyle =
                    colorMode === 'kund'
                      ? { borderLeftColor: hashColor(cb.booking.kund) }
                      : undefined;

                  return (
                    <button
                      key={`${cb.booking.id}-${cb.date.toISOString()}`}
                      onClick={() => onSelectBooking(cb.booking)}
                      className={cn(
                        'absolute left-1 right-1 overflow-hidden rounded-r-sm border-l-[3px] p-1.5 text-left transition-opacity hover:opacity-80',
                        bgClass,
                        borderClass
                      )}
                      style={{
                        top,
                        height: Math.max(height, ROW_HEIGHT),
                        ...bgStyle,
                        ...borderStyle,
                      }}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[10px] font-bold text-ink">
                            {cb.booking.butik}
                          </div>
                          <div className="truncate text-[9px] text-ink-muted">
                            {hasPersonnelFn(cb.booking) ? getPersonnelDisplay(cb.booking) : 'Ej tillsatt'}
                          </div>
                        </div>
                        {personConflict && hasPersonnelFn(cb.booking) && (
                          <AlertTriangle
                            size={12}
                            className="flex-shrink-0 text-amber"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
