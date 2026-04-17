import { useState, useMemo } from 'react';
import { Plus, Search, ChevronDown, ClipboardCheck } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import ReviewCard from '@/components/quality/ReviewCard';
import QualityReviewModal from '@/components/quality/QualityReviewModal';
import { useQualityReviews } from '@/hooks/use-reviews';
import { useAllBookings } from '@/hooks/use-bookings';
import { usePersonnel } from '@/hooks/use-personnel';
import { useCustomers } from '@/hooks/use-customers';
import { hasPersonnel, getPersonnelDisplay } from '@/lib/mock-data';
import type { Booking } from '@/lib/mock-data';
import type { QualityReview } from '@/lib/mock-data-reviews';
// cn available if needed

export default function QualityPage() {
  const [filterPerson, setFilterPerson] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setRefresh] = useState(0);

  const { data: reviews = [] } = useQualityReviews();
  const { data: bookings = [] } = useAllBookings();
  const { data: personnel = [] } = usePersonnel();
  const { data: kunder = [] } = useCustomers();

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewReview, setViewReview] = useState<QualityReview | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Eligible bookings for new reviews
  const eligibleBookings = bookings.filter((b) =>
    ['genomford', 'aterrapporterad', 'fakturerad'].includes(b.stage) && hasPersonnel(b)
  );

  // Trigger calculation
  const completedSinceLastReview = useMemo(() => {
    const genomforda = bookings.filter((b) =>
      ['genomford', 'aterrapporterad', 'fakturerad'].includes(b.stage)
    ).length;
    const reviewCount = reviews.length;
    return genomforda - reviewCount * 10;
  }, [reviews, bookings]);
  const nextReviewIn = Math.max(10 - (completedSinceLastReview % 10), 0);
  const progressPct = Math.min(((10 - nextReviewIn) / 10) * 100, 100);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (filterPerson) {
      list = list.filter((r) => r.personnelId === filterPerson);
    }
    if (filterCustomer) {
      list = list.filter((r) =>
        r.customerName.toLowerCase().includes(filterCustomer.toLowerCase())
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.personnelName.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.storeName.toLowerCase().includes(q) ||
          r.overallComment.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [filterPerson, filterCustomer, searchQuery, reviews]);

  function handleNewReview() {
    setSelectedBooking(null);
    setShowCreateModal(true);
  }

  const topbarActions = (
    <button
      onClick={handleNewReview}
      className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-dark"
    >
      <Plus size={14} strokeWidth={2} />
      Ny uppföljning
    </button>
  );

  return (
    <AdminLayout
      pageTitle="Kvalitetsuppföljning"
      pageSub="Var 10:e bokning"
      actions={topbarActions}
      activeNav="kvalitet"
    >
      {/* Trigger banner */}
      <div className="mb-6 rounded-r-lg border border-gold-light bg-gold-bg p-5">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardCheck size={16} strokeWidth={2} className="text-gold-dark" />
          <span className="text-[13.5px] font-semibold text-ink">
            Nästa kvalitetsuppföljning om {nextReviewIn} uppdrag
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gold-light/50">
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-1.5 text-[11px] text-ink-muted">
          {10 - nextReviewIn} av 10 uppdrag genomförda sedan senaste uppföljning
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={filterPerson}
            onChange={(e) => setFilterPerson(e.target.value)}
            className="appearance-none rounded-r border border-border bg-surface py-2 pl-3 pr-8 text-[13px] font-medium text-ink focus:border-gold focus:outline-none"
          >
            <option value="">Alla personal</option>
            {personnel.map((p) => (
              <option key={p.id} value={p.id}>{p.namn}</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        </div>
        <div className="relative">
          <select
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            className="appearance-none rounded-r border border-border bg-surface py-2 pl-3 pr-8 text-[13px] font-medium text-ink focus:border-gold focus:outline-none"
          >
            <option value="">Alla kunder</option>
            {kunder.map((k) => (
              <option key={k.id} value={k.namn}>{k.namn}</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök uppföljningar..."
            className="w-full rounded-r border border-border bg-surface py-2 pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Reviews grid */}
      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onView={() => setViewReview(review)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-r-lg border border-border bg-surface px-8 py-16 text-center">
          <ClipboardCheck size={32} strokeWidth={1.5} className="mx-auto mb-3 text-ink-faint" />
          <p className="text-[13.5px] text-ink-muted">Inga uppföljningar hittade.</p>
        </div>
      )}

      {/* Create modal with booking picker */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-5 backdrop-blur-[4px] animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <div className="flex max-h-[90vh] w-full max-w-[640px] flex-col overflow-hidden rounded-r-xl bg-surface shadow-lg animate-slide-up">
            {!selectedBooking ? (
              <>
                <div className="flex items-center justify-between border-b border-border px-[26px] py-[22px]">
                  <h3 className="text-lg font-black text-ink">Välj bokning</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-r bg-surface-alt text-ink-muted hover:bg-border hover:text-ink"
                  >
                    <span className="sr-only">Stäng</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-[26px] space-y-2">
                  {eligibleBookings.length > 0 ? (
                    eligibleBookings.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className="flex w-full items-center gap-3 rounded-r border border-border p-3.5 text-left transition-colors hover:border-gold hover:bg-gold-bg"
                      >
                        <div className="flex-1">
                          <div className="text-[13.5px] font-semibold text-ink">
                            {b.butik} &middot; {b.kund}
                          </div>
                          <div className="mt-0.5 text-[12px] text-ink-muted">
                            {getPersonnelDisplay(b)} &middot; {b.dagar}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="py-8 text-center text-[13px] text-ink-muted">
                      Inga genomförda bokningar tillgängliga.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <QualityReviewModal
                booking={selectedBooking}
                onClose={() => setShowCreateModal(false)}
                onSave={() => setRefresh((n) => n + 1)}
              />
            )}
          </div>
        </div>
      )}

      {/* View modal */}
      {viewReview && (
        <QualityReviewModal
          isReadOnly
          existingReview={viewReview}
          booking={bookings.find((b) => b.id === viewReview.bookingId)}
          onClose={() => setViewReview(null)}
        />
      )}
    </AdminLayout>
  );
}
