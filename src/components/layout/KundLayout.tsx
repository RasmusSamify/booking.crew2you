import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Home,
  CalendarDays,
  ClipboardList,
  Receipt,
  LogOut,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCurrentCustomer } from '@/hooks/use-current-identity';
import { supabase } from '@/lib/supabase';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from '@/components/ui/Toast';

const LOGO_SRC =
  'https://axypazcbgcogtdqqimvi.supabase.co/storage/v1/object/public/Bilder/main-logo.png';

const NAV_ITEMS = [
  { label: 'Oversikt', path: '/kund', icon: Home, end: true },
  { label: 'Mina bokningar', path: '/kund/bookings', icon: CalendarDays, end: false },
  { label: 'Aterrapporter', path: '/kund/reports', icon: ClipboardList, end: false },
  { label: 'Fakturor', path: '/kund/invoices', icon: Receipt, end: false },
] as const;

const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/kund': { title: 'Valkommen, Jenny', sub: 'Falbygdens Ost -- Kundportal' },
  '/kund/bookings': { title: 'Mina bokningar', sub: 'Oversikt over era uppdrag' },
  '/kund/reports': { title: 'Aterrapporter', sub: 'Rapporter fran genomforda uppdrag' },
  '/kund/invoices': { title: 'Fakturor', sub: 'Fakturahistorik och status' },
};

export default function KundLayout() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] ?? { title: 'Kundportal', sub: '' };
  const { data: customer } = useCurrentCustomer();
  const customerName = customer?.namn || 'Falbygdens Ost';
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = async () => {
    setConfirmLogout(false);
    const { error } = await supabase.auth.signOut();
    if (error) toast(`Kunde inte logga ut: ${error.message}`);
    else toast('Utloggad');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-[248px] flex-shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex justify-center border-b border-border px-6 py-5">
          <img src={LOGO_SRC} alt="Crew2you" className="h-[54px] w-auto" />
        </div>

        <div className="px-6 pb-2.5 pt-3.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.8px] text-ink-faint">
            Inloggad som{' '}
            <strong className="font-bold text-gold-dark">{customerName}</strong>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative flex w-full items-center gap-3 rounded-r px-3 py-2.5 text-sm font-medium text-ink-soft transition-all duration-[120ms]',
                  'hover:bg-surface-alt hover:text-ink',
                  isActive &&
                    'bg-gold-bg font-semibold text-gold-dark before:absolute before:-left-3 before:bottom-2 before:top-2 before:w-[3px] before:rounded-r-[3px] before:bg-gold'
                )
              }
            >
              <item.icon size={18} strokeWidth={1.75} />
              <span>
                {item.label === 'Oversikt'
                  ? '\u00d6versikt'
                  : item.label === 'Aterrapporter'
                    ? '\u00c5terrapporter'
                    : item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border px-5 py-4">
          <button
            onClick={() => setConfirmLogout(true)}
            className="flex w-full items-center justify-center gap-2.5 rounded-r bg-surface-alt px-3.5 py-2.5 text-[13px] font-medium text-ink-soft transition-all duration-[120ms] hover:bg-border hover:text-ink"
          >
            <LogOut size={14} strokeWidth={2} />
            <span>Logga ut</span>
          </button>
        </div>
      </aside>

      {confirmLogout && (
        <ConfirmDialog
          title="Logga ut?"
          message={<>Du loggas ut från kundportalen.</>}
          confirmLabel="Logga ut"
          onConfirm={handleLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-surface px-8 py-5">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.02em] text-ink">
              {meta.title === 'Valkommen, Jenny'
                ? 'V\u00e4lkommen, Jenny'
                : meta.title === 'Aterrapporter'
                  ? '\u00c5terrapporter'
                  : meta.title === 'Oversikt over era uppdrag'
                    ? meta.title
                    : meta.title}
            </h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              {meta.sub === 'Falbygdens Ost -- Kundportal'
                ? `${customerName} \u00b7 Kundportal`
                : meta.sub === 'Oversikt over era uppdrag'
                  ? '\u00d6versikt \u00f6ver era uppdrag'
                  : meta.sub === 'Rapporter fran genomforda uppdrag'
                    ? 'Rapporter fr\u00e5n genomf\u00f6rda uppdrag'
                    : meta.sub}
            </p>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-7 px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
