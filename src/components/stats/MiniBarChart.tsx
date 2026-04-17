import { cn } from '@/utils/cn';

interface MiniBarChartProps {
  data: number[];
  maxHeight?: number;
  className?: string;
}

export default function MiniBarChart({ data, maxHeight = 32, className }: MiniBarChartProps) {
  const max = Math.max(...data, 1);

  return (
    <div className={cn('flex items-end gap-px', className)} style={{ height: maxHeight }}>
      {data.map((val, i) => {
        const h = Math.max((val / max) * maxHeight, 2);
        const isLast = i === data.length - 1;
        return (
          <div
            key={i}
            className={cn(
              'flex-1 rounded-t-[2px]',
              isLast ? 'bg-gold' : 'bg-gold-light'
            )}
            style={{ height: h }}
          />
        );
      })}
    </div>
  );
}
