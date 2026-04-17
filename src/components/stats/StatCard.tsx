import MiniBarChart from './MiniBarChart';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  trend?: { direction: 'up' | 'down' | 'flat'; percent: number };
  sparkData?: number[];
}

export default function StatCard({ label, value, trend, sparkData }: StatCardProps) {
  return (
    <div className="rounded-r-lg border border-border bg-surface p-[22px] pb-4 transition-colors hover:border-border-strong">
      <div className="text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">
        {label}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-[28px] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              'mb-1 flex items-center gap-0.5 text-xs font-semibold',
              trend.direction === 'up' && 'text-green',
              trend.direction === 'down' && 'text-red',
              trend.direction === 'flat' && 'text-ink-muted'
            )}
          >
            {trend.direction === 'up' && String.fromCharCode(9650)}
            {trend.direction === 'down' && String.fromCharCode(9660)}
            {trend.direction === 'flat' && String.fromCharCode(9472)}
            {' '}{trend.percent}%
          </span>
        )}
      </div>
      {sparkData && sparkData.length > 0 && (
        <div className="mt-3">
          <MiniBarChart data={sparkData} maxHeight={32} />
        </div>
      )}
    </div>
  );
}
