import { Package, Car, Coffee, MoreHorizontal, CircleParking } from 'lucide-react';
import type { PersonalExpense } from '@/lib/mock-data';
import { useAllBookings } from '@/hooks/use-bookings';

const TYPE_CONFIG: Record<PersonalExpense['type'], { label: string; icon: React.ReactNode }> = {
  material: { label: 'Material', icon: <Package size={16} /> },
  milersattning: { label: 'Milersattning', icon: <Car size={16} /> },
  parkering: { label: 'Parkering', icon: <CircleParking size={16} /> },
  mat_fika: { label: 'Mat & fika', icon: <Coffee size={16} /> },
  ovrigt: { label: 'Ovrigt', icon: <MoreHorizontal size={16} /> },
};

interface ExpenseCardProps {
  expense: PersonalExpense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const config = TYPE_CONFIG[expense.type];
  const { data: bookings = [] } = useAllBookings();
  const booking = bookings.find((b) => b.id === expense.bookingId);

  return (
    <div className="bg-surface rounded-r-lg border border-border p-4 mb-3">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink-muted">
            {config.icon}
          </div>
          <div>
            <p className="font-semibold text-[13px] text-ink">
              {expense.type === 'milersattning' ? 'Milersattning' : config.label}
            </p>
            <p className="text-xs text-ink-muted">{expense.date}</p>
          </div>
        </div>
        <span className="font-bold text-ink">{expense.amount} kr</span>
      </div>

      {/* Description */}
      <p className="text-sm text-ink-soft mt-2">{expense.description}</p>

      {/* Booking reference */}
      {booking && (
        <p className="text-xs text-ink-muted mt-1">
          {booking.butik} &middot; {booking.kund}
        </p>
      )}

      {/* Receipt link */}
      {expense.receiptUrl && (
        <p className="text-xs text-gold-dark mt-2 font-medium">Se kvitto</p>
      )}
    </div>
  );
}
