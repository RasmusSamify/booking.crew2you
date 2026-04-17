import { useState } from 'react';
import { MessageSquare, Edit, ArrowRight, Camera } from 'lucide-react';
import type { Booking } from '@/hooks/use-bookings';
import { getPersonnelDisplay } from '@/lib/mock-data';
import { useUpdateBooking, useAdvanceBookingStage } from '@/hooks/use-bookings';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

interface CompleteReportActionProps {
  booking: Booking;
  onClose: () => void;
  onCompleted: () => void;
}

export default function CompleteReportAction({
  booking,
  onClose,
  onCompleted,
}: CompleteReportActionProps) {
  const updateMutation = useUpdateBooking();
  const advanceMutation = useAdvanceBookingStage();
  const [showForm, setShowForm] = useState(false);
  const [reportText, setReportText] = useState('');
  const [actualHours, setActualHours] = useState<number>(booking.timmar);
  const [soldVolume, setSoldVolume] = useState('');

  const personnelNames = getPersonnelDisplay(booking) || 'tilldelad personal';

  const handleSendReminder = () => {
    toast(`Påminnelse-SMS skickat till ${personnelNames} (simulerat)`);
    onClose();
  };

  const handleSaveReport = () => {
    const bodyParts = [
      reportText,
      `Faktiska timmar: ${actualHours} h`,
      soldVolume ? `Såld volym: ${soldVolume}` : '',
    ].filter(Boolean);
    const aterrapport = bodyParts.join('\n');

    updateMutation.mutate(
      { id: booking.id, aterrapport },
      {
        onSuccess: () => {
          advanceMutation.mutate(
            { bookingId: booking.id, targetStage: 'aterrapporterad' },
            {
              onSuccess: () => {
                toast('Återrapport sparad');
                onCompleted();
              },
            }
          );
        },
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="rounded-r border border-border bg-surface-alt px-3 py-2.5 text-[12.5px] text-ink-soft">
        <div>
          <span className="font-semibold">Personal:</span> {personnelNames}
        </div>
        <div>
          <span className="font-semibold">Genomfört:</span>{' '}
          {booking.dagar || booking.anlagd}
        </div>
      </div>

      {!showForm && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col rounded-r border border-border bg-surface p-3.5">
            <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-r-sm bg-amber-bg text-amber">
              <MessageSquare size={15} strokeWidth={2} />
            </div>
            <div className="text-[13px] font-semibold text-ink">
              Påminn personal
            </div>
            <div className="mt-1 flex-1 text-[11.5px] text-ink-muted">
              Skicka SMS-påminnelse till {personnelNames}.
            </div>
            <button
              type="button"
              onClick={handleSendReminder}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-r border border-border-strong bg-surface px-3 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-gold hover:bg-gold-bg"
            >
              Skicka SMS
              <ArrowRight size={13} strokeWidth={2} />
            </button>
          </div>

          <div className="flex flex-col rounded-r border border-border bg-surface p-3.5">
            <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-r-sm bg-gold-bg text-gold-dark">
              <Edit size={15} strokeWidth={2} />
            </div>
            <div className="text-[13px] font-semibold text-ink">
              Fyll i åt dem
            </div>
            <div className="mt-1 flex-1 text-[11.5px] text-ink-muted">
              Fyll i rapporten från kontoret.
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-r bg-gold px-3 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-gold-dark"
            >
              Fyll i
              <ArrowRight size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="space-y-2.5 rounded-r border border-border bg-surface p-3.5">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
              Hur gick det?
            </label>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Beskriv hur uppdraget gick..."
              className={cn(
                'min-h-[100px] w-full resize-y rounded-r border border-border bg-surface px-3 py-2 text-[13px] text-ink focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg'
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                Faktiska timmar
              </label>
              <input
                type="number"
                step={0.5}
                value={actualHours}
                onChange={(e) => setActualHours(Number(e.target.value))}
                className="w-full rounded-r border border-border bg-surface px-3 py-2 text-[13px] text-ink focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                Såld volym
              </label>
              <input
                type="text"
                value={soldVolume}
                onChange={(e) => setSoldVolume(e.target.value)}
                placeholder="Ex: 42 st"
                className="w-full rounded-r border border-border bg-surface px-3 py-2 text-[13px] text-ink focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
              Foto
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-r border border-dashed border-border-strong bg-surface-alt px-3 py-2.5 text-[12.5px] text-ink-muted transition-colors hover:border-gold hover:text-gold">
              <Camera size={14} strokeWidth={2} />
              Välj bild...
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-r px-3 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
            >
              Tillbaka
            </button>
            <button
              type="button"
              onClick={handleSaveReport}
              disabled={
                updateMutation.isPending ||
                advanceMutation.isPending ||
                !reportText.trim()
              }
              className="inline-flex items-center gap-1.5 rounded-r bg-gold px-3 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-50"
            >
              Spara rapport
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-r px-3 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
          >
            Avbryt
          </button>
        </div>
      )}
    </div>
  );
}
