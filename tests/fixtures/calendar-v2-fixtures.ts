/**
 * Shared test fixtures for v2 multi-calendar tests.
 *
 * These build minimal-but-valid objects that satisfy the Zod schemas
 * without requiring a running environment (no crypto, no DOM).
 */

import type {
  Calendar,
  CalendarDefinition,
  CalendarEvent,
  CustomCategory,
  MultiCalendarEnvelope,
} from '../../src/lib/schemas/calendar';
import {
  CALENDAR_SCHEMA_VERSION,
  DEFAULT_CALENDAR_COLOR,
} from '../../src/lib/schemas/calendar';

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

let _idCounter = 0;

/** Deterministic ID generator for tests (avoids crypto dependency). */
export function testId(prefix = 'test'): string {
  _idCounter += 1;
  return `${prefix}-${_idCounter}`;
}

/** Reset the test ID counter (call in beforeEach if needed). */
export function resetTestIds(): void {
  _idCounter = 0;
}

/** Minimal valid CalendarDefinition. */
export const SIMPLE_DEFINITION: CalendarDefinition = {
  months: [
    { name: 'Firstmoon', days: 30 },
    { name: 'Secondmoon', days: 30 },
  ],
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
  moons: [],
  seasons: [],
};

// ---------------------------------------------------------------------------
// Factory helpers
// ---------------------------------------------------------------------------

/** Build a single Calendar with sensible defaults. Override via `overrides`. */
export function makeCalendar(overrides: Partial<Calendar> = {}): Calendar {
  const id = overrides.id ?? testId('cal');
  return {
    id,
    name: 'Test Calendar',
    color: DEFAULT_CALENDAR_COLOR,
    preset: 'custom',
    definition: SIMPLE_DEFINITION,
    currentDay: 0,
    epochLabel: '',
    eraName: '',
    events: [],
    customCategories: [],
    ...overrides,
  };
}

/** Build a MultiCalendarEnvelope wrapping one calendar. */
export function makeEnvelope(
  overrides: Partial<MultiCalendarEnvelope> = {},
  calOverrides: Partial<Calendar> = {}
): MultiCalendarEnvelope {
  const cal = makeCalendar(calOverrides);
  return {
    version: CALENDAR_SCHEMA_VERSION,
    activeCalendarId: cal.id,
    calendars: [cal],
    ...overrides,
  };
}

/** Build an envelope with `n` calendars, active = first. */
export function makeCalendars(n: number): MultiCalendarEnvelope {
  const calendars = Array.from({ length: n }, (_, i) =>
    makeCalendar({ id: `cal-${i}`, name: `Calendar ${i}` })
  );
  return {
    version: CALENDAR_SCHEMA_VERSION,
    activeCalendarId: calendars[0].id,
    calendars,
  };
}

/** Build a valid CalendarEvent. */
export function makeEvent(
  overrides: Partial<CalendarEvent> = {}
): CalendarEvent {
  return {
    id: testId('evt'),
    absoluteDay: 0,
    title: 'Test Event',
    description: '',
    category: 'custom',
    ...overrides,
  };
}

/** Build a valid CustomCategory. */
export function makeCategory(
  overrides: Partial<CustomCategory> = {}
): CustomCategory {
  return {
    id: testId('cat'),
    name: 'Investigation',
    color: '#f97316',
    ...overrides,
  };
}

/** Build a minimal valid v1 blob for migration testing. */
export function makeV1Blob() {
  return {
    version: 1 as const,
    preset: 'custom' as const,
    definition: SIMPLE_DEFINITION,
    currentDay: 5,
    epochLabel: 'AE',
    eraName: 'First Age',
    events: [
      {
        id: 'v1-e1',
        absoluteDay: 3,
        title: 'Old Event',
        description: '',
        category: 'session' as const,
      },
    ],
  };
}
