import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapInvoice } from '@/lib/db-mappers';
import { FALLBACK_INVOICES, type Invoice } from '@/lib/fallback-data';

export type { Invoice } from '@/lib/fallback-data';

export function useInvoices(customerId?: string) {
  return useQuery({
    queryKey: ['invoices', customerId ?? 'all'],
    queryFn: async (): Promise<Invoice[]> => {
      try {
        if (!supabase) {
          console.warn('Supabase fallback for invoices: client not configured');
          return filterByCustomer(FALLBACK_INVOICES, customerId);
        }
        let query = supabase
          .from('invoices')
          .select(`
            *,
            customer:customers(name),
            invoice_bookings(booking_id)
          `)
          .is('deleted_at', null)
          .order('invoice_date', { ascending: false });
        if (customerId) query = query.eq('customer_id', customerId);
        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) {
          console.warn('Supabase fallback for invoices: empty result');
          return filterByCustomer(FALLBACK_INVOICES, customerId);
        }
        // @ts-expect-error — nested relation type is broader than our mapper expects
        return data.map(mapInvoice);
      } catch (e) {
        console.warn('Supabase fallback for invoices:', e);
        return filterByCustomer(FALLBACK_INVOICES, customerId);
      }
    },
  });
}

function filterByCustomer(list: Invoice[], customerId?: string): Invoice[] {
  if (!customerId) return list;
  return list.filter((i) => i.customerId === customerId);
}
