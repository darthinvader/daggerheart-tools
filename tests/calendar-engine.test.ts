import { describe, expect, it } from 'vitest';

import {
  advanceDay,
  dayIndexToDate,
  getDaysInMonth,
  getMonthStartDayIndex,
  getMoonPhase,
  getMoonPhaseName,
  getSeasonAtDay,
  getTotalDaysInYear,
  getWeekdayName,
  groupEventsByDay,
} from '../src/lib/calendar/calendar-engine';
import type {
  CalendarDefinition,
  CalendarEvent,
  CalendarMoon,
} from '../src/lib/schemas/calendar';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const SIMPLE_DEF: CalendarDefinition = {
  months: [
    { name: 'First', days: 30 },
    { name: 'Second', days: 30 },
    { name: 'Third', days: 30 },
  ],
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  moons: [{ name: 'Luna', cycleDays: 30, offset: 0 }],
  seasons: [
    { name: 'Cold', startMonth: 1, startDay: 1 },
    { name: 'Warm', startMonth: 2, startDay: 1 },
  ],
};

const UNEQUAL_DEF: CalendarDefinition = {
  months: [
    { name: 'Short', days: 10 },
    { name: 'Long', days: 50 },
  ],
  weekdays: ['A', 'B', 'C'],
  moons: [],
  seasons: [],
};

// ---------------------------------------------------------------------------
// getTotalDaysInYear
// ---------------------------------------------------------------------------

