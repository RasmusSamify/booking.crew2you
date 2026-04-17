import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapStore, type StoreContactRow } from '@/lib/db-mappers';
import { FALLBACK_BUTIKER, type Butik } from '@/lib/fallback-data';

export type { Butik } from '@/lib/fallback-data';

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async (): Promise<Butik[]> => {
      try {
        if (!supabase) {
          console.warn('Supabase fallback for stores: client not configured');
          return FALLBACK_BUTIKER;
        }
        const [{ data: stores, error: sErr }, { data: contacts, error: cErr }] = await Promise.all([
          supabase.from('stores').select('*').order('name'),
          supabase.from('store_contacts').select('*'),
        ]);
        if (sErr) throw sErr;
        if (cErr) throw cErr;
        if (!stores || stores.length === 0) {
          console.warn('Supabase fallback for stores: empty result');
          return FALLBACK_BUTIKER;
        }
        const byStore = new Map<string, StoreContactRow[]>();
        for (const c of contacts ?? []) {
          const list = byStore.get(c.store_id) ?? [];
          list.push(c);
          byStore.set(c.store_id, list);
        }
        return stores.map((s) => mapStore(s, byStore.get(s.id) ?? []));
      } catch (e) {
        console.warn('Supabase fallback for stores:', e);
        return FALLBACK_BUTIKER;
      }
    },
  });
}
