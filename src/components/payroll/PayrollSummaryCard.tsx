import { formatCurrency } from '@/lib/export-csv';

interface PayrollSummaryCardProps {
  personalCount: number;
  timmar: number;
  lon: number;
  utlagg: number;
  total: number;
}

export default function PayrollSummaryCard({
  personalCount,
  timmar,
  lon,
  utlagg,
  total,
}: PayrollSummaryCardProps) {
  return (
    <div className="rounded-r-xl border border-gold-light bg-gold-bg p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-gold-dark/70">
        LONEUNDERLAG APRIL 2026
      </p>

      <div className="mt-4 flex items-center gap-4 text-sm text-gold-dark">
        <span className="font-medium">Timlon: 180 kr/h</span>
        <span className="h-4 w-px bg-gold-light" />
        <span className="font-medium">Personal: {personalCount} st</span>
        <span className="h-4 w-px bg-gold-light" />
        <span className="font-medium">Timmar: {timmar}h</span>
      </div>

      <div className="mt-5 space-y-2 text-sm text-gold-dark">
        <div className="flex items-center justify-between">
          <span>Total lon</span>
          <span className="font-medium">{formatCurrency(lon)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total utlagg</span>
          <span className="font-medium">{formatCurrency(utlagg)}</span>
        </div>
        <div className="my-3 border-t border-gold-light" />
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold uppercase tracking-[0.5px]">
            TOTAL UTBETALNING
          </span>
          <span className="text-[26px] font-black text-gold-dark">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
