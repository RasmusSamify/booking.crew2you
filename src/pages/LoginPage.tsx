import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const loginSchema = z.object({
  email: z.string().email('Ange en giltig e-postadress'),
});

type LoginForm = z.infer<typeof loginSchema>;

type Mode = 'form' | 'sent' | 'password';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('form');
  const [sentToEmail, setSentToEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmitMagicLink = async (data: LoginForm) => {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      setError(error.message);
      return;
    }
    setSentToEmail(data.email);
    setMode('sent');
  };

  const onSubmitPassword = async () => {
    setError(null);
    const email = getValues('email');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[420px] rounded-r-xl bg-surface p-10 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-ink tracking-tight">Crew2you</h1>
          <p className="mt-1 text-sm text-ink-muted">Bokningssystem</p>
        </div>

        {mode === 'form' && (
          <form onSubmit={handleSubmit(onSubmitMagicLink)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                E-post
              </label>
              <input
                type="email"
                autoFocus
                {...register('email')}
                placeholder="du@crew2you.se"
                className="w-full rounded-r border border-border-strong px-3 py-2.5 text-[14px] text-ink focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red">{errors.email.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-red">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-r bg-gold py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-gold-dark disabled:opacity-50"
            >
              <Mail size={16} strokeWidth={2} />
              {isSubmitting ? 'Skickar...' : 'Skicka inloggningslänk'}
            </button>
            <button
              type="button"
              onClick={() => setMode('password')}
              className="w-full text-center text-xs text-ink-muted hover:text-ink"
            >
              Logga in med lösenord istället
            </button>
          </form>
        )}

        {mode === 'sent' && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-bg">
              <CheckCircle2 size={28} strokeWidth={2} className="text-green" />
            </div>
            <h2 className="text-lg font-bold text-ink">Kolla din inkorg</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Vi har skickat en inloggningslänk till
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{sentToEmail}</p>
            <p className="mt-4 text-xs text-ink-faint">
              Kontrollera skräpposten om mailet inte dyker upp inom en minut.
            </p>
            <button
              onClick={() => setMode('form')}
              className="mt-6 text-xs text-ink-muted hover:text-ink"
            >
              ← Tillbaka
            </button>
          </div>
        )}

        {mode === 'password' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitPassword();
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                E-post
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-r border border-border-strong px-3 py-2.5 text-[14px] text-ink focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Lösenord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full rounded-r border border-border-strong px-3 py-2.5 text-[14px] text-ink focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold-bg"
              />
            </div>
            {error && <p className="text-sm text-red">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-r bg-ink py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-ink-soft"
            >
              Logga in
            </button>
            <button
              type="button"
              onClick={() => setMode('form')}
              className="w-full text-center text-xs text-ink-muted hover:text-ink"
            >
              ← Använd magisk länk istället
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
