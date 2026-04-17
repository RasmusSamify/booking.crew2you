import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { FALLBACK_PERSONAL, FALLBACK_KUNDER, type Personal, type Kund } from '@/lib/fallback-data';
import { mapPersonnel, mapCustomer } from '@/lib/db-mappers';
import { useUserProfile } from '@/hooks/use-user-profile';

// ── Demo defaults när ingen profil är kopplad till personnel/customer ──
const DEMO_PERSONNEL_NAME = 'Stina Bergkvist';
const DEMO_CUSTOMER_NAME = 'Falbygdens Ost';

/**
 * Returnerar den personal-post vars vy vi visar.
 * - Om inloggad user har profile.personnelId → hämta den posten
 * - Annars → demo-default (Stina Bergkvist)
 */
export function useCurrentPersonnel() {
  const { data: profile } = useUserProfile();
  const personnelId = profile?.personnelId ?? null;

  return useQuery({
    queryKey: ['current-personnel', personnelId ?? 'demo'],
    queryFn: async (): Promise<Personal> => {
      // Försök hämta från DB om ID finns
      if (personnelId && supabase) {
        try {
          const { data, error } = await supabase
            .from('personnel')
            .select('*')
            .eq('id', personnelId)
            .single();
          if (!error && data) return mapPersonnel(data);
        } catch (e) {
          console.warn('current-personnel db fallback:', e);
        }
      }
      // Försök hämta demo-personal från DB (på namn)
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('personnel')
            .select('*')
            .eq('full_name', DEMO_PERSONNEL_NAME)
            .single();
          if (!error && data) return mapPersonnel(data);
        } catch {
          // fortsätt till fallback
        }
      }
      // Fallback till mockdata
      return (
        FALLBACK_PERSONAL.find((p) => p.namn === DEMO_PERSONNEL_NAME) ??
        FALLBACK_PERSONAL[0]
      );
    },
  });
}

/**
 * Returnerar den kund-post vars vy vi visar.
 * - Om inloggad user har profile.customerId → hämta den posten (med kontakter)
 * - Annars → demo-default (Falbygdens Ost)
 */
export function useCurrentCustomer() {
  const { data: profile } = useUserProfile();
  const customerId = profile?.customerId ?? null;

  return useQuery({
    queryKey: ['current-customer', customerId ?? 'demo'],
    queryFn: async (): Promise<Kund> => {
      if (supabase) {
        try {
          const query = supabase.from('customers').select('*, customer_contacts(*)');
          const { data, error } = customerId
            ? await query.eq('id', customerId).single()
            : await query.eq('name', DEMO_CUSTOMER_NAME).single();
          if (!error && data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const row = data as any;
            return mapCustomer(row, row.customer_contacts ?? []);
          }
        } catch (e) {
          console.warn('current-customer db fallback:', e);
        }
      }
      return (
        FALLBACK_KUNDER.find((k) => k.namn === DEMO_CUSTOMER_NAME) ??
        FALLBACK_KUNDER[0]
      );
    },
  });
}
