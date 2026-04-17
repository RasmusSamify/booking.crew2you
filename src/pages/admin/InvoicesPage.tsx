import { useMemo } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import InvoiceSummaryCard from '@/components/invoices/InvoiceSummaryCard';
import InvoiceTable, {
  type BookingWithFinance,
} from '@/components/invoices/InvoiceTable';
import { useAllBookings, useAdvanceBookingStage } from '@/hooks/use-bookings';
import { useExpenses } from '@/hooks/use-expenses';
import { MOCK_PERSONAL_EXPENSES, getPersonnelDisplay } from '@/lib/mock-data';
import type { Expense } from '@/lib/fallback-data';
import { exportToCSV } from '@/lib/export-csv';
import { toast } from '@/components/ui/Toast';

const TIMPRIS = 495;

function getUtlaggForBooking(bookingId: string, expenses: Expense[]): number {
  const adminExpenses = expenses
    .filter((u) => u.bokningId === bookingId)
    .reduce((s, u) => s + u.belopp, 0);
  const personalExpenses = MOCK_PERSONAL_EXPENSES
    .filter((pe) => pe.bookingId === bookingId)
    .reduce((s, pe) => s + pe.amount, 0);
  return adminExpenses + personalExpenses;
}

export default function InvoicesPage() {
  const { data: allBookings = [] } = useAllBookings();
  const { data: expenses = [] } = useExpenses();
  const advanceStage = useAdvanceBookingStage();

  const attFakturera = useMemo<BookingWithFinance[]>(() => {
    return allBookings
      .filter((b) => b.stage === 'aterrapporterad')
      .map((booking) => {
        const timmar = booking.timmar;
        const arbete = timmar * TIMPRIS;
        const utlagg = getUtlaggForBooking(booking.id, expenses);
        return { booking, timmar, arbete, utlagg, total: arbete + utlagg };
      });
  }, [allBookings, expenses]);

  const fakturerade = useMemo<BookingWithFinance[]>(() => {
    return allBookings
      .filter((b) => b.stage === 'fakturerad')
      .map((booking) => {
        const timmar = booking.timmar;
        const arbete = timmar * TIMPRIS;
        const utlagg = getUtlaggForBooking(booking.id, expenses);
        return { booking, timmar, arbete, utlagg, total: arbete + utlagg };
      });
  }, [allBookings, expenses]);

  const summaryTimmar = attFakturera.reduce((s, b) => s + b.timmar, 0);
  const summaryArbete = attFakturera.reduce((s, b) => s + b.arbete, 0);
  const summaryUtlagg = attFakturera.reduce((s, b) => s + b.utlagg, 0);
  const summaryTotal = attFakturera.reduce((s, b) => s + b.total, 0);

  const handleInvoice = (bookingId: string) => {
    advanceStage.mutate(
      { bookingId, targetStage: 'fakturerad' },
      {
        onSuccess: (booking) => {
          toast(`${booking.butik} markerad som fakturerad`);
        },
      }
    );
  };

  const handleExportCSV = () => {
    const headers = [
      'Datum',
      'Butik',
      'Ort',
      'Kund',
      'Personal',
      'Timmar',
      'Timpris',
      'Arbete',
      'Utlagg',
      'Total',
    ];
    const rows = attFakturera.map((item) => [
      item.booking.dagar,
      item.booking.butik,
      item.booking.ort,
      item.booking.kund,
      getPersonnelDisplay(item.booking),
      item.timmar,
      TIMPRIS,
      item.arbete,
      item.utlagg,
      item.total,
    ]);
    exportToCSV('fakturaunderlag-2026-04.csv', headers, rows);
  };

  return (
    <AdminLayout
      pageTitle="Fakturaunderlag"
      pageSub="April 2026"
      activeNav="fakturor"
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
            Skicka till Fortnox
          </button>
        </>
      }
    >
      <div className="space-y-8">
        <InvoiceSummaryCard
          uppdragCount={attFakturera.length}
          timmar={summaryTimmar}
          arbetskostnad={summaryArbete}
          utlagg={summaryUtlagg}
          total={summaryTotal}
        />

        <InvoiceTable
          bookings={attFakturera}
          onInvoice={handleInvoice}
          title="Att fakturera"
        />

        <InvoiceTable
          bookings={fakturerade}
          onInvoice={handleInvoice}
          title="Fakturerade denna period"
          collapsed
        />
      </div>
    </AdminLayout>
  );
}
