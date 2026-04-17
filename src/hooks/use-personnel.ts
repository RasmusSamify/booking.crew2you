import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapPersonnel } from '@/lib/db-mappers';
import { FALLBACK_PERSONAL, type Personal } from '@/lib/fallback-data';

export type { Personal } from '@/lib/fallback-data';

export interface PersonnelFilters {
  active?: boolean;
}

async function fetchPersonnel(filters?: PersonnelFilters): Promise<Personal[]> {
  try {
    if (!supabase) {
      console.warn('Supabase fallback for personnel: client not configured');
      return applyFilters(FALLBACK_PERSONAL, filters);
    }
    let query = supabase.from('personnel').select('*').order('full_name');
    if (filters?.active !== undefined) {
      query = query.eq('active', filters.active);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) {
      console.warn('Supabase fallback for personnel: empty result');
      return applyFilters(FALLBACK_PERSONAL, filters);
    }
    return data.map(mapPersonnel);
  } catch (e) {
    console.warn('Supabase fallback for personnel:', e);
    return applyFilters(FALLBACK_PERSONAL, filters);
  }
}

function applyFilters(list: Personal[], filters?: PersonnelFilters): Personal[] {
  if (!filters) return list;
  let out = list;
  if (filters.active !== undefined) out = out.filter((p) => p.active === filters.active);
  return out;
}

export function usePersonnel(filters?: PersonnelFilters) {
  return useQuery({
    queryKey: ['personnel', filters ?? {}],
    queryFn: () => fetchPersonnel(filters),
  });
}

export function useUpdatePersonnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Personal> & { id: string }) => {
      if (!supabase) throw new Error('Supabase ej konfigurerad');
      const { id, ...rest } = updates;
      // Map domain fields → DB columns
      const dbUpdate: Record<string, unknown> = {};
      if (rest.namn !== undefined) dbUpdate.full_name = rest.namn;
      if (rest.initialer !== undefined) dbUpdate.initials = rest.initialer;
      if (rest.hemort !== undefined) dbUpdate.home_city = rest.hemort;
      if (rest.tel !== undefined) dbUpdate.phone = rest.tel;
      if (rest.email !== undefined) dbUpdate.email = rest.email;
      if (rest.lat !== undefined) dbUpdate.lat = rest.lat;
      if (rest.lng !== undefined) dbUpdate.lng = rest.lng;
      if (rest.maxRadiusKm !== undefined) dbUpdate.max_radius_km = rest.maxRadiusKm;
      if (rest.kompetenser !== undefined) dbUpdate.competencies = rest.kompetenser;
      if (rest.specialiteter !== undefined) dbUpdate.specialties = rest.specialiteter;
      if (rest.sprak !== undefined) dbUpdate.languages = rest.sprak;
      if (rest.certifieringar !== undefined) dbUpdate.certifications = rest.certifieringar;
      if (rest.tillganglighet !== undefined) dbUpdate.availability = rest.tillganglighet;
      if (rest.erfarenhetAr !== undefined) dbUpdate.experience_years = rest.erfarenhetAr;
      if (rest.betyg !== undefined) dbUpdate.rating = rest.betyg;
      if (rest.antalUppdrag !== undefined) dbUpdate.total_assignments = rest.antalUppdrag;
      if (rest.anteckningar !== undefined) dbUpdate.notes = rest.anteckningar;
      if (rest.active !== undefined) dbUpdate.active = rest.active;
      if (Object.keys(dbUpdate).length === 0) return;
      const { error } = await supabase
        .from('personnel')
        .update(dbUpdate as never)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
      queryClient.invalidateQueries({ queryKey: ['current-personnel'] });
    },
  });
}

export function useTogglePersonnelActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      if (!supabase) throw new Error('Supabase ej konfigurerad');
      const { error } = await supabase.from('personnel').update({ active }).eq('id', id);
      if (error) throw error;
      return { id, active };
    },
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: ['personnel'] });
      const snapshots = queryClient.getQueriesData<Personal[]>({ queryKey: ['personnel'] });
      queryClient.setQueriesData<Personal[]>({ queryKey: ['personnel'] }, (old) =>
        old?.map((p) => (p.id === id ? { ...p, active } : p))
      );
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
    },
  });
}
