import { describe, expect, it } from 'vitest';

import {
  CALENDAR_SCHEMA_VERSION,
  CalendarDataSchema,
  CalendarDefinitionSchema,
  CalendarEventSchema,
  CalendarStateSchema,
  CalendarStateV1Schema,
  CustomCategorySchema,
} from '../src/lib/schemas/calendar';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** Minimal valid v2 MultiCalendarEnvelope for baseline assertions. */
const VALID_STATE = {
  version: CALENDAR_SCHEMA_VERSION,
  activeCalendarId: 'cal-1',
  calendars: [
    {
      id: 'cal-1',
      name: 'Main Calendar',
      color: '#6366f1',
      preset: 'daggerheart-default',
      currentDay: 0,
      definition: {
        months: [{ name: 'Month1', days: 30 }],
        weekdays: ['Mon'],
        moons: [],
        seasons: [],
      },
      events: [],
      epochLabel: '',
      eraName: '',
      customCategories: [],
    },
  ],
};

/** Minimal valid v1 state for migration testing. */
const VALID_V1_STATE = {
  version: 1,
  preset: 'daggerheart-default',
  currentDay: 0,
  definition: {
    months: [{ name: 'Month1', days: 30 }],
    weekdays: ['Mon'],
    moons: [],
    seasons: [],
  },
  events: [],
  epochLabel: '',
  eraName: '',
};

// ---------------------------------------------------------------------------
// CalendarStateSchema (v2 envelope)
// ---------------------------------------------------------------------------

