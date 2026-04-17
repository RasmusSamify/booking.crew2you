import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapAutomation, mapAutomationRun } from '@/lib/db-mappers';
import {
  FALLBACK_AUTOMATIONS,
  FALLBACK_AUTOMATION_RUNS,
  type Automation,
  type AutomationRun,
} from '@/lib/fallback-data';

export type { Automation, AutomationRun } from '@/lib/fallback-data';

export function useAutomations() {
  return useQuery({
    queryKey: ['automations'],
    queryFn: async (): Promise<Automation[]> => {
      try {
        if (!supabase) {
          console.warn('Supabase fallback for automations: client not configured');
          return FALLBACK_AUTOMATIONS;
        }
        const { data, error } = await supabase.from('automations').select('*').order('name');
        if (error) throw error;
        if (!data || data.length === 0) {
          console.warn('Supabase fallback for automations: empty result');
          return FALLBACK_AUTOMATIONS;
        }
        return data.map(mapAutomation);
      } catch (e) {
        console.warn('Supabase fallback for automations:', e);
        return FALLBACK_AUTOMATIONS;
      }
    },
  });
}

export function useAutomationRuns() {
  return useQuery({
    queryKey: ['automation-runs'],
    queryFn: async (): Promise<AutomationRun[]> => {
      try {
        if (!supabase) {
          console.warn('Supabase fallback for automation runs: client not configured');
          return FALLBACK_AUTOMATION_RUNS;
        }
        const { data, error } = await supabase
          .from('automation_runs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) {
          console.warn('Supabase fallback for automation runs: empty result');
          return FALLBACK_AUTOMATION_RUNS;
        }
        return data.map(mapAutomationRun);
      } catch (e) {
        console.warn('Supabase fallback for automation runs:', e);
        return FALLBACK_AUTOMATION_RUNS;
      }
    },
  });
}

export function useToggleAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      if (!supabase) throw new Error('Supabase ej konfigurerad');
      const { error } = await supabase.from('automations').update({ enabled }).eq('id', id);
      if (error) throw error;
      return { id, enabled };
    },
    onMutate: async ({ id, enabled }) => {
      await queryClient.cancelQueries({ queryKey: ['automations'] });
      const snapshot = queryClient.getQueryData<Automation[]>(['automations']);
      queryClient.setQueryData<Automation[]>(['automations'], (old) =>
        old?.map((a) => (a.id === id ? { ...a, enabled } : a))
      );
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(['automations'], ctx.snapshot);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
  });
}
