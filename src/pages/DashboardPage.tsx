import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-bg p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Crew2you</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink-muted">{user?.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-r border border-border px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-surface-alt"
          >
            Logga ut
          </button>
        </div>
      </header>
      <main>
        <p className="text-ink-soft">Välkommen till bokningssystemet.</p>
      </main>
    </div>
  );
}
