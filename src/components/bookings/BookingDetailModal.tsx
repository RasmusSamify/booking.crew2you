import { useState } from 'react';
import { X, ArrowRight, Clipboard, Wallet, Archive, Save, Plus, Trash2 } from 'lucide-react';
import {
  type Booking,
  type BookingStage,
  type ServiceType,
  STAGES,
  STAGE_META,
  useAdvanceBookingStage,
  useUpdateBooking,
} from '@/hooks/use-bookings';
import { useExpenses } from '@/hooks/use-expenses';
import { usePersonnel, type Personal } from '@/hooks/use-personnel';
import { type AssignedPerson } from '@/lib/mock-data';
import StageTimeline from './StageTimeline';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

const STATUS_BADGE_STYLES: Record<BookingStage, string> = {
  inkommen: 'bg-status-inkommen-bg text-status-inkommen',
  bokad: 'bg-status-bokad-bg text-status-bokad',
  bekraftad: 'bg-status-bekraftad-bg text-status-bekraftad',
  personal: 'bg-status-personal-bg text-status-personal',
  genomford: 'bg-status-genomford-bg text-status-genomford',
  aterrapporterad: 'bg-status-aterrapporterad-bg text-status-aterrapporterad',
  fakturerad: 'bg-status-fakturerad-bg text-status-fakturerad',
};

const inputClass =
  'w-full rounded-r border border-border-strong bg-surface px-3 py-2.5 text-[13.5px] text-ink transition-all focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg';
const selectClass =
  'w-full appearance-none rounded-r border border-border-strong bg-surface px-3 py-2.5 pr-8 text-[13.5px] text-ink transition-all focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg';
const labelClass = 'mb-[7px] block text-xs font-semibold tracking-[0.1px] text-ink-soft';

interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  const [form, setForm] = useState({ ...booking });
  const currentIdx = STAGES.indexOf(form.stage);
  const nextStage = currentIdx < STAGES.length - 1 ? STAGES[currentIdx + 1] : null;
  const { data: allExpenses = [] } = useExpenses();
  const expenses = allExpenses.filter((u) => u.bokningId === booking.id);
  const { data: personnel = [] } = usePersonnel({ active: true });
  const advanceMutation = useAdvanceBookingStage();
  const updateMutation = useUpdateBooking();

  const hasChanges =
    form.butik !== booking.butik ||
    form.kontakt !== booking.kontakt ||
    form.tel !== booking.tel ||
    form.ort !== booking.ort ||
    form.region !== booking.region ||
    form.dagar !== booking.dagar ||
    form.timmar !== booking.timmar ||
    form.kund !== booking.kund ||
    form.kundKontakt !== booking.kundKontakt ||
    form.tjanst !== booking.tjanst ||
    JSON.stringify(form.assignedPersonnel) !== JSON.stringify(booking.assignedPersonnel) ||
    form.produkt !== booking.produkt ||
    form.material !== booking.material ||
    form.info !== booking.info ||
    (form.ovrigInfo || '') !== (booking.ovrigInfo || '');

  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false);

  const addPerson = (person: Personal) => {
    const role: AssignedPerson['role'] = form.assignedPersonnel.length === 0 ? 'primary' : 'secondary';
    setForm((prev) => ({
      ...prev,
      assignedPersonnel: [...prev.assignedPersonnel, { personnelId: person.id, personnelName: person.namn, role }],
    }));
    setShowPersonnelDropdown(false);
  };

  const removePerson = (personnelId: string) => {
    setForm((prev) => ({
      ...prev,
      assignedPersonnel: prev.assignedPersonnel.filter((p) => p.personnelId !== personnelId),
    }));
  };

  const toggleRole = (personnelId: string) => {
    setForm((prev) => ({
      ...prev,
      assignedPersonnel: prev.assignedPersonnel.map((p) =>
        p.personnelId === personnelId
          ? { ...p, role: p.role === 'primary' ? 'secondary' : 'primary' }
          : p
      ),
    }));
  };

  const availablePersonnel = personnel.filter(
    (p) => !form.assignedPersonnel.some((ap) => ap.personnelId === p.id)
  );

  const set = (field: keyof Booking, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(
      { ...form },
      {
        onSuccess: () => {
          toast('Ändringar sparade');
          onClose();
        },
      }
    );
  };

  const handleAdvance = () => {
    if (!nextStage) return;
    advanceMutation.mutate(
      { bookingId: booking.id },
      {
        onSuccess: (updated) => {
          toast(`Flyttad till ${STAGE_META[updated.stage].label}`);
          onClose();
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-5 backdrop-blur-[4px] animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden rounded-r-xl bg-surface shadow-lg animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-[26px] py-[22px]">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-[19px] font-bold tracking-[-0.015em] text-ink">
                {form.butik || 'Ny bokning'}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center gap-[5px] rounded-[20px] px-2.5 py-[3px] text-[11px] font-semibold',
                  STATUS_BADGE_STYLES[form.stage]
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {STAGE_META[form.stage].label}
              </span>
            </div>
            <p className="mt-[3px] text-[13px] text-ink-muted">
              {form.ort} &middot; {form.dagar} &middot; {form.kund}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-r bg-surface-alt text-ink-muted transition-all hover:bg-border hover:text-ink"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[26px] py-6">
          {/* Stage timeline */}
          <StageTimeline currentStage={form.stage} />

          {/* Editable fields */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Plats / Butik</label>
              <input
                type="text"
                className={inputClass}
                value={form.butik}
                onChange={(e) => set('butik', e.target.value)}
                placeholder="Ex: Ica Maxi Bromma"
              />
            </div>

            <div>
              <label className={labelClass}>Kontaktperson</label>
              <input
                type="text"
                className={inputClass}
                value={form.kontakt}
                onChange={(e) => set('kontakt', e.target.value)}
                placeholder="Ex: Martin"
              />
            </div>
            <div>
              <label className={labelClass}>Telefon</label>
              <input
                type="text"
                className={inputClass}
                value={form.tel}
                onChange={(e) => set('tel', e.target.value)}
                placeholder="08-123456"
              />
            </div>

            <div>
              <label className={labelClass}>Ort</label>
              <input
                type="text"
                className={inputClass}
                value={form.ort}
                onChange={(e) => set('ort', e.target.value)}
                placeholder="Stockholm"
              />
            </div>
            <div>
              <label className={labelClass}>Region</label>
              <select
                className={selectClass}
                value={form.region}
                onChange={(e) => set('region', e.target.value)}
              >
                <option>Stockholm</option>
                <option>Utanför Stockholm</option>
                <option>Löpande uppdrag</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Datum / Dagar</label>
              <input
                type="text"
                className={inputClass}
                value={form.dagar}
                onChange={(e) => set('dagar', e.target.value)}
                placeholder="tis 10-18"
              />
            </div>
            <div>
              <label className={labelClass}>Antal timmar</label>
              <input
                type="number"
                className={inputClass}
                value={form.timmar}
                onChange={(e) => set('timmar', Number(e.target.value))}
                step={0.5}
                placeholder="7"
              />
            </div>

            <div>
              <label className={labelClass}>Kund / Uppdragsgivare</label>
              <input
                type="text"
                className={inputClass}
                value={form.kund}
                onChange={(e) => set('kund', e.target.value)}
                placeholder="Ex: Falbygdens Ost"
              />
            </div>
            <div>
              <label className={labelClass}>Kundkontakt</label>
              <input
                type="text"
                className={inputClass}
                value={form.kundKontakt}
                onChange={(e) => set('kundKontakt', e.target.value)}
                placeholder="Jenny Reftegård 072-371 00 31"
              />
            </div>

            <div>
              <label className={labelClass}>Tjänst</label>
              <select
                className={selectClass}
                value={form.tjanst}
                onChange={(e) => set('tjanst', e.target.value as ServiceType)}
              >
                <option value="demo">demo</option>
                <option value="plock">plock</option>
                <option value="sampling">sampling</option>
                <option value="event">event</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Tilldelad personal</label>
              {form.assignedPersonnel.length > 0 && (
                <div className="mb-2 space-y-1.5">
                  {form.assignedPersonnel.map((ap) => {
                    const personData = personnel.find((p) => p.id === ap.personnelId);
                    return (
                      <div key={ap.personnelId} className="flex items-center gap-2 rounded-r border border-border bg-surface-alt px-3 py-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">
                          {personData?.initialer ?? '??'}
                        </div>
                        <span className="flex-1 text-[13px] font-medium text-ink">{ap.personnelName}</span>
                        <button
                          type="button"
                          onClick={() => toggleRole(ap.personnelId)}
                          className={cn(
                            'rounded-[10px] px-2 py-[2px] text-[10px] font-bold uppercase',
                            ap.role === 'primary' ? 'bg-gold-bg text-gold-dark' : 'bg-surface text-ink-muted border border-border'
                          )}
                        >
                          {ap.role === 'primary' ? 'Huvudvärd' : 'Stödvärd'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removePerson(ap.personnelId)}
                          className="text-ink-faint hover:text-red transition-colors"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPersonnelDropdown(!showPersonnelDropdown)}
                  className="inline-flex items-center gap-1.5 rounded-r border border-dashed border-border-strong px-3 py-2 text-[12.5px] font-semibold text-ink-muted transition-all hover:border-gold hover:text-gold"
                >
                  <Plus size={13} strokeWidth={2} />
                  Lägg till demovärd
                </button>
                {showPersonnelDropdown && (
                  <div className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-r-lg border border-border bg-surface shadow-md">
                    {availablePersonnel.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addPerson(p)}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-surface-alt"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">
                          {p.initialer}
                        </div>
                        <span className="font-medium text-ink">{p.namn}</span>
                        <span className="ml-auto text-[11px] text-ink-muted">{p.hemort}</span>
                        {!p.active && <span className="text-[10px] text-red">(inaktiv)</span>}
                      </button>
                    ))}
                    {availablePersonnel.length === 0 && (
                      <div className="px-3 py-4 text-center text-[12px] text-ink-muted">All personal redan tilldelad</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Produkt</label>
              <input
                type="text"
                className={inputClass}
                value={form.produkt}
                onChange={(e) => set('produkt', e.target.value)}
                placeholder="Ex: Hummersoppa"
              />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Material</label>
              <input
                type="text"
                className={inputClass}
                value={form.material}
                onChange={(e) => set('material', e.target.value)}
                placeholder="Ex: Demofat + skedar + stekplatta"
              />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Övrig info</label>
              <textarea
                className={cn(inputClass, 'min-h-[80px] resize-y')}
                value={form.ovrigInfo || ''}
                onChange={(e) => set('ovrigInfo', e.target.value)}
                placeholder="Särskilda instruktioner..."
              />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Info</label>
              <input
                type="text"
                className={inputClass}
                value={form.info}
                onChange={(e) => set('info', e.target.value)}
                placeholder="Internanteckning"
              />
            </div>
          </div>

          {/* Återrapport (read-only — personal fyller i detta) */}
          {booking.aterrapport && (
            <>
              <div className="my-5 h-px bg-border" />
              <div className="rounded-r border border-green/30 bg-green-bg p-4">
                <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-green">
                  <Clipboard size={14} strokeWidth={2} />
                  Återrapport från demovärd
                </div>
                <div className="text-[13.5px] leading-relaxed text-ink-soft">
                  {booking.aterrapport}
                </div>
              </div>
            </>
          )}

          {/* Expenses (read-only) */}
          {expenses.length > 0 && (
            <>
              <div className="my-5 h-px bg-border" />
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <Wallet size={14} strokeWidth={2} />
                Utlägg ({expenses.length})
              </h4>
              <div className="overflow-hidden rounded-r border border-border">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Datum', 'Typ', 'Beskrivning', 'Belopp'].map((h, i) => (
                        <th
                          key={h}
                          className={cn(
                            'border-b border-border bg-surface-alt px-[18px] py-3 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted',
                            i === 3 && 'text-right'
                          )}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((u) => (
                      <tr key={u.id}>
                        <td className="border-b border-border px-[18px] py-3 text-[13.5px] text-ink-muted">
                          {u.datum}
                        </td>
                        <td className="border-b border-border px-[18px] py-3">
                          <span className="rounded-[10px] border border-border bg-surface-alt px-2 py-[2px] text-[11px] font-medium text-ink-soft">
                            {u.typ}
                          </span>
                        </td>
                        <td className="border-b border-border px-[18px] py-3 text-[13.5px] text-ink">
                          {u.beskrivning}
                        </td>
                        <td className="border-b border-border px-[18px] py-3 text-right text-[13.5px] font-semibold text-ink">
                          {u.belopp.toLocaleString('sv-SE')} kr
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-surface-alt">
                      <td colSpan={3} className="px-[18px] py-3 text-right text-[13.5px] font-bold text-ink">
                        Summa
                      </td>
                      <td className="px-[18px] py-3 text-right text-[13.5px] font-bold text-gold-dark">
                        {expenses.reduce((s, u) => s + u.belopp, 0).toLocaleString('sv-SE')} kr
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-surface-alt px-[26px] py-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-r bg-transparent px-4 py-2 text-[13.5px] font-semibold text-ink-muted transition-all hover:bg-surface hover:text-red"
          >
            <Archive size={14} strokeWidth={2} />
            Arkivera
          </button>
          <div className="flex gap-2.5">
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-dark disabled:opacity-50"
              >
                <Save size={14} strokeWidth={2} />
                Spara ändringar
              </button>
            )}
            {nextStage && (
              <button
                onClick={handleAdvance}
                disabled={advanceMutation.isPending}
                className="inline-flex items-center gap-2 rounded-r bg-ink px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-ink-soft disabled:opacity-50"
              >
                <ArrowRight size={14} strokeWidth={2} />
                Flytta till: {STAGE_META[nextStage].label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
