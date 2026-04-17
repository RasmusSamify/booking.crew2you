import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getPersonnelDisplay, type Booking } from '@/lib/mock-data';

export interface BookingWithFinance {
  booking: Booking;
  timmar: number;
  arbete: number;
  utlagg: number;
  total: number;
}

interface InvoiceTableProps {
  bookings: BookingWithFinance[];
  onInvoice: (id: string) => void;
  title: string;
  collapsed?: boolean;
}

export default function InvoiceTable({
  bookings,
  onInvoice,
  title,
  collapsed: defaultCollapsed = false,
}: InvoiceTableProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const totalTimmar = bookings.reduce((s, b) => s + b.timmar, 0);
  const totalArbete = bookings.reduce((s, b) => s + b.arbete, 0);
  const totalUtlagg = bookings.reduce((s, b) => s + b.utlagg, 0);
  const totalTotal = bookings.reduce((s, b) => s + b.total, 0);

  return (
    <div className={cn(collapsed && 'opacity-60')}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-3 flex w-full items-center gap-2 text-left"
      >
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-bg px-1.5 text-[11px] font-bold text-gold-dark">
          {bookings.length}
        </span>
        {collapsed ? (
          <ChevronDown size={16} className="ml-auto text-ink-muted" />
        ) : (
          <ChevronUp size={16} className="ml-auto text-ink-muted" />
        )}
      </button>

      {!collapsed && (
        <div className="overflow-x-auto rounded-r-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                <th className="px-4 py-3">Datum</th>
                <th className="px-4 py-3">Butik</th>
                <th className="px-4 py-3">Kund</th>
                <th className="px-4 py-3">Personal</th>
                <th className="px-4 py-3 text-right">Timmar</th>
                <th className="px-4 py-3 text-right">Arbete kr</th>
                <th className="px-4 py-3 text-right">Utlagg kr</th>
                <th className="px-4 py-3 text-right">Total kr</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((item) => (
                <tr
                  key={item.booking.id}
                  className="border-b border-border transition-colors hover:bg-surface-alt"
                >
                  <td className="px-4 py-3 text-ink-muted">
                    {item.booking.dagar}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {item.booking.butik}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {item.booking.kund}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {getPersonnelDisplay(item.booking) || 'Ej tillsatt'}
                  </td>
                  <td className="px-4 py-3 text-right">{item.timmar}</td>
                  <td className="px-4 py-3 text-right">
                    {item.arbete.toLocaleString('sv-SE')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.utlagg.toLocaleString('sv-SE')}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {item.total.toLocaleString('sv-SE')}
                  </td>
                  <td className="px-4 py-3">
                    {item.booking.stage !== 'fakturerad' && (
                      <button
                        onClick={() => onInvoice(item.booking.id)}
                        className="inline-flex items-center gap-1.5 rounded-r bg-gold-bg px-3 py-1.5 text-[12px] font-semibold text-gold-dark transition-colors hover:bg-gold-light"
                      >
                        <Check size={14} strokeWidth={2} />
                        Fakturera
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-surface-alt font-bold">
                <td className="px-4 py-3" colSpan={4}>
                  Totalt
                </td>
                <td className="px-4 py-3 text-right">{totalTimmar}</td>
                <td className="px-4 py-3 text-right">
                  {totalArbete.toLocaleString('sv-SE')}
                </td>
                <td className="px-4 py-3 text-right">
                  {totalUtlagg.toLocaleString('sv-SE')}
                </td>
                <td className="px-4 py-3 text-right">
                  {totalTotal.toLocaleString('sv-SE')}
                </td>
                <td className="px-4 py-3" />
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
