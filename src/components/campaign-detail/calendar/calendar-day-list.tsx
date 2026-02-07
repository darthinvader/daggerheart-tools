import { ScrollArea } from '@/components/ui/scroll-area';

import type { DayViewModel } from '../use-calendar-state';
import { CalendarDayItem } from './calendar-day-item';

// =====================================================================================
// CalendarDayList — Mobile day list (role="listbox")
// =====================================================================================

interface CalendarDayListProps {
  days: DayViewModel[];
  selectedDay: number | null;
  currentDay: number;
  onSelectDay: (dayIndex: number) => void;
}

export function CalendarDayList({
  days,
  selectedDay,
  currentDay,
  onSelectDay,
}: CalendarDayListProps) {
  return (
    <ScrollArea className="max-h-[60vh]">
      <div role="listbox" aria-label="Calendar days" className="space-y-1 p-1">
        {days.map(day => (
          <CalendarDayItem
            key={day.dayIndex}
            dayIndex={day.dayIndex}
            dayOfMonth={day.dayOfMonth}
            weekday={day.weekday}
            eventCount={day.eventCount}
            moonPhases={day.moonPhases}
            isSelected={day.dayIndex === selectedDay}
            isToday={day.dayIndex === currentDay}
            onSelect={onSelectDay}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
