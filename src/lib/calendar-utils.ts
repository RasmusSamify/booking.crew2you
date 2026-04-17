import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  getDay,
} from 'date-fns';
import type { Booking } from '@/lib/mock-data';

export interface CalendarBooking {
  booking: Booking;
  date: Date;
  startHour: number;
  endHour: number;
}

// Swedish day abbreviations -> JS getDay() values (0=Sun)
const DAY_MAP: Record<string, number> = {
  mån: 1,
  tis: 2,
  ons: 3,
  tor: 4,
  fre: 5,
  lör: 6,
  sön: 0,
};

/**
 * Parse time range from dagar string, e.g. "10-18" -> [10,18].
 * Defaults to [9,16] if not found.
 */
function parseTime(dagar: string): [number, number] {
  const match = dagar.match(/(\d{1,2})-(\d{1,2})/);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10)];
  }
  return [9, 16];
}

/**
 * Parse day names from dagar string, e.g. "mån+tor" -> ["mån","tor"],
 * "tis 10-18" -> ["tis"], "lör 11-16" -> ["lör"]
 */
function parseDayNames(dagar: string): string[] {
  const lower = dagar.toLowerCase();
  const parts = lower.split('+').map((s) => s.trim());
  const days: string[] = [];
  for (const part of parts) {
    for (const dayName of Object.keys(DAY_MAP)) {
      if (part.startsWith(dayName)) {
        days.push(dayName);
        break;
      }
    }
  }
  return days.length > 0 ? days : ['mån']; // fallback
}

/**
 * Find all dates in April 2026 that match a given JS weekday (0-6).
 */
function getDatesForWeekday(year: number, month: number, weekday: number): Date[] {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(start);
  const dates: Date[] = [];
  let current = start;
  while (current <= end) {
    if (getDay(current) === weekday) {
      dates.push(new Date(current));
    }
    current = addDays(current, 1);
  }
  return dates;
}

/**
 * Pre-defined date assignments for each booking to ensure good spread
 * across April 2026 (3-4 per week) with some overlaps for conflict detection.
 * Key = booking id, value = array of [dayOfMonth] to place it on.
 */
const BOOKING_DATE_MAP: Record<string, number[]> = {
  // Week 1: Apr 1-5 (Wed-Sun)
  b1: [7],            // tis 10-18 -> Tue Apr 7
  b2: [3],            // fre 11-19 -> Fri Apr 3
  b3: [4],            // lör 11-16 -> Sat Apr 4
  // Week 2: Apr 6-12
  b4: [9, 10],        // tor+fre 11-19 -> Thu Apr 9, Fri Apr 10
  b5: [9, 10],        // tor+fre 10-18 -> Thu Apr 9, Fri Apr 10 (conflict with b4!)
  b6: [10],           // fre 11-19 -> Fri Apr 10 (triple stack!)
  // Week 3: Apr 13-19
  b7: [17],           // fre 11-19 -> Fri Apr 17
  b8: [13, 16],       // mån+tor -> Mon Apr 13, Thu Apr 16
  b9: [13, 16],       // mån+tor -> Mon Apr 13, Thu Apr 16 (conflict with b8 on dates)
  b11: [13],          // mån 10-17 -> Mon Apr 13 (triple on Mon!)
  // Week 4: Apr 20-26
  b10: [24],          // fre 11-18 -> Fri Apr 24
  b12: [22],          // ons 11-18 -> Wed Apr 22
  b13: [25],          // lör 10-16 -> Sat Apr 25
  b14: [24],          // fre 11-18 -> Fri Apr 24 (conflict with b10 on Fri)
  b15: [20],          // mån 09-16 -> Mon Apr 20
};

/**
 * Generate CalendarBooking entries from all bookings, placed on specific
 * April 2026 dates. Multi-day bookings produce multiple entries.
 */
export function generateCalendarBookings(bookings: Booking[]): CalendarBooking[] {
  const results: CalendarBooking[] = [];
  const year = 2026;
  const month = 3; // April (0-indexed)

  for (const booking of bookings) {
    const [startHour, endHour] = parseTime(booking.dagar);
    const assignedDays = BOOKING_DATE_MAP[booking.id];

    if (assignedDays) {
      for (const dayOfMonth of assignedDays) {
        results.push({
          booking,
          date: new Date(year, month, dayOfMonth),
          startHour,
          endHour,
        });
      }
    } else {
      // Fallback: parse day names and pick first matching date in April
      const dayNames = parseDayNames(booking.dagar);
      for (const dayName of dayNames) {
        const weekday = DAY_MAP[dayName];
        if (weekday !== undefined) {
          const dates = getDatesForWeekday(year, month, weekday);
          if (dates.length > 0) {
            results.push({
              booking,
              date: dates[0],
              startHour,
              endHour,
            });
          }
        }
      }
    }
  }

  return results;
}

