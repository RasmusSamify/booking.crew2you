import { useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { usePersonnel } from '@/hooks/use-personnel';
import {
  type CalendarBooking,
  getBookingsForDate,
  getBookingsForWeek,
  STAGE_COLOR_CLASS,
} from '@/lib/calendar-utils';
import type { Booking } from '@/lib/mock-data';

interface CalendarSidebarProps {
  selectedDate: Date;
  calendarBookings: CalendarBooking[];
  onSelectBooking: (booking: Booking) => void;
  onNewBooking: () => void;
}

const WEEK_LABELS = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

export default function CalendarSidebar({
  selectedDate,
  calendarBookings,
  onSelectBooking,
  onNewBooking,
}: CalendarSidebarProps) {
  const dayBookings = getBookingsForDate(calendarBookings, selectedDate);
  const { data: personnel = [] } = usePersonnel();

  const totalHours = dayBookings.reduce(
    (s, cb) => s + (cb.endHour - cb.startHour),
    0
  );
  const missingPersonal = dayBookings.filter((cb) => cb.booking.assignedPersonnel.length === 0).length;

  // Personnel overview
  const { bookedPersonnel, availablePersonnel } = useMemo(() => {
    const bookedMap = new Map<
      string,
      { name: string; initials: string; stores: string[]; hours: number }
    >();

    for (const cb of dayBookings) {
      for (const ap of cb.booking.assignedPersonnel) {
        const existing = bookedMap.get(ap.personnelName);
        if (existing) {
          existing.stores.push(cb.booking.butik);
          existing.hours += cb.endHour - cb.startHour;
        } else {
          const p = personnel.find((pp) => pp.id === ap.personnelId);
          bookedMap.set(ap.personnelName, {
            name: ap.personnelName,
            initials: p?.initialer ?? '??',
            stores: [cb.booking.butik],
            hours: cb.endHour - cb.startHour,
          });
        }
      }
    }

    const bookedNames = new Set(bookedMap.keys());
    const available = personnel.filter((p) => !bookedNames.has(p.namn));

    return {
      bookedPersonnel: Array.from(bookedMap.values()),
      availablePersonnel: available,
    };
  }, [dayBookings, personnel]);

  // Weekly bar chart data
  const weekData = useMemo(() => {
    const ws = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekBookings = getBookingsForWeek(calendarBookings, ws);
    const counts: number[] = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(ws, i);
      counts.push(getBookingsForDate(weekBookings, d).length);
    }
    return counts;
  }, [selectedDate, calendarBookings]);

  const maxCount = Math.max(...weekData, 1);

  return (
    <div className="flex flex-col gap-5 overflow-y-auto p-4">
      {/* Section 1: Day summary */}
      <div>
        <h3 className="text-lg font-bold capitalize text-ink">
          {format(selectedDate, 'd MMMM', { locale: sv })}
        </h3>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          {dayBookings.length} bokningar &middot; {totalHours} timmar totalt
        </p>
        {missingPersonal > 0 && (
          <p className="mt-0.5 text-[13px] font-medium text-red">
            {missingPersonal} saknar personal
          </p>
        )}
      </div>

      {/* Section 2: Day's bookings list */}
      {dayBookings.length > 0 && (
        <div>
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
            Dagens bokningar
          </h4>
          <div className="flex flex-col gap-1">
            {dayBookings.map((cb) => {
              const firstAp = cb.booking.assignedPersonnel[0];
              const p = firstAp ? personnel.find((pp) => pp.id === firstAp.personnelId) : undefined;
              return (
                <button
                  key={`${cb.booking.id}-${cb.date.toISOString()}`}
                  onClick={() => onSelectBooking(cb.booking)}
                  className="flex items-center gap-2 rounded-r px-2 py-2 text-left transition-colors hover:bg-surface-alt"
                >
                  <span
                    className={cn(
                      'h-2 w-2 flex-shrink-0 rounded-full',
                      STAGE_COLOR_CLASS[cb.booking.stage]
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-ink">
                    {cb.booking.butik}
                  </span>
                  <span className="flex-shrink-0 text-[10px] text-ink-faint">
                    {cb.startHour}:00&ndash;{cb.endHour}:00
                  </span>
                  {p ? (
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold text-[7px] font-bold text-white">
                      {p.initialer}
                    </span>
                  ) : (
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: Personnel overview */}
      <div>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          Personal idag
        </h4>

        {bookedPersonnel.length > 0 && (
          <div className="mb-3 flex flex-col gap-1.5">
            {bookedPersonnel.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 rounded-r bg-surface-alt px-2 py-1.5"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">
                  {p.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-semibold text-ink">
                    {p.name}
                  </div>
                  <div className="truncate text-[10px] text-ink-faint">
                    {p.stores.join(', ')}
                  </div>
                </div>
                <span className="flex-shrink-0 text-[10px] font-medium text-ink-muted">
                  {p.hours}h
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Available staff */}
        <div className="text-[11px] font-medium text-ink-faint">
          Tillg\u00e4nglig personal
        </div>
        <div className="mt-1 flex flex-col gap-1">
          {availablePersonnel.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 px-2 py-1 text-ink-faint"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              <span className="text-[11px]">{p.namn}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Mini bar chart */}
      <div>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          Vecko\u00f6versikt
        </h4>
        <div className="flex items-end justify-between gap-1">
          {weekData.map((count, i) => {
            const ws = startOfWeek(selectedDate, { weekStartsOn: 1 });
            const d = addDays(ws, i);
            const isSelected = isSameDay(d, selectedDate);
            const barH = maxCount > 0 ? (count / maxCount) * 60 : 0;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-6 rounded-t-sm transition-all',
                    isSelected ? 'bg-gold' : 'bg-gold-light'
                  )}
                  style={{ height: Math.max(barH, 2) }}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    isSelected ? 'text-gold-dark' : 'text-ink-faint'
                  )}
                >
                  {WEEK_LABELS[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: Quick action */}
      <button
        onClick={onNewBooking}
        className="flex w-full items-center justify-center gap-2 rounded-r bg-gold px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-gold-dark"
      >
        <Plus size={14} strokeWidth={2} />
        Nytt uppdrag
      </button>
    </div>
  );
}
