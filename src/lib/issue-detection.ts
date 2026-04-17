import type { Booking } from '@/hooks/use-bookings';
import { hasPersonnel, type PersonalExpense } from '@/lib/mock-data';

export type IssueType =
  | 'missing_personnel'
  | 'needs_confirmation'
  | 'missing_report'
  | 'unreviewed_expenses'
  | 'missing_info';

export interface Issue {
  type: IssueType;
  label: string;
  description: string;
  iconName: 'UserX' | 'MailCheck' | 'ClipboardX' | 'Wallet' | 'AlertCircle';
  color: 'red' | 'amber' | 'orange' | 'violet';
  priority: number; // lower = more urgent
}

export function detectIssue(
  booking: Booking,
  expenses: PersonalExpense[] = []
): Issue | null {
  // Priority 1: missing personnel (for non-terminal stages)
  if (!hasPersonnel(booking) && booking.stage !== 'fakturerad') {
    return {
      type: 'missing_personnel',
      label: 'Saknar personal',
      description: 'Detta uppdrag har ingen demovärd tilldelad.',
      iconName: 'UserX',
      color: 'red',
      priority: 1,
    };
  }

  // Priority 2: bokad but not confirmed (has personnel)
  if (booking.stage === 'bokad' && hasPersonnel(booking)) {
    return {
      type: 'needs_confirmation',
      label: 'Väntar på bekräftelse',
      description: 'Uppdraget är bokat men bekräftelsemail har inte skickats.',
      iconName: 'MailCheck',
      color: 'amber',
      priority: 2,
    };
  }

  // Priority 3: completed but no report
  if (booking.stage === 'genomford' && !booking.aterrapport) {
    return {
      type: 'missing_report',
      label: 'Saknar återrapport',
      description: 'Uppdraget är genomfört men personalen har inte rapporterat in.',
      iconName: 'ClipboardX',
      color: 'orange',
      priority: 3,
    };
  }

  // Priority 4: has unreimbursed expenses (simulate: all are unreimbursed for now)
  const bookingExpenses = expenses.filter((e) => e.bookingId === booking.id);
  if (
    bookingExpenses.length > 0 &&
    ['genomford', 'aterrapporterad'].includes(booking.stage)
  ) {
    return {
      type: 'unreviewed_expenses',
      label: 'Ogranskade utlägg',
      description: 'Detta uppdrag har utlägg som inte godkänts.',
      iconName: 'Wallet',
      color: 'violet',
      priority: 4,
    };
  }

  return null;
}

export function getIssuesForBookings(
  bookings: Booking[],
  expenses: PersonalExpense[] = []
): Array<{ booking: Booking; issue: Issue }> {
  return bookings
    .map((b) => ({ booking: b, issue: detectIssue(b, expenses) }))
    .filter(
      (x): x is { booking: Booking; issue: Issue } => x.issue !== null
    )
    .sort((a, b) => a.issue.priority - b.issue.priority);
}
