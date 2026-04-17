import { formatCurrency } from '@/lib/export-csv';
import { useInvoices } from '@/hooks/use-invoices';
import { useCurrentCustomer } from '@/hooks/use-current-identity';
import KundInvoiceCard from '@/components/kund/KundInvoiceCard';

export default function KundInvoicesPage() {
  const { data: customer } = useCurrentCustomer();
  const { data: invoices = [] } = useInvoices(customer?.id);
  const paid = invoices.filter((i) => i.status === 'paid');
  const open = invoices.filter((i) => i.status === 'open' || i.status === 'overdue');
  const total = invoices.reduce((s, i) => s + i.total, 0);

  return (
    <>
      {/* Summary */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-[13.5px] text-ink">
        <span>
          <strong className="font-semibold">{invoices.length}</strong> fakturor
        </span>
        <span className="text-border-strong">|</span>
        <span>
          Betalt: <strong className="font-semibold">{paid.length}</strong>
        </span>
        <span className="text-border-strong">|</span>
        <span>
          &Ouml;ppen: <strong className="font-semibold">{open.length}</strong>
        </span>
        <span className="text-border-strong">|</span>
        <span>
          Totalt: <strong className="font-semibold">{formatCurrency(total)}</strong>
        </span>
      </div>

      {/* Invoice list */}
      <div className="space-y-3">
        {invoices.map((inv) => (
          <KundInvoiceCard key={inv.id} invoice={inv} />
        ))}
        {invoices.length === 0 && (
          <p className="py-12 text-center text-[13px] text-ink-muted">Inga fakturor &auml;nnu</p>
        )}
      </div>
    </>
  );
}
