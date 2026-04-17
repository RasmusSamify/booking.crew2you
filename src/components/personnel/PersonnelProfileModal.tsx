import { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Check,
  Edit,
  Save,
  CalendarDays,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';
import { isPersonAssigned, type Personal } from '@/lib/mock-data';
import { useQualityReviews } from '@/hooks/use-reviews';
import { useUpdatePersonnel } from '@/hooks/use-personnel';
import { STAGE_META, useAllBookings, type BookingStage, type ServiceType } from '@/hooks/use-bookings';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

const KOMPETENS_CHIP: Record<ServiceType, string> = {
  demo: 'bg-blue-bg text-blue',
  plock: 'bg-violet-bg text-violet',
  sampling: 'bg-pink-bg text-pink',
  event: 'bg-amber-bg text-amber',
};

const STATUS_BADGE: Record<BookingStage, string> = {
  inkommen: 'bg-status-inkommen-bg text-status-inkommen',
  bokad: 'bg-status-bokad-bg text-status-bokad',
  bekraftad: 'bg-status-bekraftad-bg text-status-bekraftad',
  personal: 'bg-status-personal-bg text-status-personal',
  genomford: 'bg-status-genomford-bg text-status-genomford',
  aterrapporterad: 'bg-status-aterrapporterad-bg text-status-aterrapporterad',
  fakturerad: 'bg-status-fakturerad-bg text-status-fakturerad',
};

const inputClass =
  'w-full rounded-r border border-border-strong bg-surface px-3 py-2 text-[13.5px] text-ink transition-all focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg';

interface PersonnelProfileModalProps {
  person: Personal;
  onClose: () => void;
  onToggleActive?: (newActive: boolean) => void;
}

export default function PersonnelProfileModal({ person, onClose, onToggleActive }: PersonnelProfileModalProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...person });
  const { data: allBookings = [] } = useAllBookings();
  const { data: reviews = [] } = useQualityReviews();

  const personBookings = allBookings.filter((b) => isPersonAssigned(b, person.namn));
  const aktivaUppdrag = personBookings.filter(
    (b) => !['genomford', 'aterrapporterad', 'fakturerad'].includes(b.stage)
  ).length;
  const personReviews = reviews.filter((r) => r.personnelId === person.id);

  const set = (field: keyof Personal, value: string | number | string[] | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMutation = useUpdatePersonnel();

  const handleSave = () => {
    updateMutation.mutate(
      { ...form, id: person.id },
      {
        onSuccess: () => {
          if (form.active !== person.active && onToggleActive) {
            onToggleActive(form.active);
          }
          toast(`${form.namn} uppdaterad`);
          setEditing(false);
        },
        onError: (err) => {
          toast(`Kunde inte spara: ${err.message}`);
        },
      }
    );
  };

  const p = editing ? form : person;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-5 backdrop-blur-[4px] animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-r-xl bg-surface shadow-lg animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-[26px] py-[22px]">
          <div className="flex items-center gap-4">
            <div className="flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-full bg-gold text-[17px] font-bold text-white">
              {p.initialer}
            </div>
            <div>
              {editing ? (
                <input
                  value={form.namn}
                  onChange={(e) => set('namn', e.target.value)}
                  className="text-xl font-black tracking-[-0.015em] text-ink border-b-2 border-gold bg-transparent outline-none"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black tracking-[-0.015em] text-ink">
                    {p.namn}
                  </h3>
                  {p.active ? (
                    <span className="inline-flex items-center rounded-[10px] bg-green-bg px-2 py-0.5 text-[10px] font-bold uppercase text-green">
                      Aktiv
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-[10px] bg-red px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Inaktiv
                    </span>
                  )}
                </div>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[13px] text-ink-muted">
                <span className="flex items-center gap-1">
                  <MapPin size={13} strokeWidth={2} />
                  {p.hemort}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={13} strokeWidth={2} className="text-gold" />
                  {p.betyg}/5
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} strokeWidth={2} />
                  {p.erfarenhetAr} år erfarenhet
                </span>
              </div>
            </div>
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
          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Aktiva uppdrag', value: String(aktivaUppdrag) },
              { label: 'Totalt', value: String(p.antalUppdrag) },
              { label: 'Radie', value: `${p.maxRadiusKm} km` },
              { label: 'Betyg', value: `${p.betyg}/5`, gold: true },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-r border border-border bg-surface-alt p-3.5 text-center">
                <div className={cn('text-lg font-bold', kpi.gold ? 'text-gold' : 'text-ink')}>
                  {kpi.value}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-ink-muted">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Inactive warning */}
          {!p.active && (
            <div className="mt-4 flex items-start gap-3 rounded-r border border-amber/30 bg-amber-bg p-3">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber" />
              <p className="text-[13px] leading-relaxed text-ink-soft">
                Denna person är markerad som inaktiv och dyker inte upp i AI-matchning eller bokningsformulärets personal-dropdown.
              </p>
            </div>
          )}

          {/* Active toggle in edit mode */}
          {editing && (
            <div className="mt-4 flex items-center justify-between rounded-r border border-border bg-surface-alt p-3.5">
              <div>
                <div className="text-[13px] font-semibold text-ink">Aktiv status</div>
                <div className="text-[12px] text-ink-muted">Inaktiva personer visas inte i bokningsformuläret</div>
              </div>
              <ToggleSwitch
                checked={form.active}
                onChange={(val) => set('active', val)}
              />
            </div>
          )}

          {/* Detail grid */}
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Kontakt */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">Kontakt</div>
              {editing ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-ink-faint flex-shrink-0" />
                    <input value={form.tel} onChange={(e) => set('tel', e.target.value)} className={inputClass} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-ink-faint flex-shrink-0" />
                    <input value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <a href={`tel:${p.tel}`} className="flex items-center gap-2 text-[13.5px] text-ink hover:text-gold">
                    <Phone size={14} className="text-ink-faint" /> {p.tel}
                  </a>
                  <a href={`mailto:${p.email}`} className="flex items-center gap-2 text-[13.5px] text-ink hover:text-gold">
                    <Mail size={14} className="text-ink-faint" /> {p.email}
                  </a>
                </div>
              )}
            </div>

            {/* Tillgänglighet */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">Tillgänglighet</div>
              {editing ? (
                <select value={form.tillganglighet} onChange={(e) => set('tillganglighet', e.target.value)} className={inputClass}>
                  <option>Heltid</option>
                  <option>Deltid</option>
                  <option>Helger</option>
                  <option>Kvällar</option>
                </select>
              ) : (
                <p className="text-[13.5px] text-ink">{p.tillganglighet}</p>
              )}
            </div>

            {/* Hemort + radie */}
            {editing && (
              <>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">Hemort</div>
                  <input value={form.hemort} onChange={(e) => set('hemort', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">Max radie (km)</div>
                  <input type="number" value={form.maxRadiusKm} onChange={(e) => set('maxRadiusKm', Number(e.target.value))} className={inputClass} />
                </div>
              </>
            )}

            {/* Kompetenser */}
            <div className="col-span-2">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">Kompetenser</div>
              {editing ? (
                <div className="flex flex-wrap gap-1.5">
                  {(['demo', 'plock', 'sampling', 'event'] as ServiceType[]).map((k) => {
                    const active = form.kompetenser.includes(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          set('kompetenser', active
                            ? form.kompetenser.filter((c) => c !== k)
                            : [...form.kompetenser, k]
                          );
                        }}
                        className={cn(
                          'rounded-[10px] px-3 py-1 text-[12px] font-semibold transition-all',
                          active ? 'bg-ink text-white' : 'border border-border bg-surface-alt text-ink-muted'
                        )}
                      >
                        {k}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {p.kompetenser.map((k) => (
                    <span key={k} className={cn('rounded-[10px] px-2.5 py-[3px] text-[11px] font-medium', KOMPETENS_CHIP[k])}>
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Specialiteter */}
            <div className="col-span-2">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">Specialiteter</div>
              {editing ? (
                <input
                  value={form.specialiteter.join(', ')}
                  onChange={(e) => set('specialiteter', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  className={inputClass}
                  placeholder="ost, mejeri, chark (kommaseparerade)"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {p.specialiteter.map((s) => (
                    <span key={s} className="rounded-[10px] border border-border bg-surface-alt px-2.5 py-[3px] text-[11px] font-medium text-ink-soft">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Språk */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">Språk</div>
              {editing ? (
                <input
                  value={form.sprak.join(', ')}
                  onChange={(e) => set('sprak', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  className={inputClass}
                  placeholder="svenska, engelska"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {p.sprak.map((s) => (
                    <span key={s} className="rounded-[10px] border border-border bg-surface-alt px-2.5 py-[3px] text-[11px] font-medium text-ink-soft">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Certifieringar */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">Certifieringar</div>
              {editing ? (
                <input
                  value={form.certifieringar.join(', ')}
                  onChange={(e) => set('certifieringar', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  className={inputClass}
                  placeholder="livsmedelshygien, barista"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {p.certifieringar.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 rounded-[10px] bg-green-bg px-2.5 py-[3px] text-[11px] font-medium text-green">
                      <Check size={11} strokeWidth={2.5} /> {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Anteckningar */}
            <div className="col-span-2">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">Anteckningar</div>
              {editing ? (
                <textarea
                  value={form.anteckningar}
                  onChange={(e) => set('anteckningar', e.target.value)}
                  className={cn(inputClass, 'min-h-[80px] resize-y')}
                />
              ) : p.anteckningar ? (
                <div className="rounded-r border border-gold-light bg-gold-bg p-3.5 text-[13.5px] leading-relaxed text-ink-soft">
                  {p.anteckningar}
                </div>
              ) : (
                <p className="text-[13.5px] text-ink-muted">Inga anteckningar</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-border" />

          {/* Uppdragshistorik */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <CalendarDays size={15} strokeWidth={2} />
              Uppdragshistorik ({personBookings.length})
            </h4>
            {personBookings.length > 0 ? (
              <div className="overflow-hidden rounded-r border border-border">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Datum', 'Butik', 'Kund', 'Status'].map((h) => (
                        <th key={h} className="border-b border-border bg-surface-alt px-[18px] py-3 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {personBookings.slice(0, 6).map((b) => (
                      <tr key={b.id} className="[&:last-child>td]:border-b-0">
                        <td className="border-b border-border px-[18px] py-3 text-[13.5px] text-ink-muted">{b.dagar}</td>
                        <td className="border-b border-border px-[18px] py-3 text-[13.5px] font-semibold text-ink">{b.butik}</td>
                        <td className="border-b border-border px-[18px] py-3 text-[13.5px] text-ink">{b.kund}</td>
                        <td className="border-b border-border px-[18px] py-3">
                          <span className={cn('inline-flex items-center gap-[5px] rounded-[20px] px-2.5 py-[3px] text-[11px] font-semibold', STATUS_BADGE[b.stage])}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {STAGE_META[b.stage].shortLabel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[13.5px] text-ink-muted">Inga uppdrag registrerade.</p>
            )}
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-border" />

          {/* Kvalitetsuppföljningar */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <ClipboardCheck size={15} strokeWidth={2} />
              Kvalitetsuppföljningar ({personReviews.length})
            </h4>
            {personReviews.length > 0 ? (
              <div className="overflow-hidden rounded-r border border-border">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Datum', 'Kund', 'Betyg'].map((h) => (
                        <th key={h} className="border-b border-border bg-surface-alt px-[18px] py-3 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {personReviews.slice(0, 3).map((r) => (
                      <tr key={r.id} className="[&:last-child>td]:border-b-0">
                        <td className="border-b border-border px-[18px] py-3 text-[13.5px] text-ink-muted">{r.date}</td>
                        <td className="border-b border-border px-[18px] py-3 text-[13.5px] font-semibold text-ink">{r.customerName}</td>
                        <td className="border-b border-border px-[18px] py-3">
                          <div className="flex items-center gap-1.5">
                            <Star size={13} strokeWidth={1.75} className="text-gold" fill="currentColor" />
                            <span className="text-[13.5px] font-semibold text-ink">{r.averageScore}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[13.5px] text-ink-muted">Inga uppföljningar ännu</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border bg-surface-alt px-[26px] py-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-r px-4 py-[9px] text-[13.5px] font-semibold text-ink-muted transition-all hover:bg-surface hover:text-ink"
          >
            Stäng
          </button>
          {editing ? (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-dark"
            >
              <Save size={14} strokeWidth={2} />
              Spara ändringar
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-r border border-border-strong px-4 py-[9px] text-[13.5px] font-semibold text-ink transition-all hover:bg-surface-alt"
            >
              <Edit size={14} strokeWidth={2} />
              Redigera profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
