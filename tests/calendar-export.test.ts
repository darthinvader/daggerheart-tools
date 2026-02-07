import { describe, expect, it } from 'vitest';

import {
  calendarFromExport,
  exportCalendar,
  exportFullCalendar,
  importCalendarDefinition,
  importFullCalendar,
  MAX_IMPORT_FILE_SIZE,
} from '../src/lib/calendar/calendar-export';
import {
  makeCalendar,
  makeEvent,
  SIMPLE_DEFINITION,
} from './fixtures/calendar-v2-fixtures';

// ---------------------------------------------------------------------------
// exportCalendar (definition-only)
// ---------------------------------------------------------------------------

describe('exportCalendar', () => {
  it('produces valid JSON', () => {
    const cal = makeCalendar();
    const json = exportCalendar(cal);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('includes definition, name, and preset', () => {
    const cal = makeCalendar({ name: 'My Cal', preset: 'gregorian' });
    const parsed = JSON.parse(exportCalendar(cal));
    expect(parsed.name).toBe('My Cal');
    expect(parsed.preset).toBe('gregorian');
    expect(parsed.definition).toBeDefined();
  });

  it('does NOT include events', () => {
    const cal = makeCalendar({ events: [makeEvent()] });
    const parsed = JSON.parse(exportCalendar(cal));
    expect(parsed.events).toBeUndefined();
  });

  it('sets exportVersion to 1', () => {
    const parsed = JSON.parse(exportCalendar(makeCalendar()));
    expect(parsed.exportVersion).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// exportFullCalendar (with events)
// ---------------------------------------------------------------------------

describe('exportFullCalendar', () => {
  it('includes events in the output', () => {
    const cal = makeCalendar({ events: [makeEvent({ title: 'Battle' })] });
    const parsed = JSON.parse(exportFullCalendar(cal));
    expect(parsed.events).toHaveLength(1);
    expect(parsed.events[0].title).toBe('Battle');
  });
});

// ---------------------------------------------------------------------------
// importCalendarDefinition
// ---------------------------------------------------------------------------

describe('importCalendarDefinition', () => {
  it('roundtrips a valid export', () => {
    const cal = makeCalendar();
    const json = exportCalendar(cal);
    const result = importCalendarDefinition(json);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe(cal.name);
    }
  });

  it('rejects invalid JSON', () => {
    const result = importCalendarDefinition('not json{');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Invalid JSON');
    }
  });

  it('rejects oversized input', () => {
    const huge = 'x'.repeat(MAX_IMPORT_FILE_SIZE + 1);
    const result = importCalendarDefinition(huge);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('2 MB');
    }
  });

  it('rejects valid JSON that does not match schema', () => {
    const result = importCalendarDefinition(JSON.stringify({ foo: 'bar' }));
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// importFullCalendar
// ---------------------------------------------------------------------------

describe('importFullCalendar', () => {
  it('roundtrips a full calendar export', () => {
    const cal = makeCalendar({ events: [makeEvent()] });
    const json = exportFullCalendar(cal);
    const result = importFullCalendar(json);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.events).toHaveLength(1);
      // IDs should be regenerated
      expect(result.data.id).not.toBe(cal.id);
    }
  });

  it('rejects data missing required fields', () => {
    const result = importFullCalendar(JSON.stringify({ foo: 'bar' }));
    expect(result.success).toBe(false);
  });

  it('rejects oversized input', () => {
    const result = importFullCalendar('x'.repeat(MAX_IMPORT_FILE_SIZE + 1));
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// calendarFromExport
// ---------------------------------------------------------------------------

describe('calendarFromExport', () => {
  it('creates a Calendar with a new ID', () => {
    const exported = {
      exportVersion: 1 as const,
      name: 'Imported',
      preset: 'custom' as const,
      definition: SIMPLE_DEFINITION,
      epochLabel: 'AE',
      eraName: 'First Age',
      customCategories: [],
    };
    const cal = calendarFromExport(exported);
    expect(cal.name).toBe('Imported');
    expect(cal.id).toBeTruthy();
    expect(cal.currentDay).toBe(0);
    expect(cal.events).toEqual([]);
  });

  it('uses the provided color', () => {
    const exported = {
      exportVersion: 1 as const,
      name: 'Test',
      preset: 'custom' as const,
      definition: SIMPLE_DEFINITION,
      epochLabel: '',
      eraName: '',
      customCategories: [],
    };
    const cal = calendarFromExport(exported, '#ef4444');
    expect(cal.color).toBe('#ef4444');
  });
});
