import type { InboxEmail, ParseStatus } from '@/lib/mock-data-inbox';
import { cn } from '@/utils/cn';

const STATUS_BADGE: Record<
  InboxEmail['status'] | 'complete' | 'partial' | 'incomplete',
  { label: string; className: string }
> = {
  complete: { label: 'KOMPLETT', className: 'bg-green/10 text-green' },
  partial: { label: 'DELVIS', className: 'bg-gold/10 text-gold-dark' },
  incomplete: { label: 'OTILLRÄCKLIGT', className: 'bg-red/10 text-red' },
  booked: { label: 'BOKAD', className: 'bg-ink/10 text-ink' },
  awaiting_reply: { label: 'VÄNTAR PÅ SVAR', className: 'bg-violet-100 text-violet-700' },
  new: { label: '', className: '' },
  ignored: { label: 'IGNORERAD', className: 'bg-ink/5 text-ink-muted' },
};

const AVATAR_BG: Record<ParseStatus, string> = {
  complete: 'bg-green text-white',
  partial: 'bg-gold text-white',
  incomplete: 'bg-red text-white',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface EmailCardProps {
  email: InboxEmail;
  isActive: boolean;
  onClick: () => void;
}

export default function EmailCard({ email, isActive, onClick }: EmailCardProps) {
  const badgeKey = email.status === 'new' ? email.parseStatus : email.status;
  const badge = STATUS_BADGE[badgeKey];

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full gap-3 border-b border-border px-4 py-3.5 text-left transition-all duration-100',
        'hover:bg-surface-alt',
        isActive && 'border-l-[3px] border-l-gold bg-gold-bg',
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
          AVATAR_BG[email.parseStatus],
        )}
      >
        {getInitials(email.from.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[13px] font-semibold text-ink">
            {email.from.name}
          </span>
          <span className="flex-shrink-0 text-[11px] text-ink-muted">
            {email.receivedAt}
          </span>
        </div>
        {email.from.company && (
          <p className="text-[11px] text-ink-muted">{email.from.company}</p>
        )}
        <p className="mt-0.5 truncate text-[12.5px] text-ink-soft">{email.subject}</p>
        {badge.label && (
          <span
            className={cn(
              'mt-1.5 inline-block rounded-[10px] px-2 py-[2px] text-[9px] font-bold uppercase tracking-[0.4px]',
              badge.className,
            )}
          >
            {badge.label}
          </span>
        )}
      </div>
    </button>
  );
}
