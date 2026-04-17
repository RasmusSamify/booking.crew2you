import { useState } from 'react';
import {
  X,
  UserX,
  MailCheck,
  ClipboardX,
  Wallet,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import type { Booking } from '@/hooks/use-bookings';
import type { Issue, IssueType } from '@/lib/issue-detection';
import { detectIssue } from '@/lib/issue-detection';
import { MOCK_PERSONAL_EXPENSES } from '@/lib/mock-data';
import AssignPersonnelAction from './actions/AssignPersonnelAction';
import SendConfirmationAction from './actions/SendConfirmationAction';
import CompleteReportAction from './actions/CompleteReportAction';
import ReviewExpenseAction from './actions/ReviewExpenseAction';
import MissingInfoAction from './actions/MissingInfoAction';
import { cn } from '@/utils/cn';

interface QuickActionModalProps {
  booking: Booking;
  issue: Issue;
  onClose: () => void;
  onOpenDetail: () => void;
}

const ICON_MAP = {
  UserX,
  MailCheck,
  ClipboardX,
  Wallet,
  AlertCircle,
};

const COLOR_BG: Record<Issue['color'], string> = {
  red: 'bg-red-bg text-red',
  amber: 'bg-amber-bg text-amber',
  orange: 'bg-status-genomford-bg text-status-genomford',
  violet: 'bg-violet-bg text-violet',
};

export default function QuickActionModal({
  booking,
  issue,
  onClose,
  onOpenDetail,
}: QuickActionModalProps) {
  const [currentActionOverride, setCurrentActionOverride] =
    useState<IssueType | null>(null);

  // Recompute the effective issue whenever override changes. The override
  // may not match a "real" current issue for the booking, so we fall back
  // to a synthetic issue object when needed.
  const effectiveType: IssueType = currentActionOverride ?? issue.type;
  const effectiveIssue: Issue =
    currentActionOverride && currentActionOverride !== issue.type
      ? makeSyntheticIssue(currentActionOverride) ??
        detectIssue(booking, MOCK_PERSONAL_EXPENSES) ??
        issue
      : issue;

  const Icon = ICON_MAP[effectiveIssue.iconName];

  const switchAction = (type: IssueType) => {
    setCurrentActionOverride(type);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-5 backdrop-blur-[4px] animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-r-xl bg-surface shadow-lg animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-[22px] py-[18px]">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full',
                COLOR_BG[effectiveIssue.color]
              )}
            >
              <Icon size={22} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-bold tracking-[-0.01em] text-ink">
                {booking.butik}{' '}
                <span className="font-medium text-ink-muted">
                  · {booking.kund}
                </span>
              </div>
              <div className="mt-0.5 text-[12.5px] text-ink-muted">
                {booking.dagar} · {booking.tjanst} · {booking.timmar} h
              </div>
              <div className="mt-1.5 text-[13px] font-semibold text-ink-soft">
                {effectiveIssue.label}
              </div>
              <div className="text-[12px] text-ink-muted">
                {effectiveIssue.description}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-r bg-surface-alt text-ink-muted transition-all hover:bg-border hover:text-ink"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[22px] py-5">
          {effectiveType === 'missing_personnel' && (
            <AssignPersonnelAction
              booking={booking}
              onClose={onClose}
              onAssigned={onClose}
            />
          )}
          {effectiveType === 'needs_confirmation' && (
            <SendConfirmationAction
              booking={booking}
              onClose={onClose}
              onSent={onClose}
              onSwitchAction={switchAction}
            />
          )}
          {effectiveType === 'missing_report' && (
            <CompleteReportAction
              booking={booking}
              onClose={onClose}
              onCompleted={onClose}
            />
          )}
          {effectiveType === 'unreviewed_expenses' && (
            <ReviewExpenseAction booking={booking} onClose={onClose} />
          )}
          {effectiveType === 'missing_info' && (
            <MissingInfoAction
              booking={booking}
              onClose={onClose}
              onOpenDetail={onOpenDetail}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-surface-alt px-[22px] py-3">
          <button
            onClick={onOpenDetail}
            className="inline-flex items-center gap-1.5 rounded-r bg-transparent px-2 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Öppna full detalj
            <ArrowRight size={13} strokeWidth={2} />
          </button>
          {currentActionOverride && currentActionOverride !== issue.type && (
            <button
              onClick={() => setCurrentActionOverride(null)}
              className="rounded-r px-2 py-1.5 text-[12px] font-medium text-ink-muted transition-colors hover:bg-surface hover:text-ink"
            >
              Tillbaka
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function makeSyntheticIssue(type: IssueType): Issue | null {
  switch (type) {
    case 'missing_personnel':
      return {
        type: 'missing_personnel',
        label: 'Saknar personal',
        description: 'Detta uppdrag har ingen demovärd tilldelad.',
        iconName: 'UserX',
        color: 'red',
        priority: 1,
      };
    case 'needs_confirmation':
      return {
        type: 'needs_confirmation',
        label: 'Väntar på bekräftelse',
        description: 'Uppdraget är bokat men bekräftelsemail har inte skickats.',
        iconName: 'MailCheck',
        color: 'amber',
        priority: 2,
      };
    case 'missing_report':
      return {
        type: 'missing_report',
        label: 'Saknar återrapport',
        description:
          'Uppdraget är genomfört men personalen har inte rapporterat in.',
        iconName: 'ClipboardX',
        color: 'orange',
        priority: 3,
      };
    case 'unreviewed_expenses':
      return {
        type: 'unreviewed_expenses',
        label: 'Ogranskade utlägg',
        description: 'Detta uppdrag har utlägg som inte godkänts.',
        iconName: 'Wallet',
        color: 'violet',
        priority: 4,
      };
    case 'missing_info':
      return {
        type: 'missing_info',
        label: 'Saknar information',
        description: 'Bokningen saknar nödvändig information.',
        iconName: 'AlertCircle',
        color: 'amber',
        priority: 5,
      };
    default:
      return null;
  }
}
