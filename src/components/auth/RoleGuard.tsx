import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserProfile, type UserProfile } from '@/hooks/use-user-profile';

type Role = UserProfile['role'];

const ROLE_HOME: Record<Role, string> = {
  super_admin: '/',
  org_admin: '/',
  org_user: '/',
  personnel: '/personal',
  customer: '/kund',
};

/**
 * Skickar användaren till sin "hem"-route baserat på rollen.
 * Super_admin kan fortsätta till vilken route som helst om de redan är där.
 */
export function RoleHomeRedirect() {
  const { data: profile, isLoading } = useUserProfile();
  if (isLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }
  return <Navigate to={ROLE_HOME[profile.role]} replace />;
}

interface RoleGuardProps {
  allow: Role[];
  children: ReactNode;
}

/**
 * Visar `children` om inloggad user har en av rollerna i `allow`.
 * Super_admin har alltid tillgång.
 * Andra roller redirectas till sin hem-route.
 */
export function RoleGuard({ allow, children }: RoleGuardProps) {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  // Super admin får alltid tillgång
  if (profile.role === 'super_admin') return <>{children}</>;

  if (allow.includes(profile.role)) return <>{children}</>;

  // Redirect till rollens hem-route
  return <Navigate to={ROLE_HOME[profile.role]} replace />;
}
