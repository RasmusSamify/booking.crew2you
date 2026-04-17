import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapBooking } from '@/lib/db-mappers';
import { FALLBACK_BOKNINGAR, type Booking } from '@/lib/fallback-data';

export type { Booking } from '@/lib/fallback-data';

export type BookingStage =
  | 'inkommen'
  | 'bokad'
  | 'bekraftad'
  | 'personal'
  | 'genomford'
  | 'aterrapporterad'
  | 'fakturerad';

export const STAGES: BookingStage[] = [
  'inkommen', 'bokad', 'bekraftad', 'personal',
  'genomford', 'aterrapporterad', 'fakturerad',
];

export const STAGE_META: Record<BookingStage, { label: string; shortLabel: string }> = {
  inkommen: { label: 'Inkommen', shortLabel: 'Inkommen' },
  bokad: { label: 'Bokad (internt)', shortLabel: 'Bokad' },
  bekraftad: { label: 'Bekräftad (utskickad)', shortLabel: 'Bekräftad' },
  personal: { label: 'Personal tillsatt', shortLabel: 'Personal' },
  genomford: { label: 'Genomförd', shortLabel: 'Genomförd' },
  aterrapporterad: { label: 'Återrapporterad', shortLabel: 'Återrapp.' },
  fakturerad: { label: 'Fakturerad', shortLabel: 'Fakturerad' },
};

export type ServiceType = 'demo' | 'plock' | 'sampling' | 'event';

const BOOKINGS_SELECT = `
  *,
  booking_personnel(
    id, role, personnel_id,
    personnel(id, full_name)
  )
` as const;

async function fetchAllBookings(): Promise<Booking[]> {
  try {
    if (!supabase) {
      console.warn('Supabase fallback for bookings: client not configured');
      return FALLBACK_BOKNINGAR;
    }
    const { data, error } = await supabase
      .from('bookings')
      .select(BOOKINGS_SELECT)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) {
      console.warn('Supabase fallback for bookings: empty result');
      return FALLBACK_BOKNINGAR;
    }
    // @ts-expect-error — Supabase inferred type for nested select is broader than our mapper expects
    return data.map(mapBooking);
  } catch (e) {
    console.warn('Supabase fallback for bookings:', e);
    return FALLBACK_BOKNINGAR;
  }
}

export function useBookings(stageFilter?: BookingStage | BookingStage[]) {
  return useQuery({
    queryKey: ['bookings', stageFilter ?? 'all'],
    queryFn: async () => {
      const all = await fetchAllBookings();
      if (!stageFilter) return all;
      const stages = Array.isArray(stageFilter) ? stageFilter : [stageFilter];
      return all.filter((b) => stages.includes(b.stage));
    },
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: fetchAllBookings,
  });
}

// ── MUTATIONS ────────────────────────────────────────────

type AssignedPersonnelInput = {
  personnelId: string;
  personnelName: string;
  role: 'primary' | 'secondary';
};

// Map domain Booking partial → DB bookings row partial
function bookingToDbUpdate(updates: Partial<Booking>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (updates.butik !== undefined) out.store_name = updates.butik;
  if (updates.kontakt !== undefined) out.store_contact_name = updates.kontakt;
  if (updates.tel !== undefined) out.store_contact_phone = updates.tel;
  if (updates.ort !== undefined) out.store_city = updates.ort;
  if (updates.region !== undefined) out.region = updates.region;
  if (updates.dagar !== undefined) out.days_text = updates.dagar;
  if (updates.timmar !== undefined) out.hours = updates.timmar;
  if (updates.kund !== undefined) out.customer_name = updates.kund;
  if (updates.kundKontakt !== undefined) out.customer_contact = updates.kundKontakt;
  if (updates.tjanst !== undefined) out.service_type = updates.tjanst;
  if (updates.produkt !== undefined) out.product = updates.produkt;
  if (updates.material !== undefined) out.material = updates.material;
  if (updates.utskick !== undefined) out.shipped_items = updates.utskick ?? null;
  if (updates.info !== undefined) out.info = updates.info;
  if (updates.ovrigInfo !== undefined) out.other_info = updates.ovrigInfo ?? null;
  if (updates.stage !== undefined) out.stage = updates.stage;
  if (updates.aterrapport !== undefined) out.report_text = updates.aterrapport ?? null;
  return out;
}

async function syncBookingPersonnel(bookingId: string, assigned: AssignedPersonnelInput[]) {
  // Delete existing links, then insert new ones
  const { error: delError } = await supabase
    .from('booking_personnel')
    .delete()
    .eq('booking_id', bookingId);
  if (delError) throw delError;
  if (assigned.length === 0) return;
  const { error: insError } = await supabase.from('booking_personnel').insert(
    assigned.map((a) => ({
      booking_id: bookingId,
      personnel_id: a.personnelId,
      role: a.role,
    }))
  );
  if (insError) throw insError;
}

