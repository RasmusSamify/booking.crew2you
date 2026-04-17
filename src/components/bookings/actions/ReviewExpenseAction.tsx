import { useMemo, useState } from 'react';
import {
  Check,
  Wallet,
  Home,
  Building2,
  AlertCircle,
  AlertTriangle,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import type { Booking } from '@/hooks/use-bookings';
import { MOCK_PERSONAL_EXPENSES, type Personal, type Butik } from '@/lib/mock-data';
import { useAllBookings } from '@/hooks/use-bookings';
import { usePersonnel } from '@/hooks/use-personnel';
import { useStores } from '@/hooks/use-stores';
import { useExpenses } from '@/hooks/use-expenses';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';
import { verifyMileage, type MileageVerdict } from '@/lib/distance';

interface ReviewExpenseActionProps {
  booking: Booking;
  onClose: () => void;
}

interface MileageInfo {
  verdict: MileageVerdict;
  expectedKm: number;
  reportedKm: number;
  deviationPercent: number;
  isRoundtrip: boolean;
  comment?: string;
  personHemort: string;
  storeName: string;
  personLat: number;
  personLng: number;
  storeLat: number;
  storeLng: number;
}

interface NormalizedExpense {
  id: string;
  source: 'admin' | 'personal';
  type: string;
  amount: number;
  description: string;
  date: string;
  personName: string;
  hasReceipt: boolean;
  isMileage: boolean;
  mileage?: MileageInfo;
}

function typeLabel(type: string): string {
  switch (type) {
    case 'material':
      return 'Material';
    case 'milersattning':
      return 'Milersättning';
    case 'parkering':
      return 'Parkering';
    case 'mat_fika':
      return 'Mat & fika';
    case 'ovrigt':
      return 'Övrigt';
    default:
      return type;
  }
}

function buildMileageInfo(
  reportedKm: number | undefined,
  isRoundtrip: boolean | undefined,
  comment: string | undefined,
  personName: string,
  bookingId: string,
  personnel: Personal[],
  allBookings: Booking[],
  stores: Butik[]
): MileageInfo | undefined {
  if (typeof reportedKm !== 'number' || reportedKm <= 0) return undefined;
  const person = personnel.find((p) => p.namn === personName);
  const bk = allBookings.find((b) => b.id === bookingId);
  if (!person || !bk) return undefined;
  const store = stores.find((s) => s.namn === bk.butik);
  if (!store) return undefined;
  const roundtrip = isRoundtrip ?? true;
  const v = verifyMileage(reportedKm, person.lat, person.lng, store.lat, store.lng, roundtrip);
  return {
    verdict: v.verdict,
    expectedKm: v.expectedKm,
    reportedKm,
    deviationPercent: v.deviationPercent,
    isRoundtrip: roundtrip,
    comment,
    personHemort: person.hemort,
    storeName: store.namn,
    personLat: person.lat,
    personLng: person.lng,
    storeLat: store.lat,
    storeLng: store.lng,
  };
}

const VERDICT_BADGE: Record<
  MileageVerdict,
  { bg: string; text: string; border: string; Icon: typeof Check }
> = {
  ok: {
    bg: 'bg-green-bg',
    text: 'text-green',
    border: 'border-green/30',
    Icon: Check,
  },
  warning: {
    bg: 'bg-amber-bg',
    text: 'text-amber',
    border: 'border-amber/30',
    Icon: AlertCircle,
  },
  suspicious: {
    bg: 'bg-red-bg',
    text: 'text-red',
    border: 'border-red/30',
    Icon: AlertTriangle,
  },
};

export default function ReviewExpenseAction({
  booking,
  onClose,
}: ReviewExpenseActionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { data: personnel = [] } = usePersonnel();
  const { data: stores = [] } = useStores();
  const { data: allBookings = [] } = useAllBookings();
  const { data: adminExpenses = [] } = useExpenses();

  const expenses = useMemo<NormalizedExpense[]>(() => {
    const admin = adminExpenses.filter((u) => u.bokningId === booking.id).map(
      (u): NormalizedExpense => {
        const isMileage = u.typ === 'Milersättning';
        return {
          id: `admin-${u.id}`,
          source: 'admin',
          type: u.typ,
          amount: u.belopp,
          description: u.beskrivning,
          date: u.datum,
          personName: u.person,
          hasReceipt: false,
          isMileage,
          mileage: isMileage
            ? buildMileageInfo(
                u.reportedKm,
                u.isRoundtrip,
                u.mileageComment,
                u.person,
                u.bokningId,
                personnel,
                allBookings,
                stores
              )
            : undefined,
        };
      }
    );
    const personal = MOCK_PERSONAL_EXPENSES.filter(
      (p) => p.bookingId === booking.id
    ).map((p): NormalizedExpense => {
      const person = personnel.find((x) => x.id === p.personnelId);
      const isMileage = p.type === 'milersattning';
      return {
        id: `pe-${p.id}`,
        source: 'personal',
        type: typeLabel(p.type),
        amount: p.amount,
        description: p.description,
        date: p.date,
        personName: person?.namn ?? 'Okänd',
        hasReceipt: !!p.receiptUrl,
        isMileage,
        mileage:
          isMileage && person
            ? buildMileageInfo(
                p.reportedKm,
                p.isRoundtrip,
                p.mileageComment,
                person.namn,
                p.bookingId,
                personnel,
                allBookings,
                stores
              )
            : undefined,
      };
    });
    const all = [...admin, ...personal];
    const seen = new Set<string>();
    return all.filter((e) => {
      const key = `${e.personName}|${e.date}|${e.amount}|${e.description}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [booking.id, adminExpenses, personnel, allBookings, stores]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedExpenses = expenses.filter((e) => selected.has(e.id));
  const total = selectedExpenses.reduce((s, e) => s + e.amount, 0);

  const handleApprove = () => {
    toast(`${selectedExpenses.length} utlägg godkända`);
    onClose();
  };

  const handleReject = () => {
    toast(
      `${selectedExpenses.length} utlägg avvisade${rejectReason ? ` (${rejectReason})` : ''}`
    );
    onClose();
  };

  const openMap = (m: MileageInfo) => {
    const url = `https://www.google.com/maps/dir/${m.personLat},${m.personLng}/${m.storeLat},${m.storeLng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-ink-muted">
        Markera utlägg för att godkänna eller avvisa.
      </p>

      {expenses.length === 0 ? (
        <div className="rounded-r border border-border bg-surface-alt px-4 py-6 text-center text-[13px] text-ink-muted">
          Inga utlägg registrerade för detta uppdrag.
        </div>
      ) : (
        <div className="overflow-hidden rounded-r border border-border">
          {expenses.map((e, idx) => {
            const badge = e.mileage ? VERDICT_BADGE[e.mileage.verdict] : null;
            const BadgeIcon = badge?.Icon;
            return (
              <label
                key={e.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 bg-surface px-3 py-2.5 transition-colors hover:bg-surface-alt',
                  idx < expenses.length - 1 && 'border-b border-border'
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.has(e.id)}
                  onChange={() => toggle(e.id)}
                  className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer accent-gold"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Wallet
                      size={13}
                      strokeWidth={2}
                      className="flex-shrink-0 text-ink-muted"
                    />
                    <span className="text-[12.5px] font-semibold text-ink">
                      {e.type}
                    </span>
                    {badge && e.mileage && BadgeIcon && (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-r border px-1.5 py-0.5 text-[10px] font-semibold',
                          badge.bg,
                          badge.text,
                          badge.border
                        )}
                      >
                        <BadgeIcon size={10} strokeWidth={2.2} />
                        {e.mileage.verdict === 'ok'
                          ? 'OK'
                          : `${e.mileage.deviationPercent}%`}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[12px] text-ink-soft">
                    {e.description}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-muted">
                    <span>{e.personName}</span>
                    <span>·</span>
                    <span>{e.date}</span>
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.preventDefault();
                        toast('Kvitto-visning kommer i Phase 2');
                      }}
                      className="ml-1 font-semibold text-gold-dark underline-offset-2 hover:underline"
                    >
                      Se kvitto
                    </button>
                  </div>

                  {e.mileage && badge && (
                    <div
                      className={cn(
                        'mt-2 rounded-r border px-2.5 py-1.5 text-[11px]',
                        badge.bg,
                        badge.border
                      )}
                    >
                      <div className={cn('flex items-center gap-1.5 font-medium', badge.text)}>
                        <Home size={11} strokeWidth={2.2} />
                        <span className="text-ink-soft">{e.mileage.personHemort}</span>
                        <span className="text-ink-muted">──</span>
                        <span className="font-semibold text-ink">
                          {e.mileage.reportedKm} km
                        </span>
                        <span className="text-ink-muted">rapp.</span>
                        <span className="text-ink-muted">──</span>
                        <Building2 size={11} strokeWidth={2.2} />
                        <span className="text-ink-soft truncate">{e.mileage.storeName}</span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="text-ink-muted">
                          Beräknat ~{e.mileage.expectedKm} km
                          {e.mileage.isRoundtrip ? ' t/r' : ' (enkel)'}
                          {e.mileage.verdict !== 'ok' &&
                            ` · ${e.mileage.deviationPercent}% avvikelse`}
                        </span>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.preventDefault();
                            openMap(e.mileage!);
                          }}
                          className="inline-flex flex-shrink-0 items-center gap-1 font-semibold text-gold-dark underline-offset-2 hover:underline"
                        >
                          <MapPin size={10} strokeWidth={2.2} />
                          Verifiera på karta
                          <ExternalLink size={9} strokeWidth={2.2} />
                        </button>
                      </div>
                      {e.mileage.comment && (
                        <div className="mt-1 italic text-ink-soft">
                          &ldquo;{e.mileage.comment}&rdquo;
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 text-[13px] font-bold text-ink">
                  {e.amount.toLocaleString('sv-SE')} kr
                </div>
              </label>
            );
          })}
        </div>
      )}

      {expenses.length > 0 && (
        <div className="flex items-center justify-between rounded-r bg-surface-alt px-3 py-2 text-[12.5px]">
          <span className="font-semibold text-ink-soft">
            {selectedExpenses.length} markerade
          </span>
          <span className="font-bold text-gold-dark">
            Totalt: {total.toLocaleString('sv-SE')} kr
          </span>
        </div>
      )}

      {showRejectReason && (
        <div className="space-y-2 rounded-r border border-red/30 bg-red-bg p-3">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.5px] text-red">
            Ange anledning
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Varför avvisas dessa utlägg?"
            className="min-h-[60px] w-full resize-y rounded-r border border-border bg-surface px-3 py-2 text-[12.5px] text-ink focus:border-gold focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowRejectReason(false)}
              className="rounded-r px-3 py-1.5 text-[12px] font-medium text-ink-muted transition-colors hover:bg-surface hover:text-ink"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="inline-flex items-center gap-1.5 rounded-r bg-red px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-red/90"
            >
              Bekräfta avvisning
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-r px-3 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
        >
          Avbryt
        </button>
        <button
          type="button"
          disabled={selectedExpenses.length === 0}
          onClick={() => setShowRejectReason(true)}
          className="inline-flex items-center gap-1.5 rounded-r border border-red/40 bg-surface px-3 py-2 text-[12.5px] font-semibold text-red transition-colors hover:bg-red-bg disabled:opacity-40"
        >
          Avvisa markerade
        </button>
        <button
          type="button"
          disabled={selectedExpenses.length === 0}
          onClick={handleApprove}
          className="inline-flex items-center gap-1.5 rounded-r bg-gold px-3 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-40"
        >
          <Check size={13} strokeWidth={2} />
          Godkänn markerade
        </button>
      </div>
    </div>
  );
}
