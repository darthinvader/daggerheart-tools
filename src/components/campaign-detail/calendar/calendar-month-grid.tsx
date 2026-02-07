import { useCallback, useRef, useState } from 'react';

import type { DayViewModel } from '../use-calendar-state';
import { CalendarDayCell } from './calendar-day-cell';

// =====================================================================================
// CalendarMonthGrid — Desktop month grid with role="grid" and roving tabindex
// =====================================================================================

interface CalendarMonthGridProps {
  days: DayViewModel[];
  selectedDay: number | null;
  currentDay: number;
  weekdays: string[];
  onSelectDay: (dayIndex: number) => void;
}

export function CalendarMonthGrid({
  days,
  selectedDay,
  currentDay,
  weekdays,
  onSelectDay,
}: CalendarMonthGridProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const gridRef = useRef<HTMLTableElement>(null);

  // Build rows: each row has weekdays.length cells
  const weekLength = weekdays.length || 1;
  const rows: (DayViewModel | null)[][] = [];

  if (days.length > 0) {
    // First day's position in week — day 0 starts at position (dayIndex % weekLength)
    const firstDayWeekPos = days[0].dayIndex % weekLength;
    let currentRow: (DayViewModel | null)[] = Array.from(
      { length: firstDayWeekPos },
      () => null
    );

    for (const day of days) {
      currentRow.push(day);
      if (currentRow.length >= weekLength) {
        rows.push(currentRow);
        currentRow = [];
      }
    }
    if (currentRow.length > 0) {
      while (currentRow.length < weekLength) currentRow.push(null);
      rows.push(currentRow);
    }
  }

  // Pre-build dayIndex → flat index map for O(1) lookup
  const dayIndexToFlat = new Map<number, number>();
  for (let i = 0; i < days.length; i++) {
    dayIndexToFlat.set(days[i].dayIndex, i);
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let newIndex = focusIndex;
      switch (e.key) {
        case 'ArrowRight':
          newIndex = Math.min(focusIndex + 1, days.length - 1);
          break;
        case 'ArrowLeft':
          newIndex = Math.max(focusIndex - 1, 0);
          break;
        case 'ArrowDown':
          newIndex = Math.min(focusIndex + weekLength, days.length - 1);
          break;
        case 'ArrowUp':
          newIndex = Math.max(focusIndex - weekLength, 0);
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = days.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      setFocusIndex(newIndex);
      // Focus the button in the new cell
      const buttons =
        gridRef.current?.querySelectorAll<HTMLButtonElement>('td button');
      buttons?.[newIndex]?.focus();
    },
    [focusIndex, days.length, weekLength]
  );

  return (
    <table
      ref={gridRef}
      role="grid"
      aria-label="Calendar month view"
      className="w-full border-collapse"
      onKeyDown={handleKeyDown}
    >
      <thead>
        <tr>
          {weekdays.map(wd => (
            <th
              key={wd}
              scope="col"
              className="text-muted-foreground p-1 text-center text-xs font-medium"
            >
              {wd}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {row.map((cell, colIdx) => {
              if (!cell) {
                return <td key={`empty-${colIdx}`} />;
              }
              const flatIdx = dayIndexToFlat.get(cell.dayIndex) ?? 0;
              return (
                <CalendarDayCell
                  key={cell.dayIndex}
                  dayIndex={cell.dayIndex}
                  dayOfMonth={cell.dayOfMonth}
                  eventCount={cell.eventCount}
                  moonPhases={cell.moonPhases}
                  isSelected={cell.dayIndex === selectedDay}
                  isToday={cell.dayIndex === currentDay}
                  tabIndex={flatIdx === focusIndex ? 0 : -1}
                  onSelect={onSelectDay}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
