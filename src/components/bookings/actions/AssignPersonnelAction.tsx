import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Booking } from '@/hooks/use-bookings';
import {
  type Personal,
  type AssignedPerson,
} from '@/lib/mock-data';
import { usePersonnel } from '@/hooks/use-personnel';
import { useUpdateBooking, useAdvanceBookingStage } from '@/hooks/use-bookings';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

interface AssignPersonnelActionProps {
  booking: Booking;
  onClose: () => void;
  onAssigned: () => void;
}

function scorePersonnel(booking: Booking, person: Personal): number {
  let score = 50;
  if (person.kompetenser.includes(booking.tjanst)) score += 20;
  if (booking.produkt) {
    const productLower = booking.produkt.toLowerCase();
    if (
      person.specialiteter.some((s) =>
        productLower.includes(s.toLowerCase())
      )
    )
      score += 15;
  }
  if (!person.active) score -= 50;
  score += Math.round((person.betyg - 4) * 10);
  return Math.max(0, Math.min(100, score));
}

function scoreColor(score: number): string {
  if (score >= 80) return 'bg-green-bg text-green';
  if (score >= 65) return 'bg-gold-bg text-gold-dark';
  if (score >= 50) return 'bg-amber-bg text-amber';
  return 'bg-surface-alt text-ink-muted';
}

export default function AssignPersonnelAction({
  booking,
  onClose,
  onAssigned,
}: AssignPersonnelActionProps) {
  const updateMutation = useUpdateBooking();
  const advanceMutation = useAdvanceBookingStage();
  const { data: personnel = [] } = usePersonnel();
  const [manualPick, setManualPick] = useState('');

  const ranked = useMemo(() => {
    return personnel
      .filter((p) => p.active)
      .map((p) => ({ person: p, score: scorePersonnel(booking, p) }))
      .sort((a, b) => b.score - a.score);
  }, [booking, personnel]);

  const topThree = ranked.slice(0, 3);
  const rest = ranked.slice(3).map((r) => r.person);

  const handleAssign = (person: Personal) => {
    const role: AssignedPerson['role'] =
      booking.assignedPersonnel.length === 0 ? 'primary' : 'secondary';
    const newAssigned: AssignedPerson[] = [
      ...booking.assignedPersonnel,
      { personnelId: person.id, personnelName: person.namn, role },
    ];
    updateMutation.mutate(
      { id: booking.id, assignedPersonnel: newAssigned },
      {
        onSuccess: () => {
          const shouldAdvance = ['inkommen', 'bokad', 'bekraftad'].includes(
            booking.stage
          );
          if (shouldAdvance) {
            advanceMutation.mutate(
              { bookingId: booking.id, targetStage: 'personal' },
              {
                onSuccess: () => {
                  toast(
                    `${person.namn} tillsatt · SMS + kalenderinvite skickat (simulerat)`
                  );
                  onAssigned();
                },
              }
            );
          } else {
            toast(
              `${person.namn} tillsatt · SMS + kalenderinvite skickat (simulerat)`
            );
            onAssigned();
          }
        },
      }
    );
  };

  const reasonsFor = (person: Personal): string => {
    const reasons: string[] = [];
    if (booking.region === 'Stockholm' && person.hemort) {
      reasons.push(person.hemort);
    } else {
      reasons.push(person.hemort);
    }
    if (person.specialiteter.length > 0) {
      reasons.push(`${person.specialiteter[0]}-specialist`);
    }
    return reasons.join(' · ');
  };

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-ink-muted">
        Topp 3 kandidater enligt matchning (kompetens, specialitet, betyg).
      </p>

      {topThree.map(({ person, score }, idx) => (
        <div key={person.id}>
          {idx === 0 && (
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.8px] text-gold-dark">
              Bästa match
            </div>
          )}
          <div
            className={cn(
              'flex items-center gap-3 rounded-r border bg-surface p-3',
              idx === 0
                ? 'border-2 border-gold'
                : 'border-border'
            )}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold text-[12px] font-bold text-white">
              {person.initialer}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-ink">
                {person.namn}
              </div>
              <div className="text-[11.5px] text-ink-muted">
                {reasonsFor(person)}
              </div>
            </div>
            <div
              className={cn(
                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-r-sm text-[13px] font-bold',
                scoreColor(score)
              )}
            >
              {score}
            </div>
            <button
              type="button"
              disabled={updateMutation.isPending || advanceMutation.isPending}
              onClick={() => handleAssign(person)}
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-r bg-gold px-3 py-2 text-[12.5px] font-semibold text-white transition-all hover:bg-gold-dark disabled:opacity-50"
            >
              Tillsätt
              <ArrowRight size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      ))}

      {rest.length > 0 && (
        <div className="pt-2">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted">
            Eller välj manuellt
          </label>
          <div className="flex gap-2">
            <select
              value={manualPick}
              onChange={(e) => setManualPick(e.target.value)}
              className="flex-1 appearance-none rounded-r border border-border-strong bg-surface px-3 py-2 text-[13px] text-ink focus:border-gold focus:outline-none"
            >
              <option value="">Välj demovärd...</option>
              {rest.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.namn} — {p.hemort}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!manualPick}
              onClick={() => {
                const p = rest.find((x) => x.id === manualPick);
                if (p) handleAssign(p);
              }}
              className="inline-flex items-center gap-1.5 rounded-r bg-ink px-3 py-2 text-[12.5px] font-semibold text-white transition-all hover:bg-ink-soft disabled:opacity-50"
            >
              Tillsätt
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-r px-3 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}