describe('getTotalDaysInYear', () => {
  it('sums all month days', () => {
    expect(getTotalDaysInYear(SIMPLE_DEF)).toBe(90);
  });

  it('handles unequal months', () => {
    expect(getTotalDaysInYear(UNEQUAL_DEF)).toBe(60);
  });

  it('returns single-month total', () => {
    const def: CalendarDefinition = {
      months: [{ name: 'Only', days: 7 }],
      weekdays: ['Day'],
      moons: [],
      seasons: [],
    };
    expect(getTotalDaysInYear(def)).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// dayIndexToDate
// ---------------------------------------------------------------------------

describe('dayIndexToDate', () => {
  it('returns first day correctly', () => {
    expect(dayIndexToDate(0, SIMPLE_DEF)).toEqual({
      year: 0,
      monthIndex: 0,
      dayOfMonth: 0,
    });
  });

  it('returns last day of first month', () => {
    expect(dayIndexToDate(29, SIMPLE_DEF)).toEqual({
      year: 0,
      monthIndex: 0,
      dayOfMonth: 29,
    });
  });

  it('rolls into second month', () => {
    expect(dayIndexToDate(30, SIMPLE_DEF)).toEqual({
      year: 0,
      monthIndex: 1,
      dayOfMonth: 0,
    });
  });

  it('rolls into second year', () => {
    expect(dayIndexToDate(90, SIMPLE_DEF)).toEqual({
      year: 1,
      monthIndex: 0,
      dayOfMonth: 0,
    });
  });

  it('handles middle of third month year 2', () => {
    // year 2 starts at 180, month 2 starts at 180+60=240, day 15 → index 255
    expect(dayIndexToDate(255, SIMPLE_DEF)).toEqual({
      year: 2,
      monthIndex: 2,
      dayOfMonth: 15,
    });
  });

  it('handles zero-total-days gracefully', () => {
    const zeroDef: CalendarDefinition = {
      months: [{ name: 'Empty', days: 0 }],
      weekdays: [],
      moons: [],
      seasons: [],
    };
    expect(dayIndexToDate(5, zeroDef)).toEqual({
      year: 0,
      monthIndex: 0,
      dayOfMonth: 0,
    });
  });
});

// ---------------------------------------------------------------------------
// advanceDay
// ---------------------------------------------------------------------------

describe('advanceDay', () => {
  it('advances forward', () => {
    expect(advanceDay(10, 5)).toBe(15);
  });

  it('clamps to zero', () => {
    expect(advanceDay(3, -10)).toBe(0);
  });

  it('stays at zero', () => {
    expect(advanceDay(0, 0)).toBe(0);
  });

  it('advances large amounts', () => {
    expect(advanceDay(0, 365)).toBe(365);
  });
});

// ---------------------------------------------------------------------------
// getMoonPhase
// ---------------------------------------------------------------------------

describe('getMoonPhase', () => {
  const moon: CalendarMoon = { name: 'Test', cycleDays: 30, offset: 0 };

  it('returns 0 at day 0 (new moon)', () => {
    expect(getMoonPhase(0, moon)).toBeCloseTo(0);
  });

  it('returns 0.5 at half cycle (full moon)', () => {
    expect(getMoonPhase(15, moon)).toBeCloseTo(0.5);
  });

  it('wraps at full cycle', () => {
    expect(getMoonPhase(30, moon)).toBeCloseTo(0);
  });

  it('applies offset', () => {
    const offsetMoon: CalendarMoon = { name: 'Off', cycleDays: 30, offset: 15 };
    expect(getMoonPhase(0, offsetMoon)).toBeCloseTo(0.5);
  });

  it('returns 0 for zero-cycle moon', () => {
    const zeroMoon: CalendarMoon = { name: 'Zero', cycleDays: 0, offset: 0 };
    expect(getMoonPhase(10, zeroMoon)).toBe(0);
  });

  it('computes two moons independently', () => {
    const moonA: CalendarMoon = { name: 'A', cycleDays: 20, offset: 0 };
    const moonB: CalendarMoon = { name: 'B', cycleDays: 30, offset: 0 };
    expect(getMoonPhase(10, moonA)).not.toBeCloseTo(getMoonPhase(10, moonB));
  });
});

// ---------------------------------------------------------------------------
// getMoonPhaseName
// ---------------------------------------------------------------------------

describe('getMoonPhaseName', () => {
  it('returns "New Moon" at 0', () => {
    expect(getMoonPhaseName(0)).toBe('New Moon');
  });

  it('returns "Full Moon" at 0.5', () => {
    expect(getMoonPhaseName(0.5)).toBe('Full Moon');
  });

  it('returns "First Quarter" at 0.25', () => {
    expect(getMoonPhaseName(0.25)).toBe('First Quarter');
  });

  it('returns "Last Quarter" at 0.75', () => {
    expect(getMoonPhaseName(0.75)).toBe('Last Quarter');
  });

  it('wraps correctly at 1.0', () => {
    expect(getMoonPhaseName(1.0)).toBe('New Moon');
  });

  it('handles negative input gracefully', () => {
    expect(getMoonPhaseName(-0.25)).toBe('Last Quarter');
  });
});

// ---------------------------------------------------------------------------
// getWeekdayName
// ---------------------------------------------------------------------------

describe('getWeekdayName', () => {
  it('returns first weekday at day 0', () => {
    expect(getWeekdayName(0, SIMPLE_DEF)).toBe('Mon');
  });

  it('wraps around', () => {
    expect(getWeekdayName(5, SIMPLE_DEF)).toBe('Mon');
  });

  it('returns empty for no weekdays', () => {
    const noWeek: CalendarDefinition = {
      months: [{ name: 'X', days: 10 }],
      weekdays: [],
      moons: [],
      seasons: [],
    };
    expect(getWeekdayName(3, noWeek)).toBe('');
  });

  it('returns correct weekday mid-week', () => {
    expect(getWeekdayName(2, SIMPLE_DEF)).toBe('Wed');
  });
});

// ---------------------------------------------------------------------------
// getSeasonAtDay
// ---------------------------------------------------------------------------

describe('getSeasonAtDay', () => {
  it('returns first season at day 0', () => {
    const season = getSeasonAtDay(0, SIMPLE_DEF);
    expect(season?.name).toBe('Cold');
  });

  it('returns second season at day 30', () => {
    const season = getSeasonAtDay(30, SIMPLE_DEF);
    expect(season?.name).toBe('Warm');
  });

  it('returns null for no seasons', () => {
    expect(getSeasonAtDay(0, UNEQUAL_DEF)).toBeNull();
  });

  it('wraps season across year boundary', () => {
    // Day 91 = day 1 in year 1 → dayOfYear=1 → Cold starts at 0
    const season = getSeasonAtDay(91, SIMPLE_DEF);
    expect(season?.name).toBe('Cold');
  });
});

// ---------------------------------------------------------------------------
// getDaysInMonth
// ---------------------------------------------------------------------------

describe('getDaysInMonth', () => {
  it('returns correct day count', () => {
    expect(getDaysInMonth(0, SIMPLE_DEF)).toBe(30);
  });

  it('returns 0 for out-of-range index', () => {
    expect(getDaysInMonth(99, SIMPLE_DEF)).toBe(0);
    expect(getDaysInMonth(-1, SIMPLE_DEF)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getMonthStartDayIndex
// ---------------------------------------------------------------------------

describe('getMonthStartDayIndex', () => {
  it('returns 0 for year 0, month 0', () => {
    expect(getMonthStartDayIndex(0, 0, SIMPLE_DEF)).toBe(0);
  });

  it('returns 30 for year 0, month 1', () => {
    expect(getMonthStartDayIndex(0, 1, SIMPLE_DEF)).toBe(30);
  });

  it('returns 90 for year 1, month 0', () => {
    expect(getMonthStartDayIndex(1, 0, SIMPLE_DEF)).toBe(90);
  });

  it('returns 120 for year 1, month 1', () => {
    expect(getMonthStartDayIndex(1, 1, SIMPLE_DEF)).toBe(120);
  });
});

// ---------------------------------------------------------------------------
// groupEventsByDay
// ---------------------------------------------------------------------------

describe('groupEventsByDay', () => {
  it('returns empty map for no events', () => {
    const map = groupEventsByDay([]);
    expect(map.size).toBe(0);
  });

  it('groups events on the same day', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        absoluteDay: 5,
        title: 'A',
        description: '',
        category: 'custom',
      },
      {
        id: '2',
        absoluteDay: 5,
        title: 'B',
        description: '',
        category: 'custom',
      },
      {
        id: '3',
        absoluteDay: 10,
        title: 'C',
        description: '',
        category: 'session',
      },
    ];
    const map = groupEventsByDay(events);
    expect(map.size).toBe(2);
    expect(map.get(5)).toHaveLength(2);
    expect(map.get(10)).toHaveLength(1);
  });

  it('handles single event', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        absoluteDay: 0,
        title: 'Solo',
        description: '',
        category: 'custom',
      },
    ];
    const map = groupEventsByDay(events);
    expect(map.size).toBe(1);
    expect(map.get(0)?.[0].title).toBe('Solo');
  });

  it('separates events across different days', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        absoluteDay: 0,
        title: 'New Year',
        description: '',
        category: 'holiday',
      },
      {
        id: '2',
        absoluteDay: 180,
        title: 'Midsummer',
        description: '',
        category: 'holiday',
      },
      {
        id: '3',
        absoluteDay: 359,
        title: 'Year End',
        description: '',
        category: 'custom',
      },
    ];
    const map = groupEventsByDay(events);
    expect(map.size).toBe(3);
  });

  // Multi-day event tests (C3 feature)

  it('expands a multi-day event across its range', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        absoluteDay: 5,
        endDay: 8,
        title: 'Festival',
        description: '',
        category: 'holiday',
      },
    ];
    const map = groupEventsByDay(events);
    expect(map.get(5)).toHaveLength(1);
    expect(map.get(6)).toHaveLength(1);
    expect(map.get(7)).toHaveLength(1);
    expect(map.get(8)).toHaveLength(1);
    // Should not appear on days outside the range
    expect(map.get(4)).toBeUndefined();
    expect(map.get(9)).toBeUndefined();
  });

  it('treats endDay === absoluteDay as a single-day event', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        absoluteDay: 10,
        endDay: 10,
        title: 'Quick',
        description: '',
        category: 'custom',
      },
    ];
    const map = groupEventsByDay(events);
    expect(map.size).toBe(1);
    expect(map.get(10)).toHaveLength(1);
  });

  it('multi-day event shares day map with single-day events', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        absoluteDay: 5,
        endDay: 7,
        title: 'Multi',
        description: '',
        category: 'travel',
      },
      {
        id: '2',
        absoluteDay: 6,
        title: 'Single',
        description: '',
        category: 'combat',
      },
    ];
    const map = groupEventsByDay(events);
    expect(map.get(6)).toHaveLength(2);
  });

  it('clamps multi-day event span to MAX_EVENT_SPAN', () => {
    // An event spanning 100 days should be clamped
    const events: CalendarEvent[] = [
      {
        id: '1',
        absoluteDay: 0,
        endDay: 100,
        title: 'Long',
        description: '',
        category: 'custom',
      },
    ];
    const map = groupEventsByDay(events);
    // Should have exactly MAX_EVENT_SPAN + 1 days (0 to 60 inclusive)
    expect(map.size).toBeLessThanOrEqual(61);
    expect(map.get(0)).toHaveLength(1);
    expect(map.get(60)).toHaveLength(1);
    // Should NOT appear beyond clamp
    expect(map.get(61)).toBeUndefined();
  });
});
