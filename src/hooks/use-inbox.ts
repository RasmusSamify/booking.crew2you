import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapInboxEmail } from '@/lib/db-mappers';
import { FALLBACK_INBOX, type InboxEmail } from '@/lib/fallback-data';

export type { InboxEmail } from '@/lib/fallback-data';

export function useInboxEmails() {
  return useQuery({
    queryKey: ['inbox-emails'],
    queryFn: async (): Promise<InboxEmail[]> => {
      try {
        if (!supabase) {
          console.warn('Supabase fallback for inbox: client not configured');
          return FALLBACK_INBOX;
        }
        const { data, error } = await supabase
          .from('inbox_emails')
          .select('*')
          .order('received_at', { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) {
          console.warn('Supabase fallback for inbox: empty result');
          return FALLBACK_INBOX;
        }
        return data.map(mapInboxEmail);
      } catch (e) {
        console.warn('Supabase fallback for inbox:', e);
        return FALLBACK_INBOX;
      }
    },
  });
}
