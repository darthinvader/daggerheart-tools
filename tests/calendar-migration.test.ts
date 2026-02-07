import { describe, expect, it, vi } from 'vitest';

import {
  migrateV1ToV2,
  parseAndMigrateCalendar,
  safeParseAndMigrateCalendar,
} from '../src/lib/calendar/calendar-migration';
import {
  CALENDAR_SCHEMA_VERSION,
  DEFAULT_CALENDAR_COLOR,
} from '../src/lib/schemas/calendar';
import { makeV1Blob } from './fixtures/calendar-v2-fixtures';

// ---------------------------------------------------------------------------
// migrateV1ToV2
// ---------------------------------------------------------------------------

describe('migrateV1ToV2', () => {
  it('wraps v1 data into a v2 envelope', () => {
    const v1 = makeV1Blob();
    const v2 = migrateV1ToV2(v1);
    expect(v2.version).toBe(CALENDAR_SCHEMA_VERSION);
    expect(v2.calendars).toHaveLength(1);
  });

  it('preserves currentDay, epochLabel, eraName', () => {
    const v1 = makeV1Blob();
    const v2 = migrateV1ToV2(v1);
    const cal = v2.calendars[0];
    expect(cal.currentDay).toBe(v1.currentDay);
    expect(cal.epochLabel).toBe(v1.epochLabel);
    expect(cal.eraName).toBe(v1.eraName);
  });

  it('carries over events from v1', () => {
    const v1 = makeV1Blob();
    const v2 = migrateV1ToV2(v1);
    expect(v2.calendars[0].events).toHaveLength(1);
    expect(v2.calendars[0].events[0].title).toBe('Old Event');
  });

  it('assigns the default accent color', () => {
    const v2 = migrateV1ToV2(makeV1Blob());
    expect(v2.calendars[0].color).toBe(DEFAULT_CALENDAR_COLOR);
  });

  it('names the migrated calendar "Main Calendar"', () => {
    const v2 = migrateV1ToV2(makeV1Blob());
    expect(v2.calendars[0].name).toBe('Main Calendar');
  });

  it('initializes customCategories as empty', () => {
    const v2 = migrateV1ToV2(makeV1Blob());
    expect(v2.calendars[0].customCategories).toEqual([]);
  });

  it('sets activeCalendarId to the migrated calendar id', () => {
    const v2 = migrateV1ToV2(makeV1Blob());
    expect(v2.activeCalendarId).toBe(v2.calendars[0].id);
  });
});

// ---------------------------------------------------------------------------
// parseAndMigrateCalendar
// ---------------------------------------------------------------------------

describe('parseAndMigrateCalendar', () => {
  it('parses valid v1 data and returns v2', () => {
    const result = parseAndMigrateCalendar(makeV1Blob());
    expect(result.version).toBe(CALENDAR_SCHEMA_VERSION);
  });

  it('passes through valid v2 data unchanged', () => {
    const v2Input = migrateV1ToV2(makeV1Blob());
    const result = parseAndMigrateCalendar(v2Input);
    expect(result).toEqual(v2Input);
  });

  it('throws on completely invalid data', () => {
    expect(() => parseAndMigrateCalendar({ garbage: true })).toThrow();
  });
});

// ---------------------------------------------------------------------------
// safeParseAndMigrateCalendar
// ---------------------------------------------------------------------------

describe('safeParseAndMigrateCalendar', () => {
  it('returns v2 envelope for valid v1 data', () => {
    const result = safeParseAndMigrateCalendar(makeV1Blob());
    expect(result).not.toBeNull();
    expect(result?.version).toBe(CALENDAR_SCHEMA_VERSION);
  });

  it('returns null for invalid data', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = safeParseAndMigrateCalendar({ garbage: true });
    expect(result).toBeNull();
    spy.mockRestore();
  });

  it('logs a warning on invalid data', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    safeParseAndMigrateCalendar(null);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('returns null for null input', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = safeParseAndMigrateCalendar(null);
    expect(result).toBeNull();
    spy.mockRestore();
  });
});
