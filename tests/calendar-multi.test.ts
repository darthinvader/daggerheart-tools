import { describe, expect, it } from 'vitest';

import {
  addCalendar,
  deleteCalendar,
  getActiveCalendar,
  setActiveCalendar,
  updateCalendarInEnvelope,
} from '../src/lib/calendar/calendar-multi';
import { MAX_CALENDARS_PER_CAMPAIGN } from '../src/lib/schemas/calendar';
import {
  makeCalendar,
  makeCalendars,
  makeEnvelope,
} from './fixtures/calendar-v2-fixtures';

// ---------------------------------------------------------------------------
// getActiveCalendar
// ---------------------------------------------------------------------------

describe('getActiveCalendar', () => {
  it('returns the active calendar by ID', () => {
    const env = makeEnvelope();
    const active = getActiveCalendar(env);
    expect(active).toBeDefined();
    expect(active?.id).toBe(env.activeCalendarId);
  });

  it('returns undefined when activeCalendarId does not match', () => {
    const env = makeEnvelope({ activeCalendarId: 'nonexistent' });
    expect(getActiveCalendar(env)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// setActiveCalendar
// ---------------------------------------------------------------------------

describe('setActiveCalendar', () => {
  it('switches to an existing calendar', () => {
    const env = makeCalendars(3);
    const switched = setActiveCalendar(env, 'cal-2');
    expect(switched.activeCalendarId).toBe('cal-2');
  });

  it('throws when calendar does not exist', () => {
    const env = makeEnvelope();
    expect(() => setActiveCalendar(env, 'nope')).toThrow();
  });

  it('preserves calendars array', () => {
    const env = makeCalendars(2);
    const switched = setActiveCalendar(env, 'cal-1');
    expect(switched.calendars).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// addCalendar
// ---------------------------------------------------------------------------

describe('addCalendar', () => {
  it('appends a new calendar', () => {
    const env = makeEnvelope();
    const newCal = makeCalendar({ id: 'new-cal', name: 'New' });
    const result = addCalendar(env, newCal);
    expect(result.calendars).toHaveLength(2);
    expect(result.calendars[1].id).toBe('new-cal');
  });

  it('does not change activeCalendarId', () => {
    const env = makeEnvelope();
    const newCal = makeCalendar({ id: 'new-cal' });
    const result = addCalendar(env, newCal);
    expect(result.activeCalendarId).toBe(env.activeCalendarId);
  });

  it('throws when at capacity', () => {
    const env = makeCalendars(MAX_CALENDARS_PER_CAMPAIGN);
    const extra = makeCalendar({ id: 'overflow' });
    expect(() => addCalendar(env, extra)).toThrow('Cannot exceed');
  });
});

// ---------------------------------------------------------------------------
// deleteCalendar
// ---------------------------------------------------------------------------

describe('deleteCalendar', () => {
  it('removes the specified calendar', () => {
    const env = makeCalendars(3);
    const result = deleteCalendar(env, 'cal-1');
    expect(result.calendars).toHaveLength(2);
    expect(result.calendars.find(c => c.id === 'cal-1')).toBeUndefined();
  });

  it('no-ops when calendarId is not found', () => {
    const env = makeCalendars(2);
    const result = deleteCalendar(env, 'nonexistent');
    expect(result).toBe(env); // Same reference
  });

  it('throws when deleting the only calendar', () => {
    const env = makeEnvelope();
    expect(() => deleteCalendar(env, env.calendars[0].id)).toThrow(
      'Cannot delete the only calendar'
    );
  });

  it('reassigns activeCalendarId when active is deleted', () => {
    const env = makeCalendars(2);
    // Active is cal-0
    const result = deleteCalendar(env, 'cal-0');
    expect(result.activeCalendarId).toBe('cal-1');
  });

  it('keeps activeCalendarId when a non-active calendar is deleted', () => {
    const env = makeCalendars(3);
    const result = deleteCalendar(env, 'cal-2');
    expect(result.activeCalendarId).toBe('cal-0');
  });
});

// ---------------------------------------------------------------------------
// updateCalendarInEnvelope
// ---------------------------------------------------------------------------

describe('updateCalendarInEnvelope', () => {
  it('applies the updater to the matching calendar', () => {
    const env = makeCalendars(2);
    const result = updateCalendarInEnvelope(env, 'cal-1', cal => ({
      ...cal,
      name: 'Renamed',
    }));
    expect(result.calendars.find(c => c.id === 'cal-1')?.name).toBe('Renamed');
  });

  it('leaves other calendars untouched', () => {
    const env = makeCalendars(2);
    const result = updateCalendarInEnvelope(env, 'cal-1', cal => ({
      ...cal,
      name: 'Renamed',
    }));
    expect(result.calendars.find(c => c.id === 'cal-0')?.name).toBe(
      'Calendar 0'
    );
  });

  it('no-ops when calendarId is not found', () => {
    const env = makeEnvelope();
    const result = updateCalendarInEnvelope(env, 'nope', cal => ({
      ...cal,
      name: 'X',
    }));
    expect(result).toBe(env);
  });

  it('preserves envelope version', () => {
    const env = makeEnvelope();
    const result = updateCalendarInEnvelope(env, env.calendars[0].id, cal => ({
      ...cal,
      color: '#ff0000',
    }));
    expect(result.version).toBe(env.version);
  });
});
