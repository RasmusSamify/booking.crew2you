import { useState } from 'react';
import { X, MessageSquare, Star } from 'lucide-react';
import RatingStars from './RatingStars';
import { QUALITY_QUESTIONS, type QualityReview } from '@/lib/mock-data-reviews';
import { getPrimaryPersonnel, getPersonnelDisplay, type Booking } from '@/lib/mock-data';
import { usePersonnel } from '@/hooks/use-personnel';
import { useQualityReviews, useCreateReview } from '@/hooks/use-reviews';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

interface QualityReviewModalProps {
  booking?: Booking;
  isReadOnly?: boolean;
  existingReview?: QualityReview;
  onClose: () => void;
  onSave?: () => void;
}

export default function QualityReviewModal({
  booking,
  isReadOnly = false,
  existingReview,
  onClose,
  onSave,
}: QualityReviewModalProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    existingReview?.scores || {}
  );
  const [comments, setComments] = useState<Record<string, string>>(
    existingReview?.comments || {}
  );
  const [overallComment, setOverallComment] = useState(
    existingReview?.overallComment || ''
  );
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set(Object.keys(existingReview?.comments || {}))
  );
  const { data: personnelList = [] } = usePersonnel();
  const { data: allReviews = [] } = useQualityReviews();
  const createReviewMutation = useCreateReview();

  const answeredCount = QUALITY_QUESTIONS.filter((q) => scores[q.id] > 0).length;
  const allAnswered = answeredCount === QUALITY_QUESTIONS.length;
  const avgScore = allAnswered
    ? Math.round(
        (Object.values(scores).reduce((a, b) => a + b, 0) / QUALITY_QUESTIONS.length) * 10
      ) / 10
    : 0;

  const reviewNumber = existingReview?.reviewNumber || allReviews.length + 1;

  const primaryAp = booking ? getPrimaryPersonnel(booking) : null;
  const personnel = primaryAp
    ? personnelList.find((p) => p.id === primaryAp.personnelId)
    : null;

  function handleSave() {
    if (!booking || !allAnswered) return;

    createReviewMutation.mutate(
      {
        bookingId: booking.id,
        personnelId: personnel?.id || primaryAp?.personnelId || '',
        reviewNumber,
        scores,
        comments: Object.fromEntries(
          Object.entries(comments).filter(([, v]) => v.trim())
        ),
        overallComment,
        averageScore: avgScore,
      },
      {
        onSuccess: () => {
          toast('Kvalitetsuppföljning sparad');
          onSave?.();
          onClose();
        },
        onError: (err) => {
          toast(`Kunde inte spara: ${(err as Error).message}`);
        },
      }
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-5 backdrop-blur-[4px] animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[90vh] w-full max-w-[640px] flex-col overflow-hidden rounded-r-xl bg-surface shadow-lg animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-[26px] py-[22px]">
          <div>
            <h3 className="text-lg font-black tracking-[-0.015em] text-ink">
              Kvalitetsuppföljning #{reviewNumber}
            </h3>
            {booking && (
              <div className="mt-1 space-y-0.5 text-[13px] text-ink-muted">
                <div>{booking.butik} &middot; {booking.kund}</div>
                <div>{getPersonnelDisplay(booking)} &middot; {booking.dagar}</div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-r bg-surface-alt text-ink-muted transition-all hover:bg-border hover:text-ink"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[26px] py-6 space-y-6">
          {QUALITY_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="space-y-2">
              <div>
                <div className="text-[13.5px] font-bold text-ink">
                  {idx + 1}. {q.label}
                </div>
                <div className="text-sm text-ink-muted">{q.description}</div>
              </div>
              <RatingStars
                value={scores[q.id] || 0}
                onChange={
                  isReadOnly
                    ? undefined
                    : (v) => setScores((prev) => ({ ...prev, [q.id]: v }))
                }
                readOnly={isReadOnly}
              />
              {isReadOnly ? (
                comments[q.id] && (
                  <div className="rounded-r border border-border bg-surface-alt p-3 text-[13px] text-ink-soft">
                    {comments[q.id]}
                  </div>
                )
              ) : (
                <>
                  {!expandedComments.has(q.id) ? (
                    <button
                      onClick={() =>
                        setExpandedComments((prev) => new Set(prev).add(q.id))
                      }
                      className="flex items-center gap-1.5 text-[12px] font-medium text-ink-muted hover:text-ink"
                    >
                      <MessageSquare size={12} strokeWidth={2} />
                      Lägg till kommentar
                    </button>
                  ) : (
                    <textarea
                      value={comments[q.id] || ''}
                      onChange={(e) =>
                        setComments((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="Valfri kommentar..."
                      className="w-full rounded-r border border-border bg-surface-alt p-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none"
                      rows={2}
                    />
                  )}
                </>
              )}
            </div>
          ))}

          {/* Overall comment */}
          <div>
            <div className="mb-2 text-[13.5px] font-bold text-ink">
              Övergripande kommentar
            </div>
            {isReadOnly ? (
              <div className="rounded-r border border-border bg-surface-alt p-3 text-[13px] text-ink-soft">
                {overallComment || 'Ingen kommentar'}
              </div>
            ) : (
              <textarea
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                placeholder="Sammanfattning av uppföljningen..."
                className="w-full rounded-r border border-border bg-surface-alt p-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none"
                rows={3}
              />
            )}
          </div>
        </div>

        {/* Summary bar */}
        {!isReadOnly && (
          <div className="border-t border-border bg-gold-bg px-[26px] py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-ink">
                  Snittpoäng: {allAnswered ? avgScore : '–'} / 5.0
                </span>
                {allAnswered && (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        strokeWidth={1.75}
                        className={s <= Math.round(avgScore) ? 'text-gold' : 'text-border-strong'}
                        fill={s <= Math.round(avgScore) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[12px] text-ink-muted">
                {answeredCount} av 7 frågor besvarade
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border bg-surface-alt px-[26px] py-4">
          {isReadOnly ? (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-r border border-border-strong px-4 py-[9px] text-[13.5px] font-semibold text-ink transition-all hover:bg-surface hover:text-ink"
            >
              Stäng
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-r px-4 py-[9px] text-[13.5px] font-semibold text-ink-muted transition-all hover:bg-surface hover:text-ink"
              >
                Avbryt
              </button>
              <button
                onClick={handleSave}
                disabled={!allAnswered || createReviewMutation.isPending}
                className={cn(
                  'inline-flex items-center gap-2 rounded-r px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all',
                  allAnswered
                    ? 'bg-gold hover:bg-gold-dark'
                    : 'cursor-not-allowed bg-gold/40'
                )}
              >
                Spara uppföljning
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
