import AdminLayout from '@/components/layout/AdminLayout';
import AutomationCard from '@/components/automations/AutomationCard';
import AutomationRunLog from '@/components/automations/AutomationRunLog';
import { useAutomations, useAutomationRuns, useToggleAutomation } from '@/hooks/use-automations';
import { Zap, Clock, Activity, Timer } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function AutomationsPage() {
  const { data: automations = [] } = useAutomations();
  const { data: automationRuns = [] } = useAutomationRuns();
  const toggleMutation = useToggleAutomation();

  const enabledCount = automations.filter((a) => a.enabled).length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0);
  const timeSaved = Math.round((totalRuns * 7.5) / 60);

  const handleToggle = (id: string) => {
    const auto = automations.find((a) => a.id === id);
    if (!auto) return;
    const newEnabled = !auto.enabled;
    toggleMutation.mutate({ id, enabled: newEnabled });
    toast(newEnabled ? `${auto.name} aktiverad` : `${auto.name} inaktiverad`);
  };

  return (
    <AdminLayout
      pageTitle="Samify Autoflow\u2122"
      pageSub="Automatiserade flöden som sparar er tid"
      activeNav="automationer"
    >
      {/* Hero banner */}
      <div className="relative mb-8 overflow-hidden rounded-r-xl bg-ink p-8 text-white">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, #c4a758 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex items-center gap-3 mb-6">
          <Zap size={20} className="text-gold" />
          <span className="text-[13px] font-bold uppercase tracking-[1px] text-gold">
            Samify Autoflow
          </span>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white/60">
              <Activity size={14} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.5px]">
                Aktiva flöden
              </span>
            </div>
            <p className="mt-1 text-[28px] font-bold tracking-tight">
              {enabledCount}
              <span className="text-[16px] font-normal text-white/50">
                /{automations.length}
              </span>
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/60">
              <Clock size={14} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.5px]">
                Totala körningar
              </span>
            </div>
            <p className="mt-1 text-[28px] font-bold tracking-tight">{totalRuns}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/60">
              <Timer size={14} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.5px]">
                Tid sparad
              </span>
            </div>
            <p className="mt-1 text-[28px] font-bold tracking-tight">{timeSaved}h</p>
          </div>
        </div>
      </div>

      {/* Automation cards grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {automations.map((automation) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            onToggle={() => handleToggle(automation.id)}
          />
        ))}
      </div>

      {/* Run log */}
      <div className="mb-2 flex items-center gap-2.5">
        <Clock size={16} strokeWidth={1.75} className="text-ink-muted" />
        <h2 className="text-[15px] font-bold text-ink">Senaste aktivitet</h2>
        <span className="rounded-[10px] bg-gold-bg px-2 py-[2px] text-[10px] font-bold text-gold-dark">
          {automationRuns.length}
        </span>
      </div>
      <AutomationRunLog runs={automationRuns} />
    </AdminLayout>
  );
}
