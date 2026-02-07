import type {
  CalendarDefinition,
  CalendarEvent,
  CalendarMoon,
  CalendarSeason,
} from '@/lib/schemas/calendar';
import { MAX_EVENT_SPAN } from '@/lib/schemas/calendar';

// =====================================================================================
// Pure calendar math — no React, no side effects, no JS Date
// =====================================================================================

/** Structured date derived from an absolute day index. */
export interface CalendarDate {
  year: number;
  monthIndex: number;
  dayOfMonth: number;
}

/** Sum of all month day-counts in the definition. */
export function getTotalDaysInYear(definition: CalendarDefinition): number {
  let total = 0;
  for (const month of definition.months) {
    total += month.days;
  }
  return total;
}

/**
 * Convert an absolute day index to a structured { year, monthIndex, dayOfMonth }.
 * dayOfMonth is 0-based. Year is 0-based.
 */
export function dayIndexToDate(
  dayIndex: number,
  definition: CalendarDefinition
): CalendarDate {
  const totalDays = getTotalDaysInYear(definition);
  if (totalDays === 0) return { year: 0, monthIndex: 0, dayOfMonth: 0 };

  const year = Math.floor(dayIndex / totalDays);
  let remaining = dayIndex % totalDays;

  for (let i = 0; i < definition.months.length; i++) {
    if (remaining < definition.months[i].days) {
      return { year, monthIndex: i, dayOfMonth: remaining };
    }
    remaining -= definition.months[i].days;
  }

  // Fallback — should never happen with valid data
  const lastMonth = definition.months.length - 1;
  return { year, monthIndex: lastMonth, dayOfMonth: remaining };
}

/** Returns currentDay + amount, clamped to ≥ 0. */
export function advanceDay(currentDay: number, amount: number): number {
  return Math.max(0, currentDay + amount);
}

/**
 * Moon phase as a 0–1 float.
 * 0 = new moon, 0.5 = full moon, wraps at 1.
 */
export function getMoonPhase(dayIndex: number, moon: CalendarMoon): number {
  if (moon.cycleDays <= 0) return 0;
  return ((dayIndex + moon.offset) % moon.cycleDays) / moon.cycleDays;
}

/** Maps a 0–1 phase float to a human-readable name. */
export function getMoonPhaseName(phase: number): string {
  // Normalise into 0–1 range
  const p = ((phase % 1) + 1) % 1;

  if (p < 0.0625) return 'New Moon';
  if (p < 0.1875) return 'Waxing Crescent';
  if (p < 0.3125) return 'First Quarter';
  if (p < 0.4375) return 'Waxing Gibbous';
  if (p < 0.5625) return 'Full Moon';
  if (p < 0.6875) return 'Waning Gibbous';
  if (p < 0.8125) return 'Last Quarter';
  if (p < 0.9375) return 'Waning Crescent';
  return 'New Moon';
}

/** Weekday name for an absolute day index. */
export function getWeekdayName(
  dayIndex: number,
  definition: CalendarDefinition
): string {
  const len = definition.weekdays.length;
  if (len === 0) return '';
  return definition.weekdays[dayIndex % len];
}

/**
 * Find the active season at an absolute day index, or null if none defined.
 * Seasons are defined with 1-based startMonth/startDay relative to definition.months.
 * The last matching season whose start has been reached (within the year) wins.
 */
export function getSeasonAtDay(
  dayIndex: number,
  definition: CalendarDefinition
): CalendarSeason | null {
  if (definition.seasons.length === 0) return null;

  const totalDays = getTotalDaysInYear(definition);
  if (totalDays === 0) return null;

  const dayOfYear = dayIndex % totalDays;

  // Convert each season's startMonth/startDay to an absolute day-of-year
  const seasonStarts = definition.seasons.map(season => {
    let abs = 0;
    for (
      let m = 0;
      m < season.startMonth - 1 && m < definition.months.length;
      m++
    ) {
      abs += definition.months[m].days;
    }
    abs += season.startDay - 1;
    return abs;
  });

  // Find the last season whose start is ≤ dayOfYear
  let best: CalendarSeason | null = null;
  let bestStart = -1;
  for (let i = 0; i < definition.seasons.length; i++) {
    if (seasonStarts[i] <= dayOfYear && seasonStarts[i] >= bestStart) {
      best = definition.seasons[i];
      bestStart = seasonStarts[i];
    }
  }

  // If no season's start is ≤ dayOfYear, wrap: use the last season of the year
  if (best === null) {
    let lastIdx = 0;
    let lastStart = 0;
    for (let i = 0; i < seasonStarts.length; i++) {
      if (seasonStarts[i] >= lastStart) {
        lastStart = seasonStarts[i];
        lastIdx = i;
      }
    }
    best = definition.seasons[lastIdx];
  }

  return best;
}

/** Days in a specific month (0-based monthIndex). */
export function getDaysInMonth(
  monthIndex: number,
  definition: CalendarDefinition
): number {
  if (monthIndex < 0 || monthIndex >= definition.months.length) return 0;
  return definition.months[monthIndex].days;
}

/** Absolute day index of the first day of a given year + month. */
export function getMonthStartDayIndex(
  year: number,
  monthIndex: number,
  definition: CalendarDefinition
): number {
  const totalDays = getTotalDaysInYear(definition);
  let idx = year * totalDays;
  for (let m = 0; m < monthIndex && m < definition.months.length; m++) {
    idx += definition.months[m].days;
  }
  return idx;
}

// MAX_EVENT_SPAN imported from @/lib/schemas/calendar (single source of truth).
// Re-exported for consumers that import from this module.
export { MAX_EVENT_SPAN } from '@/lib/schemas/calendar';

/**
 * Index events by absoluteDay for O(1) per-day lookup.
 *
 * Multi-day events (those with `endDay > absoluteDay`) are expanded so they
 * appear in every day of their range `[absoluteDay, clampedEndDay]`.
 * If `endDay - absoluteDay > MAX_EVENT_SPAN`, the range is clamped.
 *
 * @param events - The event array (from a single Calendar).
 * @returns Map where key = absoluteDay, value = events touching that day.
 */
export function groupEventsByDay(
  events: readonly CalendarEvent[]
): Map<number, CalendarEvent[]> {
  const map = new Map<number, CalendarEvent[]>();
  for (const event of events) {
    const start = event.absoluteDay;
    const rawEnd = event.endDay ?? event.absoluteDay;
    const end = Math.min(rawEnd, start + MAX_EVENT_SPAN);
    for (let day = start; day <= end; day++) {
      const existing = map.get(day);
      if (existing) {
        existing.push(event);
      } else {
        map.set(day, [event]);
      }
    }
  }
  return map;
}
