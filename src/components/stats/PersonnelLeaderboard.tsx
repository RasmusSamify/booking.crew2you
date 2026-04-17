import { Crown, Star } from 'lucide-react';
import { isPersonAssigned, type Personal } from '@/lib/mock-data';
import { useAllBookings } from '@/hooks/use-bookings';
import { usePersonnel } from '@/hooks/use-personnel';
import { useQualityReviews } from '@/hooks/use-reviews';
import MiniBarChart from './MiniBarChart';
import { cn } from '@/utils/cn';

interface PersonnelLeaderboardProps {
  onPersonClick: (person: Personal) => void;
}

interface LeaderboardEntry {
  person: Personal;
  uppdrag: number;
  timmar: number;
  avgScore: number;
  reviewCount: number;
  sparkData: number[];
}

export default function PersonnelLeaderboard({ onPersonClick }: PersonnelLeaderboardProps) {
  const { data: personnel = [] } = usePersonnel();
  const { data: bookings = [] } = useAllBookings();
  const { data: allReviews = [] } = useQualityReviews();

  const entries: LeaderboardEntry[] = personnel
    .map((p) => {
      const personBookings = bookings.filter((b) => isPersonAssigned(b, p.namn));
      const reviews = allReviews.filter((r) => r.personnelId === p.id);
      const avgScore =
        reviews.length > 0
          ? Math.round((reviews.reduce((s, r) => s + r.averageScore, 0) / reviews.length) * 10) / 10
          : p.betyg;
      const timmar = personBookings.reduce((s, b) => s + b.timmar, 0);
      // Generate spark data from booking hours spread
      const sparkData = [
        Math.round(timmar * 0.1),
        Math.round(timmar * 0.15),
        Math.round(timmar * 0.12),
        Math.round(timmar * 0.2),
      ];
      return { person: p, uppdrag: personBookings.length, timmar, avgScore, reviewCount: reviews.length, sparkData };
    })
    .sort((a, b) => {
      // Active persons first, then sort by avg score desc, then uppdrag desc
      if (a.person.active !== b.person.active) return a.person.active ? -1 : 1;
      if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
      return b.uppdrag - a.uppdrag;
    });

  const RANK_COLORS: Record<number, string> = {
    0: 'text-gold',
    1: 'text-ink-faint',
    2: 'text-amber',
  };

  return (
    <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
      <div className="border-b border-border px-[22px] py-[18px]">
        <h2 className="text-[15px] font-bold tracking-[-0.01em] text-ink">
          Personalranking
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['#', 'Person', 'Status', 'Uppdrag', 'Timmar', 'Betyg', 'Trend'].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap border-b border-border bg-surface-alt px-[14px] py-3 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr
                key={entry.person.id}
                onClick={() => onPersonClick(entry.person)}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-surface-alt [&:last-child>td]:border-b-0',
                  !entry.person.active && 'opacity-60'
                )}
              >
                <td className="border-b border-border px-[14px] py-3 text-center">
                  {idx < 3 && entry.person.active ? (
                    <Crown
                      size={16}
                      strokeWidth={2}
                      className={cn(RANK_COLORS[idx])}
                      fill="currentColor"
                    />
                  ) : (
                    <span className="text-[13px] font-medium text-ink-muted">{idx + 1}</span>
                  )}
                </td>
                <td className="border-b border-border px-[14px] py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-white">
                      {entry.person.initialer}
                    </div>
                    <span className="text-[13.5px] font-semibold text-ink">
                      {entry.person.namn}
                    </span>
                  </div>
                </td>
                <td className="border-b border-border px-[14px] py-3">
                  <span
                    className={cn(
                      'inline-block h-2.5 w-2.5 rounded-full',
                      entry.person.active ? 'bg-green' : 'bg-red'
                    )}
                    title={entry.person.active ? 'Aktiv' : 'Inaktiv'}
                  />
                </td>
                <td className="border-b border-border px-[14px] py-3 text-[13.5px] text-ink">
                  {entry.uppdrag}
                </td>
                <td className="border-b border-border px-[14px] py-3 text-[13.5px] text-ink">
                  {entry.timmar}h
                </td>
                <td className="border-b border-border px-[14px] py-3">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} strokeWidth={1.75} className="text-gold" fill="currentColor" />
                    <span className="text-[13.5px] font-semibold text-ink">{entry.avgScore}</span>
                  </div>
                </td>
                <td className="border-b border-border px-[14px] py-3">
                  <div className="w-16">
                    <MiniBarChart data={entry.sparkData} maxHeight={20} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
