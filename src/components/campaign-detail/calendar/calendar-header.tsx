import { ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { CalendarDate } from '@/lib/calendar/calendar-engine';
import type {
  CalendarDefinition,
  CalendarSeason,
} from '@/lib/schemas/calendar';

import type { MoonPhaseInfo } from '../use-calendar-state';
import { MoonPhaseIcon } from './moon-phase-icon';

// =====================================================================================
// CalendarHeader — Date display, advance buttons, month navigation
// =====================================================================================

interface CalendarHeaderProps {
  currentDate: CalendarDate;
  definition: CalendarDefinition;
  currentSeason: CalendarSeason | null;
  currentWeekday: string;
  currentMoonPhases: readonly MoonPhaseInfo[];
  epochLabel: string;
  eraName: string;
  onAdvanceDay: (amount: number) => void;
  onNavigateMonth: (direction: -1 | 1) => void;
  viewMonth: { year: number; monthIndex: number };
}

export function CalendarHeader({
  currentDate,
  definition,
  currentSeason,
  currentWeekday,
  currentMoonPhases,
  epochLabel,
  eraName,
  onAdvanceDay,
  onNavigateMonth,
  viewMonth,
}: CalendarHeaderProps) {
  const monthName = definition.months[currentDate.monthIndex]?.name ?? '';
  const viewMonthName = definition.months[viewMonth.monthIndex]?.name ?? '';
  const yearLabel = eraName
    ? `${currentDate.year + 1} ${epochLabel || eraName}`
    : `Year ${currentDate.year + 1}`;

  return (
    <div className="space-y-3">
      {/* Current date display */}
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="text-lg font-semibold">
          {currentWeekday}, {monthName} {currentDate.dayOfMonth + 1}
        </h3>
        <span className="text-muted-foreground text-sm">{yearLabel}</span>
        {currentSeason && (
          <span className="text-muted-foreground text-sm">
            — {currentSeason.name}
          </span>
        )}
      </div>

      {/* Moon phases */}
      {currentMoonPhases.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {currentMoonPhases.map(mp => (
            <span
              key={mp.name}
              className="text-muted-foreground flex items-center gap-1 text-xs"
            >
              <MoonPhaseIcon
                phase={mp.phase}
                moonName={mp.name}
                phaseName={mp.phaseName}
                illumination={mp.illumination}
                size={16}
              />
              <span>
                {mp.name}: {mp.phaseName}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Advance time controls + month navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdvanceDay(1)}
            aria-label="Advance 1 day"
          >
            +1 Day
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdvanceDay(7)}
            aria-label="Advance 1 week"
          >
            +1 Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdvanceDay(30)}
            aria-label="Advance 1 month"
          >
            <ChevronsRight className="mr-1 h-3 w-3" />
            +30
          </Button>
        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigateMonth(-1)}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[8rem] text-center text-sm font-medium">
            {viewMonthName} — Year {viewMonth.year + 1}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigateMonth(1)}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
