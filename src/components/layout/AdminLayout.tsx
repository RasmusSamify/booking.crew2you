import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from '@/components/ui/Toast';
import {
  Inbox,
  LayoutDashboard,
  Columns3,
  Calendar,
  CalendarDays,
  Users,
  Building2,
  Receipt,
  Wallet,
  BarChart3,
  ClipboardCheck,
  Zap,
  LogOut,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUserProfile, roleLabel } from '@/hooks/use-user-profile';

const LOGO_SRC =
  'https://axypazcbgcogtdqqimvi.supabase.co/storage/v1/object/public/Bilder/main-logo.png';

interface NavItemDef {
  key: string;
  label: string;
  icon: ReactNode;
  path: string;
  badge?: string;
  badgeRed?: boolean;
  dividerBefore?: boolean;
}

const NAV_ITEMS: NavItemDef[] = [
  { key: 'inkorg', label: 'Inkorg', icon: <Inbox size={18} strokeWidth={1.75} />, path: '/admin/inbox', badge: '3', badgeRed: true },
  { key: 'oversikt', label: 'Översikt', icon: <LayoutDashboard size={18} strokeWidth={1.75} />, path: '/' },
  { key: 'pipeline', label: 'Pipeline', icon: <Columns3 size={18} strokeWidth={1.75} />, path: '/admin/pipeline' },
  { key: 'kalender', label: 'Kalender', icon: <Calendar size={18} strokeWidth={1.75} />, path: '/admin/calendar' },
  { key: 'bokningar', label: 'Bokningar', icon: <CalendarDays size={18} strokeWidth={1.75} />, path: '/admin/bokningar' },
  { key: 'personal', label: 'Personal', icon: <Users size={18} strokeWidth={1.75} />, path: '/admin/personnel' },
  { key: 'kunder', label: 'Kunder & butiker', icon: <Building2 size={18} strokeWidth={1.75} />, path: '/admin/customers' },
  { key: 'fakturor', label: 'Fakturaunderlag', icon: <Receipt size={18} strokeWidth={1.75} />, path: '/admin/invoices' },
  { key: 'lon', label: 'Löneunderlag', icon: <Wallet size={18} strokeWidth={1.75} />, path: '/admin/payroll' },
  { key: 'statistik', label: 'Statistik', icon: <BarChart3 size={18} strokeWidth={1.75} />, path: '/admin/stats' },
  { key: 'kvalitet', label: 'Kvalitet', icon: <ClipboardCheck size={18} strokeWidth={1.75} />, path: '/admin/quality', badge: 'NY' },
  {
    key: 'automationer',
    label: 'Automationer',
    icon: <Zap size={18} strokeWidth={1.75} />,
    path: '/admin/automationer',
    badge: 'AUTOFLOW',
    dividerBefore: true,
  },
];

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle: string;
  pageSub: string;
  actions?: ReactNode;
  activeNav?: string;
}

export default function AdminLayout({ children, pageTitle, pageSub, actions, activeNav }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profile } = useUserProfile();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = async () => {
    setConfirmLogout(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast(`Kunde inte logga ut: ${error.message}`);
      return;
    }
    toast('Utloggad');
  };

  const resolvedActiveNav =
    activeNav || NAV_ITEMS.find((item) => item.path === location.pathname)?.key || 'oversikt';

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
            <strong className="font-bold text-gold-dark">
              {profile ? roleLabel(profile.role) : 'Admin'}
            </strong>
          </span>
          {profile?.fullName && (
            <div className="mt-1 truncate text-[12px] font-medium text-ink-soft" title={profile.email}>
              {profile.fullName}
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.key}>
              {item.dividerBefore && (
                <div className="mx-3 my-2 border-t border-border" />
              )}
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-r px-3 py-2.5 text-sm font-medium text-ink-soft transition-all duration-[120ms]',
                  'hover:bg-surface-alt hover:text-ink',
                  resolvedActiveNav === item.key &&
                    'bg-gold-bg font-semibold text-gold-dark before:absolute before:-left-3 before:bottom-2 before:top-2 before:w-[3px] before:rounded-r-[3px] before:bg-gold'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    'ml-auto rounded-[10px] px-[7px] py-0.5 text-[10px] font-bold tracking-[0.3px] text-white',
                    item.badgeRed ? 'bg-red' : 'bg-gold',
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
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
          message={<>Du loggas ut från Crew2you och skickas tillbaka till inloggningssidan.</>}
          confirmLabel="Logga ut"
          cancelLabel="Avbryt"
          onConfirm={handleLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-surface px-8 py-5">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.02em] text-ink">
              {pageTitle}
            </h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">{pageSub}</p>
          </div>
          {actions && (
            <div className="flex items-center gap-2.5">
              {actions}
            </div>
          )}
        </header>
        <div className="flex-1 overflow-y-auto p-7 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
