import type { Confidence } from '@/lib/mock-data-inbox';
import { cn } from '@/utils/cn';

const CONFIG: Record<Confidence, { dotClass: string; label: string }> = {
  high: { dotClass: 'bg-green', label: 'Säker' },
  medium: { dotClass: 'bg-gold', label: 'Trolig' },
  low: { dotClass: 'bg-red', label: 'Osäker' },
};

interface ConfidenceBadgeProps {
  confidence: Confidence;
}

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const { dotClass, label } = CONFIG[confidence];
  return (
    <span className={cn('inline-flex items-center gap-1')}>
      <span className={cn('inline-block h-[6px] w-[6px] rounded-full', dotClass)} />
      <span className="text-[9px] font-semibold uppercase tracking-[0.4px] text-ink-muted">
        {label}
      </span>
    </span>
  );
}
