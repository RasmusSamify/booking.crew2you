import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  Receipt,
  Wallet,
  TrendingUp,
  AlertCircle,
  Check,
  ArrowRight,
  UserX,
  Download,
  Plus,
  Star,
  ClipboardCheck,
  MailCheck,
  ClipboardX,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import NewBookingModal from '@/components/bookings/NewBookingModal';
import QuickActionModal from '@/components/bookings/QuickActionModal';
import { useAllBookings, STAGE_META, type Booking, type BookingStage } from '@/hooks/use-bookings';
import { useExpenses } from '@/hooks/use-expenses';
import { useQualityReviews } from '@/hooks/use-reviews';
import { MOCK_PERSONAL_EXPENSES, hasPersonnel, getPersonnelDisplay } from '@/lib/mock-data';
import { getIssuesForBookings, type Issue } from '@/lib/issue-detection';
import { cn } from '@/utils/cn';

const STATUS_COLOR: Record<BookingStage, string> = {
  inkommen: 'bg-status-inkommen-bg text-status-inkommen',
  bokad: 'bg-status-bokad-bg text-status-bokad',
  bekraftad: 'bg-status-bekraftad-bg text-status-bekraftad',
  personal: 'bg-status-personal-bg text-status-personal',
  genomford: 'bg-status-genomford-bg text-status-genomford',
  aterrapporterad: 'bg-status-aterrapporterad-bg text-status-aterrapporterad',
  fakturerad: 'bg-status-fakturerad-bg text-status-fakturerad',
};

function StatusBadge({ stage }: { stage: BookingStage }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] rounded-[20px] px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px]',
        STATUS_COLOR[stage]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STAGE_META[stage].shortLabel}
    </span>
  );
}

function KpiCard({
  label,
  value,
  suffix,
  icon,
  change,
  changeType,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  icon: React.ReactNode;
  change: React.ReactNode;
  changeType?: 'up' | 'warn' | 'danger' | 'neutral';
}) {
  return (
    <div className="rounded-r-lg border border-border bg-surface p-[22px] pb-5 transition-colors hover:border-border-strong">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.6px] text-ink-muted">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-r-sm bg-gold-bg text-gold-dark">
          {icon}
        </div>
      </div>
      <div className="text-[30px] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
        {value}
        {suffix && <span className="ml-1 text-lg font-medium text-ink-muted">{suffix}</span>}
      </div>
      <div
        className={cn(
          'mt-1.5 flex items-center gap-1 text-xs font-medium text-ink-muted',
          changeType === 'up' && 'text-green',
          changeType === 'warn' && 'text-amber',
          changeType === 'danger' && 'text-red'
        )}
      >
        {change}
      </div>
    </div>
  );
}

function ExpenseChip({ typ }: { typ: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[10px] border border-border bg-surface-alt px-2 py-[2px] text-[11px] font-medium text-ink-soft">
      {typ}
    </span>
  );
}

const ISSUE_ICON_MAP = {
  UserX,
  MailCheck,
  ClipboardX,
  Wallet,
  AlertCircle,
};

