import { useState, useCallback, useEffect } from 'react';
import { RefreshCw, Inbox } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import EmailCard from '@/components/inbox/EmailCard';
import EmailDetailModal from '@/components/inbox/EmailDetailModal';
import ParseAnimation from '@/components/inbox/ParseAnimation';
import { useInboxEmails } from '@/hooks/use-inbox';

export default function InboxPage() {
  const { data: emails = [] } = useInboxEmails();
  const [selectedEmailId, setSelectedEmailId] = useState('');
  const [parsedEmails, setParsedEmails] = useState<Set<string>>(new Set());
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!selectedEmailId && emails.length > 0) {
      setSelectedEmailId(emails[0].id);
    }
  }, [emails, selectedEmailId]);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);
  const newCount = emails.filter((e) => e.status === 'new').length;

  const handleParsed = useCallback(() => {
    setParsedEmails((prev) => {
      const next = new Set(prev);
      next.add(selectedEmailId);
      return next;
    });
  }, [selectedEmailId]);

  return (
    <AdminLayout
      pageTitle="Inkorg"
      pageSub="AI-parsade bokningsmail"
      activeNav="inkorg"
      actions={
        <button
          onClick={forceUpdate}
          className="inline-flex items-center gap-2 rounded-r border border-border-strong bg-surface px-3.5 py-2 text-[13px] font-semibold text-ink-soft transition-all hover:bg-surface-alt hover:text-ink"
        >
          <RefreshCw size={14} strokeWidth={2} />
          Uppdatera
        </button>
      }
    >
      <div className="flex gap-0 -mx-8 -mt-7 min-h-[calc(100vh-120px)]">
        {/* Left panel — email list */}
        <div className="w-[40%] flex-shrink-0 overflow-y-auto border-r border-border">
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <Inbox size={15} strokeWidth={1.75} className="text-ink-muted" />
            <span className="text-[13px] font-bold text-ink">Inkommande</span>
            {newCount > 0 && (
              <span className="rounded-[10px] bg-red px-[7px] py-0.5 text-[10px] font-bold text-white">
                {newCount}
              </span>
            )}
          </div>
          {emails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              isActive={email.id === selectedEmailId}
              onClick={() => setSelectedEmailId(email.id)}
            />
          ))}
        </div>

        {/* Right panel — detail */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedEmail ? (
            parsedEmails.has(selectedEmailId) ? (
              <EmailDetailModal
                key={selectedEmailId}
                email={selectedEmail}
                onStatusChange={forceUpdate}
              />
            ) : (
              <ParseAnimation onComplete={handleParsed} />
            )
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">
              Välj ett mail i listan
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
