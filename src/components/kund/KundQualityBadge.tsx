import { Star } from 'lucide-react';

interface KundQualityBadgeProps {
  score: number;
}

export default function KundQualityBadge({ score }: KundQualityBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[10px] bg-gold-bg px-2 py-0.5 text-[11px] font-semibold text-gold-dark">
      <Star size={10} strokeWidth={2} fill="currentColor" />
      {score.toFixed(1)}
    </span>
  );
}
