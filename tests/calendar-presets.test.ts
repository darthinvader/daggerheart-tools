import { describe, expect, it } from 'vitest';

import {
  createDaggerheartDefault,
  createGregorianLike,
  createHarptos,
} from '../src/lib/calendar/calendar-presets';
import {
  CALENDAR_SCHEMA_VERSION,
  CalendarStateSchema,
} from '../src/lib/schemas/calendar';

// ---------------------------------------------------------------------------
// createDaggerheartDefault
// ---------------------------------------------------------------------------

describe('createDaggerheartDefault', () => {
  const state = createDaggerheartDefault();
  const cal = state.calendars[0];

  it('passes Zod schema validation', () => {
    const result = CalendarStateSchema.safeParse(state);
    expect(result.success).toBe(true);
  });

  it('has current schema version', () => {
    expect(state.version).toBe(CALENDAR_SCHEMA_VERSION);
  });

  it('has preset "daggerheart-default"', () => {
    expect(cal.preset).toBe('daggerheart-default');
  });
});

// ---------------------------------------------------------------------------
// createGregorianLike
// ---------------------------------------------------------------------------

describe('createGregorianLike', () => {
  const state = createGregorianLike();
  const cal = state.calendars[0];

  it('passes Zod schema validation', () => {
    const result = CalendarStateSchema.safeParse(state);
    expect(result.success).toBe(true);
  });

  it('has 12 months', () => {
    expect(cal.definition.months).toHaveLength(12);
  });

  it('has 7 weekdays', () => {
    expect(cal.definition.weekdays).toHaveLength(7);
  });
});

// ---------------------------------------------------------------------------
// createHarptos
// ---------------------------------------------------------------------------

describe('createHarptos', () => {
  const state = createHarptos();
  const cal = state.calendars[0];

  it('passes Zod schema validation', () => {
    const result = CalendarStateSchema.safeParse(state);
    expect(result.success).toBe(true);
  });

  it('has total days equal to 365', () => {
    const totalDays = cal.definition.months.reduce((sum, m) => sum + m.days, 0);
    expect(totalDays).toBe(365);
  });

  it('has 12 months of 30 days each (standard months)', () => {
    const standardMonths = cal.definition.months.filter(m => m.days === 30);
    expect(standardMonths).toHaveLength(12);
  });

  it('handles special intercalary months', () => {
    // Harptos has 5 intercalary days (1-day months) → 12×30 + 5 = 365
    const specialMonths = cal.definition.months.filter(m => m.days !== 30);
    expect(specialMonths.length).toBeGreaterThan(0);
    const specialTotal = specialMonths.reduce((sum, m) => sum + m.days, 0);
    expect(specialTotal).toBe(5);
  });
});