describe('CalendarStateSchema', () => {
  it('accepts a valid v2 envelope', () => {
    expect(CalendarStateSchema.safeParse(VALID_STATE).success).toBe(true);
  });

  it('rejects when version is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { version: _, ...noVersion } = VALID_STATE;
    expect(CalendarStateSchema.safeParse(noVersion).success).toBe(false);
  });

  it('rejects v1 data directly', () => {
    expect(CalendarStateSchema.safeParse(VALID_V1_STATE).success).toBe(false);
  });

  it('rejects when calendars is empty', () => {
    const bad = { ...VALID_STATE, calendars: [] };
    expect(CalendarStateSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects more than 10 calendars', () => {
    const calendars = Array.from({ length: 11 }, (_, i) => ({
      ...VALID_STATE.calendars[0],
      id: `cal-${i}`,
    }));
    const bad = { ...VALID_STATE, calendars };
    expect(CalendarStateSchema.safeParse(bad).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CalendarDataSchema (v1 | v2 discriminated union)
// ---------------------------------------------------------------------------

describe('CalendarDataSchema', () => {
  it('accepts v1 data', () => {
    expect(CalendarDataSchema.safeParse(VALID_V1_STATE).success).toBe(true);
  });

  it('accepts v2 data', () => {
    expect(CalendarDataSchema.safeParse(VALID_STATE).success).toBe(true);
  });

  it('rejects data with unknown version', () => {
    const bad = { ...VALID_STATE, version: 99 };
    expect(CalendarDataSchema.safeParse(bad).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CalendarStateV1Schema (legacy)
// ---------------------------------------------------------------------------

describe('CalendarStateV1Schema', () => {
  it('accepts a valid v1 state', () => {
    expect(CalendarStateV1Schema.safeParse(VALID_V1_STATE).success).toBe(true);
  });

  it('rejects an invalid preset value', () => {
    const bad = { ...VALID_V1_STATE, preset: 123 };
    expect(CalendarStateV1Schema.safeParse(bad).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CalendarDefinitionSchema
// ---------------------------------------------------------------------------

describe('CalendarDefinitionSchema', () => {
  it('rejects empty months array', () => {
    const def = { months: [], weekdays: ['A'], moons: [], seasons: [] };
    expect(CalendarDefinitionSchema.safeParse(def).success).toBe(false);
  });

  it('rejects a month with 0 days', () => {
    const def = {
      months: [{ name: 'Bad', days: 0 }],
      weekdays: ['A'],
      moons: [],
      seasons: [],
    };
    expect(CalendarDefinitionSchema.safeParse(def).success).toBe(false);
  });

  it('rejects more than 50 months', () => {
    const months = Array.from({ length: 51 }, (_, i) => ({
      name: `M${i}`,
      days: 10,
    }));
    const def = { months, weekdays: ['A'], moons: [], seasons: [] };
    expect(CalendarDefinitionSchema.safeParse(def).success).toBe(false);
  });

  it('rejects more than 20 weekdays', () => {
    const weekdays = Array.from({ length: 21 }, (_, i) => `D${i}`);
    const def = {
      months: [{ name: 'M', days: 10 }],
      weekdays,
      moons: [],
      seasons: [],
    };
    expect(CalendarDefinitionSchema.safeParse(def).success).toBe(false);
  });

  it('rejects more than 10 moons', () => {
    const moons = Array.from({ length: 11 }, (_, i) => ({
      name: `Moon${i}`,
      cycleDays: 30,
      offset: 0,
    }));
    const def = {
      months: [{ name: 'M', days: 10 }],
      weekdays: ['A'],
      moons,
      seasons: [],
    };
    expect(CalendarDefinitionSchema.safeParse(def).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CalendarEventSchema (v2 — with endDay + union category)
// ---------------------------------------------------------------------------

describe('CalendarEventSchema', () => {
  it('accepts a valid event', () => {
    const event = {
      id: 'e1',
      absoluteDay: 5,
      title: 'Market Day',
      description: '',
      category: 'custom',
    };
    expect(CalendarEventSchema.safeParse(event).success).toBe(true);
  });

  it('rejects an event with empty title', () => {
    const event = {
      id: 'e1',
      absoluteDay: 5,
      title: '',
      description: '',
      category: 'custom',
    };
    expect(CalendarEventSchema.safeParse(event).success).toBe(false);
  });

  it('rejects a title longer than 200 characters', () => {
    const event = {
      id: 'e1',
      absoluteDay: 5,
      title: 'A'.repeat(201),
      description: '',
      category: 'custom',
    };
    expect(CalendarEventSchema.safeParse(event).success).toBe(false);
  });

  it('accepts an event with endDay ≥ absoluteDay', () => {
    const event = {
      id: 'e1',
      absoluteDay: 5,
      endDay: 8,
      title: 'Festival',
      description: '',
      category: 'holiday',
    };
    expect(CalendarEventSchema.safeParse(event).success).toBe(true);
  });

  it('rejects an event with endDay < absoluteDay', () => {
    const event = {
      id: 'e1',
      absoluteDay: 5,
      endDay: 3,
      title: 'Bad',
      description: '',
      category: 'custom',
    };
    expect(CalendarEventSchema.safeParse(event).success).toBe(false);
  });

  it('accepts a custom category ID string', () => {
    const event = {
      id: 'e1',
      absoluteDay: 0,
      title: 'Test',
      description: '',
      category: 'my-custom-cat',
    };
    expect(CalendarEventSchema.safeParse(event).success).toBe(true);
  });

  it('rejects an event spanning more than MAX_EVENT_SPAN days', () => {
    const event = {
      id: 'e1',
      absoluteDay: 0,
      endDay: 61,
      title: 'Too Long',
      description: '',
      category: 'custom',
    };
    expect(CalendarEventSchema.safeParse(event).success).toBe(false);
  });

  it('accepts an event spanning exactly MAX_EVENT_SPAN days', () => {
    const event = {
      id: 'e1',
      absoluteDay: 0,
      endDay: 60,
      title: 'Exactly Max',
      description: '',
      category: 'custom',
    };
    expect(CalendarEventSchema.safeParse(event).success).toBe(true);
  });

  it('accepts an event with no endDay', () => {
    const event = {
      id: 'e1',
      absoluteDay: 0,
      title: 'Single-day',
      description: '',
      category: 'session',
    };
    expect(CalendarEventSchema.safeParse(event).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// CustomCategorySchema
// ---------------------------------------------------------------------------

describe('CustomCategorySchema', () => {
  it('accepts a valid custom category', () => {
    const cat = { id: 'cat-1', name: 'Investigation', color: '#f97316' };
    expect(CustomCategorySchema.safeParse(cat).success).toBe(true);
  });

  it('rejects empty name', () => {
    const cat = { id: 'cat-1', name: '', color: '#f97316' };
    expect(CustomCategorySchema.safeParse(cat).success).toBe(false);
  });

  it('accepts 3-digit hex shorthand', () => {
    const cat = { id: 'cat-1', name: 'Test', color: '#f00' };
    expect(CustomCategorySchema.safeParse(cat).success).toBe(true);
  });

  it('rejects invalid hex color format', () => {
    const cat = { id: 'cat-1', name: 'Test', color: 'red' };
    expect(CustomCategorySchema.safeParse(cat).success).toBe(false);
  });

  it('rejects hex without hash prefix', () => {
    const cat = { id: 'cat-1', name: 'Test', color: 'f97316' };
    expect(CustomCategorySchema.safeParse(cat).success).toBe(false);
  });
});
