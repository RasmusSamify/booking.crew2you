import { useEffect, useState } from 'react';
import { Zap, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ParseAnimationProps {
  onComplete: () => void;
}

const STEPS = [
  'Identifierar avsändare...',
  'Extraherar uppdragsinfo...',
  'Validerar mot register...',
];

export default function ParseAnimation({ onComplete }: ParseAnimationProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => setCompletedSteps((prev) => [...prev, 0]), 400),
    );
    timers.push(
      setTimeout(() => setCompletedSteps((prev) => [...prev, 1]), 800),
    );
    timers.push(
      setTimeout(() => setCompletedSteps((prev) => [...prev, 2]), 1200),
    );
    timers.push(setTimeout(() => onComplete(), 1500));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-bg">
        <Zap size={22} className="animate-spin text-gold-dark" />
      </div>
      <p className="text-sm font-semibold text-ink">Samify AI analyserar mailet...</p>
      <div className="flex flex-col gap-3">
        {STEPS.map((step, i) => {
          const done = completedSteps.includes(i);
          return (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-200',
                  done ? 'bg-green' : 'bg-border',
                )}
              >
                {done && <Check size={12} strokeWidth={2.5} className="text-white" />}
              </div>
              <span
                className={cn(
                  'text-sm transition-colors duration-200',
                  done ? 'font-medium text-ink' : 'text-ink-muted',
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
