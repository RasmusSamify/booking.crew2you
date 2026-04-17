import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/stats/StatCard';
import PersonnelLeaderboard from '@/components/stats/PersonnelLeaderboard';
import CustomerBreakdown from '@/components/stats/CustomerBreakdown';
import StoreHeatmap from '@/components/stats/StoreHeatmap';
import MiniLineChart from '@/components/stats/MiniLineChart';
import PersonnelProfileModal from '@/components/personnel/PersonnelProfileModal';
import { type Personal } from '@/lib/mock-data';
import { useAllBookings } from '@/hooks/use-bookings';
import { useQualityReviews } from '@/hooks/use-reviews';
import { formatCurrency } from '@/lib/export-csv';
import { cn } from '@/utils/cn';

const PERIODS = ['Denna månad', 'Senaste 3 mån', '6 mån', 'I år', 'Allt'] as const;

const SERVICE_LABELS: Record<string, string> = {
  demo: 'Demo',
  plock: 'Plock',
  sampling: 'Sampling',
  event: 'Event',
};

const SERVICE_COLORS: Record<string, string> = {
  demo: '#c4a758',
  plock: '#7c3aed',
  sampling: '#db2777',
  event: '#d97706',
};

export default function StatsPage() {
  const [period, setPeriod] = useState<string>('Allt');
  const [showPeriod, setShowPeriod] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Personal | null>(null);

  const { data: allBookings = [] } = useAllBookings();
  const { data: reviews = [] } = useQualityReviews();

  // KPI computations
  const genomforda = allBookings.filter((b) =>
    ['genomford', 'aterrapporterad', 'fakturerad'].includes(b.stage)
  );
  const totalTimmar = allBookings.reduce((s, b) => s + b.timmar, 0);
  const avgTimmar = genomforda.length > 0
    ? Math.round((genomforda.reduce((s, b) => s + b.timmar, 0) / genomforda.length) * 10) / 10
    : 0;
  const avgScore = reviews.length > 0
    ? Math.round((reviews.reduce((s, r) => s + r.averageScore, 0) / reviews.length) * 10) / 10
    : 0;
  const omsattning = totalTimmar * 495;
  const uniqueCustomers = new Set(allBookings.map((b) => b.kund)).size;

  // Repeat frequency: customers with >1 booking / total customers
  const customerCounts: Record<string, number> = {};
  for (const b of allBookings) {
    customerCounts[b.kund] = (customerCounts[b.kund] || 0) + 1;
  }
  const repeatRate = Math.round(
    (Object.values(customerCounts).filter((c) => c > 1).length / Math.max(Object.keys(customerCounts).length, 1)) * 100
  );

  // Service type distribution
  const serviceCount: Record<string, number> = {};
  for (const b of allBookings) {
    serviceCount[b.tjanst] = (serviceCount[b.tjanst] || 0) + 1;
  }
  const serviceTotal = Object.values(serviceCount).reduce((a, b) => a + b, 0);

  // Build conic gradient
  let gradientParts: string[] = [];
  let accumulated = 0;
  const serviceEntries = Object.entries(serviceCount).sort((a, b) => b[1] - a[1]);
  for (const [svc, count] of serviceEntries) {
    const pct = (count / serviceTotal) * 100;
    const color = SERVICE_COLORS[svc] || '#9c9581';
    gradientParts.push(`${color} ${accumulated}% ${accumulated + pct}%`);
    accumulated += pct;
  }
  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  // Sparkline data (8 values)
  const sparkUppdrag = [3, 5, 4, 6, 5, 7, 4, genomforda.length];
  const sparkBetyg = [4.2, 4.3, 4.5, 4.4, 4.6, 4.3, 4.5, avgScore];
  const sparkOmsattning = [12, 18, 15, 22, 20, 25, 19, totalTimmar];
  const sparkTimmar = [5.5, 6, 7, 6.5, 7, 6.8, 7.2, avgTimmar];
  const sparkKunder = [3, 4, 4, 5, 5, 6, 5, uniqueCustomers];
  const sparkRepeat = [50, 55, 60, 58, 65, 62, 70, repeatRate];

  // Score over time
  const scoreOverTime = [4.3, 4.5, 4.4, 4.7, 4.5, 4.6, 4.8, avgScore];

  const topbarActions = (
    <div className="relative">
      <button
        onClick={() => setShowPeriod(!showPeriod)}
        className="inline-flex items-center gap-2 rounded-r border border-border-strong bg-surface px-3 py-[6px] text-[13px] font-semibold text-ink transition-all hover:border-ink hover:bg-surface-alt"
      >
        {period}
        <ChevronDown size={14} strokeWidth={2} />
      </button>
      {showPeriod && (
        <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-r-lg border border-border bg-surface shadow-md">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => { setPeriod(p); setShowPeriod(false); }}
              className={cn(
                'block w-full px-4 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-surface-alt',
                p === period ? 'bg-gold-bg text-gold-dark' : 'text-ink'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout
      pageTitle="Statistik & insikter"
      pageSub="Hela verksamheten i siffror"
      actions={topbarActions}
      activeNav="statistik"
    >
      {/* Row 1: KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Utförda uppdrag"
          value={String(genomforda.length)}
          trend={{ direction: 'up', percent: 12 }}
          sparkData={sparkUppdrag}
        />
        <StatCard
          label="Snittbetyg"
          value={String(avgScore)}
          trend={{ direction: 'up', percent: 3 }}
          sparkData={sparkBetyg}
        />
        <StatCard
          label="Omsättning"
          value={formatCurrency(omsattning)}
          trend={{ direction: 'up', percent: 8 }}
          sparkData={sparkOmsattning}
        />
        <StatCard
          label="Snitt timmar/uppdrag"
          value={`${avgTimmar}h`}
          trend={{ direction: 'flat', percent: 0 }}
          sparkData={sparkTimmar}
        />
        <StatCard
          label="Aktiva kunder"
          value={String(uniqueCustomers)}
          trend={{ direction: 'up', percent: 15 }}
          sparkData={sparkKunder}
        />
        <StatCard
          label="Upprepningsfrekvens"
          value={`${repeatRate}%`}
          trend={{ direction: 'up', percent: 5 }}
          sparkData={sparkRepeat}
        />
      </div>

      {/* Row 2: Leaderboard + Customer breakdown */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <PersonnelLeaderboard onPersonClick={setSelectedPerson} />
        <CustomerBreakdown />
      </div>

      {/* Row 3: Store heatmap + Service distribution */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StoreHeatmap />
        <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
          <div className="border-b border-border px-[22px] py-[18px]">
            <h2 className="text-[15px] font-bold tracking-[-0.01em] text-ink">
              Tjänstefördelning
            </h2>
          </div>
          <div className="flex items-center gap-8 px-[22px] py-6">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <div
                className="h-[200px] w-[200px] rounded-full"
                style={{ background: conicGradient }}
              />
              <div className="absolute inset-[40px] flex flex-col items-center justify-center rounded-full bg-surface">
                <span className="text-2xl font-bold text-ink">{serviceTotal}</span>
                <span className="text-[11px] text-ink-muted">bokningar</span>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-3">
              {serviceEntries.map(([svc, count]) => (
                <div key={svc} className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: SERVICE_COLORS[svc] || '#9c9581' }}
                  />
                  <div>
                    <div className="text-[13px] font-semibold text-ink">
                      {SERVICE_LABELS[svc] || svc}
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      {count} ({Math.round((count / serviceTotal) * 100)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Score over time */}
      <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
        <div className="border-b border-border px-[22px] py-[18px]">
          <h2 className="text-[15px] font-bold tracking-[-0.01em] text-ink">
            Snittbetyg över tid
          </h2>
        </div>
        <div className="px-[22px] py-4">
          <MiniLineChart data={scoreOverTime} height={140} />
        </div>
      </div>

      {/* Personnel profile modal */}
      {selectedPerson && (
        <PersonnelProfileModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </AdminLayout>
  );
}
