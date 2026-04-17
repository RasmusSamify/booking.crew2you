import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapExpense } from '@/lib/db-mappers';
import { FALLBACK_UTLAGG, type Expense } from '@/lib/fallback-data';

export type { Expense } from '@/lib/fallback-data';

export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async (): Promise<Expense[]> => {
      try {
        if (!supabase) {
          console.warn('Supabase fallback for expenses: client not configured');
          return FALLBACK_UTLAGG;
        }
        const { data, error } = await supabase
          .from('expenses')
          .select('*, personnel(full_name)')
          .order('expense_date', { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) {
          console.warn('Supabase fallback for expenses: empty result');
          return FALLBACK_UTLAGG;
        }
        // @ts-expect-error — nested personnel relation type is broader than our mapper type
        return data.map(mapExpense);
      } catch (e) {
        console.warn('Supabase fallback for expenses:', e);
        return FALLBACK_UTLAGG;
      }
    },
  });
}
