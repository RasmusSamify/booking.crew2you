import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { usePersonnel } from '@/hooks/use-personnel';
import {
  type CalendarBooking,
  getBookingsForDate,
  STAGE_COLOR_CLASS,
  STAGE_BG_CLASS,
  STAGE_TEXT_CLASS,
  hashColor,
} from '@/lib/calendar-utils';
import { STAGE_META } from '@/hooks/use-bookings';
import type { Booking } from '@/lib/mock-data';

interface CalendarDayViewProps {
  date: Date;
  calendarBookings: CalendarBooking[];
  colorMode: 'status' | 'kund';
  onSelectBooking: (booking: Booking) => void;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07-20
const ROW_HEIGHT = 72; // px per hour, larger for day view

export default function CalendarDayView({
  date,
  calendarBookings,
  colorMode,
  onSelectBooking,
}: CalendarDayViewProps) {
  const dayBookings = getBookingsForDate(calendarBookings, date);
  const dateLabel = format(date, "EEEE d MMMM yyyy", { locale: sv });
  const { data: personnel = [] } = usePersonnel();

  return (
    <div className="flex flex-col">
      {/* Day header */}
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-lg font-bold capitalize text-ink">{dateLabel}</h2>
        <p className="text-[13px] text-ink-muted">
          {dayBookings.length} bokningar &middot;{' '}
          {dayBookings.reduce((s, cb) => s + (cb.endHour - cb.startHour), 0)} timmar
        </p>
      </div>

      {/* Time grid */}
      <div className="flex overflow-auto">
        {/* Time axis */}
        <div className="flex-shrink-0 border-r border-border">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="flex w-16 items-start justify-end pr-3 text-[11px] text-ink-faint"
              style={{ height: ROW_HEIGHT }}
            >
              {String(hour).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Booking lane */}
        <div
          className="relative flex-1"
          style={{ height: HOURS.length * ROW_HEIGHT }}
        >
          {/* Hour lines */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute w-full border-b border-border/50"
              style={{ top: (hour - 7) * ROW_HEIGHT, height: ROW_HEIGHT }}
            />
          ))}

          {/* Booking cards */}
          {dayBookings.map((cb) => {
            const top = (cb.startHour - 7) * ROW_HEIGHT;
            const height = (cb.endHour - cb.startHour) * ROW_HEIGHT;
            const hasPersonal = cb.booking.assignedPersonnel.length > 0;

            const bgClass =
              colorMode === 'status' ? STAGE_BG_CLASS[cb.booking.stage] : '';
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
                  'absolute left-3 right-3 overflow-hidden rounded-r border-l-4 p-3 text-left shadow-xs transition-shadow hover:shadow-sm',
                  bgClass,
                  colorMode === 'status'
                    ? `border-l-4 border-status-${cb.booking.stage}`
                    : 'border-l-4'
                )}
                style={{
                  top,
                  height: Math.max(height, ROW_HEIGHT),
                  ...bgStyle,
                  ...borderStyle,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-ink">
                      {cb.booking.butik}
                    </div>
                    <div className="mt-0.5 text-xs text-ink-muted">
                      {cb.booking.ort} &middot; {cb.booking.kund}
                    </div>

                    {/* Personal */}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {hasPersonal ? (
                        <>
                          {cb.booking.assignedPersonnel.map((ap, i) => {
                            const pd = personnel.find((p) => p.id === ap.personnelId);
                            return (
                              <span key={ap.personnelId} className={cn('flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-white', i > 0 && '-ml-1')}>
                                {pd?.initialer ?? '??'}
                              </span>
                            );
                          })}
                          <span className="text-xs font-medium text-ink">
                            {cb.booking.assignedPersonnel.map((ap) => ap.personnelName).join(', ')}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-red">
                          Saknar personal
                        </span>
                      )}
                    </div>

                    {/* Product + material */}
                    {(cb.booking.produkt || cb.booking.material) && (
                      <div className="mt-1 text-[10px] text-ink-faint">
                        {cb.booking.produkt}
                        {cb.booking.material
                          ? ` \u2014 ${cb.booking.material}`
                          : ''}
                      </div>
                    )}
                  </div>

                  {/* Right column: badges */}
                  <div className="flex flex-col items-end gap-1">
                    {/* Stage badge */}
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-semibold',
                        STAGE_BG_CLASS[cb.booking.stage],
                        STAGE_TEXT_CLASS[cb.booking.stage]
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          STAGE_COLOR_CLASS[cb.booking.stage]
                        )}
                      />
                      {STAGE_META[cb.booking.stage].shortLabel}
                    </span>

                    {/* Service chip */}
                    <span className="rounded-full border border-border bg-surface px-2 py-[2px] text-[10px] font-medium text-ink-muted">
                      {cb.booking.tjanst}
                    </span>

                    {/* Hours */}
                    <span className="text-[10px] font-medium text-ink-faint">
                      {cb.startHour}:00&ndash;{cb.endHour}:00
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
