import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { MOCK_PERSONAL_EXPENSES } from '@/lib/mock-data';
import { useCurrentPersonnel } from '@/hooks/use-current-identity';
import ExpenseCard from '@/components/personal/ExpenseCard';
import NewExpenseModal from '@/components/personal/NewExpenseModal';

export default function ExpensesPage() {
  const [showModal, setShowModal] = useState(false);
  const [, forceUpdate] = useState(0);
  const { data: person } = useCurrentPersonnel();
  const personnelId = person?.id;

  const stinaExpenses = useMemo(
    () =>
      MOCK_PERSONAL_EXPENSES
        .filter((e) => e.personnelId === personnelId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [forceUpdate, personnelId]
  );

  const total = stinaExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      {/* Summary card */}
      <div className="bg-gold-bg border border-gold-light rounded-r-lg p-5 mb-4">
        <p className="text-xs text-gold-dark/70 uppercase tracking-wide font-semibold">
          Mina utlagg denna manad
        </p>
        <p className="text-[32px] font-black text-gold-dark tracking-tight mt-1">
          {total} kr
        </p>
        <p className="text-xs text-gold-dark/60">
          {stinaExpenses.length} utlagg registrerade
        </p>
      </div>

      {/* New expense button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 bg-gold text-white w-full py-3 rounded-r font-semibold text-[14px] mb-6 active:scale-[0.98] active:opacity-90"
      >
        <Plus size={18} />
        Registrera utlagg
      </button>

      {/* Expense list */}
      {stinaExpenses.map((e) => (
        <ExpenseCard key={e.id} expense={e} />
      ))}

      {/* Modal */}
      {showModal && (
        <NewExpenseModal
          onClose={() => setShowModal(false)}
          onSaved={() => forceUpdate((n) => n + 1)}
        />
      )}
    </div>
  );
}
