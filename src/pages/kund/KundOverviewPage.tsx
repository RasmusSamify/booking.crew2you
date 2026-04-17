import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Check,
  Clock,
  Star,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { useQualityReviews } from '@/hooks/use-reviews';
import { useAllBookings, type BookingStage } from '@/hooks/use-bookings';
import { useCurrentCustomer } from '@/hooks/use-current-identity';
import KundBookingCard from '@/components/kund/KundBookingCard';
import KundQualityBadge from '@/components/kund/KundQualityBadge';

const UPCOMING_STAGES: BookingStage[] = ['inkommen', 'bokad', 'bekraftad', 'personal'];
const DONE_STAGES: BookingStage[] = ['genomford', 'aterrapporterad', 'fakturerad'];

export default function KundOverviewPage() {
  const navigate = useNavigate();
  const { data: customer } = useCurrentCustomer();
  const { data: bookings = [] } = useAllBookings();
  const { data: reviews = [] } = useQualityReviews();

  const needle = (customer?.namn ?? 'falbygdens').toLowerCase().split(' ')[0];
  const allBookings = bookings.filter((b) => b.kund.toLowerCase().includes(needle));
  const upcoming = allBookings.filter((b) => UPCOMING_STAGES.includes(b.stage));
  const done = allBookings.filter((b) => DONE_STAGES.includes(b.stage));
  const withReports = allBookings.filter((b) => b.aterrapport);
  const totalHours = allBookings.reduce((s, b) => s + b.timmar, 0);

  const customerReviews = reviews.filter((r) =>
    r.customerName.toLowerCase().includes(needle)
  );
  const avgScore =
    customerReviews.length > 0
      ? Math.round(
          (customerReviews.reduce((s, r) => s + r.averageScore, 0) / customerReviews.length) * 10
        ) / 10
      : 0;

  return (
    <>
      {/* Hero banner */}
      <div className="relative mb-6 overflow-hidden rounded-r-xl bg-ink p-8 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 80% 50%, rgba(196,167,88,0.15) 0%, transparent 60%)',
          }}
        />
        <div className="relative">
          <h2 className="mb-1 text-[20px] font-bold">
            Ni har {upcoming.length} kommande uppdrag
          </h2>
          <p className="mb-5 text-[14px] text-white/70">
            och {withReports.length} f&auml;rska &aring;terrapporter att l&auml;sa.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/kund/bookings')}
              className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-gold-dark"
            >
              Se kommande
              <ArrowRight size={14} strokeWidth={2} />
            </button>
            <button
              onClick={() => navigate('/kund/reports')}
              className="inline-flex items-center gap-2 rounded-r bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-white/20"
            >
              L&auml;s rapporter
              <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
        <KpiCard
          label="Kommande uppdrag"
          value={upcoming.length}
          icon={<CalendarDays size={14} strokeWidth={2} />}
        />
        <KpiCard
          label="Genomf\u00f6rda"
          value={done.length}
          icon={<Check size={14} strokeWidth={2} />}
        />
        <KpiCard
          label="Totala timmar"
          value={totalHours}
          suffix="h"
          icon={<Clock size={14} strokeWidth={2} />}
        />
        <KpiCard
          label="Kvalitetssnitt"
          value={avgScore.toFixed(1)}
          icon={<Star size={14} strokeWidth={2} />}
          extra={
            <div className="mt-1 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  strokeWidth={1.75}
                  className={s <= Math.round(avgScore) ? 'text-gold' : 'text-border-strong'}
                  fill={s <= Math.round(avgScore) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          }
        />
      </div>

      {/* Upcoming bookings */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays size={16} strokeWidth={2} className="text-gold-dark" />
          <h2 className="text-[15px] font-bold text-ink">Kommande uppdrag</h2>
        </div>
        <div className="space-y-2.5">
          {upcoming.slice(0, 5).map((b) => (
            <KundBookingCard key={b.id} booking={b} onClick={() => navigate('/kund/bookings')} />
          ))}
          {upcoming.length === 0 && (
            <p className="py-8 text-center text-[13px] text-ink-muted">Inga kommande uppdrag</p>
          )}
        </div>
        {upcoming.length > 5 && (
          <button
            onClick={() => navigate('/kund/bookings')}
            className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-gold-dark hover:underline"
          >
            Visa alla <ArrowRight size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Latest reports */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList size={16} strokeWidth={2} className="text-gold-dark" />
          <h2 className="text-[15px] font-bold text-ink">Senaste rapporter</h2>
        </div>
        <div className="space-y-2.5">
          {withReports.slice(0, 3).map((b) => {
            const review = customerReviews.find((r) => r.bookingId === b.id);
            return (
              <div
                key={b.id}
                onClick={() => navigate('/kund/reports')}
                className="cursor-pointer rounded-r-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[13.5px] font-semibold text-ink">{b.butik}</span>
                  <span className="text-[12px] text-ink-muted">{b.dagar}</span>
                </div>
                <p className="mb-2 text-[12.5px] text-ink-muted line-clamp-2">
                  {b.aterrapport}
                </p>
                {review && <KundQualityBadge score={review.averageScore} />}
              </div>
            );
          })}
          {withReports.length === 0 && (
            <p className="py-8 text-center text-[13px] text-ink-muted">Inga rapporter &auml;nnu</p>
          )}
        </div>
        {withReports.length > 3 && (
          <button
            onClick={() => navigate('/kund/reports')}
            className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-gold-dark hover:underline"
          >
            Visa alla <ArrowRight size={13} strokeWidth={2} />
          </button>
        )}
      </div>
    </>
  );
}

function KpiCard({
  label,
  value,
  suffix,
  icon,
  extra,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  icon: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-r-lg border border-border bg-surface p-[22px] pb-5 transition-colors hover:border-border-strong">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-r-sm bg-gold-bg text-gold-dark">
          {icon}
        </div>
      </div>
      <div className="text-[30px] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
        {value}
        {suffix && <span className="ml-1 text-lg font-medium text-ink-muted">{suffix}</span>}
      </div>
      {extra}
    </div>
  );
}
