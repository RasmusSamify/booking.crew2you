import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCurrentPersonnel } from '@/hooks/use-current-identity';
import { supabase } from '@/lib/supabase';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from '@/components/ui/Toast';

const TABS = [
  { label: 'Uppdrag', path: '/personal', end: true },
  { label: 'Utlagg', path: '/personal/expenses', end: false },
  { label: 'Aterrapport', path: '/personal/reports', end: false },
] as const;

export default function PersonalLayout() {
  const { data: person } = useCurrentPersonnel();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = async () => {
    setConfirmLogout(false);
    const { error } = await supabase.auth.signOut();
    if (error) toast(`Kunde inte logga ut: ${error.message}`);
    else toast('Utloggad');
  };

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="max-w-[440px] w-full bg-surface min-h-screen shadow-lg flex flex-col">
        {/* Header */}
        <header className="bg-ink text-white px-5 py-5 flex justify-between items-center">
          <div>
            <p className="text-xs opacity-60">God morgon</p>
            <p className="text-[17px] font-semibold">{person?.namn || 'Stina Bergkvist'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfirmLogout(true)}
              className="bg-white/10 text-white rounded-r-sm px-2.5 py-1.5 text-[11px] font-medium active:scale-[0.98] active:opacity-90"
            >
              <LogOut size={14} />
            </button>
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white text-sm font-bold">
              {person?.initialer || 'SB'}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <nav className="flex bg-surface border-b border-border sticky top-0 z-10">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'flex-1 py-3.5 text-[12.5px] font-semibold text-center border-b-2 active:scale-[0.98] active:opacity-90',
                  isActive
                    ? 'text-ink border-b-gold'
                    : 'text-ink-muted border-transparent'
                )
              }
            >
              {tab.label === 'Utlagg' ? 'Utl\u00e4gg' : tab.label === 'Aterrapport' ? '\u00c5terrapport' : tab.label}
            </NavLink>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {confirmLogout && (
        <ConfirmDialog
          title="Logga ut?"
          message={<>Du loggas ut från Crew2you.</>}
          confirmLabel="Logga ut"
          onConfirm={handleLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
    </div>
  );
}
