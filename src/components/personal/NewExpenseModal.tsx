import { useMemo, useState, useEffect } from 'react';
import {
  X,
  Package,
  Car,
  Coffee,
  MoreHorizontal,
  CircleParking,
  Camera,
  Check,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  MOCK_PERSONAL_EXPENSES,
  isPersonAssigned,
} from '@/lib/mock-data';
import type { PersonalExpense } from '@/lib/mock-data';
import { useAllBookings } from '@/hooks/use-bookings';
import { useStores } from '@/hooks/use-stores';
import { useCurrentPersonnel } from '@/hooks/use-current-identity';
import { verifyMileage } from '@/lib/distance';
import { uploadFile } from '@/lib/storage';
import { toast } from '@/components/ui/Toast';

const EXPENSE_TYPES: { value: PersonalExpense['type']; label: string; icon: React.ReactNode }[] = [
  { value: 'material', label: 'Material', icon: <Package size={16} /> },
  { value: 'milersattning', label: 'Milersattning', icon: <Car size={16} /> },
  { value: 'parkering', label: 'Parkering', icon: <CircleParking size={16} /> },
  { value: 'mat_fika', label: 'Mat & fika', icon: <Coffee size={16} /> },
  { value: 'ovrigt', label: 'Ovrigt', icon: <MoreHorizontal size={16} /> },
];

const KM_RATE = 3.0;

