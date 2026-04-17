import { useAllBookings } from '@/hooks/use-bookings';

export default function CustomerBreakdown() {
  const { data: bookings = [] } = useAllBookings();

  const countMap: Record<string, number> = {};
  for (const b of bookings) {
    countMap[b.kund] = (countMap[b.kund] || 0) + 1;
  }

  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1]);
  const max = sorted.length > 0 ? sorted[0][1] : 1;
  const total = sorted.reduce((s, [, c]) => s + c, 0);

  return (
    <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
      <div className="border-b border-border px-[22px] py-[18px]">
        <h2 className="text-[15px] font-bold tracking-[-0.01em] text-ink">
          Bokningar per kund
        </h2>
      </div>
      <div className="px-[22px] py-4 space-y-3">
        {sorted.map(([name, count]) => (
          <div key={name}>
            <div className="mb-1 flex items-center justify-between text-[13px]">
              <span className="font-medium text-ink">{name}</span>
              <span className="font-semibold text-ink-muted">{count}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-alt">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-light to-gold transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-[22px] py-4">
        <div className="text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted mb-2">
          Topp-kunder
        </div>
        <div className="space-y-1">
          {sorted.slice(0, 3).map(([name, count]) => (
            <div key={name} className="flex items-center justify-between text-[12px]">
              <span className="text-ink-soft">{name}</span>
              <span className="font-semibold text-ink-muted">
                {Math.round((count / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
