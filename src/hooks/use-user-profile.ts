import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'org_admin' | 'org_user' | 'personnel' | 'customer';
  orgId: string | null;
  orgName: string | null;
  personnelId: string | null;
  customerId: string | null;
}

export function useUserProfile() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['user-profile', user?.id],
    enabled: !!user?.id && !!supabase,
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id || !supabase) return null;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*, organizations(name)')
        .eq('id', user.id)
        .single();
      if (error) {
        console.warn('Failed to load user profile:', error);
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = data as any;
      return {
        id: row.id,
        email: row.email,
        fullName: row.full_name || row.email,
        role: row.role,
        orgId: row.org_id,
        orgName: row.organizations?.name ?? null,
        personnelId: row.personnel_id,
        customerId: row.customer_id,
      };
    },
  });
}

export function roleLabel(role: UserProfile['role']): string {
  switch (role) {
    case 'super_admin': return 'Super Admin';
    case 'org_admin': return 'Admin';
    case 'org_user': return 'Användare';
    case 'personnel': return 'Demovärd';
    case 'customer': return 'Uppdragsgivare';
  }
}
