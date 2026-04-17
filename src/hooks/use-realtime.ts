import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * Prenumererar på ändringar i bookings + booking_personnel + expenses
 * och invaliderar motsvarande TanStack Query-cache när något händer.
 *
 * Använd en gång per app-körning, t.ex. i App.tsx eller en Provider.
 */
export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('crew2you-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'booking_personnel' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
