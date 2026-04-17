import { useAllBookings } from '@/hooks/use-bookings';
import { useStores } from '@/hooks/use-stores';
import { cn } from '@/utils/cn';

export default function StoreHeatmap() {
  const { data: bookings = [] } = useAllBookings();
  const { data: stores = [] } = useStores();

  const countMap: Record<string, number> = {};
  for (const b of bookings) {
    countMap[b.butik] = (countMap[b.butik] || 0) + 1;
  }

  const max = Math.max(...Object.values(countMap), 1);

  function intensity(count: number): string {
    const ratio = count / max;
    if (ratio >= 0.7) return 'bg-gold text-white';
    if (ratio >= 0.35) return 'bg-gold-light text-ink';
    return 'bg-gold-bg text-ink-soft';
  }

  return (
    <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
      <div className="border-b border-border px-[22px] py-[18px]">
        <h2 className="text-[15px] font-bold tracking-[-0.01em] text-ink">
          Butiker (heatmap)
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-2 p-[22px]">
        {stores.map((store) => {
          const count = countMap[store.namn] || 0;
          return (
            <div
              key={store.id}
              className={cn(
                'flex flex-col items-center justify-center rounded-r p-3 text-center transition-colors',
                intensity(count)
              )}
            >
              <span className="text-[11px] font-medium leading-tight line-clamp-2">
                {store.namn.length > 16 ? store.namn.slice(0, 14) + '...' : store.namn}
              </span>
              <span className="mt-1 text-sm font-bold">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
