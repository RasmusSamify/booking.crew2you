import { Phone, Mail } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ContactChipProps {
  contact: {
    namn: string;
    tel: string;
    email?: string;
    isPrimary: boolean;
    roll?: string;
  };
  className?: string;
}

function getInitials(namn: string): string {
  return namn
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ContactChip({ contact, className }: ContactChipProps) {
  return (
    <div className={cn('flex items-center gap-2.5 py-1.5', className)}>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-alt text-[11px] font-semibold text-ink-muted">
        {getInitials(contact.namn)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13px] font-semibold text-ink">
            {contact.namn}
          </span>
          {contact.roll && (
            <span className="text-xs text-ink-muted">{contact.roll}</span>
          )}
          {contact.isPrimary && (
            <span className="rounded-[10px] bg-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              PRIMAR
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-ink-muted">
          {contact.tel && (
            <a
              href={`tel:${contact.tel}`}
              className="flex items-center gap-1 transition-colors hover:text-gold"
            >
              <Phone size={11} strokeWidth={2} />
              {contact.tel}
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1 transition-colors hover:text-gold"
            >
              <Mail size={11} strokeWidth={2} />
              {contact.email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
