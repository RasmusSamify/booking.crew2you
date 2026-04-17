import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Booking, Personal } from '@/lib/mock-data';

export interface PersonPayroll {
  person: Personal;
  bookings: {
    booking: Booking;
    timmar: number;
    lon: number;
    utlagg: number;
  }[];
  totalTimmar: number;
  totalLon: number;
  totalUtlagg: number;
  totalUtbetalning: number;
}

interface PayrollTableProps {
  personnelData: PersonPayroll[];
}

function PersonRow({ data }: { data: PersonPayroll }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-alt"
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold-bg text-[11px] font-bold text-gold-dark">
          {data.person.initialer}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">{data.person.namn}</p>
          <p className="text-sm text-ink-muted">
            {data.bookings.length} uppdrag &middot; {data.totalTimmar}h &middot;
            Lon: {data.totalLon.toLocaleString('sv-SE')} kr &middot; Utlagg:{' '}
            {data.totalUtlagg.toLocaleString('sv-SE')} kr
          </p>
        </div>
        <span className="text-sm font-bold text-gold-dark">
          Total: {data.totalUtbetalning.toLocaleString('sv-SE')} kr
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'flex-shrink-0 text-ink-muted transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pl-[60px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                <th className="px-3 py-2">Datum</th>
                <th className="px-3 py-2">Butik</th>
                <th className="px-3 py-2 text-right">Tim</th>
                <th className="px-3 py-2 text-right">Lon</th>
                <th className="px-3 py-2 text-right">Utlagg</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.map((item) => (
                <tr
                  key={item.booking.id}
                  className="border-b border-border transition-colors hover:bg-surface-alt"
                >
                  <td className="px-3 py-2 text-ink-muted">
                    {item.booking.dagar}
                  </td>
                  <td className="px-3 py-2 text-ink-soft">
                    {item.booking.butik}
                  </td>
                  <td className="px-3 py-2 text-right">{item.timmar}</td>
                  <td className="px-3 py-2 text-right">
                    {item.lon.toLocaleString('sv-SE')}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {item.utlagg.toLocaleString('sv-SE')}
                  </td>
                </tr>
              ))}
              <tr className="bg-surface-alt font-bold">
                <td className="px-3 py-2" colSpan={2}>
                  Summa
                </td>
                <td className="px-3 py-2 text-right">{data.totalTimmar}</td>
                <td className="px-3 py-2 text-right">
                  {data.totalLon.toLocaleString('sv-SE')}
                </td>
                <td className="px-3 py-2 text-right">
                  {data.totalUtlagg.toLocaleString('sv-SE')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function PayrollTable({ personnelData }: PayrollTableProps) {
  const sorted = [...personnelData].sort(
    (a, b) => b.totalUtbetalning - a.totalUtbetalning
  );

  return (
    <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
      {sorted.map((data) => (
        <PersonRow key={data.person.id} data={data} />
      ))}
    </div>
  );
}
