import { useCallback, useRef, useState } from 'react';

import type { DayViewModel } from '../use-calendar-state';
import { CalendarDayCell } from './calendar-day-cell';

// =====================================================================================
// CalendarMonthGrid — Desktop month grid with role="grid" and roving tabindex
// =====================================================================================

// -------------------------------------------------------------------------------------
// Helper: build rows of (DayViewModel | null)[] from a flat days array
// -------------------------------------------------------------------------------------
function buildRows(
  days: DayViewModel[],
  weekLength: number
): (DayViewModel | null)[][] {
  if (days.length === 0) {
    return [];
  }

  const rows: (DayViewModel | null)[][] = [];
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

  return rows;
}

// -------------------------------------------------------------------------------------
// Helper: build a dayIndex → flat-index map for O(1) lookup
// -------------------------------------------------------------------------------------
function buildDayIndexToFlatMap(days: DayViewModel[]): Map<number, number> {
  const map = new Map<number, number>();
  for (let i = 0; i < days.length; i++) {
    map.set(days[i].dayIndex, i);
  }
  return map;
}

// -------------------------------------------------------------------------------------
// Key → focus-index updater lookup (replaces switch statement)
// -------------------------------------------------------------------------------------
type FocusIndexUpdater = (current: number, max: number, step: number) => number;

const KEY_NAV_UPDATERS: Record<string, FocusIndexUpdater> = {
  ArrowRight: (cur, max) => Math.min(cur + 1, max),
  ArrowLeft: cur => Math.max(cur - 1, 0),
  ArrowDown: (cur, max, step) => Math.min(cur + step, max),
  ArrowUp: (cur, _max, step) => Math.max(cur - step, 0),
  Home: () => 0,
  End: (_cur, max) => max,
};

// -------------------------------------------------------------------------------------
// Sub-component: renders a single cell — either empty <td> or <CalendarDayCell>
// -------------------------------------------------------------------------------------
interface MonthGridCellProps {
  cell: DayViewModel | null;
  colIdx: number;
  flatIdx: number;
  focusIndex: number;
  selectedDay: number | null;
  currentDay: number;
  onSelectDay: (dayIndex: number) => void;
}

function MonthGridCell({
  cell,
  colIdx,
  flatIdx,
  focusIndex,
  selectedDay,
  currentDay,
  onSelectDay,
}: MonthGridCellProps) {
  if (!cell) {
    return <td key={`empty-${colIdx}`} />;
  }

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
}

// -------------------------------------------------------------------------------------
// Main component
// -------------------------------------------------------------------------------------

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

  const weekLength = weekdays.length || 1;
  const rows = buildRows(days, weekLength);
  const dayIndexToFlat = buildDayIndexToFlatMap(days);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const updater = KEY_NAV_UPDATERS[e.key];
      if (!updater) {
        return;
      }

      const maxIndex = days.length - 1;
      const newIndex = updater(focusIndex, maxIndex, weekLength);

      e.preventDefault();
      setFocusIndex(newIndex);

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
            {row.map((cell, colIdx) => (
              <MonthGridCell
                key={cell?.dayIndex ?? `empty-${colIdx}`}
                cell={cell}
                colIdx={colIdx}
                flatIdx={dayIndexToFlat.get(cell?.dayIndex ?? -1) ?? 0}
                focusIndex={focusIndex}
                selectedDay={selectedDay}
                currentDay={currentDay}
                onSelectDay={onSelectDay}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
