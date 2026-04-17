import { Star } from 'lucide-react';
import { QUALITY_QUESTIONS, type QualityReview } from '@/lib/mock-data-reviews';
import { cn } from '@/utils/cn';

function barColor(score: number): string {
  if (score >= 5) return 'bg-green';
  if (score >= 4) return 'bg-gold';
  if (score >= 2) return 'bg-amber';
  return 'bg-red';
}

interface ReviewCardProps {
  review: QualityReview;
  onView?: () => void;
}

export default function ReviewCard({ review, onView }: ReviewCardProps) {
  const initials = review.personnelName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="overflow-hidden rounded-r-lg border border-border bg-surface transition-colors hover:border-border-strong">
      {/* Header */}
      <div className="border-b border-border px-5 py-3.5">
        <div className="text-xs font-semibold text-ink-muted">
          #{review.reviewNumber} &middot; {review.date}
        </div>
      </div>

      {/* Person + score */}
      <div className="flex items-center gap-3 px-5 py-3.5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-white">
          {initials}
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-semibold text-ink">{review.personnelName}</div>
          <div className="text-[11px] text-ink-muted">
            {review.storeName} &middot; {review.customerName}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} strokeWidth={1.75} className="text-gold" fill="currentColor" />
          <span className="text-sm font-bold text-ink">{review.averageScore}</span>
        </div>
      </div>

      {/* Score bars */}
      <div className="space-y-2 px-5 pb-4">
        {QUALITY_QUESTIONS.map((q) => {
          const score = review.scores[q.id] || 0;
          return (
            <div key={q.id} className="flex items-center gap-2">
              <span className="w-[100px] text-[11px] font-medium text-ink-muted truncate">
                {q.label}
              </span>
              <div className="flex-1 h-2 rounded-full bg-surface-alt overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', barColor(score))}
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
              <span className="w-7 text-right text-[11px] font-semibold text-ink-muted">
                {score}/5
              </span>
            </div>
          );
        })}
      </div>

      {/* Comment */}
      {review.overallComment && (
        <div className="border-t border-border px-5 py-3">
          <p className="text-[12px] leading-relaxed text-ink-muted line-clamp-2">
            {review.overallComment}
          </p>
          {onView && (
            <button
              onClick={onView}
              className="mt-1 text-[12px] font-semibold text-gold-dark hover:text-gold"
            >
              Visa
            </button>
          )}
        </div>
      )}
    </div>
  );
}
