import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Check, Sparkles, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { bookingSchema, type BookingFormValues } from '@/lib/schemas/booking';
import { type AssignedPerson } from '@/lib/mock-data';
import { useAllBookings, useCreateBooking, type BookingStage } from '@/hooks/use-bookings';
import { usePersonnel, type Personal } from '@/hooks/use-personnel';
import { useCustomers } from '@/hooks/use-customers';
import { useStores } from '@/hooks/use-stores';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

const inputClass =
  'w-full rounded-r border border-border-strong bg-surface px-3 py-2.5 text-[13.5px] text-ink transition-all focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg';
const selectClass =
  'w-full appearance-none rounded-r border border-border-strong bg-surface px-3 py-2.5 pr-8 text-[13.5px] text-ink transition-all focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg';
const labelClass = 'mb-[7px] flex items-center gap-1.5 text-xs font-semibold tracking-[0.1px] text-ink-soft';

function AutoDot({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      className="inline-block h-2 w-2 rounded-full bg-gold animate-pulse-gold"
      title="Autoifyllt från register"
    />
  );
}

interface NewBookingModalProps {
  onClose: () => void;
}

function guessRegion(ort: string): string {
  const stockholmOrter = ['stockholm', 'bromma', 'nacka', 'täby', 'solna', 'sundbyberg', 'farsta', 'hägersten', 'kungsholmen', 'södermalm', 'södertälje', 'nykvarn'];
  if (stockholmOrter.includes(ort.toLowerCase())) return 'Stockholm';
  if (ort) return 'Utanför Stockholm';
  return '';
}

