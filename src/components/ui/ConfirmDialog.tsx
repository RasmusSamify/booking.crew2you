import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ConfirmDialogProps {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Bekräfta',
  cancelLabel = 'Avbryt',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/45 p-5 backdrop-blur-[4px] animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full max-w-[420px] overflow-hidden rounded-r-xl bg-surface shadow-lg animate-slide-up">
        <div className="flex items-start gap-3 px-6 py-5">
          {variant === 'danger' && (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-bg">
              <AlertTriangle size={20} strokeWidth={2} className="text-red" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-[16px] font-bold tracking-tight text-ink">{title}</h3>
            <div className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{message}</div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border bg-surface-alt px-6 py-3.5">
          <button
            onClick={onCancel}
            className="inline-flex items-center rounded-r px-4 py-2 text-[13.5px] font-semibold text-ink-muted hover:bg-surface hover:text-ink"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'inline-flex items-center rounded-r px-4 py-2 text-[13.5px] font-semibold text-white transition-all',
              variant === 'danger'
                ? 'bg-red hover:opacity-90'
                : 'bg-gold hover:bg-gold-dark'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