/** Get all calendar bookings for a specific date */
export function getBookingsForDate(
  bookings: CalendarBooking[],
  date: Date
): CalendarBooking[] {
  return bookings.filter((cb) => isSameDay(cb.date, date));
}

/** Get all calendar bookings for a week starting on weekStart */
export function getBookingsForWeek(
  bookings: CalendarBooking[],
  weekStart: Date
): CalendarBooking[] {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  return bookings.filter((cb) => cb.date >= weekStart && cb.date <= weekEnd);
}

/** Get all calendar bookings for a given month (0-indexed) */
export function getBookingsForMonth(
  bookings: CalendarBooking[],
  year: number,
  month: number
): CalendarBooking[] {
  return bookings.filter(
    (cb) => cb.date.getFullYear() === year && cb.date.getMonth() === month
  );
}

/**
 * Detect personnel conflicts: same person booked on multiple bookings
 * on the same day. Returns array of { person } for each conflict.
 */
export function hasConflict(
  bookings: CalendarBooking[],
  date: Date
): { person: string }[] {
  const dayBookings = getBookingsForDate(bookings, date);
  const personCount = new Map<string, number>();

  for (const cb of dayBookings) {
    for (const ap of cb.booking.assignedPersonnel) {
      personCount.set(
        ap.personnelName,
        (personCount.get(ap.personnelName) || 0) + 1
      );
    }
  }

  const conflicts: { person: string }[] = [];
  for (const [person, count] of personCount) {
    if (count > 1) {
      conflicts.push({ person });
    }
  }
  return conflicts;
}

/** Get the month grid dates (including overflow from prev/next months) */
export function getMonthGridDates(year: number, month: number): Date[] {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dates: Date[] = [];
  let current = gridStart;
  while (current <= gridEnd) {
    dates.push(new Date(current));
    current = addDays(current, 1);
  }
  return dates;
}

/** Check if a date is in the given month */
export function isInMonth(date: Date, year: number, month: number): boolean {
  return isSameMonth(date, new Date(year, month));
}

/** Generate a consistent color from a string (for kund coloring) */
export function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#4c6ef5', '#7c3aed', '#db2777', '#d97706',
    '#059669', '#dc2626', '#475569', '#a88c42',
  ];
  return colors[Math.abs(hash) % colors.length];
}

/** Stage -> Tailwind bg color class */
export const STAGE_COLOR_CLASS: Record<string, string> = {
  inkommen: 'bg-status-inkommen',
  bokad: 'bg-status-bokad',
  bekraftad: 'bg-status-bekraftad',
  personal: 'bg-status-personal',
  genomford: 'bg-status-genomford',
  aterrapporterad: 'bg-status-aterrapporterad',
  fakturerad: 'bg-status-fakturerad',
};

/** Stage -> Tailwind border color class */
export const STAGE_BORDER_CLASS: Record<string, string> = {
  inkommen: 'border-status-inkommen',
  bokad: 'border-status-bokad',
  bekraftad: 'border-status-bekraftad',
  personal: 'border-status-personal',
  genomford: 'border-status-genomford',
  aterrapporterad: 'border-status-aterrapporterad',
  fakturerad: 'border-status-fakturerad',
};

/** Stage -> Tailwind bg-*-bg class for light background */
export const STAGE_BG_CLASS: Record<string, string> = {
  inkommen: 'bg-status-inkommen-bg',
  bokad: 'bg-status-bokad-bg',
  bekraftad: 'bg-status-bekraftad-bg',
  personal: 'bg-status-personal-bg',
  genomford: 'bg-status-genomford-bg',
  aterrapporterad: 'bg-status-aterrapporterad-bg',
  fakturerad: 'bg-status-fakturerad-bg',
};

/** Stage -> Tailwind text color class */
export const STAGE_TEXT_CLASS: Record<string, string> = {
  inkommen: 'text-status-inkommen',
  bokad: 'text-status-bokad',
  bekraftad: 'text-status-bekraftad',
  personal: 'text-status-personal',
  genomford: 'text-status-genomford',
  aterrapporterad: 'text-status-aterrapporterad',
  fakturerad: 'text-status-fakturerad',
};
