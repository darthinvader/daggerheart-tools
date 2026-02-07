import { memo } from 'react';

import { Badge } from '@/components/ui/badge';

import type { MoonPhaseInfo } from '../use-calendar-state';
import { MoonPhaseIcon } from './moon-phase-icon';

// =====================================================================================
// CalendarDayItem — single day item for mobile list view
// =====================================================================================

interface CalendarDayItemProps {
  dayIndex: number;
  dayOfMonth: number;
  weekday: string;
  eventCount: number;
  moonPhases: MoonPhaseInfo[];
  isSelected: boolean;
  isToday: boolean;
  onSelect: (dayIndex: number) => void;
}

export const CalendarDayItem = memo(function CalendarDayItem({
  dayIndex,
  dayOfMonth,
  weekday,
  eventCount,
  moonPhases,
  isSelected,
  isToday,
  onSelect,
}: CalendarDayItemProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      aria-current={isToday ? 'date' : undefined}
      onClick={() => onSelect(dayIndex)}
      className={[
        'flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        isToday && 'ring-primary ring-2',
        isSelected && 'bg-primary text-primary-foreground',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="w-8 text-right font-medium">{dayOfMonth + 1}</span>
      <span className="text-muted-foreground flex-1">{weekday}</span>
      <span className="flex items-center gap-1">
        {eventCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {eventCount}
          </Badge>
        )}
        {moonPhases.map(mp => (
          <MoonPhaseIcon
            key={mp.name}
            phase={mp.phase}
            moonName={mp.name}
            phaseName={mp.phaseName}
            illumination={mp.illumination}
            size={14}
          />
        ))}
      </span>
    </button>
  );
});
