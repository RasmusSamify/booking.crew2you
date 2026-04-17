import { useState } from 'react';
import { Zap, Send, Check, AlertTriangle } from 'lucide-react';
import type { InboxEmail, Confidence } from '@/lib/mock-data-inbox';
import ConfidenceBadge from './ConfidenceBadge';
import { useCreateBooking } from '@/hooks/use-bookings';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

const BORDER_COLOR: Record<Confidence, string> = {
  high: 'border-l-green',
  medium: 'border-l-gold',
  low: 'border-l-red',
};

interface EmailDetailModalProps {
  email: InboxEmail;
  onStatusChange: () => void;
}

export default function EmailDetailModal({ email, onStatusChange }: EmailDetailModalProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState(email.autoReplyDraft ?? '');
  const createBooking = useCreateBooking();

  const handleCreateBooking = () => {
    const field = (label: string) =>
      email.parsedFields.find((f) => f.label === label)?.value ?? '';

    createBooking.mutate(
      {
        butik: field('Butik'),
        kontakt: field('Butikskontakt').split(' ')[0] || '',
        tel: field('Butikskontakt').split(' ').slice(1).join(' ') || '',
        ort: '',
        region: field('Region') || 'Stockholm',
        dagar: field('Datum'),
        timmar: Number(field('Timmar')) || 7,
        kund: field('Kund'),
        kundKontakt: field('Kundkontakt'),
        tjanst: (field('Tjänst') as 'demo' | 'plock' | 'sampling' | 'event') || 'demo',
        assignedPersonnel: [],
        produkt: field('Produkt'),
        material: field('Material'),
        info: '',
        ovrigInfo: '',
        stage: 'inkommen',
      },
      {
        onSuccess: () => {
          email.status = 'booked';
          toast(`Bokning skapad från mail: ${field('Butik') || email.subject}`);
          onStatusChange();
        },
      },
    );
  };

  const handleSendReply = () => {
    email.status = 'awaiting_reply';
    toast('Kompletteringsmail skickat');
    setShowReply(false);
    onStatusChange();
  };

  const handleIgnore = () => {
    email.status = 'ignored';
    toast('Mail ignorerat');
    onStatusChange();
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Original email */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] text-ink-muted">
              Från: <span className="font-semibold text-ink">{email.from.name}</span>{' '}
              &lt;{email.from.email}&gt;
            </p>
            <h3 className="mt-1 text-[15px] font-bold text-ink">{email.subject}</h3>
          </div>
          <span className="flex-shrink-0 text-[11px] text-ink-muted">{email.receivedAt}</span>
        </div>
        <pre className="mt-4 whitespace-pre-wrap font-[Montserrat] text-[13px] leading-relaxed text-ink-soft">
          {email.body}
        </pre>
      </div>

      {/* AI parsed fields */}
      <div className="flex-1 px-6 py-5">
        <div className="mb-4 flex items-center gap-2">
          <Zap size={14} className="text-gold-dark" />
          <span className="text-[13px] font-bold text-ink">AI-extraherade uppgifter</span>
          <span className="rounded-[10px] bg-gold-bg px-2 py-[2px] text-[9px] font-bold tracking-[0.3px] text-gold-dark">
            Samify AI
          </span>
        </div>

        {email.parsedFields.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            {email.parsedFields.map((field, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-r border-l-[3px] bg-surface-alt px-3 py-2.5',
                  BORDER_COLOR[field.confidence],
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3px] text-ink-muted">
                    {field.label}
                  </span>
                  <ConfidenceBadge confidence={field.confidence} />
                </div>
                <p className="mt-0.5 text-[13px] font-medium text-ink">{field.value}</p>
              </div>
            ))}
          </div>
        )}

        {email.missingFields.length > 0 && (
          <div className="mt-4 rounded-r border border-red/20 bg-red/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-red" />
              <span className="text-[12px] font-semibold text-red">
                Saknade uppgifter
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-ink-soft">
              {email.missingFields.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Auto-reply preview */}
      {showReply && email.autoReplyDraft && (
        <div className="border-t border-border px-6 py-4">
          <p className="mb-2 text-[12px] font-semibold text-ink-muted">
            Kompletteringsmail (redigera vid behov)
          </p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full rounded-r border border-border-strong bg-surface px-3 py-2.5 text-[13px] text-ink focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg"
            rows={8}
          />
          <div className="mt-2.5 flex justify-end">
            <button
              onClick={handleSendReply}
              className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-gold-dark"
            >
              <Send size={14} strokeWidth={2} />
              Skicka
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {email.status !== 'booked' && email.status !== 'ignored' && email.status !== 'awaiting_reply' && (
        <div className="sticky bottom-0 flex items-center gap-2.5 border-t border-border bg-surface px-6 py-4">
          {email.parseStatus === 'complete' && (
            <>
              <button
                onClick={handleCreateBooking}
                disabled={createBooking.isPending}
                className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-gold-dark disabled:opacity-50"
              >
                <Check size={14} strokeWidth={2} />
                Skapa bokning
              </button>
              <button
                onClick={() => toast('Redigering inte implementerad i demo')}
                className="inline-flex items-center gap-2 rounded-r border border-border-strong bg-surface px-4 py-2 text-[13px] font-semibold text-ink transition-all hover:bg-surface-alt"
              >
                Redigera innan
              </button>
            </>
          )}
          {email.parseStatus === 'partial' && (
            <>
              <button
                onClick={() => setShowReply(!showReply)}
                className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-gold-dark"
              >
                <Send size={14} strokeWidth={2} />
                Skicka kompletteringsmail
              </button>
              <button
                onClick={handleCreateBooking}
                disabled={createBooking.isPending}
                className="inline-flex items-center gap-2 rounded-r border border-border-strong bg-surface px-4 py-2 text-[13px] font-semibold text-ink transition-all hover:bg-surface-alt disabled:opacity-50"
              >
                Skapa ändå
              </button>
            </>
          )}
          {email.parseStatus === 'incomplete' && (
            <>
              <button
                onClick={() => setShowReply(!showReply)}
                className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-gold-dark"
              >
                <Send size={14} strokeWidth={2} />
                Skicka kompletteringsmail
              </button>
              <button
                onClick={handleIgnore}
                className="inline-flex items-center gap-2 rounded-r bg-transparent px-4 py-2 text-[13px] font-semibold text-red transition-all hover:bg-red/5"
              >
                Ignorera
              </button>
            </>
          )}
        </div>
      )}

      {/* Status indicator for already-handled emails */}
      {(email.status === 'booked' || email.status === 'awaiting_reply' || email.status === 'ignored') && (
        <div className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-surface-alt px-6 py-4">
          <Check size={14} className="text-ink-muted" />
          <span className="text-[13px] font-medium text-ink-muted">
            {email.status === 'booked' && 'Bokning skapad'}
            {email.status === 'awaiting_reply' && 'Kompletteringsmail skickat'}
            {email.status === 'ignored' && 'Mail ignorerat'}
          </span>
        </div>
      )}
    </div>
  );
}
