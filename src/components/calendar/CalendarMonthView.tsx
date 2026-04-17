import { isSameDay, isWeekend, getDate } from 'date-fns';
import { cn } from '@/utils/cn';
import {
  type CalendarBooking,
  getBookingsForDate,
  getMonthGridDates,
  isInMonth,
} from '@/lib/calendar-utils';
import CalendarEventChip from './CalendarEventChip';
import type { Booking } from '@/lib/mock-data';

interface CalendarMonthViewProps {
  year: number;
  month: number;
  selectedDate: Date;
  calendarBookings: CalendarBooking[];
  colorMode: 'status' | 'kund';
  onSelectDate: (date: Date) => void;
  onSelectBooking: (booking: Booking) => void;
}

const DAY_NAMES = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

export default function CalendarMonthView({
  year,
  month,
  selectedDate,
  calendarBookings,
  colorMode,
  onSelectDate,
  onSelectBooking,
}: CalendarMonthViewProps) {
  const today = new Date();
  const gridDates = getMonthGridDates(year, month);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={cn(
              'px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted',
              i >= 5 && 'text-ink-faint'
            )}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {gridDates.map((date) => {
          const inMonth = isInMonth(date, year, month);
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);
          const weekend = isWeekend(date);
          const dayBookings = getBookingsForDate(calendarBookings, date);
          const visibleCount = 3;
          const overflow = dayBookings.length - visibleCount;

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={cn(
                'flex min-h-[100px] flex-col border-b border-r border-border p-1.5 text-left transition-colors hover:bg-surface-alt',
                weekend && 'bg-[#faf8f3]',
                isSelected && 'ring-1 ring-inset ring-gold',
                !inMonth && 'opacity-40'
              )}
            >
              {/* Date number */}
              <span
                className={cn(
                  'mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                  isToday && 'ring-2 ring-gold text-gold-dark',
                  inMonth ? 'text-ink' : 'text-ink-faint'
                )}
              >
                {getDate(date)}
              </span>

              {/* Event chips */}
              <div className="flex flex-col gap-[2px]">
                {dayBookings.slice(0, visibleCount).map((cb) => (
                  <CalendarEventChip
                    key={`${cb.booking.id}-${cb.date.toISOString()}`}
                    calendarBooking={cb}
                    colorMode={colorMode}
                    onClick={() => onSelectBooking(cb.booking)}
                  />
                ))}
                {overflow > 0 && (
                  <span className="px-1.5 text-[10px] font-medium text-ink-muted">
                    +{overflow} till
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
