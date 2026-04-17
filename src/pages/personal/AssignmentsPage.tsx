import { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { isPersonAssigned } from '@/lib/mock-data';
import { useAllBookings } from '@/hooks/use-bookings';
import { useCurrentPersonnel } from '@/hooks/use-current-identity';
import AssignmentCard from '@/components/personal/AssignmentCard';

const COMPLETED_STAGES = ['genomford', 'aterrapporterad', 'fakturerad'] as const;

export default function AssignmentsPage() {
  const [showCompleted, setShowCompleted] = useState(false);
  const { data: person } = useCurrentPersonnel();
  const { data: bookings = [] } = useAllBookings();

  const personName = person?.namn ?? 'Stina Bergkvist';
  const minaBokningar = bookings.filter((b) => isPersonAssigned(b, personName));
  const upcoming = minaBokningar.filter((b) => !COMPLETED_STAGES.includes(b.stage as typeof COMPLETED_STAGES[number]));
  const completed = minaBokningar.filter((b) => COMPLETED_STAGES.includes(b.stage as typeof COMPLETED_STAGES[number]));

  return (
    <div>
      {/* Upcoming */}
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={16} className="text-ink-muted" />
        <h2 className="text-[14px] font-bold text-ink">Kommande uppdrag</h2>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-sm text-ink-muted py-4">Inga kommande uppdrag</p>
      ) : (
        upcoming.map((b) => <AssignmentCard key={b.id} booking={b} />)
      )}

      {/* Completed - accordion */}
      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="flex items-center gap-2 w-full mt-6 mb-3 active:opacity-90"
      >
        <h2 className="text-[14px] font-bold text-ink">
          Genomforda uppdrag ({completed.length})
        </h2>
        <ChevronDown
          size={16}
          className={cn(
            'text-ink-muted transition-transform duration-200',
            showCompleted && 'rotate-180'
          )}
        />
      </button>

      {showCompleted &&
        completed.map((b) => (
          <div key={b.id} className="opacity-60">
            <AssignmentCard booking={b} />
          </div>
        ))}
    </div>
  );
}
