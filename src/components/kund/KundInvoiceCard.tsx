import { Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Invoice } from '@/lib/mock-data';
import { useAllBookings } from '@/hooks/use-bookings';
import { formatCurrency } from '@/lib/export-csv';
import { toast } from '@/components/ui/Toast';

const STATUS_CONFIG: Record<Invoice['status'], { label: string; className: string }> = {
  paid: { label: 'Betald', className: 'bg-green-bg text-green' },
  open: { label: '\u00d6ppen', className: 'bg-gold-bg text-gold-dark' },
  overdue: { label: 'F\u00f6rfallen', className: 'bg-red-bg text-red' },
};

interface KundInvoiceCardProps {
  invoice: Invoice;
}

export default function KundInvoiceCard({ invoice }: KundInvoiceCardProps) {
  const { label, className } = STATUS_CONFIG[invoice.status];
  const { data: bookings = [] } = useAllBookings();

  const stores = invoice.bookingIds
    .map((bid) => bookings.find((b) => b.id === bid))
    .filter(Boolean)
    .map((b) => b!.butik);
  const uniqueStores = [...new Set(stores)];

  return (
    <div className="rounded-r-lg border border-border bg-surface p-5">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <span className="text-[15px] font-semibold text-ink">Faktura {invoice.invoiceNumber}</span>
          <span className="ml-2 text-[13px] text-ink-muted">{invoice.date}</span>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-[5px] rounded-[20px] px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px]',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {label}
        </span>
      </div>

      {/* Booking count + hours */}
      <div className="mb-2 text-[12.5px] text-ink-muted">
        {invoice.bookingIds.length} uppdrag &middot; {invoice.totalHours} timmar
      </div>

      {/* Stores */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {uniqueStores.map((store) => (
          <span
            key={store}
            className="rounded-[10px] border border-border bg-surface-alt px-2 py-[2px] text-[11px] font-medium text-ink-soft"
          >
            {store}
          </span>
        ))}
      </div>

      {/* Cost breakdown */}
      <div className="mb-3 space-y-1 text-[13px]">
        <div className="flex justify-between">
          <span className="text-ink-muted">Arbete</span>
          <span className="text-ink">{formatCurrency(invoice.laborCost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-muted">Utl&auml;gg</span>
          <span className="text-ink">{formatCurrency(invoice.expenses)}</span>
        </div>
        <div className="border-t border-border pt-1">
          <div className="flex justify-between font-bold">
            <span className="text-ink">Totalt</span>
            <span className="text-ink">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Date info */}
      {invoice.status === 'paid' && invoice.paidDate && (
        <div className="mb-3 text-[12px] text-green">
          Betald {invoice.paidDate}
        </div>
      )}
      {invoice.status === 'open' && invoice.dueDate && (
        <div className="mb-3 text-[12px] text-gold-dark">
          F&ouml;rfallodatum: {invoice.dueDate}
        </div>
      )}
      {invoice.status === 'overdue' && invoice.dueDate && (
        <div className="mb-3 text-[12px] text-red">
          F&ouml;rfallen sedan {invoice.dueDate}
        </div>
      )}

      {/* Download button */}
      <button
        onClick={() => toast('PDF-export kopplas i Phase 3')}
        className="inline-flex items-center gap-2 rounded-r border border-border-strong bg-surface px-3 py-[6px] text-[12px] font-semibold text-ink transition-all hover:border-ink hover:bg-surface-alt"
      >
        <Download size={13} strokeWidth={2} />
        Ladda ner PDF
      </button>
    </div>
  );
}
