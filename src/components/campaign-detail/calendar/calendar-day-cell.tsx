import { memo } from 'react';

import { Badge } from '@/components/ui/badge';

import type { MoonPhaseInfo } from '../use-calendar-state';
import { MoonPhaseIcon } from './moon-phase-icon';

// =====================================================================================
// CalendarDayCell — single day cell in the month grid (React.memo)
// =====================================================================================

interface CalendarDayCellProps {
  dayIndex: number;
  dayOfMonth: number;
  eventCount: number;
  moonPhases: MoonPhaseInfo[];
  isSelected: boolean;
  isToday: boolean;
  tabIndex: number;
  onSelect: (dayIndex: number) => void;
}

export const CalendarDayCell = memo(function CalendarDayCell({
  dayIndex,
  dayOfMonth,
  eventCount,
  moonPhases,
  isSelected,
  isToday,
  tabIndex,
  onSelect,
}: CalendarDayCellProps) {
  return (
    <td role="gridcell">
      <button
        type="button"
        tabIndex={tabIndex}
        onClick={() => onSelect(dayIndex)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(dayIndex);
          }
        }}
        aria-current={isToday ? 'date' : undefined}
        aria-selected={isSelected}
        className={[
          'flex h-11 w-full min-w-11 flex-col items-center justify-center rounded-md text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          isToday && 'ring-primary ring-2',
          isSelected && 'bg-primary text-primary-foreground',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="font-medium">{dayOfMonth + 1}</span>
        <span className="flex items-center gap-0.5">
          {eventCount > 0 && (
            <Badge variant="secondary" className="h-3 px-1 text-[9px]">
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
              size={10}
            />
          ))}
        </span>
      </button>
    </td>
  );
});
