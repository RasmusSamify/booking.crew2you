import { cn } from '@/utils/cn';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function ToggleSwitch({ checked, onChange, className }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-[22px] w-10 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-150',
        checked ? 'bg-gold' : 'bg-border-strong',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-150',
          checked ? 'translate-x-[20px]' : 'translate-x-[2px]'
        )}
      />
    </button>
  );
}
