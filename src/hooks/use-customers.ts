import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapCustomer, type CustomerContactRow } from '@/lib/db-mappers';
import { FALLBACK_KUNDER, type Kund } from '@/lib/fallback-data';

export type { Kund } from '@/lib/fallback-data';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async (): Promise<Kund[]> => {
      try {
        if (!supabase) {
          console.warn('Supabase fallback for customers: client not configured');
          return FALLBACK_KUNDER;
        }
        const [{ data: customers, error: cErr }, { data: contacts, error: contactsErr }] =
          await Promise.all([
            supabase.from('customers').select('*').order('name'),
            supabase.from('customer_contacts').select('*'),
          ]);
        if (cErr) throw cErr;
        if (contactsErr) throw contactsErr;
        if (!customers || customers.length === 0) {
          console.warn('Supabase fallback for customers: empty result');
          return FALLBACK_KUNDER;
        }
        const contactsByCustomer = new Map<string, CustomerContactRow[]>();
        for (const c of contacts ?? []) {
          const list = contactsByCustomer.get(c.customer_id) ?? [];
          list.push(c);
          contactsByCustomer.set(c.customer_id, list);
        }
        return customers.map((cust) => mapCustomer(cust, contactsByCustomer.get(cust.id) ?? []));
      } catch (e) {
        console.warn('Supabase fallback for customers:', e);
        return FALLBACK_KUNDER;
      }
    },
  });
}
