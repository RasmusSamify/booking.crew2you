import { Home, Building2, Check, AlertCircle, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface MileageVerificationProps {
  personnelName: string;
  personnelHemort: string;
  storeName: string;
  reportedKm: number;
  expectedKm: number;
  deviationPercent: number;
  verdict: 'ok' | 'warning' | 'suspicious';
  amount: number;
  kmRate: number;
  isRoundtrip: boolean;
  comment?: string;
  onOpenMap?: () => void;
  onApprove?: () => void;
  onContact?: () => void;
  onReject?: () => void;
}

const VERDICT_CONFIG = {
  ok: {
    headerBg: 'bg-green-bg',
    headerText: 'text-green',
    headerBorder: 'border-green/30',
    lineColor: 'border-green',
    iconBg: 'bg-green-bg',
    iconColor: 'text-green',
    title: 'Milersättning verifierad',
    Icon: Check,
  },
  warning: {
    headerBg: 'bg-amber-bg',
    headerText: 'text-amber',
    headerBorder: 'border-amber/30',
    lineColor: 'border-amber',
    iconBg: 'bg-amber-bg',
    iconColor: 'text-amber',
    title: 'Milersättning avviker',
    Icon: AlertCircle,
  },
  suspicious: {
    headerBg: 'bg-red-bg',
    headerText: 'text-red',
    headerBorder: 'border-red/30',
    lineColor: 'border-red',
    iconBg: 'bg-red-bg',
    iconColor: 'text-red',
    title: 'Milersättning misstänkt hög',
    Icon: AlertTriangle,
  },
} as const;

export default function MileageVerification({
  personnelName,
  personnelHemort,
  storeName,
  reportedKm,
  expectedKm,
  deviationPercent,
  verdict,
  amount,
  kmRate,
  isRoundtrip,
  comment,
  onOpenMap,
  onApprove,
  onContact,
  onReject,
}: MileageVerificationProps) {
  const config = VERDICT_CONFIG[verdict];
  const VerdictIcon = config.Icon;
  const legKm = isRoundtrip ? Math.round(expectedKm / 2) : expectedKm;
  const expectedAmount = Math.round(expectedKm * kmRate);
  const diffAmount = Math.max(0, amount - expectedAmount);

  return (
    <div className={cn('rounded-r border overflow-hidden', config.headerBorder)}>
      {/* Header */}
      <div className={cn('flex items-center gap-2 px-3 py-2', config.headerBg, config.headerText)}>
        <VerdictIcon size={16} strokeWidth={2.2} className="flex-shrink-0" />
        <span className="text-[13px] font-semibold">{config.title}</span>
        <span className="ml-auto text-[11px] font-medium opacity-80">
          {personnelName}
        </span>
      </div>

      <div className="bg-surface px-3 py-3 space-y-3">
        {/* Route visualization */}
        <div className="flex items-start justify-between gap-1">
          {/* Start: hemort */}
          <div className="flex flex-col items-center flex-shrink-0 w-[68px]">
            <div className={cn('w-9 h-9 rounded-full flex items-center justify-center', config.iconBg, config.iconColor)}>
              <Home size={16} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-semibold text-ink mt-1 truncate max-w-full text-center">
              {personnelHemort}
            </span>
            <span className="text-[9px] text-ink-muted uppercase tracking-wide">Hem</span>
          </div>

          {/* Leg 1 line */}
          <div className="flex flex-col items-center flex-1 pt-4">
            <span className="text-[10px] font-semibold text-ink-soft mb-0.5">
              ~{legKm} km
            </span>
            <div className={cn('w-full border-t-2 border-dashed', config.lineColor)} />
          </div>

          {/* Middle: store */}
          <div className="flex flex-col items-center flex-shrink-0 w-[88px]">
            <div className={cn('w-9 h-9 rounded-full flex items-center justify-center', config.iconBg, config.iconColor)}>
              <Building2 size={16} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-semibold text-ink mt-1 text-center leading-tight line-clamp-2">
              {storeName}
            </span>
          </div>

          {isRoundtrip && (
            <>
              {/* Leg 2 line */}
              <div className="flex flex-col items-center flex-1 pt-4">
                <span className="text-[10px] font-semibold text-ink-soft mb-0.5">
                  ~{legKm} km
                </span>
                <div className={cn('w-full border-t-2 border-dashed', config.lineColor)} />
              </div>

              {/* End: hemort */}
              <div className="flex flex-col items-center flex-shrink-0 w-[68px]">
                <div className={cn('w-9 h-9 rounded-full flex items-center justify-center', config.iconBg, config.iconColor)}>
                  <Home size={16} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-semibold text-ink mt-1 truncate max-w-full text-center">
                  {personnelHemort}
                </span>
                <span className="text-[9px] text-ink-muted uppercase tracking-wide">Hem</span>
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="rounded-r bg-surface-alt px-3 py-2 space-y-1">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink-muted">Rapporterat:</span>
            <span className="font-semibold text-ink">
              {reportedKm} km {isRoundtrip ? '(t/r)' : '(enkel)'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink-muted">Beräknat:</span>
            <span className="font-semibold text-ink">
              ~{expectedKm} km {isRoundtrip ? '(t/r)' : '(enkel)'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink-muted">Avvikelse:</span>
            <span className={cn('font-semibold', config.headerText)}>
              {deviationPercent}%
            </span>
          </div>
          <div className="h-px bg-border my-1" />
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink-muted">Rapporterat belopp:</span>
            <span className="font-semibold text-ink">
              {amount.toLocaleString('sv-SE')} kr
            </span>
          </div>
          {verdict === 'suspicious' && (
            <>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-ink-muted">Beräknat belopp:</span>
                <span className="font-semibold text-ink">
                  {expectedAmount.toLocaleString('sv-SE')} kr
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className={cn('font-semibold', config.headerText)}>Differens:</span>
                <span className={cn('font-bold', config.headerText)}>
                  {diffAmount.toLocaleString('sv-SE')} kr
                </span>
              </div>
            </>
          )}
        </div>

        {/* Comment */}
        {comment && (
          <div className="rounded-r border border-border bg-surface-alt px-3 py-2">
            <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-muted mb-0.5">
              Kommentar från personal
            </div>
            <div className="text-[12.5px] text-ink-soft italic">
              &ldquo;{comment}&rdquo;
            </div>
          </div>
        )}

        {/* Map button */}
        {onOpenMap && (
          <button
            type="button"
            onClick={onOpenMap}
            className="inline-flex items-center gap-1.5 rounded-r border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
          >
            <MapPin size={12} strokeWidth={2.2} />
            Verifiera på karta
            <ExternalLink size={11} strokeWidth={2.2} />
          </button>
        )}

        {/* Suspicious actions */}
        {verdict === 'suspicious' && (onApprove || onContact || onReject) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {onApprove && (
              <button
                type="button"
                onClick={onApprove}
                className="inline-flex items-center gap-1.5 rounded-r bg-gold px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-gold-dark"
              >
                <Check size={12} strokeWidth={2.2} />
                Godkänn ändå
              </button>
            )}
            {onContact && (
              <button
                type="button"
                onClick={onContact}
                className="inline-flex items-center gap-1.5 rounded-r border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
              >
                Kontakta personal
              </button>
            )}
            {onReject && (
              <button
                type="button"
                onClick={onReject}
                className="inline-flex items-center gap-1.5 rounded-r border border-red/40 bg-surface px-3 py-1.5 text-[12px] font-semibold text-red transition-colors hover:bg-red-bg"
              >
                Avvisa
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
