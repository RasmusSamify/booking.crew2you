import { useState, useMemo } from 'react';
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  format,
} from 'date-fns';
import { sv } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import CalendarMonthView from '@/components/calendar/CalendarMonthView';
import CalendarWeekView from '@/components/calendar/CalendarWeekView';
import CalendarDayView from '@/components/calendar/CalendarDayView';
import CalendarSidebar from '@/components/calendar/CalendarSidebar';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import NewBookingModal from '@/components/bookings/NewBookingModal';
import { useAllBookings, type Booking } from '@/hooks/use-bookings';
import { generateCalendarBookings } from '@/lib/calendar-utils';
import { cn } from '@/utils/cn';

type ViewMode = 'month' | 'week' | 'day';
type ColorMode = 'status' | 'kund';

const VIEW_LABELS: { key: ViewMode; label: string }[] = [
  { key: 'month', label: 'Månad' },
  { key: 'week', label: 'Vecka' },
  { key: 'day', label: 'Dag' },
];

export default function CalendarPage() {
  const { data: bookings = [] } = useAllBookings();

  // Default to April 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 3, 13));
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [colorMode, setColorMode] = useState<ColorMode>('status');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const calendarBookings = useMemo(
    () => generateCalendarBookings(bookings),
    [bookings]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    const today = new Date(2026, 3, 15); // Use a mid-April date as "today" for demo
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  // Format title based on view
  const titleSub = useMemo(() => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy', { locale: sv });
    }
    if (viewMode === 'week') {
      const ws = startOfWeek(currentDate, { weekStartsOn: 1 });
      return `Vecka ${format(ws, 'w', { locale: sv })} \u2014 ${format(ws, 'MMMM yyyy', { locale: sv })}`;
    }
    return format(currentDate, "EEEE d MMMM yyyy", { locale: sv });
  }, [currentDate, viewMode]);

  const weekStart = startOfWeek(
    viewMode === 'week' ? currentDate : selectedDate,
    { weekStartsOn: 1 }
  );

  return (
    <AdminLayout
      pageTitle="Kalender"
      pageSub={titleSub}
      activeNav="kalender"
      actions={
        <div className="flex items-center gap-3">
          {/* Color toggle */}
          <div className="flex items-center rounded-r border border-border bg-surface-alt">
            {(['status', 'kund'] as ColorMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setColorMode(mode)}
                className={cn(
                  'px-2.5 py-1.5 text-[11px] font-semibold capitalize transition-all',
                  colorMode === mode
                    ? 'bg-ink text-white'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                {mode === 'status' ? 'Status' : 'Kund'}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center rounded-r border border-border bg-surface-alt">
            {VIEW_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={cn(
                  'px-3 py-1.5 text-[11px] font-semibold transition-all',
                  viewMode === key
                    ? 'bg-ink text-white'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="flex h-8 w-8 items-center justify-center rounded-r border border-border bg-surface transition-colors hover:bg-surface-alt"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleToday}
              className="rounded-r border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
            >
              Idag
            </button>
            <button
              onClick={handleNext}
              className="flex h-8 w-8 items-center justify-center rounded-r border border-border bg-surface transition-colors hover:bg-surface-alt"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex gap-0 -mx-8 -mt-7 h-[calc(100vh-88px)]">
        {/* Main calendar area */}
        <div className="flex-1 overflow-auto border-r border-border">
          {viewMode === 'month' && (
            <CalendarMonthView
              year={year}
              month={month}
              selectedDate={selectedDate}
              calendarBookings={calendarBookings}
              colorMode={colorMode}
              onSelectDate={handleSelectDate}
              onSelectBooking={handleSelectBooking}
            />
          )}
          {viewMode === 'week' && (
            <CalendarWeekView
              weekStart={weekStart}
              calendarBookings={calendarBookings}
              colorMode={colorMode}
              onSelectBooking={handleSelectBooking}
            />
          )}
          {viewMode === 'day' && (
            <CalendarDayView
              date={currentDate}
              calendarBookings={calendarBookings}
              colorMode={colorMode}
              onSelectBooking={handleSelectBooking}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden w-[300px] flex-shrink-0 bg-surface lg:block">
          <CalendarSidebar
            selectedDate={selectedDate}
            calendarBookings={calendarBookings}
            onSelectBooking={handleSelectBooking}
            onNewBooking={() => setShowNewModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
      {showNewModal && (
        <NewBookingModal onClose={() => setShowNewModal(false)} />
      )}
    </AdminLayout>
  );
}
