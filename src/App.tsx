import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={user ? <DashboardPage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <div className="max-w-md rounded-r-lg bg-surface p-8 shadow-md text-center">
          <h1 className="mb-3 text-xl font-bold text-ink">Crew2you</h1>
          <p className="text-ink-soft text-sm">
            Supabase är inte konfigurerat ännu. Sätt{' '}
            <code className="rounded bg-surface-alt px-1.5 py-0.5 text-xs font-mono">
              VITE_SUPABASE_URL
            </code>{' '}
            och{' '}
            <code className="rounded bg-surface-alt px-1.5 py-0.5 text-xs font-mono">
              VITE_SUPABASE_ANON_KEY
            </code>{' '}
            i miljövariabler.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
