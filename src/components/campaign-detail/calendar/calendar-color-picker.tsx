import { Check } from 'lucide-react';

import {
  CALENDAR_COLOR_NAMES,
  CALENDAR_COLOR_PRESETS,
} from '@/lib/schemas/calendar';
import { cn } from '@/lib/utils';

// =====================================================================================
// CalendarColorPicker — Accessible swatch grid using radiogroup semantics (H1)
// =====================================================================================

interface CalendarColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  /** Optional label id for aria-labelledby. */
  labelId?: string;
}

export function CalendarColorPicker({
  value,
  onChange,
  labelId,
}: CalendarColorPickerProps) {
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      next = (idx + 1) % CALENDAR_COLOR_PRESETS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      next =
        (idx - 1 + CALENDAR_COLOR_PRESETS.length) %
        CALENDAR_COLOR_PRESETS.length;
    }
    if (next !== null) {
      onChange(CALENDAR_COLOR_PRESETS[next]);
      // Focus the next swatch
      const container = e.currentTarget.parentElement;
      const nextEl = container?.children[next] as HTMLButtonElement | undefined;
      nextEl?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={labelId ? undefined : 'Calendar color'}
      aria-labelledby={labelId}
      className="flex flex-wrap gap-2"
    >
      {CALENDAR_COLOR_PRESETS.map((color, idx) => {
        const isSelected = value === color;
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={CALENDAR_COLOR_NAMES[color] ?? color}
            tabIndex={isSelected ? 0 : -1}
            className={cn(
              'focus-visible:ring-ring flex h-7 w-7 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              isSelected ? 'border-foreground' : 'border-transparent'
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            onKeyDown={e => handleKeyDown(e, idx)}
          >
            {isSelected && (
              <Check className="h-3.5 w-3.5 text-white drop-shadow-sm" />
            )}
          </button>
        );
      })}
    </div>
  );
}
