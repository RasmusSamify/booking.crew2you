import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapQualityReview } from '@/lib/db-mappers';
import { FALLBACK_REVIEWS, type QualityReview } from '@/lib/fallback-data';

export type { QualityReview } from '@/lib/fallback-data';

export function useQualityReviews() {
  return useQuery({
    queryKey: ['quality-reviews'],
    queryFn: async (): Promise<QualityReview[]> => {
      try {
        if (!supabase) {
          console.warn('Supabase fallback for reviews: client not configured');
          return FALLBACK_REVIEWS;
        }
        const { data, error } = await supabase
          .from('quality_reviews')
          .select(`
            *,
            personnel(full_name),
            booking:bookings(customer_name, store_name)
          `)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) {
          console.warn('Supabase fallback for reviews: empty result');
          return FALLBACK_REVIEWS;
        }
        // @ts-expect-error — Supabase nested relation type is broader than our mapper expects
        return data.map(mapQualityReview);
      } catch (e) {
        console.warn('Supabase fallback for reviews:', e);
        return FALLBACK_REVIEWS;
      }
    },
  });
}

export interface CreateReviewInput {
  bookingId: string;
  personnelId: string;
  reviewNumber: number;
  scores: Record<string, number>;
  comments: Record<string, string>;
  overallComment: string;
  averageScore: number;
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      if (!supabase) throw new Error('Supabase ej konfigurerad');
      const { data, error } = await supabase
        .from('quality_reviews')
        .insert({
          org_id: '11111111-1111-4111-a111-111111111111',
          booking_id: input.bookingId,
          personnel_id: input.personnelId,
          review_number: input.reviewNumber,
          scores: input.scores,
          comments: input.comments,
          overall_comment: input.overallComment,
          average_score: input.averageScore,
        })
        .select('id')
        .single();
      if (error) throw error;
      return { id: data.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quality-reviews'] });
    },
  });
}
