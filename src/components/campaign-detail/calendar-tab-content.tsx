import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import {
  dayIndexToDate,
  getMoonPhase,
  getMoonPhaseName,
  getWeekdayName,
} from '@/lib/calendar/calendar-engine';
import type { CalendarMoon } from '@/lib/schemas/calendar';
import type { Campaign } from '@/lib/schemas/campaign';

import { CalendarDayList } from './calendar/calendar-day-list';
import { CalendarHeader } from './calendar/calendar-header';
import { CalendarMonthGrid } from './calendar/calendar-month-grid';
import { CalendarSelector } from './calendar/calendar-selector';
import { CalendarSetup } from './calendar/calendar-setup';
import { CategoryManager } from './calendar/category-manager';
import { DayDetailPanel } from './calendar/day-detail-panel';
import { DeleteCalendarDialog } from './calendar/delete-calendar-dialog';
import { buildDayViewModels, useCalendarState } from './use-calendar-state';

// =====================================================================================
// CalendarResponsiveGrid — desktop month grid / mobile day list
// =====================================================================================

interface CalendarResponsiveGridProps {
  days: ReturnType<typeof buildDayViewModels>;
  selectedDay: number | null;
  currentDay: number;
  weekdays: string[];
  onSelectDay: (dayIndex: number) => void;
}

function CalendarResponsiveGrid({
  days,
  selectedDay,
  currentDay,
  weekdays,
  onSelectDay,
}: CalendarResponsiveGridProps) {
  return (
    <div className="flex-1">
      {/* Desktop: month grid */}
      <div className="hidden md:block">
        <CalendarMonthGrid
          days={days}
          selectedDay={selectedDay}
          currentDay={currentDay}
          weekdays={weekdays}
          onSelectDay={onSelectDay}
        />
      </div>
      {/* Mobile: day list */}
      <div className="block md:hidden">
        <CalendarDayList
          days={days}
          selectedDay={selectedDay}
          currentDay={currentDay}
          onSelectDay={onSelectDay}
        />
      </div>
    </div>
  );
}

// =====================================================================================
// CalendarTabContent — Top-level orchestrator for the Campaign Calendar tab
// =====================================================================================

interface CalendarTabContentProps {
  campaign: Campaign;
  setCampaign: Dispatch<SetStateAction<Campaign | null>>;
  markChanged: () => void;
}

