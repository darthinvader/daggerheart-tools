import type { Calendar, CalendarExport } from '@/lib/schemas/calendar';
import {
  CalendarExportSchema,
  CalendarSchema,
  DEFAULT_CALENDAR_COLOR,
} from '@/lib/schemas/calendar';
import { generateId } from '@/lib/utils';

// =====================================================================================
// Result type
// =====================================================================================

export type ImportResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// =====================================================================================
// Constants
// =====================================================================================

/** Maximum file size accepted for calendar import (2 MB). */
export const MAX_IMPORT_FILE_SIZE = 2 * 1024 * 1024;

// =====================================================================================
// Export helpers
// =====================================================================================

/** Serialize a calendar's definition (without events) to a portable JSON string. */
export function exportCalendar(calendar: Calendar): string {
  const obj: CalendarExport = {
    exportVersion: 1,
    name: calendar.name,
    preset: calendar.preset,
    definition: calendar.definition,
    epochLabel: calendar.epochLabel,
    eraName: calendar.eraName,
    customCategories: calendar.customCategories,
  };
  return JSON.stringify(obj, null, 2);
}

/** Serialize a full calendar (including events) to a JSON string. */
export function exportFullCalendar(calendar: Calendar): string {
  return JSON.stringify(calendar, null, 2);
}

// =====================================================================================
// Import helpers
// =====================================================================================

/** Parse and validate a portable calendar definition from a JSON string. */
export function importCalendarDefinition(
  raw: string
): ImportResult<CalendarExport> {
  if (raw.length > MAX_IMPORT_FILE_SIZE) {
    return { success: false, error: 'File exceeds the 2 MB size limit.' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { success: false, error: 'Invalid JSON.' };
  }

  const result = CalendarExportSchema.safeParse(parsed);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? 'Invalid calendar export.',
    };
  }

  return { success: true, data: result.data };
}

/** Parse and validate a full calendar (with events) from a JSON string. */
export function importFullCalendar(raw: string): ImportResult<Calendar> {
  if (raw.length > MAX_IMPORT_FILE_SIZE) {
    return { success: false, error: 'File exceeds the 2 MB size limit.' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { success: false, error: 'Invalid JSON.' };
  }

  // Minimal shape check before rebuilding
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('definition' in parsed) ||
    !('events' in parsed) ||
    !('name' in parsed)
  ) {
    return {
      success: false,
      error: 'Missing required fields: definition, events, name.',
    };
  }

  const source = parsed as Record<string, unknown>;

  // Regenerate IDs to avoid collisions
  const events = Array.isArray(source.events)
    ? source.events.map(e => {
        if (typeof e === 'object' && e !== null) {
          return { ...e, id: crypto.randomUUID() };
        }
        return e;
      })
    : [];

  const rebuilt = {
    ...source,
    id: generateId(),
    events,
  };

  const result = CalendarSchema.safeParse(rebuilt);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? 'Invalid calendar data.',
    };
  }

  return { success: true, data: result.data };
}

// =====================================================================================
// Conversion helper
// =====================================================================================

/** Build a new Calendar from an imported CalendarExport definition. */
export function calendarFromExport(
  exported: CalendarExport,
  color?: string
): Calendar {
  return {
    id: generateId(),
    name: exported.name,
    color: color ?? DEFAULT_CALENDAR_COLOR,
    preset: exported.preset,
    definition: exported.definition,
    currentDay: 0,
    epochLabel: exported.epochLabel,
    eraName: exported.eraName,
    events: [],
    customCategories: exported.customCategories,
  };
}
