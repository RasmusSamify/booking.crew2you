import { useState, useMemo } from 'react';
import { Search, Plus, Users, TrendingUp, Clock, Check } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PersonnelCard from '@/components/personnel/PersonnelCard';
import PersonnelProfileModal from '@/components/personnel/PersonnelProfileModal';
import { isPersonAssigned, type Personal } from '@/lib/mock-data';
import { useAllBookings, type Booking } from '@/hooks/use-bookings';
import { usePersonnel, useTogglePersonnelActive } from '@/hooks/use-personnel';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

type ActiveFilter = 'alla' | 'aktiva' | 'inaktiva';

function getAktivaUppdrag(personNamn: string, bookings: Booking[]): number {
  return bookings.filter(
    (b) =>
      isPersonAssigned(b, personNamn) &&
      !['genomford', 'aterrapporterad', 'fakturerad'].includes(b.stage)
  ).length;
}

export default function PersonnelPage() {
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Personal | null>(null);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('aktiva');

  const { data: allPersonal = [] } = usePersonnel();
  const { data: bookings = [] } = useAllBookings();
  const toggleMutation = useTogglePersonnelActive();

  const activeCount = allPersonal.filter((p) => p.active).length;
  const inactiveCount = allPersonal.filter((p) => !p.active).length;
  const totalCount = allPersonal.length;

  const filtered = useMemo(() => {
    let list = allPersonal;

    // Filter by active status
    if (activeFilter === 'aktiva') {
      list = list.filter((p) => p.active);
    } else if (activeFilter === 'inaktiva') {
      list = list.filter((p) => !p.active);
    }

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.namn.toLowerCase().includes(q) ||
          p.hemort.toLowerCase().includes(q) ||
          p.kompetenser.some((k) => k.toLowerCase().includes(q)) ||
          p.specialiteter.some((s) => s.toLowerCase().includes(q))
      );
    }

    return list;
  }, [search, activeFilter, allPersonal]);

  // KPI computations
  const snittBetyg = totalCount > 0
    ? (allPersonal.reduce((s, p) => s + p.betyg, 0) / totalCount).toFixed(1)
    : '0.0';
  const totalErfarenhet = allPersonal.reduce((s, p) => s + p.erfarenhetAr, 0);
  const totalUppdrag = allPersonal.reduce((s, p) => s + p.antalUppdrag, 0);

  const handleToggleActive = (person: Personal, newActive: boolean) => {
    toggleMutation.mutate({ id: person.id, active: newActive });
    toast(`${person.namn} markerad som ${newActive ? 'aktiv' : 'inaktiv'}`);
  };

  const filterButtons: { key: ActiveFilter; label: string; count: number }[] = [
    { key: 'alla', label: 'Alla', count: totalCount },
    { key: 'aktiva', label: 'Aktiva', count: activeCount },
    { key: 'inaktiva', label: 'Inaktiva', count: inactiveCount },
  ];

  const topbarActions = (
    <button
      onClick={() => toast('Kommer snart')}
      className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-dark"
    >
      <Plus size={14} strokeWidth={2} />
      Ny person
    </button>
  );

  return (
    <AdminLayout
      pageTitle="Personal"
      pageSub={`${totalCount} demovärdar`}
      actions={topbarActions}
      activeNav="personal"
    >
      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        {[
          { label: 'Total personal', value: `${activeCount} aktiva / ${totalCount} totalt`, icon: <Users size={16} strokeWidth={2} /> },
          { label: 'Snittbetyg', value: `${snittBetyg}/5`, icon: <TrendingUp size={16} strokeWidth={2} /> },
          { label: 'Total erfarenhet', value: `${totalErfarenhet} ar`, icon: <Clock size={16} strokeWidth={2} /> },
          { label: 'Uppdrag utforda', value: String(totalUppdrag), icon: <Check size={16} strokeWidth={2} /> },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="flex items-center gap-3 rounded-r-lg border border-border bg-surface p-4 shadow-xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-r bg-gold-bg text-gold">
              {kpi.icon}
            </div>
            <div>
              <div className="text-lg font-bold text-ink">{kpi.value}</div>
              <div className="text-[11px] font-medium text-ink-muted">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="mb-[18px] flex items-center gap-3">
        <div className="relative max-w-[380px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Sok namn, hemort, kompetens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-r border border-border-strong bg-surface py-[9px] pl-[38px] pr-3 text-[13.5px] text-ink transition-colors focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg"
          />
        </div>
        <div className="flex gap-1.5">
          {filterButtons.map((fb) => (
            <button
              key={fb.key}
              onClick={() => setActiveFilter(fb.key)}
              className={cn(
                'rounded-r px-3 py-[7px] text-[12.5px] font-semibold transition-all',
                activeFilter === fb.key
                  ? 'bg-ink text-white'
                  : 'border border-border bg-surface-alt text-ink-soft'
              )}
            >
              {fb.label} ({fb.count})
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((person) => (
          <PersonnelCard
            key={person.id}
            person={person}
            aktivaUppdrag={getAktivaUppdrag(person.namn, bookings)}
            onClick={() => setSelectedPerson(person)}
            onToggleActive={handleToggleActive}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-[13.5px] text-ink-muted">
            Inga personer matchar sokningen
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPerson && (
        <PersonnelProfileModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          onToggleActive={(newActive) => {
            handleToggleActive(selectedPerson, newActive);
            setSelectedPerson({ ...selectedPerson, active: newActive });
          }}
        />
      )}
    </AdminLayout>
  );
}
