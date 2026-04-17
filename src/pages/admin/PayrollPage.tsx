import { useMemo } from 'react';
import { Download, FileSpreadsheet, Users, Clock, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PayrollSummaryCard from '@/components/payroll/PayrollSummaryCard';
import PayrollTable, { type PersonPayroll } from '@/components/payroll/PayrollTable';
import { useAllBookings } from '@/hooks/use-bookings';
import { useExpenses } from '@/hooks/use-expenses';
import { usePersonnel } from '@/hooks/use-personnel';
import { MOCK_PERSONAL_EXPENSES } from '@/lib/mock-data';
import type { Expense, Personal } from '@/lib/fallback-data';
import { exportToCSV, formatCurrency } from '@/lib/export-csv';

const TIMLON = 180;
const PAYROLL_STAGES = ['genomford', 'aterrapporterad', 'fakturerad'] as const;

function getUtlaggForBooking(bookingId: string, expenses: Expense[]): number {
  const adminExpenses = expenses
    .filter((u) => u.bokningId === bookingId)
    .reduce((s, u) => s + u.belopp, 0);
  const personalExpenses = MOCK_PERSONAL_EXPENSES
    .filter((pe) => pe.bookingId === bookingId)
    .reduce((s, pe) => s + pe.amount, 0);
  return adminExpenses + personalExpenses;
}

export default function PayrollPage() {
  const { data: allBookings = [] } = useAllBookings();
  const { data: expenses = [] } = useExpenses();
  const { data: allPersonnel = [] } = usePersonnel();

  const personnelData = useMemo<PersonPayroll[]>(() => {
    const eligible = allBookings.filter((b) =>
      (PAYROLL_STAGES as readonly string[]).includes(b.stage) && b.assignedPersonnel.length > 0
    );

    const grouped = new Map<string, { person: Personal; bookings: typeof eligible }>();
    for (const booking of eligible) {
      for (const ap of booking.assignedPersonnel) {
        const person = allPersonnel.find((p) => p.id === ap.personnelId);
        if (!person) continue;
        if (!grouped.has(ap.personnelId)) grouped.set(ap.personnelId, { person, bookings: [] });
        grouped.get(ap.personnelId)!.bookings.push(booking);
      }
    }

    const result: PersonPayroll[] = [];
    for (const [, { person, bookings }] of grouped) {
      const items = bookings.map((booking) => {
        const timmar = booking.timmar;
        const lon = timmar * TIMLON;
        const utlagg = getUtlaggForBooking(booking.id, expenses);
        return { booking, timmar, lon, utlagg };
      });

      const totalTimmar = items.reduce((s, i) => s + i.timmar, 0);
      const totalLon = items.reduce((s, i) => s + i.lon, 0);
      const totalUtlagg = items.reduce((s, i) => s + i.utlagg, 0);

      result.push({
        person,
        bookings: items,
        totalTimmar,
        totalLon,
        totalUtlagg,
        totalUtbetalning: totalLon + totalUtlagg,
      });
    }

    return result;
  }, [allBookings, expenses, allPersonnel]);

  const totalPersonal = personnelData.length;
  const totalTimmar = personnelData.reduce((s, p) => s + p.totalTimmar, 0);
  const totalLon = personnelData.reduce((s, p) => s + p.totalLon, 0);
  const totalUtlagg = personnelData.reduce((s, p) => s + p.totalUtlagg, 0);
  const totalUtbetalning = personnelData.reduce(
    (s, p) => s + p.totalUtbetalning,
    0
  );

  const handleExportCSV = () => {
    const headers = [
      'Personal',
      'Datum',
      'Butik',
      'Kund',
      'Timmar',
      'Timlon',
      'Lon',
      'Utlagg',
      'Total',
    ];
    const rows: (string | number)[][] = [];
    for (const pd of personnelData) {
      for (const item of pd.bookings) {
        rows.push([
          pd.person.namn,
          item.booking.dagar,
          item.booking.butik,
          item.booking.kund,
          item.timmar,
          TIMLON,
          item.lon,
          item.utlagg,
          item.lon + item.utlagg,
        ]);
      }
    }
    exportToCSV('loneunderlag-2026-04.csv', headers, rows);
  };

  return (
    <AdminLayout
      pageTitle="Loneunderlag"
      pageSub="April 2026"
      activeNav="lon"
      actions={
        <>
          <select className="rounded-r border border-border bg-surface px-3 py-2 text-sm text-ink">
            <option>April 2026</option>
            <option>Mars 2026</option>
            <option>Februari 2026</option>
            <option>Januari 2026</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-r border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-alt"
          >
            <Download size={15} strokeWidth={2} />
            Exportera CSV
          </button>
          <button
            disabled
            title="Kopplas i Phase 3"
            className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
          >
            <FileSpreadsheet size={15} strokeWidth={2} />
            Exportera SIE
          </button>
        </>
      }
    >
      <div className="space-y-8">
        <PayrollSummaryCard
          personalCount={totalPersonal}
          timmar={totalTimmar}
          lon={totalLon}
          utlagg={totalUtlagg}
          total={totalUtbetalning}
        />

        <PayrollTable personnelData={personnelData} />

        <div className="flex items-center justify-between rounded-r-lg border border-border bg-surface px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <Users size={15} strokeWidth={2} className="text-ink-muted" />
            <span className="font-medium">{totalPersonal} personal</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <Clock size={15} strokeWidth={2} className="text-ink-muted" />
            <span className="font-medium">{totalTimmar} timmar</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <span className="font-medium">Lon: {formatCurrency(totalLon)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <span className="font-medium">
              Utlagg: {formatCurrency(totalUtlagg)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-gold-dark">
            <TrendingUp size={15} strokeWidth={2} />
            <span>Total: {formatCurrency(totalUtbetalning)}</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
