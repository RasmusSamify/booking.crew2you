import { useMemo, useState } from 'react';
import { MailCheck, Edit, AlertCircle } from 'lucide-react';
import type { Booking } from '@/hooks/use-bookings';
import { hasPersonnel, getPersonnelDisplay } from '@/lib/mock-data';
import { useAdvanceBookingStage } from '@/hooks/use-bookings';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';
import type { IssueType } from '@/lib/issue-detection';

interface SendConfirmationActionProps {
  booking: Booking;
  onClose: () => void;
  onSent: () => void;
  onSwitchAction?: (type: IssueType) => void;
}

function buildEmailBody(booking: Booking): string {
  const personnelLine = hasPersonnel(booking)
    ? `Demovärd: ${getPersonnelDisplay(booking)}`
    : 'Demovärd: (ej tilldelad än)';

  return `Hej ${booking.kontakt}!

Härmed bekräftar vi uppdraget i ${booking.butik}.

Datum: ${booking.dagar}
Timmar: ${booking.timmar} h
Tjänst: ${booking.tjanst}
Produkt: ${booking.produkt || '–'}
${personnelLine}

Material: ${booking.material || '–'}
${booking.ovrigInfo ? `\nÖvrig info: ${booking.ovrigInfo}` : ''}

Hör av dig vid frågor!

Vänliga hälsningar,
Crew2you`;
}

export default function SendConfirmationAction({
  booking,
  onClose,
  onSent,
  onSwitchAction,
}: SendConfirmationActionProps) {
  const advanceMutation = useAdvanceBookingStage();
  const initialBody = useMemo(() => buildEmailBody(booking), [booking]);
  const [emailText, setEmailText] = useState(initialBody);
  const [isEditing, setIsEditing] = useState(false);

  const toEmail = `${booking.kontakt.toLowerCase().replace(/\s+/g, '.')}@butik.se`;
  const ccEmail = booking.kundKontakt
    ? `${booking.kundKontakt.split(' ')[0].toLowerCase()}@kund.se`
    : '';
  const subject = `Bekräftelse — ${booking.tjanst} ${booking.produkt} ${booking.dagar}`.trim();

  const handleSend = () => {
    advanceMutation.mutate(
      { bookingId: booking.id, targetStage: 'bekraftad' },
      {
        onSuccess: () => {
          toast(`Bekräftelse skickad till ${toEmail} (simulerat)`);
          onSent();
        },
      }
    );
  };

  return (
    <div className="space-y-3">
      {!hasPersonnel(booking) && (
        <div className="flex items-start gap-2.5 rounded-r border border-amber/30 bg-amber-bg p-3">
          <AlertCircle
            size={16}
            strokeWidth={2}
            className="mt-0.5 flex-shrink-0 text-amber"
          />
          <div className="flex-1 text-[12.5px] text-ink-soft">
            <div className="font-semibold text-amber">
              Personal ej tilldelad
            </div>
            <div className="mt-0.5">
              Demovärd-raden lämnas tom i mailet.{' '}
              {onSwitchAction && (
                <button
                  type="button"
                  onClick={() => onSwitchAction('missing_personnel')}
                  className="font-semibold text-gold-dark underline-offset-2 hover:underline"
                >
                  Tilldela först?
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-r border border-border bg-surface">
        <div className="space-y-1 border-b border-border bg-surface-alt px-3 py-2.5 text-[12px]">
          <div className="flex gap-2">
            <span className="w-14 font-semibold text-ink-muted">Till:</span>
            <span className="text-ink">{toEmail}</span>
          </div>
          {ccEmail && (
            <div className="flex gap-2">
              <span className="w-14 font-semibold text-ink-muted">Cc:</span>
              <span className="text-ink">{ccEmail}</span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="w-14 font-semibold text-ink-muted">Ämne:</span>
            <span className="font-medium text-ink">{subject}</span>
          </div>
        </div>
        <div className="px-3 py-3">
          {isEditing ? (
            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              className={cn(
                'min-h-[200px] w-full resize-y rounded-r border border-border bg-surface px-3 py-2 text-[12.5px] leading-relaxed text-ink focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg'
              )}
            />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-[12.5px] leading-relaxed text-ink-soft">
              {emailText}
            </pre>
          )}
        </div>
      </div>

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
          onClick={() => setIsEditing((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-r border border-border-strong bg-surface px-3 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:bg-surface-alt"
        >
          <Edit size={13} strokeWidth={2} />
          {isEditing ? 'Förhandsvisa' : 'Redigera'}
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={advanceMutation.isPending}
          className="inline-flex items-center gap-1.5 rounded-r bg-gold px-3 py-2 text-[12.5px] font-semibold text-white transition-all hover:bg-gold-dark disabled:opacity-50"
        >
          <MailCheck size={13} strokeWidth={2} />
          Skicka bekräftelse
        </button>
      </div>
    </div>
  );
}
