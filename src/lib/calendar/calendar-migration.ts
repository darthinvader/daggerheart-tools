import type {
  CalendarData,
  CalendarStateV1,
  MultiCalendarEnvelope,
} from '@/lib/schemas/calendar';
import {
  CALENDAR_SCHEMA_VERSION,
  CALENDAR_SCHEMA_VERSION_V1,
  CalendarDataSchema,
  DEFAULT_CALENDAR_COLOR,
} from '@/lib/schemas/calendar';
import { generateId } from '@/lib/utils';

// =====================================================================================
// Runtime migration: v1 → v2 (pure functions, no side effects)
// =====================================================================================

/** Default name applied to the single calendar during v1 → v2 migration. */
const MIGRATED_CALENDAR_NAME = 'Main Calendar';

/**
 * Convert a v1 single-calendar state into a v2 multi-calendar envelope.
 *
 * - Generates a stable UUID for the migrated calendar.
 * - Assigns the default accent color.
 * - Names it "Main Calendar".
 * - Existing events are carried over as-is (no endDay, no custom categories).
 *
 * This function is pure — it has no side effects and always returns
 * a structurally valid MultiCalendarEnvelope.
 */
export function migrateV1ToV2(v1: CalendarStateV1): MultiCalendarEnvelope {
  const calendarId = generateId();

  return {
    version: CALENDAR_SCHEMA_VERSION,
    activeCalendarId: calendarId,
    calendars: [
      {
        id: calendarId,
        name: MIGRATED_CALENDAR_NAME,
        color: DEFAULT_CALENDAR_COLOR,
        preset: v1.preset,
        definition: v1.definition,
        currentDay: v1.currentDay,
        epochLabel: v1.epochLabel,
        eraName: v1.eraName,
        events: v1.events,
        customCategories: [],
      },
    ],
  };
}

/**
 * Parse raw JSONB from the database and ensure it's in v2 format.
 *
 * 1. Validates with `CalendarDataSchema` (accepts v1 or v2).
 * 2. If v1, migrates to v2 via `migrateV1ToV2`.
 * 3. Returns the v2 envelope or throws on invalid data.
 *
 * Usage:
 * ```ts
 * const calendar = parseAndMigrateCalendar(campaign.calendar);
 * // calendar is always MultiCalendarEnvelope (v2)
 * ```
 */
export function parseAndMigrateCalendar(raw: unknown): MultiCalendarEnvelope {
  const parsed: CalendarData = CalendarDataSchema.parse(raw);

  if (parsed.version === CALENDAR_SCHEMA_VERSION_V1) {
    return migrateV1ToV2(parsed);
  }

  return parsed;
}

/**
 * Safe variant — returns `null` instead of throwing on invalid data.
 * Logs a warning to console for observability.
 */
export function safeParseAndMigrateCalendar(
  raw: unknown
): MultiCalendarEnvelope | null {
  const result = CalendarDataSchema.safeParse(raw);

  if (!result.success) {
    console.warn(
      '[calendar-migration] Invalid calendar data:',
      result.error.format()
    );
    return null;
  }

  if (result.data.version === CALENDAR_SCHEMA_VERSION_V1) {
    return migrateV1ToV2(result.data);
  }

  return result.data;
}
