import { MapPin } from 'lucide-react';
import type { Personal } from '@/lib/mock-data';
import type { ServiceType } from '@/hooks/use-bookings';
import { cn } from '@/utils/cn';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

const KOMPETENS_CHIP: Record<ServiceType, string> = {
  demo: 'bg-blue-bg text-blue',
  plock: 'bg-violet-bg text-violet',
  sampling: 'bg-pink-bg text-pink',
  event: 'bg-amber-bg text-amber',
};

function renderStars(betyg: number): string {
  const full = Math.floor(betyg);
  const half = betyg - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '\u2605'.repeat(full) + (half ? '\u2605' : '') + '\u2606'.repeat(empty);
}

interface PersonnelCardProps {
  person: Personal;
  aktivaUppdrag: number;
  onClick: () => void;
  onToggleActive: (person: Personal, newActive: boolean) => void;
}

export default function PersonnelCard({ person, aktivaUppdrag, onClick, onToggleActive }: PersonnelCardProps) {
  const visibleSpec = person.specialiteter.slice(0, 3);
  const extraSpec = person.specialiteter.length - 3;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex w-full flex-col gap-3 rounded-r-lg border border-border bg-surface p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm',
        !person.active && 'opacity-50'
      )}
    >
      {/* Toggle in top-right corner */}
      <div
        className="absolute right-4 top-4"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ToggleSwitch
          checked={person.active}
          onChange={(newActive) => {
            onToggleActive(person, newActive);
          }}
        />
      </div>

      {/* Top row: avatar + name + rating */}
      <div className="flex items-start gap-3 pr-12">
        <div className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-full bg-gold text-[14px] font-bold text-white">
          {person.initialer}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 truncate text-[15px] font-bold text-ink">
              {person.namn}
              {person.active ? (
                <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green" />
              ) : (
                <span className="inline-flex flex-shrink-0 items-center rounded-[10px] bg-red px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                  Inaktiv
                </span>
              )}
            </span>
            <span className="flex-shrink-0 text-[13px]">
              <span className="text-gold">{renderStars(person.betyg)}</span>
              <span className="ml-1 text-ink-muted">{person.betyg}</span>
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
            <MapPin size={12} strokeWidth={2} />
            {person.hemort}
          </div>
        </div>
      </div>

      {/* Kompetenser */}
      <div className="flex flex-wrap gap-1.5">
        {person.kompetenser.map((k) => (
          <span
            key={k}
            className={cn(
              'rounded-[10px] px-2 py-[2px] text-[11px] font-medium',
              KOMPETENS_CHIP[k]
            )}
          >
            {k}
          </span>
        ))}
      </div>

      {/* Specialiteter */}
      <div className="flex flex-wrap gap-1.5">
        {visibleSpec.map((s) => (
          <span
            key={s}
            className="rounded-[10px] border border-border bg-surface-alt px-2 py-[2px] text-[11px] font-medium text-ink-soft"
          >
            {s}
          </span>
        ))}
        {extraSpec > 0 && (
          <span className="rounded-[10px] border border-border bg-surface-alt px-2 py-[2px] text-[11px] font-medium text-ink-faint">
            +{extraSpec}
          </span>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-center gap-3 border-t border-border pt-3 text-xs text-ink-muted">
        <span className="font-semibold text-ink-soft">{aktivaUppdrag} aktiva</span>
        <span>Radie: {person.maxRadiusKm}km</span>
        <span className="truncate">{person.tillganglighet}</span>
      </div>
    </button>
  );
}
