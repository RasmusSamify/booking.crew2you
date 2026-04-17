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
import type { Automation } from '@/lib/mock-data-automations';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
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

const ACTION_ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  sms: MessageSquare,
  calendar: CalendarPlus,
  fortnox: FileText,
  slack: Hash,
  ai: Zap,
};

interface AutomationCardProps {
  automation: Automation;
  onToggle: () => void;
}

export default function AutomationCard({ automation, onToggle }: AutomationCardProps) {
  const Icon = ICON_MAP[automation.icon] || Zap;

  return (
    <div
      className={cn(
        'rounded-r-xl border border-border bg-surface p-5 transition-opacity',
        !automation.enabled && 'opacity-60',
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-r bg-gold-bg text-gold-dark">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[13.5px] font-bold text-ink">{automation.name}</h3>
            <ToggleSwitch checked={automation.enabled} onChange={onToggle} />
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">
            {automation.description}
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span className="rounded-r-sm bg-surface-alt px-2.5 py-1 text-[11px] font-medium text-ink-soft">
          {automation.trigger}
        </span>
        {automation.actions.map((action, i) => {
          const ActionIcon = ACTION_ICON_MAP[action.type];
          return (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-r-sm bg-surface-alt px-2 py-1 text-[11px] font-medium text-ink-soft"
            >
              {ActionIcon && <ActionIcon size={11} strokeWidth={2} />}
              {action.label}
            </span>
          );
        })}
      </div>

      <div className="mt-3.5 border-t border-border pt-3">
        <div className="flex items-center justify-between text-[11px] text-ink-muted">
          <span>{automation.runs} körningar</span>
          <span>Senast: {automation.lastRun}</span>
        </div>
      </div>
    </div>
  );
}
