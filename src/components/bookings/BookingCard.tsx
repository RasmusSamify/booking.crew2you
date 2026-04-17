import {
  MapPin,
  Clock,
  AlertCircle,
  UserX,
  MailCheck,
  ClipboardX,
  Wallet,
} from 'lucide-react';
import type { Booking } from '@/hooks/use-bookings';
import { hasPersonnel, getPersonnelDisplay, MOCK_PERSONAL_EXPENSES } from '@/lib/mock-data';
import { detectIssue, type Issue } from '@/lib/issue-detection';
import { cn } from '@/utils/cn';

const SERVICE_CHIP_STYLES: Record<string, string> = {
  demo: 'bg-blue-bg text-blue border-transparent',
  plock: 'bg-violet-bg text-violet border-transparent',
  sampling: 'bg-pink-bg text-pink border-transparent',
  event: 'bg-amber-bg text-amber border-transparent',
};

const ISSUE_ICON_MAP = {
  UserX,
  MailCheck,
  ClipboardX,
  Wallet,
  AlertCircle,
};

const ISSUE_BADGE_BG: Record<Issue['color'], string> = {
  red: 'bg-red text-white',
  amber: 'bg-amber text-white',
  orange: 'bg-status-genomford text-white',
  violet: 'bg-violet text-white',
};

interface BookingCardProps {
  booking: Booking;
  onClick: () => void;
  onIssueClick?: (booking: Booking, issue: Issue) => void;
}

export default function BookingCard({ booking, onClick, onIssueClick }: BookingCardProps) {
  const b = booking;
  const issue = detectIssue(b, MOCK_PERSONAL_EXPENSES);
  const IssueIcon = issue ? ISSUE_ICON_MAP[issue.iconName] : null;

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer rounded-r border border-border bg-surface p-3 shadow-xs transition-all hover:-translate-y-px hover:border-gold hover:shadow-md"
    >
      {issue && IssueIcon && (
        <button
          type="button"
          title={issue.label}
          onClick={(e) => {
            e.stopPropagation();
            if (onIssueClick) {
              onIssueClick(b, issue);
            } else {
              onClick();
            }
          }}
          className={cn(
            'absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full shadow-xs transition-transform hover:scale-110',
            ISSUE_BADGE_BG[issue.color]
          )}
        >
          <IssueIcon size={11} strokeWidth={2.5} />
        </button>
      )}

      {/* Butik name */}
      <div className={cn('text-[13.5px] font-semibold leading-snug text-ink', issue && 'pr-6')}>
        {b.butik}
      </div>

      {/* Ort + dagar */}
      <div className="mt-[3px] flex items-center gap-[5px] text-[11.5px] text-ink-muted">
        <MapPin size={12} strokeWidth={2} />
        {b.ort} &middot; {b.dagar}
      </div>

      {/* Service + hours chips */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-[10px] border px-2 py-[2px] text-[11px] font-medium',
            SERVICE_CHIP_STYLES[b.tjanst] || 'border-border bg-surface-alt text-ink-soft'
          )}
        >
          {b.tjanst}
        </span>
        <span className="inline-flex items-center gap-1 rounded-[10px] border border-border bg-surface-alt px-2 py-[2px] text-[11px] font-medium text-ink-soft">
          <Clock size={10} strokeWidth={2} />
          {b.timmar} h
        </span>
      </div>

      {/* Kund */}
      <div className="mt-2 border-t border-surface-alt pt-2 text-[12.5px] font-medium text-ink-soft">
        {b.kund}
      </div>

      {/* Personal */}
      <div
        className={cn(
          'mt-2 flex items-center gap-[5px] text-[11.5px]',
          hasPersonnel(b) ? 'text-ink-muted' : 'font-medium text-red'
        )}
      >
        {hasPersonnel(b) ? (
          <>
            {b.assignedPersonnel.map((ap, i) => (
              <div
                key={ap.personnelId}
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full bg-gold-bg text-[9px] font-bold text-gold-dark',
                  i > 0 && '-ml-2 ring-2 ring-surface'
                )}
              >
                {ap.personnelName
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </div>
            ))}
            {getPersonnelDisplay(b)}
          </>
        ) : (
          <>
            <AlertCircle size={12} strokeWidth={2} />
            Saknar personal
          </>
        )}
      </div>
    </div>
  );
}
