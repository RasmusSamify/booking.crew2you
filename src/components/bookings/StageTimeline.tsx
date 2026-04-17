import { Check } from 'lucide-react';
import { STAGES, STAGE_META, type BookingStage } from '@/hooks/use-bookings';
import { cn } from '@/utils/cn';

interface StageTimelineProps {
  currentStage: BookingStage;
}

export default function StageTimeline({ currentStage }: StageTimelineProps) {
  const currentIdx = STAGES.indexOf(currentStage);

  return (
    <div className="flex gap-1 rounded-r bg-surface-alt p-1">
      {STAGES.map((stage, i) => {
        const isDone = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isUpcoming = i > currentIdx;

        return (
          <div
            key={stage}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 rounded-r-sm px-1.5 py-2.5 text-center text-[11px] font-semibold transition-all',
              isDone && 'bg-green-bg text-green',
              isCurrent && 'bg-ink text-white',
              isUpcoming && 'text-ink-muted opacity-50'
            )}
          >
            {isDone && <Check size={12} strokeWidth={2.5} />}
            {STAGE_META[stage].shortLabel}
          </div>
        );
      })}
    </div>
  );
}
