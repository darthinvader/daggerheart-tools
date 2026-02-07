import { useCallback, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import {
  advanceDay,
  dayIndexToDate,
  getMoonPhase,
  getMoonPhaseName,
  getSeasonAtDay,
  getTotalDaysInYear,
  getWeekdayName,
  groupEventsByDay,
} from '@/lib/calendar/calendar-engine';
import type { CalendarDate } from '@/lib/calendar/calendar-engine';
import {
  addCalendar as addCalendarToEnvelope,
  deleteCalendar as deleteCalendarFromEnvelope,
  getActiveCalendar,
  setActiveCalendar as setActiveCalendarInEnvelope,
  updateCalendarInEnvelope,
} from '@/lib/calendar/calendar-multi';
import type {
  Calendar,
  CalendarEvent,
  CalendarSeason,
  CalendarState,
  CustomCategory,
  MultiCalendarEnvelope,
} from '@/lib/schemas/calendar';
import { MAX_EVENTS_PER_CALENDAR } from '@/lib/schemas/calendar';
import type { Campaign } from '@/lib/schemas/campaign';

// =====================================================================================
// useCalendarState — v2 multi-calendar envelope support
// =====================================================================================

interface UseCalendarStateInput {
  campaign: Campaign;
  setCampaign: Dispatch<SetStateAction<Campaign | null>>;
  markChanged: () => void;
}

export interface MoonPhaseInfo {
  name: string;
  phase: number;
  phaseName: string;
  illumination: number;
}

export interface DayViewModel {
  dayIndex: number;
  dayOfMonth: number;
  weekday: string;
  eventCount: number;
  moonPhases: MoonPhaseInfo[];
}

interface UseCalendarStateReturn {
  envelope: MultiCalendarEnvelope | undefined;
  calendars: readonly Calendar[];
  activeCalendar: Calendar | undefined;
  activeCalendarId: string | undefined;
  currentDate: CalendarDate | null;
  currentWeekday: string | null;
  currentSeason: CalendarSeason | null;
  currentMoonPhases: readonly MoonPhaseInfo[];
  currentDayEvents: readonly CalendarEvent[];
  eventsByDay: Map<number, CalendarEvent[]>;
  advanceCampaignDay: (amount: number) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;
  setCalendar: (state: CalendarState) => void;
  createCalendar: (calendar: Calendar) => void;
  removeCalendar: (calendarId: string) => void;
  switchCalendar: (calendarId: string) => void;
  renameCalendar: (calendarId: string, newName: string) => void;
  setCalendarColor: (calendarId: string, color: string) => void;
  addCustomCategory: (category: CustomCategory) => void;
  updateCustomCategory: (category: CustomCategory) => void;
  deleteCustomCategory: (categoryId: string) => void;
}

export function useCalendarState({
  campaign,
  setCampaign,
  markChanged,
}: UseCalendarStateInput): UseCalendarStateReturn {
  const envelope = campaign.calendar;

  const activeCalendar = useMemo(
    () => (envelope ? getActiveCalendar(envelope) : undefined),
    [envelope]
  );

  // ---------------------------------------------------------------------------
  // Derived values (narrow dependencies)
  // ---------------------------------------------------------------------------

  const currentDate = useMemo(() => {
    if (!activeCalendar) return null;
    return dayIndexToDate(activeCalendar.currentDay, activeCalendar.definition);
  }, [activeCalendar]);

  const currentWeekday = useMemo(() => {
    if (!activeCalendar) return null;
    return getWeekdayName(activeCalendar.currentDay, activeCalendar.definition);
  }, [activeCalendar]);

  const currentSeason = useMemo(() => {
    if (!activeCalendar) return null;
    return getSeasonAtDay(activeCalendar.currentDay, activeCalendar.definition);
  }, [activeCalendar]);

  const currentMoonPhases = useMemo<readonly MoonPhaseInfo[]>(() => {
    if (!activeCalendar) return [];
    return activeCalendar.definition.moons.map(moon => {
      const phase = getMoonPhase(activeCalendar.currentDay, moon);
      const phaseName = getMoonPhaseName(phase);
      const illumination = Math.round(
        ((1 - Math.cos(phase * 2 * Math.PI)) / 2) * 100
      );
      return { name: moon.name, phase, phaseName, illumination };
    });
  }, [activeCalendar]);

  const eventsByDay = useMemo(() => {
    if (!activeCalendar) return new Map<number, CalendarEvent[]>();
    return groupEventsByDay(activeCalendar.events);
  }, [activeCalendar]);

  const currentDayEvents = useMemo<readonly CalendarEvent[]>(() => {
    if (!activeCalendar) return [];
    return eventsByDay.get(activeCalendar.currentDay) ?? [];
  }, [activeCalendar, eventsByDay]);

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  const updateEnvelope = useCallback(
    (updater: (env: MultiCalendarEnvelope) => MultiCalendarEnvelope) => {
      setCampaign(current => {
        if (!current?.calendar) return current;
        markChanged();
        return {
          ...current,
          calendar: updater(current.calendar as MultiCalendarEnvelope),
        };
      });
    },
    [setCampaign, markChanged]
  );

  const updateActive = useCallback(
    (updater: (cal: Calendar) => Calendar) => {
      updateEnvelope(env =>
        updateCalendarInEnvelope(env, env.activeCalendarId, updater)
      );
    },
    [updateEnvelope]
  );

  // ---------------------------------------------------------------------------
  // Existing mutations (refactored for envelope)
  // ---------------------------------------------------------------------------

  const advanceCampaignDay = useCallback(
    (amount: number) => {
      updateActive(cal => ({
        ...cal,
        currentDay: advanceDay(cal.currentDay, amount),
      }));
    },
    [updateActive]
  );

  const addEvent = useCallback(
    (event: Omit<CalendarEvent, 'id'>) => {
      updateActive(cal => {
        if (cal.events.length >= MAX_EVENTS_PER_CALENDAR) return cal;
        const newEvent: CalendarEvent = { ...event, id: crypto.randomUUID() };
        return { ...cal, events: [...cal.events, newEvent] };
      });
    },
    [updateActive]
  );

  const updateEvent = useCallback(
    (event: CalendarEvent) => {
      updateActive(cal => ({
        ...cal,
        events: cal.events.map(e => (e.id === event.id ? event : e)),
      }));
    },
    [updateActive]
  );

  const deleteEvent = useCallback(
    (eventId: string) => {
      updateActive(cal => ({
        ...cal,
        events: cal.events.filter(e => e.id !== eventId),
      }));
    },
    [updateActive]
  );

  const setCalendar = useCallback(
    (state: CalendarState) => {
      setCampaign(current => {
        if (!current) return current;
        markChanged();
        return { ...current, calendar: state };
      });
    },
    [setCampaign, markChanged]
  );

  // ---------------------------------------------------------------------------
  // New multi-calendar mutations
  // ---------------------------------------------------------------------------

  const createCalendar = useCallback(
    (calendar: Calendar) => {
      updateEnvelope(env => addCalendarToEnvelope(env, calendar));
    },
    [updateEnvelope]
  );

  const removeCalendar = useCallback(
    (calendarId: string) => {
      updateEnvelope(env => deleteCalendarFromEnvelope(env, calendarId));
    },
    [updateEnvelope]
  );

  const switchCalendar = useCallback(
    (calendarId: string) => {
      updateEnvelope(env => setActiveCalendarInEnvelope(env, calendarId));
    },
    [updateEnvelope]
  );

  const renameCalendar = useCallback(
    (calendarId: string, newName: string) => {
      updateEnvelope(env =>
        updateCalendarInEnvelope(env, calendarId, cal => ({
          ...cal,
          name: newName,
        }))
      );
    },
    [updateEnvelope]
  );

  const setCalendarColor = useCallback(
    (calendarId: string, color: string) => {
      updateEnvelope(env =>
        updateCalendarInEnvelope(env, calendarId, cal => ({ ...cal, color }))
      );
    },
    [updateEnvelope]
  );

  const addCustomCategory = useCallback(
    (category: CustomCategory) => {
      updateActive(cal => ({
        ...cal,
        customCategories: [...cal.customCategories, category],
      }));
    },
    [updateActive]
  );

  const updateCustomCategory = useCallback(
    (category: CustomCategory) => {
      updateActive(cal => ({
        ...cal,
        customCategories: cal.customCategories.map(c =>
          c.id === category.id ? category : c
        ),
      }));
    },
    [updateActive]
  );

  const deleteCustomCategory = useCallback(
    (categoryId: string) => {
      updateActive(cal => ({
        ...cal,
        customCategories: cal.customCategories.filter(c => c.id !== categoryId),
      }));
    },
    [updateActive]
  );

  return {
    envelope,
    calendars: envelope?.calendars ?? [],
    activeCalendar,
    activeCalendarId: envelope?.activeCalendarId,
    currentDate,
    currentWeekday,
    currentSeason,
    currentMoonPhases,
    currentDayEvents,
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
    setCalendarColor,
    addCustomCategory,
    updateCustomCategory,
    deleteCustomCategory,
  };
}

/** Build DayViewModel[] for a given month view. */
export function buildDayViewModels(
  calendar: Calendar,
  viewYear: number,
  viewMonthIndex: number,
  eventsByDay: Map<number, CalendarEvent[]>
): DayViewModel[] {
  const totalDaysInYear = getTotalDaysInYear(calendar.definition);
  const daysInMonth = calendar.definition.months[viewMonthIndex]?.days ?? 0;

  // Calculate the absolute day index of the first day of the view month
  let startIdx = viewYear * totalDaysInYear;
  for (let m = 0; m < viewMonthIndex; m++) {
    startIdx += calendar.definition.months[m].days;
  }

  const days: DayViewModel[] = [];
  for (let d = 0; d < daysInMonth; d++) {
    const dayIndex = startIdx + d;
    const weekday = getWeekdayName(dayIndex, calendar.definition);
    const events = eventsByDay.get(dayIndex);
    const moonPhases = calendar.definition.moons.map(moon => {
      const phase = getMoonPhase(dayIndex, moon);
      const phaseName = getMoonPhaseName(phase);
      const illumination = Math.round(
        ((1 - Math.cos(phase * 2 * Math.PI)) / 2) * 100
      );
      return { name: moon.name, phase, phaseName, illumination };
    });

    days.push({
      dayIndex,
      dayOfMonth: d,
      weekday,
      eventCount: events?.length ?? 0,
      moonPhases,
    });
  }

  return days;
}