function PersonnelMultiSelect({ value, onChange }: { value: AssignedPerson[]; onChange: (val: AssignedPerson[]) => void }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: personnel = [] } = usePersonnel();
  const available = personnel.filter((p) => !value.some((ap) => ap.personnelId === p.id));

  const addPerson = (person: Personal) => {
    const role: AssignedPerson['role'] = value.length === 0 ? 'primary' : 'secondary';
    onChange([...value, { personnelId: person.id, personnelName: person.namn, role }]);
    setShowDropdown(false);
  };

  const removePerson = (personnelId: string) => {
    onChange(value.filter((p) => p.personnelId !== personnelId));
  };

  const toggleRole = (personnelId: string) => {
    onChange(value.map((p) =>
      p.personnelId === personnelId
        ? { ...p, role: p.role === 'primary' ? 'secondary' : 'primary' }
        : p
    ));
  };

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2 space-y-1.5">
          {value.map((ap) => {
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
                <button type="button" onClick={() => removePerson(ap.personnelId)} className="text-ink-faint hover:text-red transition-colors">
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
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center gap-1.5 rounded-r border border-dashed border-border-strong px-3 py-2 text-[12.5px] font-semibold text-ink-muted transition-all hover:border-gold hover:text-gold"
        >
          <Plus size={13} strokeWidth={2} />
          Lägg till demovärd
        </button>
        {showDropdown && (
          <div className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-r-lg border border-border bg-surface shadow-md">
            {available.filter((p) => p.active).map((p) => (
              <button key={p.id} type="button" onClick={() => addPerson(p)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-surface-alt">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">{p.initialer}</div>
                <span className="font-medium text-ink">{p.namn}</span>
                <span className="ml-auto text-[11px] text-ink-muted">{p.hemort}</span>
              </button>
            ))}
            {available.filter((p) => !p.active).map((p) => (
              <button key={p.id} type="button" onClick={() => addPerson(p)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-ink-muted transition-colors hover:bg-surface-alt">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-faint text-[9px] font-bold text-white">{p.initialer}</div>
                <span>{p.namn} (inaktiv)</span>
              </button>
            ))}
            {available.length === 0 && (
              <div className="px-3 py-4 text-center text-[12px] text-ink-muted">All personal redan tilldelad</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewBookingModal({ onClose }: NewBookingModalProps) {
  const createMutation = useCreateBooking();
  const { data: stores = [] } = useStores();
  const { data: customers = [] } = useCustomers();
  const { data: allBookings = [] } = useAllBookings();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      butik: '',
      kontakt: '',
      tel: '',
      ort: '',
      region: 'Stockholm',
      dagar: '',
      timmar: 7,
      kund: '',
      kundKontakt: '',
      tjanst: 'demo',
      assignedPersonnel: [],
      produkt: '',
      material: '',
      info: '',
      ovrigInfo: '',
    },
  });

  const watchButik = watch('butik');
  const watchKund = watch('kund');

  // Auto-fill from butik selection
  const selectedButik = stores.find((b) => b.namn === watchButik);
  const butikAutoFilled = !!selectedButik;

  useEffect(() => {
    if (selectedButik) {
      setValue('ort', selectedButik.ort);
      setValue('region', selectedButik.region !== 'Löpande uppdrag' ? selectedButik.region : guessRegion(selectedButik.ort));
      const primary = selectedButik.kontakter.find((k) => k.isPrimary) || selectedButik.kontakter[0];
      if (primary) {
        setValue('kontakt', primary.namn);
        setValue('tel', primary.tel);
      }
    }
  }, [selectedButik, setValue]);

  // Auto-fill from kund selection
  const selectedKund = customers.find((k) => k.namn === watchKund);
  const kundAutoFilled = !!selectedKund;

  useEffect(() => {
    if (selectedKund) {
      const primary = selectedKund.kontakter.find((k) => k.isPrimary) || selectedKund.kontakter[0];
      if (primary) {
        setValue('kundKontakt', `${primary.namn} ${primary.tel}`);
      }
    }
  }, [selectedKund, setValue]);

  // Smart suggestion: find previous booking for same butik+kund
  const smartSuggestion = useMemo(() => {
    if (!watchButik || !watchKund) return null;
    return allBookings.find(
      (b) => b.butik === watchButik && b.kund === watchKund
    ) || null;
  }, [watchButik, watchKund, allBookings]);

  const applySuggestion = () => {
    if (!smartSuggestion) return;
    setValue('tjanst', smartSuggestion.tjanst);
    setValue('timmar', smartSuggestion.timmar);
    setValue('produkt', smartSuggestion.produkt);
    setValue('material', smartSuggestion.material);
  };

  const onSubmit = (stage: BookingStage) => (data: BookingFormValues) => {
    createMutation.mutate(
      { ...data, stage, utskick: '', aterrapport: undefined },
      {
        onSuccess: (created) => {
          toast(
            stage === 'inkommen'
              ? `Utkast sparat: ${created.butik}`
              : `Bokning skapad: ${created.butik}`
          );
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
            <h3 className="text-[19px] font-bold tracking-[-0.015em] text-ink">
              Nytt uppdrag
            </h3>
            <p className="mt-[3px] text-[13px] text-ink-muted">
              Fyll i uppgifter för ett nytt demouppdrag
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
          <div className="grid grid-cols-2 gap-4">
            {/* Butik */}
            <div className="col-span-2">
              <label className={labelClass}>
                Plats / Butik <AutoDot show={false} />
              </label>
              <select {...register('butik')} className={selectClass}>
                <option value="">— Välj butik —</option>
                {stores.map((b) => (
                  <option key={b.id} value={b.namn}>{b.namn} — {b.ort}</option>
                ))}
                <option value="__ny">+ Ny butik...</option>
              </select>
              {errors.butik && (
                <p className="mt-1 text-xs text-red">{errors.butik.message}</p>
              )}
            </div>

            {/* Kontaktperson */}
            <div>
              <label className={labelClass}>
                Kontaktperson <AutoDot show={butikAutoFilled} />
              </label>
              {selectedButik && selectedButik.kontakter.length > 1 ? (
                <select {...register('kontakt')} className={selectClass}>
                  {selectedButik.kontakter.map((k, i) => (
                    <option key={i} value={k.namn}>{k.namn}{k.isPrimary ? ' (primär)' : ''}</option>
                  ))}
                </select>
              ) : (
                <input {...register('kontakt')} type="text" className={inputClass} placeholder="Ex: Martin" />
              )}
            </div>

            {/* Telefon */}
            <div>
              <label className={labelClass}>
                Telefon <AutoDot show={butikAutoFilled} />
              </label>
              <input {...register('tel')} type="text" className={inputClass} placeholder="08-123456" />
            </div>

            {/* Ort */}
            <div>
              <label className={labelClass}>
                Ort <AutoDot show={butikAutoFilled} />
              </label>
              <input {...register('ort')} type="text" className={inputClass} placeholder="Stockholm" />
              {errors.ort && (
                <p className="mt-1 text-xs text-red">{errors.ort.message}</p>
              )}
            </div>

            {/* Region */}
            <div>
              <label className={labelClass}>
                Region <AutoDot show={butikAutoFilled} />
              </label>
              <select {...register('region')} className={selectClass}>
                <option value="Stockholm">Stockholm</option>
                <option value="Utanför Stockholm">Utanför Stockholm</option>
                <option value="Löpande uppdrag">Löpande uppdrag</option>
              </select>
            </div>

            {/* Datum */}
            <div>
              <label className={labelClass}>Datum / Dagar</label>
              <input {...register('dagar')} type="text" className={inputClass} placeholder="tis 10-18" />
              {errors.dagar && (
                <p className="mt-1 text-xs text-red">{errors.dagar.message}</p>
              )}
            </div>

            {/* Timmar */}
            <div>
              <label className={labelClass}>Antal timmar</label>
              <input
                {...register('timmar', { valueAsNumber: true })}
                type="number"
                step={0.5}
                className={inputClass}
                placeholder="7"
              />
              {errors.timmar && (
                <p className="mt-1 text-xs text-red">{errors.timmar.message}</p>
              )}
            </div>

            {/* Kund */}
            <div className="col-span-2">
              <label className={labelClass}>Kund / Uppdragsgivare</label>
              <select {...register('kund')} className={selectClass}>
                <option value="">— Välj kund —</option>
                {customers.map((k) => (
                  <option key={k.id} value={k.namn}>{k.namn}</option>
                ))}
                <option value="__ny">+ Ny kund...</option>
              </select>
              {errors.kund && (
                <p className="mt-1 text-xs text-red">{errors.kund.message}</p>
              )}
              {selectedKund && (
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-muted">
                  <span>Kontakt: {selectedKund.kontakter.find((k) => k.isPrimary)?.namn}</span>
                  <span>Tel: {selectedKund.kontakter.find((k) => k.isPrimary)?.tel}</span>
                  <span>{selectedKund.kontakter.length} kontakt(er)</span>
                  <span>{allBookings.filter((b) => b.kund === selectedKund.namn).length} tidigare uppdrag</span>
                </div>
              )}
            </div>

            {/* Kundkontakt */}
            <div className="col-span-2">
              <label className={labelClass}>
                Kundkontakt <AutoDot show={kundAutoFilled} />
              </label>
              <input {...register('kundKontakt')} type="text" className={inputClass} placeholder="Jenny Reftegård 072-371 00 31" />
            </div>

            {/* Smart suggestion */}
            {smartSuggestion && (
              <div className="col-span-2 flex items-start gap-3 rounded-r-lg border border-gold-light bg-gold-bg p-4">
                <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-gold-dark" />
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-gold-dark">
                    Tidigare uppdrag hittat hos {smartSuggestion.butik} för {smartSuggestion.kund}
                  </div>
                  <div className="mt-1 text-[12.5px] text-ink-muted">
                    {smartSuggestion.tjanst} &middot; {smartSuggestion.timmar}h &middot; {smartSuggestion.produkt} &middot; {smartSuggestion.material}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="inline-flex items-center gap-1.5 rounded-r bg-gold-dark px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-gold"
                >
                  <RotateCcw size={12} strokeWidth={2} />
                  Återanvänd
                </button>
              </div>
            )}

            {/* Tjänst */}
            <div>
              <label className={labelClass}>Tjänst</label>
              <select {...register('tjanst')} className={selectClass}>
                <option value="demo">demo</option>
                <option value="plock">plock</option>
                <option value="sampling">sampling</option>
                <option value="event">event</option>
              </select>
            </div>

            {/* Personal */}
            <div className="col-span-2">
              <label className={labelClass}>Tilldelad personal</label>
              <PersonnelMultiSelect
                value={watch('assignedPersonnel')}
                onChange={(val) => setValue('assignedPersonnel', val)}
              />
            </div>

            {/* Produkt */}
            <div className="col-span-2">
              <label className={labelClass}>Produkt</label>
              <input {...register('produkt')} type="text" className={inputClass} placeholder="Ex: Hummersoppa" />
            </div>

            {/* Material */}
            <div className="col-span-2">
              <label className={labelClass}>Material</label>
              <input {...register('material')} type="text" className={inputClass} placeholder="Ex: Demofat + skedar + stekplatta" />
            </div>

            {/* Övrig info */}
            <div className="col-span-2">
              <label className={labelClass}>Övrig info</label>
              <textarea
                {...register('ovrigInfo')}
                className={cn(inputClass, 'min-h-[80px] resize-y')}
                placeholder="Särskilda instruktioner..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-surface-alt px-[26px] py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-r bg-transparent px-4 py-2 text-[13.5px] font-semibold text-ink-muted transition-all hover:bg-surface hover:text-ink"
          >
            Avbryt
          </button>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleSubmit(onSubmit('inkommen'))}
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 rounded-r border border-border-strong bg-surface px-4 py-[9px] text-[13.5px] font-semibold text-ink transition-all hover:border-ink hover:bg-surface-alt disabled:opacity-50"
            >
              Spara utkast
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit('bokad'))}
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 rounded-r bg-ink px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-ink-soft disabled:opacity-50"
            >
              <Check size={14} strokeWidth={2} />
              Spara & boka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
