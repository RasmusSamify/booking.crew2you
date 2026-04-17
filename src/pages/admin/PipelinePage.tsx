import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PipelineColumn from '@/components/bookings/PipelineColumn';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import NewBookingModal from '@/components/bookings/NewBookingModal';
import QuickActionModal from '@/components/bookings/QuickActionModal';
import { useAllBookings, STAGES, type Booking, type BookingStage } from '@/hooks/use-bookings';
import type { Issue } from '@/lib/issue-detection';

export default function PipelinePage() {
  const { data: bookings = [] } = useAllBookings();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [quickActionBooking, setQuickActionBooking] = useState<{
    booking: Booking;
    issue: Issue;
  } | null>(null);

  const aktiva = bookings.filter((b) => b.stage !== 'fakturerad').length;

  const filtered = useMemo(() => {
    let result = bookings;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.butik.toLowerCase().includes(q) ||
          b.kund.toLowerCase().includes(q) ||
          b.assignedPersonnel.some((p) => p.personnelName.toLowerCase().includes(q)) ||
          b.ort.toLowerCase().includes(q) ||
          b.produkt.toLowerCase().includes(q)
      );
    }
    if (regionFilter) {
      result = result.filter((b) => b.region === regionFilter);
    }
    return result;
  }, [bookings, search, regionFilter]);

  const byStage = useMemo(() => {
    const map: Record<BookingStage, Booking[]> = {
      inkommen: [],
      bokad: [],
      bekraftad: [],
      personal: [],
      genomford: [],
      aterrapporterad: [],
      fakturerad: [],
    };
    filtered.forEach((b) => map[b.stage].push(b));
    return map;
  }, [filtered]);

  const handleCardClick = (booking: Booking) => {
    // Re-fetch the latest version from the bookings array
    const latest = bookings.find((b) => b.id === booking.id);
    setSelectedBooking(latest || booking);
  };

  const handleIssueClick = (booking: Booking, issue: Issue) => {
    const latest = bookings.find((b) => b.id === booking.id) || booking;
    setQuickActionBooking({ booking: latest, issue });
  };

  const topbarActions = (
    <button
      onClick={() => setShowNewModal(true)}
      className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-dark"
    >
      <Plus size={14} strokeWidth={2} />
      Nytt uppdrag
    </button>
  );

  return (
    <AdminLayout
      pageTitle="Pipeline"
      pageSub={`${aktiva} aktiva uppdrag`}
      actions={topbarActions}
      activeNav="pipeline"
    >
      {/* Filter bar */}
      <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] max-w-[380px] flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="text"
            placeholder="Sök butik, kund, personal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-r border border-border-strong bg-surface py-[9px] pl-[38px] pr-3 text-[13.5px] text-ink transition-colors focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg"
          />
        </div>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="appearance-none rounded-r border border-border-strong bg-surface bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%236b6656%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3cpolyline%20points%3D%276%209%2012%2015%2018%209%27%3E%3c%2Fpolyline%3E%3c%2Fsvg%3E')] bg-[right_10px_center] bg-no-repeat py-[9px] pl-3 pr-8 text-[13.5px] text-ink focus:border-gold focus:outline-none"
        >
          <option value="">Alla regioner</option>
          <option value="Stockholm">Stockholm</option>
          <option value="Utanför Stockholm">Utanför Stockholm</option>
          <option value="Löpande uppdrag">Löpande uppdrag</option>
        </select>
        <div className="ml-auto text-[12.5px] text-ink-muted">
          Klicka på kort för detalj & flytta steg
        </div>
      </div>

      {/* Pipeline kanban */}
      <div className="flex gap-3 overflow-x-auto pb-3">
        {STAGES.map((stage) => (
          <PipelineColumn
            key={stage}
            stage={stage}
            bookings={byStage[stage]}
            onCardClick={handleCardClick}
            onIssueClick={handleIssueClick}
          />
        ))}
      </div>

      {/* Detail modal */}
      {quickActionBooking && (
        <QuickActionModal
          booking={quickActionBooking.booking}
          issue={quickActionBooking.issue}
          onClose={() => setQuickActionBooking(null)}
          onOpenDetail={() => {
            setSelectedBooking(quickActionBooking.booking);
            setQuickActionBooking(null);
          }}
        />
      )}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
      {showNewModal && (
        <NewBookingModal onClose={() => setShowNewModal(false)} />
      )}
    </AdminLayout>
  );
}
