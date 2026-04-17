import {
  Mail,
  MessageSquare,
  Hash,
  FileText,
  Zap,
  BarChart3,
  CalendarPlus,
  type LucideIcon,
} from 'lucide-react';
import type { AutomationRun } from '@/lib/mock-data-automations';
import { cn } from '@/utils/cn';

const ICON_MAP: Record<string, LucideIcon> = {
  Mail,
  MessageSquare,
  Hash,
  FileText,
  Zap,
  BarChart3,
  CalendarPlus,
};

interface AutomationRunLogProps {
  runs: AutomationRun[];
}

export default function AutomationRunLog({ runs }: AutomationRunLogProps) {
  return (
    <div className="overflow-hidden rounded-r-xl border border-border bg-surface">
      <div className="divide-y divide-border">
        {runs.map((run) => {
          const Icon = ICON_MAP[run.icon] || Zap;
          return (
            <div key={run.id} className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 text-ink-muted">
                  <Icon size={15} strokeWidth={1.75} />
                </span>
                <span className="min-w-[100px] flex-shrink-0 text-[11px] text-ink-muted">
                  {run.timestamp}
                </span>
                <span className="text-[13px] font-semibold text-ink">
                  {run.automationName}
                </span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-soft">
                  {run.detail}
                </span>
                <span
                  className={cn(
                    'flex-shrink-0 rounded-[10px] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.3px]',
                    run.status === 'success'
                      ? 'bg-green/10 text-green'
                      : 'bg-red/10 text-red',
                  )}
                >
                  {run.status === 'success' ? 'Lyckad' : 'Misslyckad'}
                </span>
              </div>
              {run.status === 'failed' && run.error && (
                <p className="ml-[30px] mt-1.5 text-[12px] text-red">{run.error}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
