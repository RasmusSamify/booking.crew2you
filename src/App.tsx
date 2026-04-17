import type { ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useRealtimeSync } from '@/hooks/use-realtime';
import { RoleGuard, RoleHomeRedirect } from '@/components/auth/RoleGuard';
import { ToastContainer } from '@/components/ui/Toast';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import PipelinePage from '@/pages/admin/PipelinePage';
import BookingsPage from '@/pages/admin/BookingsPage';
import CalendarPage from '@/pages/admin/CalendarPage';
import PersonnelPage from '@/pages/admin/PersonnelPage';
import CustomersPage from '@/pages/admin/CustomersPage';
import InvoicesPage from '@/pages/admin/InvoicesPage';
import PayrollPage from '@/pages/admin/PayrollPage';
import StatsPage from '@/pages/admin/StatsPage';
import QualityPage from '@/pages/admin/QualityPage';
import AutomationsPage from '@/pages/admin/AutomationsPage';
import InboxPage from '@/pages/admin/InboxPage';
import PersonalLayout from '@/components/layout/PersonalLayout';
import AssignmentsPage from '@/pages/personal/AssignmentsPage';
import ExpensesPage from '@/pages/personal/ExpensesPage';
import ReportsPage from '@/pages/personal/ReportsPage';
import KundLayout from '@/components/layout/KundLayout';
import KundOverviewPage from '@/pages/kund/KundOverviewPage';
import KundBookingsPage from '@/pages/kund/KundBookingsPage';
import KundReportsPage from '@/pages/kund/KundReportsPage';
import KundInvoicesPage from '@/pages/kund/KundInvoicesPage';

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
  useRealtimeSync();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  const adminOnly = (el: ReactElement) =>
    user ? <RoleGuard allow={['super_admin', 'org_admin', 'org_user']}>{el}</RoleGuard> : <Navigate to="/login" replace />;
  const personnelOnly = (el: ReactElement) =>
    user ? <RoleGuard allow={['personnel']}>{el}</RoleGuard> : <Navigate to="/login" replace />;
  const customerOnly = (el: ReactElement) =>
    user ? <RoleGuard allow={['customer']}>{el}</RoleGuard> : <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <RoleHomeRedirect /> : <LoginPage />}
      />
      <Route path="/" element={adminOnly(<DashboardPage />)} />
      <Route path="/admin/pipeline" element={adminOnly(<PipelinePage />)} />
      <Route path="/admin/bokningar" element={adminOnly(<BookingsPage />)} />
      <Route path="/admin/calendar" element={adminOnly(<CalendarPage />)} />
      <Route path="/admin/personnel" element={adminOnly(<PersonnelPage />)} />
      <Route path="/admin/customers" element={adminOnly(<CustomersPage />)} />
      <Route path="/admin/invoices" element={adminOnly(<InvoicesPage />)} />
      <Route path="/admin/payroll" element={adminOnly(<PayrollPage />)} />
      <Route path="/admin/stats" element={adminOnly(<StatsPage />)} />
      <Route path="/admin/quality" element={adminOnly(<QualityPage />)} />
      <Route path="/admin/automationer" element={adminOnly(<AutomationsPage />)} />
      <Route path="/admin/inbox" element={adminOnly(<InboxPage />)} />

      {/* Personal app — personnel role (eller super_admin för preview) */}
      <Route path="/personal" element={personnelOnly(<PersonalLayout />)}>
        <Route index element={<AssignmentsPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* Kund portal — customer role (eller super_admin för preview) */}
      <Route path="/kund" element={customerOnly(<KundLayout />)}>
        <Route index element={<KundOverviewPage />} />
        <Route path="bookings" element={<KundBookingsPage />} />
        <Route path="reports" element={<KundReportsPage />} />
        <Route path="invoices" element={<KundInvoicesPage />} />
      </Route>
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
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
