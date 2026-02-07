import type { Calendar, MultiCalendarEnvelope } from '@/lib/schemas/calendar';
import { MAX_CALENDARS_PER_CAMPAIGN } from '@/lib/schemas/calendar';

/** Returns the currently active calendar, or `undefined` if not found. */
export function getActiveCalendar(
  envelope: MultiCalendarEnvelope
): Calendar | undefined {
  return envelope.calendars.find(c => c.id === envelope.activeCalendarId);
}

/** Returns a new envelope with `activeCalendarId` set to `calendarId`. Throws if not found. */
export function setActiveCalendar(
  envelope: MultiCalendarEnvelope,
  calendarId: string
): MultiCalendarEnvelope {
  if (!envelope.calendars.some(c => c.id === calendarId)) {
    throw new Error(`Calendar "${calendarId}" not found in envelope`);
  }
  return { ...envelope, activeCalendarId: calendarId };
}

/** Returns a new envelope with `calendar` appended. Throws if at capacity. */
export function addCalendar(
  envelope: MultiCalendarEnvelope,
  calendar: Calendar
): MultiCalendarEnvelope {
  if (envelope.calendars.length >= MAX_CALENDARS_PER_CAMPAIGN) {
    throw new Error(
      `Cannot exceed ${MAX_CALENDARS_PER_CAMPAIGN} calendars per campaign`
    );
  }
  return { ...envelope, calendars: [...envelope.calendars, calendar] };
}

/**
 * Returns a new envelope without the specified calendar.
 * - Throws if it's the only calendar (schema requires min 1).
 * - No-op (returns same reference) if `calendarId` not found.
 * - If the deleted calendar was active, falls back to the first remaining.
 */
export function deleteCalendar(
  envelope: MultiCalendarEnvelope,
  calendarId: string
): MultiCalendarEnvelope {
  if (!envelope.calendars.some(c => c.id === calendarId)) {
    return envelope;
  }
  if (envelope.calendars.length === 1) {
    throw new Error('Cannot delete the only calendar');
  }

  const calendars = envelope.calendars.filter(c => c.id !== calendarId);
  const activeCalendarId =
    envelope.activeCalendarId === calendarId
      ? calendars[0].id
      : envelope.activeCalendarId;

  return { ...envelope, activeCalendarId, calendars };
}

/**
 * Maps over calendars and applies `updater` to the one matching `calendarId`.
 * No-op (returns same reference) if `calendarId` is not found.
 */
export function updateCalendarInEnvelope(
  envelope: MultiCalendarEnvelope,
  calendarId: string,
  updater: (cal: Calendar) => Calendar
): MultiCalendarEnvelope {
  if (!envelope.calendars.some(c => c.id === calendarId)) {
    return envelope;
  }
  return {
    ...envelope,
    calendars: envelope.calendars.map(c =>
      c.id === calendarId ? updater(c) : c
    ),
  };
}
