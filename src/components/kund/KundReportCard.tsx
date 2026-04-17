import { useState } from 'react';
import { Camera } from 'lucide-react';
import { cn } from '@/utils/cn';
import { hasPersonnel, getPersonnelDisplay, type Booking } from '@/lib/mock-data';
import type { QualityReview } from '@/lib/mock-data-reviews';
import { QUALITY_QUESTIONS } from '@/lib/mock-data-reviews';
import RatingStars from '@/components/quality/RatingStars';

interface KundReportCardProps {
  booking: Booking;
  review?: QualityReview;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function KundReportCard({ booking, review }: KundReportCardProps) {
  const [expanded, setExpanded] = useState(false);
  const reportText = booking.aterrapport ?? '';
  const truncated = reportText.length > 160;

  return (
    <div className="rounded-r-lg border border-border bg-surface p-5">
      {/* Header */}
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <span className="text-[14px] font-semibold text-ink">{booking.butik}</span>
          <span className="ml-1.5 text-[13px] text-ink-muted">{booking.ort}</span>
        </div>
        <span className="text-[12px] text-ink-muted">{booking.dagar}</span>
      </div>

      {/* Personnel */}
      {hasPersonnel(booking) && (
        <div className="mb-2 flex items-center gap-2">
          {booking.assignedPersonnel.map((ap) => (
            <div key={ap.personnelId} className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
              {getInitials(ap.personnelName)}
            </div>
          ))}
          <span className="text-[12.5px] font-medium text-ink">{getPersonnelDisplay(booking)}</span>
        </div>
      )}

      {/* Product */}
      {booking.produkt && (
        <div className="mb-3 text-[12.5px] text-ink-muted">{booking.produkt}</div>
      )}

      <div className="mb-3 border-t border-border" />

      {/* Report text */}
      {reportText && (
        <div className="mb-3">
          <p className="text-[13px] leading-relaxed text-ink">
            {expanded || !truncated ? reportText : reportText.slice(0, 160) + '...'}
          </p>
          {truncated && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-[12px] font-semibold text-gold-dark hover:underline"
            >
              {expanded ? 'Visa mindre' : 'L\u00e4s hela'}
            </button>
          )}
        </div>
      )}

      {/* Photo placeholder */}
      <div className="mb-4 flex h-[90px] w-[120px] flex-col items-center justify-center rounded-r bg-surface-alt text-ink-faint">
        <Camera size={20} strokeWidth={1.5} />
        <span className="mt-1 text-[10px]">Foto fr&aring;n uppdraget</span>
      </div>

      {/* Sold volume and hours */}
      <div className="mb-3 flex gap-4 text-[12.5px]">
        {booking.timmar > 0 && (
          <span className="text-ink-muted">
            Faktiska timmar: <strong className="font-semibold text-ink">{booking.timmar}h</strong>
          </span>
        )}
      </div>

      {/* Quality review */}
      {review && (
        <div className="rounded-r border border-gold-light bg-gold-bg p-4">
          <div className="mb-2 flex items-center gap-2">
            <RatingStars value={Math.round(review.averageScore)} readOnly size={16} />
            <span className="text-[13px] font-semibold text-ink">{review.averageScore.toFixed(1)}</span>
          </div>

          <div className="space-y-2">
            {QUALITY_QUESTIONS.map((q) => {
              const score = review.scores[q.id] ?? 0;
              return (
                <div key={q.id}>
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-ink-soft">{q.label}</span>
                    <span className="text-[11px] font-semibold text-ink">{score}/5</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gold-light">
                    <div
                      className={cn('h-full rounded-full bg-gold transition-all')}
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {review.overallComment && (
            <p className="mt-3 text-[12px] italic text-ink-soft">
              &ldquo;{review.overallComment}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
