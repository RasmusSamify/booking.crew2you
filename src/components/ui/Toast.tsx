import { useEffect, useState, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ToastItem {
  id: number;
  message: string;
  removing?: boolean;
}

let addToastFn: ((message: string) => void) | null = null;

export function toast(message: string) {
  addToastFn?.(message);
}

let nextId = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 200);
    }, 3000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  const dismiss = (id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex max-w-[380px] flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex min-w-[280px] items-start gap-3 rounded-r-lg border-l-[3px] border-l-gold bg-ink p-3.5 text-white shadow-lg',
            t.removing
              ? 'animate-[toastOut_0.2s_ease_forwards]'
              : 'animate-[toastIn_0.25s_cubic-bezier(0.4,0,0.2,1)]'
          )}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-r-sm bg-gold/15 text-gold">
            <Check size={14} strokeWidth={2} />
          </div>
          <div className="flex-1 text-[13px] font-medium leading-snug">
            {t.message}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="flex-shrink-0 text-white/50 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
