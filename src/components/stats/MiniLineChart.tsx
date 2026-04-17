import { cn } from '@/utils/cn';

interface MiniLineChartProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

export default function MiniLineChart({ data, width = 600, height = 120, className }: MiniLineChartProps) {
  if (data.length < 2) return null;

  const padding = 12;
  const minVal = Math.min(...data) - 0.1;
  const maxVal = Math.max(...data) + 0.1;
  const range = maxVal - minVal || 1;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const areaPoints = [
    `${points[0].x},${height - padding}`,
    ...points.map((p) => `${p.x},${p.y}`),
    `${points[points.length - 1].x},${height - padding}`,
  ].join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-full', className)}
      preserveAspectRatio="none"
    >
      <polygon points={areaPoints} fill="#faf4e3" />
      <polyline
        points={polylinePoints}
        fill="none"
        stroke="#c4a758"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#c4a758" stroke="#ffffff" strokeWidth="2" />
      ))}
    </svg>
  );
}
