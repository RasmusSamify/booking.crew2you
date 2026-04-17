import { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { useQualityReviews } from '@/hooks/use-reviews';
import { useAllBookings } from '@/hooks/use-bookings';
import { useCurrentCustomer } from '@/hooks/use-current-identity';
import KundReportCard from '@/components/kund/KundReportCard';

export default function KundReportsPage() {
  const [periodFilter, setPeriodFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');

  const { data: customer } = useCurrentCustomer();
  const { data: bookings = [] } = useAllBookings();
  const { data: reviews = [] } = useQualityReviews();

  const needle = (customer?.namn ?? 'falbygdens').toLowerCase().split(' ')[0];
  const allBookings = bookings.filter((b) => b.kund.toLowerCase().includes(needle));
  const withReports = allBookings.filter((b) => b.aterrapport);

  const stores = useMemo(() => {
    const s = [...new Set(withReports.map((b) => b.butik))];
    return s.sort();
  }, [withReports]);

  const customerReviews = reviews.filter((r) =>
    r.customerName.toLowerCase().includes(needle)
  );

  const avgScore =
    customerReviews.length > 0
      ? Math.round(
          (customerReviews.reduce((s, r) => s + r.averageScore, 0) / customerReviews.length) * 10
        ) / 10
      : 0;

  const totalHours = withReports.reduce((s, b) => s + b.timmar, 0);

  const filtered = useMemo(() => {
    let list = withReports;
    if (storeFilter !== 'all') {
      list = list.filter((b) => b.butik === storeFilter);
    }
    // Sort by anlagd desc
    return [...list].sort((a, b) => b.anlagd.localeCompare(a.anlagd));
  }, [withReports, storeFilter, periodFilter]);

  return (
    <>
      {/* Filter bar */}
      <div className="mb-4 flex gap-3">
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="rounded-r border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none focus:border-gold"
        >
          <option value="all">Alla perioder</option>
          <option value="q1">Q1 2026</option>
          <option value="q2">Q2 2026</option>
        </select>
        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          className="rounded-r border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none focus:border-gold"
        >
          <option value="all">Alla butiker</option>
          {stores.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-r-lg border border-gold-light bg-gold-bg p-5">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[1px] text-gold-dark">
          Resultat&ouml;versikt
        </span>
        <div className="flex flex-wrap items-center gap-4 text-[13.5px] text-ink">
          <span>
            <strong className="font-semibold">{filtered.length}</strong> rapporter
          </span>
          <span className="text-border-strong">|</span>
          <span className="flex items-center gap-1">
            Snittbetyg:{' '}
            <strong className="font-semibold">{avgScore.toFixed(1)}</strong>
            <span className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  strokeWidth={1.75}
                  className={s <= Math.round(avgScore) ? 'text-gold' : 'text-border-strong'}
                  fill={s <= Math.round(avgScore) ? 'currentColor' : 'none'}
                />
              ))}
            </span>
          </span>
          <span className="text-border-strong">|</span>
          <span>
            <strong className="font-semibold">{totalHours}h</strong> totalt
          </span>
        </div>
      </div>

      {/* Reports */}
      <div className="space-y-3">
        {filtered.map((b) => {
          const review = customerReviews.find((r) => r.bookingId === b.id);
          return <KundReportCard key={b.id} booking={b} review={review} />;
        })}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-[13px] text-ink-muted">
            Inga rapporter f&ouml;r vald period
          </p>
        )}
      </div>
    </>
  );
}
