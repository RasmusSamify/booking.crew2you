import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import CustomerCard from '@/components/customers/CustomerCard';
import StoreCard from '@/components/customers/StoreCard';
import { useAllBookings } from '@/hooks/use-bookings';
import { useCustomers } from '@/hooks/use-customers';
import { useStores } from '@/hooks/use-stores';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

type Tab = 'kunder' | 'butiker';

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('kunder');
  const [search, setSearch] = useState('');

  const { data: kunder = [] } = useCustomers();
  const { data: butiker = [] } = useStores();
  const { data: bookings = [] } = useAllBookings();

  // Compute uppdrag counts
  const kundUppdrag = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of bookings) {
      // Match on kund name (loose matching since mock data has slight variations)
      const found = kunder.find(
        (k) =>
          b.kund.toLowerCase().includes(k.namn.toLowerCase()) ||
          k.namn.toLowerCase().includes(b.kund.toLowerCase())
      );
      if (found) {
        map[found.id] = (map[found.id] || 0) + 1;
      }
    }
    return map;
  }, [kunder, bookings]);

  const butikUppdrag = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of bookings) {
      const found = butiker.find((bu) => bu.namn === b.butik);
      if (found) {
        map[found.id] = (map[found.id] || 0) + 1;
      }
    }
    return map;
  }, [butiker, bookings]);

  const filteredKunder = useMemo(() => {
    if (!search) return kunder;
    const q = search.toLowerCase();
    return kunder.filter(
      (k) =>
        k.namn.toLowerCase().includes(q) ||
        k.kontakter.some((c) => c.namn.toLowerCase().includes(q))
    );
  }, [search, kunder]);

  const filteredButiker = useMemo(() => {
    if (!search) return butiker;
    const q = search.toLowerCase();
    return butiker.filter(
      (b) =>
        b.namn.toLowerCase().includes(q) ||
        b.ort.toLowerCase().includes(q) ||
        b.kontakter.some((c) => c.namn.toLowerCase().includes(q))
    );
  }, [search, butiker]);

  const topbarActions = (
    <>
      <button
        onClick={() => toast('Kommer snart')}
        className="inline-flex items-center gap-2 rounded-r border border-border-strong px-4 py-[9px] text-[13.5px] font-semibold text-ink transition-all hover:bg-surface-alt"
      >
        <Plus size={14} strokeWidth={2} />
        Ny kund
      </button>
      <button
        onClick={() => toast('Kommer snart')}
        className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-dark"
      >
        <Plus size={14} strokeWidth={2} />
        Ny butik
      </button>
    </>
  );

  return (
    <AdminLayout
      pageTitle="Kunder & butiker"
      pageSub={`${kunder.length} uppdragsgivare, ${butiker.length} butiker`}
      actions={topbarActions}
      activeNav="kunder"
    >
      {/* Tabs */}
      <div className="mb-5 flex gap-6 border-b border-border">
        {[
          { key: 'kunder' as Tab, label: `Uppdragsgivare (${kunder.length})` },
          { key: 'butiker' as Tab, label: `Butiker & platser (${butiker.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSearch(''); }}
            className={cn(
              'relative pb-3 text-[14px] transition-colors',
              activeTab === tab.key
                ? 'font-semibold text-ink after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gold'
                : 'font-medium text-ink-muted hover:text-ink'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-[18px]">
        <div className="relative max-w-[380px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder={
              activeTab === 'kunder'
                ? 'Sok kund, kontaktperson...'
                : 'Sok butik, ort, kontaktperson...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-r border border-border-strong bg-surface py-[9px] pl-[38px] pr-3 text-[13.5px] text-ink transition-colors focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg"
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === 'kunder' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredKunder.map((k) => (
            <CustomerCard
              key={k.id}
              kund={k}
              uppdragCount={kundUppdrag[k.id] || 0}
            />
          ))}
          {filteredKunder.length === 0 && (
            <div className="col-span-full py-12 text-center text-[13.5px] text-ink-muted">
              Inga kunder matchar sokningen
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredButiker.map((b) => (
            <StoreCard
              key={b.id}
              butik={b}
              uppdragCount={butikUppdrag[b.id] || 0}
            />
          ))}
          {filteredButiker.length === 0 && (
            <div className="col-span-full py-12 text-center text-[13.5px] text-ink-muted">
              Inga butiker matchar sokningen
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