export function CalendarTabContent({
  campaign,
  setCampaign,
  markChanged,
}: CalendarTabContentProps) {
  const {
    calendars,
    activeCalendar,
    activeCalendarId,
    currentDate,
    currentWeekday,
    currentSeason,
    currentMoonPhases,
    eventsByDay,
    advanceCampaignDay,
    addEvent,
    updateEvent,
    deleteEvent,
    setCalendar,
    createCalendar,
    removeCalendar,
    switchCalendar,
    renameCalendar,
    addCustomCategory,
    updateCustomCategory,
    deleteCustomCategory,
  } = useCalendarState({ campaign, setCampaign, markChanged });

  // Delete calendar confirmation state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const calendarToDelete = deleteTarget
    ? (calendars.find(c => c.id === deleteTarget) ?? null)
    : null;

  // View state — which month is being displayed
  const [viewMonth, setViewMonth] = useState<{
    year: number;
    monthIndex: number;
  }>(() => {
    if (currentDate) {
      return { year: currentDate.year, monthIndex: currentDate.monthIndex };
    }
    return { year: 0, monthIndex: 0 };
  });

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Reset view month and selection when the active calendar changes
  useEffect(() => {
    if (currentDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setViewMonth({
        year: currentDate.year,
        monthIndex: currentDate.monthIndex,
      });
    }
    setSelectedDay(null);
  }, [activeCalendarId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate months
  const handleNavigateMonth = useCallback(
    (direction: -1 | 1) => {
      if (!activeCalendar) return;
      setViewMonth(prev => {
        let newMonth = prev.monthIndex + direction;
        let newYear = prev.year;
        if (newMonth < 0) {
          if (prev.year === 0) return prev; // Already at earliest month — no-op
          newMonth = activeCalendar.definition.months.length - 1;
          newYear -= 1;
        } else if (newMonth >= activeCalendar.definition.months.length) {
          newMonth = 0;
          newYear += 1;
        }
        return { year: newYear, monthIndex: newMonth };
      });
    },
    [activeCalendar]
  );

  // Build day view models for the current view month
  const days = useMemo(() => {
    if (!activeCalendar) return [];
    return buildDayViewModels(
      activeCalendar,
      viewMonth.year,
      viewMonth.monthIndex,
      eventsByDay
    );
  }, [activeCalendar, viewMonth.year, viewMonth.monthIndex, eventsByDay]);

  // Selected day details
  const selectedDayDetails = useMemo(() => {
    if (selectedDay === null || !activeCalendar) return null;
    const date = dayIndexToDate(selectedDay, activeCalendar.definition);
    const weekday = getWeekdayName(selectedDay, activeCalendar.definition);
    const monthName =
      activeCalendar.definition.months[date.monthIndex]?.name ?? '';
    const events = eventsByDay.get(selectedDay) ?? [];
    const moonPhases = activeCalendar.definition.moons.map(
      (moon: CalendarMoon) => {
        const phase = getMoonPhase(selectedDay, moon);
        const phaseName = getMoonPhaseName(phase);
        const illumination = Math.round(
          ((1 - Math.cos(phase * 2 * Math.PI)) / 2) * 100
        );
        return { name: moon.name, phase, phaseName, illumination };
      }
    );
    return { date, weekday, monthName, events, moonPhases };
  }, [selectedDay, activeCalendar, eventsByDay]);

  // Stable callback for day selection
  const handleSelectDay = useCallback((dayIndex: number) => {
    setSelectedDay(prev => (prev === dayIndex ? null : dayIndex));
  }, []);

  // Close day detail panel
  const handleCloseDetail = useCallback(() => {
    setSelectedDay(null);
  }, []);

  // Delete-dialog open/close
  const handleDeleteDialogChange = useCallback((open: boolean) => {
    if (!open) setDeleteTarget(null);
  }, []);

  // Confirm calendar deletion
  const handleConfirmDelete = useCallback(
    (id: string) => {
      removeCalendar(id);
      setDeleteTarget(null);
    },
    [removeCalendar]
  );

  // --- Render ---

  // No calendar configured — show setup wizard
  if (!activeCalendar || !currentDate || !currentWeekday) {
    return <CalendarSetup onSetup={setCalendar} />;
  }

  return (
    <div className="space-y-4 py-4">
      {/* Calendar management toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <CalendarSelector
          calendars={calendars}
          activeCalendarId={activeCalendarId}
          onSwitch={switchCalendar}
          onCreate={createCalendar}
          onDelete={setDeleteTarget}
          onRename={renameCalendar}
        />
        <CategoryManager
          categories={activeCalendar.customCategories}
          onAdd={addCustomCategory}
          onUpdate={updateCustomCategory}
          onDelete={deleteCustomCategory}
        />
      </div>

      <CalendarHeader
        currentDate={currentDate}
        definition={activeCalendar.definition}
        currentSeason={currentSeason}
        currentWeekday={currentWeekday}
        currentMoonPhases={currentMoonPhases}
        epochLabel={activeCalendar.epochLabel}
        eraName={activeCalendar.eraName}
        onAdvanceDay={advanceCampaignDay}
        onNavigateMonth={handleNavigateMonth}
        viewMonth={viewMonth}
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <CalendarResponsiveGrid
          days={days}
          selectedDay={selectedDay}
          currentDay={activeCalendar.currentDay}
          weekdays={activeCalendar.definition.weekdays}
          onSelectDay={handleSelectDay}
        />

        {/* Day detail panel */}
        {selectedDayDetails && selectedDay !== null && (
          <div className="w-full md:w-80">
            <DayDetailPanel
              dayIndex={selectedDay}
              date={selectedDayDetails.date}
              monthName={selectedDayDetails.monthName}
              weekday={selectedDayDetails.weekday}
              events={selectedDayDetails.events}
              moonPhases={selectedDayDetails.moonPhases}
              customCategories={activeCalendar.customCategories}
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              onDeleteEvent={deleteEvent}
              onClose={handleCloseDetail}
            />
          </div>
        )}
      </div>

      {/* Delete calendar confirmation */}
      <DeleteCalendarDialog
        calendar={calendarToDelete}
        open={deleteTarget !== null}
        onOpenChange={handleDeleteDialogChange}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
