import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

const LABELS: Record<number, string> = {
  1: 'Undermåligt',
  2: 'Bristfälligt',
  3: 'Godkänt',
  4: 'Bra',
  5: 'Utmärkt',
};

interface RatingStarsProps {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}

export default function RatingStars({ value, onChange, size = 24, readOnly = false }: RatingStarsProps) {
  const [hovered, setHovered] = useState(0);

  const display = hovered || value;

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => !readOnly && setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            className={cn(
              'transition-colors',
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            )}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onClick={() => onChange?.(star)}
          >
            <Star
              size={size}
              strokeWidth={1.75}
              className={cn(
                star <= display ? 'text-gold' : 'text-border-strong'
              )}
              fill={star <= display ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
      {display > 0 && (
        <span className="text-xs font-medium text-ink-muted">
          {LABELS[display]}
        </span>
      )}
    </div>
  );
}