async function fetchBookingById(id: string): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKINGS_SELECT)
    .eq('id', id)
    .single();
  if (error) throw error;
  // @ts-expect-error — Supabase nested select type is broader than our mapper expects
  return mapBooking(data);
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Booking> & { id: string }): Promise<Booking> => {
      if (!supabase) throw new Error('Supabase ej konfigurerad');
      const { id, assignedPersonnel, ...rest } = updates;
      const dbUpdate = bookingToDbUpdate(rest);
      if (Object.keys(dbUpdate).length > 0) {
        // Cast required because Update expects a precise schema shape — dbUpdate contains
        // only fields we know are safe (built by bookingToDbUpdate).
        const { error } = await supabase
          .from('bookings')
          .update(dbUpdate as never)
          .eq('id', id);
        if (error) throw error;
      }
      if (assignedPersonnel !== undefined) {
        await syncBookingPersonnel(id, assignedPersonnel);
      }
      return fetchBookingById(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      booking: Omit<Booking, 'id' | 'anlagd'> & { stage: BookingStage }
    ): Promise<Booking> => {
      if (!supabase) throw new Error('Supabase ej konfigurerad');
      const { assignedPersonnel, ...rest } = booking;
      const insertRow = {
        ...bookingToDbUpdate(rest),
        // org_id is required by the schema; RLS will reject if wrong, but we pass the test org
        org_id: '11111111-1111-4111-a111-111111111111',
        store_name: rest.butik,
        customer_name: rest.kund,
        service_type: rest.tjanst,
        stage: rest.stage,
      };
      const { data, error } = await supabase
        .from('bookings')
        .insert(insertRow as never)
        .select('id')
        .single();
      if (error) throw error;
      const newId = (data as { id: string }).id;
      if (assignedPersonnel && assignedPersonnel.length > 0) {
        await syncBookingPersonnel(newId, assignedPersonnel);
      }
      return fetchBookingById(newId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useAdvanceBookingStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      targetStage,
      note,
    }: {
      bookingId: string;
      targetStage?: BookingStage;
      note?: string;
    }): Promise<Booking> => {
      if (!supabase) throw new Error('Supabase ej konfigurerad');
      // Fetch current stage (needed for both inference and history)
      const { data: curr, error: currErr } = await supabase
        .from('bookings')
        .select('stage')
        .eq('id', bookingId)
        .single();
      if (currErr) throw currErr;
      const currentStage = curr.stage as BookingStage;

      let nextStage: BookingStage;
      if (targetStage) {
        nextStage = targetStage;
      } else {
        const idx = STAGES.indexOf(currentStage);
        if (idx < 0 || idx >= STAGES.length - 1) throw new Error('Redan i sista steget');
        nextStage = STAGES[idx + 1];
      }

      // Update stage
      const { error } = await supabase
        .from('bookings')
        .update({ stage: nextStage })
        .eq('id', bookingId);
      if (error) throw error;

      // Log in history (best-effort — don't fail the mutation if this fails)
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from('booking_stage_history').insert({
        booking_id: bookingId,
        from_stage: currentStage,
        to_stage: nextStage,
        changed_by: userData.user?.id ?? null,
        note: note ?? null,
      });

      return fetchBookingById(bookingId);
    },
    onMutate: async ({ bookingId, targetStage }) => {
      await queryClient.cancelQueries({ queryKey: ['bookings'] });
      const snapshots = queryClient.getQueriesData<Booking[]>({ queryKey: ['bookings'] });
      // Optimistically update all cached booking lists
      queryClient.setQueriesData<Booking[]>({ queryKey: ['bookings'] }, (old) => {
        if (!old) return old;
        return old.map((b) => {
          if (b.id !== bookingId) return b;
          let next: BookingStage = b.stage;
          if (targetStage) {
            next = targetStage;
          } else {
            const idx = STAGES.indexOf(b.stage);
            if (idx >= 0 && idx < STAGES.length - 1) next = STAGES[idx + 1];
          }
          return { ...b, stage: next };
        });
      });
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking-history'] });
    },
  });
}

export function useBookingHistory(bookingId: string) {
  return useQuery({
    queryKey: ['booking-history', bookingId],
    enabled: !!bookingId && !!supabase,
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('booking_stage_history')
        .select('id, from_stage, to_stage, changed_at, note')
        .eq('booking_id', bookingId)
        .order('changed_at', { ascending: false });
      if (error) return [];
      return data ?? [];
    },
  });
}
