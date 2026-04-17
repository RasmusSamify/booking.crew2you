import { useState, useMemo } from 'react';
import { Search, ChevronRight, UserX, Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import NewBookingModal from '@/components/bookings/NewBookingModal';
import { useAllBookings, STAGES, STAGE_META, type Booking, type BookingStage } from '@/hooks/use-bookings';
import { hasPersonnel, getPersonnelDisplay } from '@/lib/mock-data';
import { cn } from '@/utils/cn';

const STATUS_COLOR: Record<BookingStage, string> = {
  inkommen: 'bg-status-inkommen-bg text-status-inkommen',
  bokad: 'bg-status-bokad-bg text-status-bokad',
  bekraftad: 'bg-status-bekraftad-bg text-status-bekraftad',
  personal: 'bg-status-personal-bg text-status-personal',
  genomford: 'bg-status-genomford-bg text-status-genomford',
  aterrapporterad: 'bg-status-aterrapporterad-bg text-status-aterrapporterad',
  fakturerad: 'bg-status-fakturerad-bg text-status-fakturerad',
};

const SERVICE_CHIP: Record<string, string> = {
  demo: 'bg-blue-bg text-blue border-transparent',
  plock: 'bg-violet-bg text-violet border-transparent',
  sampling: 'bg-pink-bg text-pink border-transparent',
  event: 'bg-amber-bg text-amber border-transparent',
};

export default function BookingsPage() {
  const { data: bookings = [] } = useAllBookings();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

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
    if (stageFilter) {
      result = result.filter((b) => b.stage === stageFilter);
    }
    if (regionFilter) {
      result = result.filter((b) => b.region === regionFilter);
    }
    return result;
  }, [bookings, search, stageFilter, regionFilter]);

  const openBooking = (id: string) => {
    const b = bookings.find((x) => x.id === id);
    if (b) setSelectedBooking(b);
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
      pageTitle="Bokningar"
      pageSub={`${bookings.length} bokningar totalt`}
      actions={topbarActions}
      activeNav="bokningar"
    >
      {/* Filters */}
      <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] max-w-[380px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Sök butik, kund, personal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-r border border-border-strong bg-surface py-[9px] pl-[38px] pr-3 text-[13.5px] text-ink transition-colors focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="appearance-none rounded-r border border-border-strong bg-surface py-[9px] pl-3 pr-8 text-[13.5px] text-ink focus:border-gold focus:outline-none"
        >
          <option value="">Alla statusar</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{STAGE_META[s].label}</option>
          ))}
        </select>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="appearance-none rounded-r border border-border-strong bg-surface py-[9px] pl-3 pr-8 text-[13.5px] text-ink focus:border-gold focus:outline-none"
        >
          <option value="">Alla regioner</option>
          <option value="Stockholm">Stockholm</option>
          <option value="Utanför Stockholm">Utanför Stockholm</option>
          <option value="Löpande uppdrag">Löpande uppdrag</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Datum', 'Butik', 'Ort', 'Kund', 'Tjänst', 'Personal', 'Tim', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap border-b border-border bg-surface-alt px-[18px] py-3 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => openBooking(b.id)}
                  className="cursor-pointer transition-colors hover:bg-surface-alt [&:last-child>td]:border-b-0"
                >
                  <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] font-semibold text-ink">
                    {b.dagar}
                  </td>
                  <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] font-semibold text-ink">
                    {b.butik}
                  </td>
                  <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] text-ink-muted">
                    {b.ort}
                  </td>
                  <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] text-ink">
                    {b.kund}
                  </td>
                  <td className="border-b border-border px-[18px] py-3.5">
                    <span className={cn(
                      'inline-flex items-center rounded-[10px] border px-2 py-[2px] text-[11px] font-medium',
                      SERVICE_CHIP[b.tjanst] || 'border-border bg-surface-alt text-ink-soft'
                    )}>
                      {b.tjanst}
                    </span>
                  </td>
                  <td className="border-b border-border px-[18px] py-3.5 text-[13.5px]">
                    {hasPersonnel(b) ? (
                      getPersonnelDisplay(b)
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red">
                        <UserX size={14} strokeWidth={2} />
                        Saknar
                      </span>
                    )}
                  </td>
                  <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] text-ink">
                    {b.timmar}h
                  </td>
                  <td className="border-b border-border px-[18px] py-3.5">
                    <span className={cn(
                      'inline-flex items-center gap-[5px] rounded-[20px] px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px]',
                      STATUS_COLOR[b.stage]
                    )}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {STAGE_META[b.stage].shortLabel}
                    </span>
                  </td>
                  <td className="border-b border-border px-[18px] py-3.5">
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-soft hover:text-ink">
                      Öppna <ChevronRight size={14} strokeWidth={2} />
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-[18px] py-12 text-center text-[13.5px] text-ink-muted">
                    Inga bokningar matchar filtret
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
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
