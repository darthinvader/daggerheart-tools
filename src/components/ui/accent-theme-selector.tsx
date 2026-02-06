import { type AccentTheme, useTheme } from '@/components/providers/theme';
import { cn } from '@/lib/utils';

const accentOptions: { value: AccentTheme; label: string; color: string }[] = [
  { value: 'classic', label: 'Classic', color: 'bg-blue-500' },
  { value: 'parchment', label: 'Parchment', color: 'bg-amber-500' },
  { value: 'crimson', label: 'Crimson', color: 'bg-red-500' },
  { value: 'arcane', label: 'Arcane', color: 'bg-purple-500' },
];

export function AccentThemeSelector() {
  const { accentTheme, setAccentTheme } = useTheme();

  return (
    <div className="flex items-center gap-1">
      {accentOptions.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => setAccentTheme(option.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors',
            'hover:bg-accent',
            accentTheme === option.value
              ? 'border-ring bg-accent border'
              : 'border border-transparent'
          )}
          aria-label={`Accent theme: ${option.label}`}
          aria-pressed={accentTheme === option.value}
        >
          <span
            className={cn('size-3 rounded-full', option.color)}
            aria-hidden="true"
          />
          <span className="text-foreground hidden sm:inline">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
