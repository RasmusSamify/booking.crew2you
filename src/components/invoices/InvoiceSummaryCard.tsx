import { formatCurrency } from '@/lib/export-csv';

interface InvoiceSummaryCardProps {
  uppdragCount: number;
  timmar: number;
  arbetskostnad: number;
  utlagg: number;
  total: number;
}

export default function InvoiceSummaryCard({
  uppdragCount,
  timmar,
  arbetskostnad,
  utlagg,
  total,
}: InvoiceSummaryCardProps) {
  return (
    <div className="rounded-r-xl border border-gold-light bg-gold-bg p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-gold-dark/70">
        KLARA ATT FAKTURERA
      </p>

      <div className="mt-4 flex items-center gap-4 text-sm text-gold-dark">
        <span className="font-medium">{uppdragCount} uppdrag</span>
        <span className="h-4 w-px bg-gold-light" />
        <span className="font-medium">Timpris: 495 kr/h</span>
        <span className="h-4 w-px bg-gold-light" />
        <span className="font-medium">Timmar: {timmar}h</span>
      </div>

      <div className="mt-5 space-y-2 text-sm text-gold-dark">
        <div className="flex items-center justify-between">
          <span>Arbetskostnad</span>
          <span className="font-medium">{formatCurrency(arbetskostnad)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Utlagg</span>
          <span className="font-medium">{formatCurrency(utlagg)}</span>
        </div>
        <div className="my-3 border-t border-gold-light" />
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold uppercase tracking-[0.5px]">
            TOTALT ATT FAKTURERA
          </span>
          <span className="text-[26px] font-black text-gold-dark">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