export default function NewExpenseModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data: currentPerson } = useCurrentPersonnel();
  const personnelId = currentPerson?.id;
  const personName = currentPerson?.namn ?? 'Stina Bergkvist';
  const { data: allBookings = [] } = useAllBookings();
  const { data: stores = [] } = useStores();

  const myBookings = useMemo(
    () => allBookings.filter((b) => isPersonAssigned(b, personName)),
    [personName, allBookings]
  );

  const [bookingId, setBookingId] = useState(myBookings[0]?.id || '');
  const [type, setType] = useState<PersonalExpense['type']>('material');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Mileage-specific state
  const [reportedKm, setReportedKm] = useState('');
  const [isRoundtrip, setIsRoundtrip] = useState(true);

  const booking = useMemo(
    () => allBookings.find((b) => b.id === bookingId),
    [bookingId, allBookings]
  );

  const store = useMemo(
    () => (booking ? stores.find((s) => s.namn === booking.butik) : undefined),
    [booking, stores]
  );

  const km = parseFloat(reportedKm);
  const verification = useMemo(() => {
    if (type !== 'milersattning') return null;
    if (!currentPerson || !store) return null;
    if (!reportedKm || isNaN(km) || km <= 0) return null;
    return verifyMileage(
      km,
      currentPerson.lat,
      currentPerson.lng,
      store.lat,
      store.lng,
      isRoundtrip
    );
  }, [type, currentPerson, store, reportedKm, km, isRoundtrip]);

  // Auto-calc amount when km changes
  useEffect(() => {
    if (type === 'milersattning' && reportedKm) {
      const parsed = parseFloat(reportedKm);
      if (!isNaN(parsed) && parsed > 0) {
        setAmount(String(Math.round(parsed * KM_RATE)));
      } else {
        setAmount('');
      }
    }
  }, [type, reportedKm]);

  const descriptionRequired =
    type === 'milersattning' &&
    (verification?.verdict === 'warning' || verification?.verdict === 'suspicious');

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!bookingId) return;
    if (!personnelId) {
      toast('Ingen personal vald');
      return;
    }
    if (type === 'milersattning') {
      if (!reportedKm || isNaN(km) || km <= 0) {
        toast('Ange antal kilometer');
        return;
      }
      if (descriptionRequired && !description.trim()) {
        toast('Beskriv avvikelsen i kommentaren');
        return;
      }
    } else if (!amount) {
      return;
    }

    const finalAmount =
      type === 'milersattning' ? Math.round(km * KM_RATE) : parseFloat(amount) || 0;

    setSaving(true);
    let receiptUrl: string | null = null;
    if (file) {
      try {
        receiptUrl = await uploadFile('receipts', file, bookingId, personnelId);
      } catch (e) {
        console.warn('Kvittoupload misslyckades, sparar utan:', e);
        toast('Kunde inte ladda upp kvitto — sparar utan');
        receiptUrl = null;
      }
    }

    const newExpense: PersonalExpense = {
      id: 'pe' + (MOCK_PERSONAL_EXPENSES.length + 1 + Math.random()).toString(36).slice(2, 7),
      personnelId,
      bookingId,
      type,
      amount: finalAmount,
      description,
      date: new Date().toISOString().slice(0, 10),
      receiptUrl,
    };

    if (type === 'milersattning') {
      newExpense.reportedKm = km;
      newExpense.kmRate = KM_RATE;
      newExpense.isRoundtrip = isRoundtrip;
      if (description.trim()) {
        newExpense.mileageComment = description.trim();
      }
    }

    MOCK_PERSONAL_EXPENSES.push(newExpense);
    toast('Utlagg sparat');
    setSaving(false);
    onSaved();
    onClose();
  }

  const isMileage = type === 'milersattning';

  return (
    <div className="fixed inset-0 bg-surface z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-bold text-ink">Nytt utlagg</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-r text-ink-muted active:scale-[0.98] active:opacity-90"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Booking select */}
        <label className="block text-[13px] font-semibold text-ink mb-1.5">Uppdrag</label>
        <select
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="w-full rounded-r border border-border bg-surface px-3 py-3 text-[16px] text-ink mb-5"
        >
          {myBookings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.butik} &middot; {b.dagar}
            </option>
          ))}
        </select>

        {/* Type grid */}
        <label className="block text-[13px] font-semibold text-ink mb-1.5">Typ</label>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {EXPENSE_TYPES.map((et, i) => (
            <button
              key={et.value}
              onClick={() => setType(et.value)}
              className={cn(
                'flex items-center justify-center gap-2 py-3 rounded-r text-[13px] font-semibold active:scale-[0.98] active:opacity-90',
                i === EXPENSE_TYPES.length - 1 && 'col-span-2',
                type === et.value
                  ? 'bg-ink text-white'
                  : 'bg-surface-alt text-ink-soft border border-border'
              )}
            >
              {et.icon}
              {et.label === 'Milersattning' ? 'Milersattning' : et.label}
            </button>
          ))}
        </div>

        {/* Mileage-specific fields */}
        {isMileage && (
          <>
            <label className="block text-[13px] font-semibold text-ink mb-1.5">
              Körda kilometer {isRoundtrip ? '(tur och retur)' : '(enkel resa)'}
            </label>
            <div className="flex items-baseline gap-2 mb-2">
              <input
                type="number"
                inputMode="decimal"
                value={reportedKm}
                onChange={(e) => setReportedKm(e.target.value)}
                placeholder="0"
                className="w-full rounded-r border border-border bg-surface px-3 py-3 text-[24px] font-bold text-ink"
              />
              <span className="text-[16px] text-ink-muted font-medium flex-shrink-0">km</span>
            </div>
            <div className="text-[11.5px] text-ink-muted mb-3">
              {KM_RATE.toFixed(2).replace('.', ',')} kr/km
              {reportedKm && !isNaN(km) && km > 0 && (
                <span className="ml-2 font-semibold text-ink">
                  = {Math.round(km * KM_RATE).toLocaleString('sv-SE')} kr
                </span>
              )}
            </div>

            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={!isRoundtrip}
                onChange={(e) => setIsRoundtrip(!e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-gold"
              />
              <span className="text-[13px] text-ink-soft">Enkel resa (inte tur och retur)</span>
            </label>

            {verification && (
              <div
                className={cn(
                  'flex items-start gap-2 rounded-r border px-3 py-2 mb-5 text-[12.5px]',
                  verification.verdict === 'ok' &&
                    'bg-green-bg border-green/30 text-green',
                  verification.verdict === 'warning' &&
                    'bg-amber-bg border-amber/30 text-amber',
                  verification.verdict === 'suspicious' &&
                    'bg-red-bg border-red/30 text-red'
                )}
              >
                {verification.verdict === 'ok' && (
                  <Check size={14} strokeWidth={2.2} className="mt-0.5 flex-shrink-0" />
                )}
                {verification.verdict === 'warning' && (
                  <AlertCircle size={14} strokeWidth={2.2} className="mt-0.5 flex-shrink-0" />
                )}
                {verification.verdict === 'suspicious' && (
                  <AlertTriangle size={14} strokeWidth={2.2} className="mt-0.5 flex-shrink-0" />
                )}
                <span className="font-medium leading-snug">
                  {verification.verdict === 'ok' &&
                    `~${verification.expectedKm} km beräknat ${isRoundtrip ? 't/r' : 'enkel'} — stämmer`}
                  {verification.verdict === 'warning' &&
                    `Beräknat ~${verification.expectedKm} km, du rapporterar ${km} km`}
                  {verification.verdict === 'suspicious' &&
                    `Beräknat ~${verification.expectedKm} km, du rapporterar ${km} km — beskriv i kommentaren`}
                </span>
              </div>
            )}
          </>
        )}

        {/* Amount (for non-mileage types) */}
        {!isMileage && (
          <>
            <label className="block text-[13px] font-semibold text-ink mb-1.5">Belopp</label>
            <div className="flex items-baseline gap-2 mb-5">
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-r border border-border bg-surface px-3 py-3 text-[24px] font-bold text-ink"
              />
              <span className="text-[16px] text-ink-muted font-medium flex-shrink-0">kr</span>
            </div>
          </>
        )}

        {/* Description */}
        <label className="block text-[13px] font-semibold text-ink mb-1.5">
          {isMileage ? 'Kommentar' : 'Beskrivning'}
          {descriptionRequired && <span className="text-red ml-1">*</span>}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder={
            descriptionRequired
              ? 'Förklara avvikelsen (t.ex. hämtade material på annan adress)'
              : undefined
          }
          className={cn(
            'w-full rounded-r border bg-surface px-3 py-3 text-[16px] text-ink mb-5 resize-none',
            descriptionRequired ? 'border-red/40' : 'border-border'
          )}
        />

        {/* Receipt upload */}
        <label className="block text-[13px] font-semibold text-ink mb-1.5">Kvitto</label>
        <label className="flex items-center justify-center gap-2 w-full py-3 rounded-r border border-dashed border-border bg-surface-alt text-ink-muted text-[13px] font-semibold cursor-pointer active:scale-[0.98] active:opacity-90 mb-2">
          <Camera size={16} />
          Fota kvitto eller valj fil
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        {file && (
          <p className="text-xs text-ink-muted mb-4">{file.name}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-border bg-surface flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-r border border-border text-ink-soft font-semibold text-[14px] active:scale-[0.98] active:opacity-90"
        >
          Avbryt
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-3 rounded-r bg-gold text-white font-semibold text-[14px] active:scale-[0.98] active:opacity-90 disabled:opacity-60"
        >
          {saving ? 'Sparar...' : 'Spara utlagg'}
        </button>
      </div>
    </div>
  );
}
