import { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { hasPersonnel, type Booking } from '@/lib/mock-data';
import { useAllBookings, type BookingStage } from '@/hooks/use-bookings';
import { useCurrentCustomer } from '@/hooks/use-current-identity';
import { useQualityReviews } from '@/hooks/use-reviews';
import { QUALITY_QUESTIONS } from '@/lib/mock-data-reviews';
import KundBookingCard from '@/components/kund/KundBookingCard';
import RatingStars from '@/components/quality/RatingStars';

const KUND_STAGE_MAP: Record<BookingStage, string> = {
  inkommen: 'Mottagen',
  bokad: 'Mottagen',
  bekraftad: 'Bekr\u00e4ftad',
  personal: 'Bekr\u00e4ftad',
  genomford: 'Genomf\u00f6rd',
  aterrapporterad: 'Rapporterad',
  fakturerad: 'Rapporterad',
};

const CUSTOMER_STEPS = ['Mottagen', 'Bekr\u00e4ftad', 'Genomf\u00f6rd', 'Rapporterad'];

const UPCOMING_STAGES: BookingStage[] = ['inkommen', 'bokad', 'bekraftad', 'personal'];
const DONE_STAGES: BookingStage[] = ['genomford', 'aterrapporterad', 'fakturerad'];

type TabKey = 'upcoming' | 'done' | 'all';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function KundBookingsPage() {
  const [tab, setTab] = useState<TabKey>('upcoming');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Booking | null>(null);

  const { data: customer } = useCurrentCustomer();
  const { data: bookings = [] } = useAllBookings();

  const needle = (customer?.namn ?? 'falbygdens').toLowerCase().split(' ')[0];
  const allBookings = bookings.filter((b) => b.kund.toLowerCase().includes(needle));

  const filtered = (() => {
    let list = allBookings;
    if (tab === 'upcoming') list = list.filter((b) => UPCOMING_STAGES.includes(b.stage));
    if (tab === 'done') list = list.filter((b) => DONE_STAGES.includes(b.stage));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.butik.toLowerCase().includes(q) ||
          b.ort.toLowerCase().includes(q) ||
          b.produkt.toLowerCase().includes(q) ||
          b.assignedPersonnel.some((p) => p.personnelName.toLowerCase().includes(q))
      );
    }
    return list;
  })();

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'upcoming', label: 'Kommande' },
    { key: 'done', label: 'Genomf\u00f6rda' },
    { key: 'all', label: 'Alla' },
  ];

  return (
    <>
      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-r bg-surface-alt p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 rounded-r-sm px-3 py-2 text-[13px] font-semibold transition-all',
              tab === t.key ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="S\u00f6k butik, ort, produkt..."
          className="w-full rounded-r border border-border bg-surface py-2.5 pl-9 pr-3 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-gold"
        />
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {filtered.map((b) => (
          <KundBookingCard key={b.id} booking={b} onClick={() => setSelected(b)} />
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-[13px] text-ink-muted">Inga bokningar matchar</p>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <BookingDetailModal booking={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function BookingDetailModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const kundStage = KUND_STAGE_MAP[booking.stage];
  const stepIdx = CUSTOMER_STEPS.indexOf(kundStage);
  const { data: reviews = [] } = useQualityReviews();
  const review = reviews.find((r) => r.bookingId === booking.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-[520px] overflow-y-auto rounded-r-lg bg-surface p-6 shadow-lg animate-slide-up"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-ink-faint hover:text-ink"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <h2 className="mb-1 text-[18px] font-bold text-ink">{booking.butik}</h2>
        <p className="mb-4 text-[13px] text-ink-muted">{booking.ort}</p>

        {/* Info */}
        <div className="mb-4 space-y-2 text-[13px]">
          <Row label="Datum" value={booking.dagar} />
          <Row label="Timmar" value={`${booking.timmar}h`} />
          <Row label="Produkt" value={booking.produkt || '\u2013'} />
          <Row label="Material" value={booking.material || '\u2013'} />
        </div>

        {/* Personnel */}
        {hasPersonnel(booking) ? (
          <div className="mb-4 flex items-center gap-2">
            {booking.assignedPersonnel.map((ap) => (
              <div key={ap.personnelId} className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-white">
                  {getInitials(ap.personnelName)}
                </div>
                <span className="text-[13px] font-semibold text-ink">{ap.personnelName}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-4 text-[13px] italic text-ink-muted">
            Demov&auml;rd tilldelas inom kort
          </p>
        )}

        {/* Customer stage track */}
        <div className="mb-5">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted">
            Status
          </span>
          <div className="flex gap-1 rounded-r bg-surface-alt p-1">
            {CUSTOMER_STEPS.map((step, i) => {
              const isDone = i < stepIdx;
              const isCurrent = i === stepIdx;
              return (
                <div
                  key={step}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-1 rounded-r-sm px-1.5 py-2.5 text-center text-[11px] font-semibold transition-all',
                    isDone && 'bg-green-bg text-green',
                    isCurrent && 'bg-ink text-white',
                    !isDone && !isCurrent && 'text-ink-muted opacity-50'
                  )}
                >
                  {isDone && <Check size={12} strokeWidth={2.5} />}
                  {step}
                </div>
              );
            })}
          </div>
        </div>

        {/* Report */}
        {booking.aterrapport && (
          <div className="mb-4">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted">
              &Aring;terrapport
            </span>
            <p className="text-[13px] leading-relaxed text-ink">{booking.aterrapport}</p>
          </div>
        )}

        {/* Quality review */}
        {review && (
          <div className="rounded-r border border-gold-light bg-gold-bg p-4">
            <div className="mb-2 flex items-center gap-2">
              <RatingStars value={Math.round(review.averageScore)} readOnly size={16} />
              <span className="text-[13px] font-semibold text-ink">{review.averageScore.toFixed(1)}</span>
            </div>
            <div className="space-y-2">
              {QUALITY_QUESTIONS.map((q) => {
                const score = review.scores[q.id] ?? 0;
                return (
                  <div key={q.id}>
                    <div className="mb-0.5 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-ink-soft">{q.label}</span>
                      <span className="text-[11px] font-semibold text-ink">{score}/5</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gold-light">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