const ISSUE_COLOR_BG: Record<Issue['color'], string> = {
  red: 'bg-red-bg text-red',
  amber: 'bg-amber-bg text-amber',
  orange: 'bg-status-genomford-bg text-status-genomford',
  violet: 'bg-violet-bg text-violet',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: bookings = [] } = useAllBookings();
  const { data: expenses = [] } = useExpenses();
  const { data: reviews = [] } = useQualityReviews();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [quickActionBooking, setQuickActionBooking] = useState<{
    booking: Booking;
    issue: Issue;
  } | null>(null);

  const issuesList = useMemo(
    () => getIssuesForBookings(bookings, MOCK_PERSONAL_EXPENSES),
    [bookings]
  );
  const visibleIssues = issuesList.slice(0, 8);
  const extraCount = Math.max(0, issuesList.length - visibleIssues.length);

  const aktiva = bookings.filter((b) => b.stage !== 'fakturerad').length;
  const veckan = bookings.filter((b) =>
    ['bokad', 'bekraftad', 'personal'].includes(b.stage)
  ).length;
  const obemannade = bookings.filter(
    (b) => !hasPersonnel(b) && b.stage !== 'fakturerad'
  ).length;
  const attFakturera = bookings.filter((b) => b.stage === 'aterrapporterad').length;
  const totalUtlagg = expenses.reduce((s, u) => s + u.belopp, 0);

  const weekBookings = bookings
    .filter((b) => !['fakturerad', 'aterrapporterad'].includes(b.stage))
    .slice(0, 6);

  const recentExpenses = [...expenses].reverse().slice(0, 5);

  const openBooking = (id: string) => {
    const b = bookings.find((x) => x.id === id);
    if (b) setSelectedBooking(b);
  };

  const topbarActions = (
    <>
      <button className="inline-flex items-center gap-2 rounded-r border border-border-strong bg-surface px-3 py-[6px] text-[13px] font-semibold text-ink transition-all hover:border-ink hover:bg-surface-alt">
        <Download size={14} strokeWidth={2} />
        Exportera
      </button>
      <button
        onClick={() => setShowNewModal(true)}
        className="inline-flex items-center gap-2 rounded-r bg-gold px-4 py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-dark"
      >
        <Plus size={14} strokeWidth={2} />
        Nytt uppdrag
      </button>
    </>
  );

  return (
    <AdminLayout
      pageTitle="Översikt"
      pageSub="Vad händer i Crew2you idag"
      actions={topbarActions}
    >
      {/* KPI Grid */}
      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
        <KpiCard
          label="Aktiva uppdrag"
          value={aktiva}
          icon={<CalendarDays size={14} strokeWidth={2} />}
          change={
            <>
              <TrendingUp size={14} strokeWidth={2} />
              +3 denna vecka
            </>
          }
          changeType="up"
        />
        <KpiCard
          label="Kommande vecka"
          value={veckan}
          icon={<Clock size={14} strokeWidth={2} />}
          change={
            <>
              {obemannade > 0 ? (
                <AlertCircle size={14} strokeWidth={2} />
              ) : (
                <Check size={14} strokeWidth={2} />
              )}
              {obemannade} saknar personal
            </>
          }
          changeType={obemannade > 0 ? 'warn' : undefined}
        />
        <KpiCard
          label="Att fakturera"
          value={attFakturera}
          icon={<Receipt size={14} strokeWidth={2} />}
          change={
            <>
              <Check size={14} strokeWidth={2} />
              Klara att exporteras
            </>
          }
          changeType="up"
        />
        <KpiCard
          label="Utlägg denna månad"
          value={totalUtlagg.toLocaleString('sv-SE')}
          suffix="kr"
          icon={<Wallet size={14} strokeWidth={2} />}
          change={<>{expenses.length} poster registrerade</>}
        />
      </div>

      {/* Two-column grid: week table + needs attention */}
      <div className="mb-4 grid grid-cols-[2fr_1fr] gap-4">
        {/* Week bookings table */}
        <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-[22px] py-[18px]">
            <h2 className="text-[15px] font-bold tracking-[-0.01em] text-ink">
              Uppdrag denna vecka
            </h2>
            <button
              onClick={() => navigate('/admin/pipeline')}
              className="inline-flex items-center gap-2 rounded-r bg-transparent px-3 py-1.5 text-[13px] font-semibold text-ink-soft transition-all hover:bg-surface-alt hover:text-ink"
            >
              Pipeline <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Datum', 'Butik', 'Kund', 'Personal', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap border-b border-border bg-surface-alt px-[18px] py-3 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekBookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => openBooking(b.id)}
                    className="cursor-pointer transition-colors hover:bg-surface-alt [&:last-child>td]:border-b-0"
                  >
                    <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] font-semibold text-ink">
                      {b.dagar}
                    </td>
                    <td className="border-b border-border px-[18px] py-3.5">
                      <div className="text-[13.5px] font-semibold text-ink">{b.butik}</div>
                      <div className="mt-0.5 text-[11.5px] text-ink-muted">{b.ort}</div>
                    </td>
                    <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] text-ink">
                      {b.kund}
                    </td>
                    <td className="border-b border-border px-[18px] py-3.5 text-[13.5px]">
                      {hasPersonnel(b) ? (
                        getPersonnelDisplay(b)
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red">
                          <UserX size={14} strokeWidth={2} />
                          Ej tillsatt
                        </span>
                      )}
                    </td>
                    <td className="border-b border-border px-[18px] py-3.5">
                      <StatusBadge stage={b.stage} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Needs attention */}
        <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
          <div className="border-b border-border px-[22px] py-[18px]">
            <h2 className="text-[15px] font-bold tracking-[-0.01em] text-ink">
              Behöver uppmärksamhet
            </h2>
          </div>
          <div>
            {visibleIssues.length > 0 ? (
              <>
                {visibleIssues.map(({ booking: b, issue }) => {
                  const IconComp = ISSUE_ICON_MAP[issue.iconName];
                  return (
                    <div
                      key={b.id}
                      onClick={() =>
                        setQuickActionBooking({ booking: b, issue })
                      }
                      className="flex cursor-pointer items-center gap-3 border-b border-border px-[22px] py-3 transition-colors last:border-b-0 hover:bg-surface-alt"
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-r-sm',
                          ISSUE_COLOR_BG[issue.color]
                        )}
                      >
                        <IconComp size={14} strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-semibold text-ink">
                          {issue.label}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-ink-muted">
                          {b.butik} · {b.dagar}
                        </div>
                      </div>
                      <span className="flex-shrink-0 text-[12.5px] font-semibold text-gold-dark">
                        Lös →
                      </span>
                    </div>
                  );
                })}
                {extraCount > 0 && (
                  <div className="px-[22px] py-2.5 text-center text-[12.5px] font-medium text-ink-muted">
                    Visa alla ({issuesList.length})
                  </div>
                )}
              </>
            ) : (
              <div className="px-[22px] py-12 text-center text-ink-muted">
                <Check size={22} strokeWidth={1.75} className="mx-auto mb-3 text-ink-faint" />
                <div>Allt under kontroll</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent expenses */}
      <div className="overflow-hidden rounded-r-lg border border-border bg-surface">
        <div className="border-b border-border px-[22px] py-[18px]">
          <h2 className="text-[15px] font-bold tracking-[-0.01em] text-ink">
            Senaste utlägg från fält
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Datum', 'Person', 'Typ', 'Uppdrag', 'Beskrivning', 'Belopp'].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'whitespace-nowrap border-b border-border bg-surface-alt px-[18px] py-3 text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-muted',
                        i === 5 && 'text-right'
                      )}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((u) => {
                const booking = bookings.find((b) => b.id === u.bokningId);
                return (
                  <tr
                    key={u.id}
                    onClick={() => booking && openBooking(booking.id)}
                    className={cn(
                      'transition-colors hover:bg-surface-alt [&:last-child>td]:border-b-0',
                      booking && 'cursor-pointer'
                    )}
                  >
                    <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] text-ink-muted">
                      {u.datum}
                    </td>
                    <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] font-semibold text-ink">
                      {u.person}
                    </td>
                    <td className="border-b border-border px-[18px] py-3.5">
                      <ExpenseChip typ={u.typ} />
                    </td>
                    <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] text-ink">
                      {booking ? booking.butik : '–'}
                    </td>
                    <td className="border-b border-border px-[18px] py-3.5 text-[13.5px] text-ink-muted">
                      {u.beskrivning}
                    </td>
                    <td className="border-b border-border px-[18px] py-3.5 text-right text-[13.5px] font-semibold text-ink">
                      {u.belopp.toLocaleString('sv-SE')} kr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality card */}
      {(() => {
        const avgScore = reviews.length > 0
          ? Math.round((reviews.reduce((s, r) => s + r.averageScore, 0) / reviews.length) * 10) / 10
          : 0;
        const latest = [...reviews].sort((a, b) => b.date.localeCompare(a.date))[0];
        const genomforda = bookings.filter((b) =>
          ['genomford', 'aterrapporterad', 'fakturerad'].includes(b.stage)
        ).length;
        const nextReviewIn = Math.max(10 - (genomforda - reviews.length * 10) % 10, 0);
        return (
          <div
            onClick={() => navigate('/admin/quality')}
            className="mt-4 cursor-pointer overflow-hidden rounded-r-lg border border-border bg-surface transition-colors hover:border-border-strong"
          >
            <div className="border-b border-border px-[22px] py-[18px]">
              <h2 className="flex items-center gap-2 text-[15px] font-bold tracking-[-0.01em] text-ink">
                <ClipboardCheck size={16} strokeWidth={2} className="text-gold-dark" />
                Kvalitet
              </h2>
            </div>
            <div className="px-[22px] py-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-semibold text-ink">
                  Snittbetyg: {avgScore}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      strokeWidth={1.75}
                      className={s <= Math.round(avgScore) ? 'text-gold' : 'text-border-strong'}
                      fill={s <= Math.round(avgScore) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
              {latest && (
                <div className="text-[13px] text-ink-muted">
                  Senaste: {latest.personnelName} {latest.averageScore} — {latest.date}
                </div>
              )}
              <div className="text-[13px] text-ink-muted">
                Nästa uppföljning om {nextReviewIn} uppdrag
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modals */}
      {quickActionBooking && (
        <QuickActionModal
          booking={quickActionBooking.booking}
          issue={quickActionBooking.issue}
          onClose={() => setQuickActionBooking(null)}
          onOpenDetail={() => {
            setSelectedBooking(quickActionBooking.booking);
            setQuickActionBooking(null);
          }}
        />
      )}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
      {showNewModal && (
        <NewBookingModal onClose={() => setShowNewModal(false)} />
      )}
    </AdminLayout>
  );
}
