import { z } from 'zod';

// =====================================================================================
// Campaign Calendar — Fantasy calendar system with moon phases and events
// =====================================================================================

// =====================================================================================
// Schema versions
// =====================================================================================

/** @deprecated V1 schema version — retained for runtime migration only. */
export const CALENDAR_SCHEMA_VERSION_V1 = 1 as const;

/** Current schema version. Bump when the JSONB shape changes. */
export const CALENDAR_SCHEMA_VERSION = 2 as const;

// =====================================================================================
// Limits
// =====================================================================================

/** Maximum calendars per campaign. */
export const MAX_CALENDARS_PER_CAMPAIGN = 10 as const;

/** Maximum events per individual calendar. */
export const MAX_EVENTS_PER_CALENDAR = 200 as const;

/** Maximum total events across all calendars in a campaign. */
export const MAX_TOTAL_EVENTS = 2000 as const;

/** Maximum custom categories per calendar. */
export const MAX_CUSTOM_CATEGORIES = 50 as const;

/** Maximum span (in days) for a multi-day event. */
export const MAX_EVENT_SPAN = 60 as const;

// =====================================================================================
// Preset identifiers
// =====================================================================================

export const CalendarPresetEnum = z.enum([
  'custom',
  'daggerheart-default',
  'harptos',
  'eberron',
  'exandria',
  'gregorian',
]);

// =====================================================================================
// Calendar definition — months, weekdays, moons, seasons
// =====================================================================================

export const CalendarMonthSchema = z.object({
  name: z.string().min(1).max(60),
  days: z.number().int().min(1).max(100),
});

export const CalendarMoonSchema = z.object({
  name: z.string().min(1).max(60),
  /** Full cycle length in days. */
  cycleDays: z.number().int().min(1).max(1000),
  /** Phase offset in days — shifts the "full moon" position. */
  offset: z.number().int().min(0).max(999),
});

export const CalendarSeasonSchema = z.object({
  name: z.string().min(1).max(60),
  /** 1-based month index where the season starts. */
  startMonth: z.number().int().min(1),
  /** 1-based day within that month. */
  startDay: z.number().int().min(1),
});

export const CalendarDefinitionSchema = z.object({
  months: z.array(CalendarMonthSchema).min(1).max(50),
  weekdays: z.array(z.string().min(1).max(60)).min(1).max(20),
  moons: z.array(CalendarMoonSchema).min(0).max(10),
  seasons: z.array(CalendarSeasonSchema).default([]),
});

// =====================================================================================
// Event categories — fixed enum + custom category IDs
// =====================================================================================

/** The 6 built-in event category values. */
export const CalendarEventCategoryEnum = z.enum([
  'session',
  'holiday',
  'combat',
  'travel',
  'downtime',
  'custom',
]);

/**
 * Event category: one of the 6 built-in values OR a custom category ID string.
 * Custom category IDs are user-defined and must match an entry in the
 * parent calendar's `customCategories` array.
 */
export const CalendarEventCategorySchema = z.union([
  CalendarEventCategoryEnum,
  z.string().min(1).max(60),
]);

// =====================================================================================
// Custom categories — user-defined beyond the 6 fixed ones (C4)
// =====================================================================================

export const CustomCategorySchema = z.object({
  /** Stable identifier for the custom category. */
  id: z.string().min(1).max(60),
  /** Display name. */
  name: z.string().min(1).max(60),
  /** Hex color (e.g. "#ef4444") for visual differentiation. */
  color: z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Must be a valid hex color'),
});

// =====================================================================================
// V1 event schema (legacy — retained for migration)
// =====================================================================================

/** @deprecated V1 event shape — use CalendarEventSchema instead. */
export const CalendarEventV1Schema = z.object({
  id: z.string(),
  absoluteDay: z.number().int().min(0),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).default(''),
  category: CalendarEventCategoryEnum.default('custom'),
});

// =====================================================================================
// V2 event schema — adds optional endDay for multi-day events (C3)
// =====================================================================================

export const CalendarEventSchema = z
  .object({
    id: z.string(),
    /** Absolute day index this event starts on. */
    absoluteDay: z.number().int().min(0),
    /** Optional end day for multi-day events (inclusive). Must be ≥ absoluteDay. */
    endDay: z.number().int().min(0).optional(),
    title: z.string().min(1).max(200),
    description: z.string().max(2000).default(''),
    /** Built-in category OR a custom category ID. */
    category: CalendarEventCategorySchema.default('custom'),
  })
  .refine(e => e.endDay === undefined || e.endDay >= e.absoluteDay, {
    message: 'endDay must be ≥ absoluteDay',
    path: ['endDay'],
  })
  .refine(
    e => e.endDay === undefined || e.endDay - e.absoluteDay <= MAX_EVENT_SPAN,
    {
      message: `Event span must be ≤ ${MAX_EVENT_SPAN} days`,
      path: ['endDay'],
    }
  );

// =====================================================================================
// V1 top-level state (legacy — retained for migration)
// =====================================================================================

/** @deprecated V1 single-calendar shape. Use CalendarStateSchema (v2 envelope). */
export const CalendarStateV1Schema = z.object({
  version: z.literal(CALENDAR_SCHEMA_VERSION_V1),
  preset: CalendarPresetEnum,
  definition: CalendarDefinitionSchema,
  currentDay: z.number().int().min(0).default(0),
  epochLabel: z.string().max(100).default(''),
  eraName: z.string().max(100).default(''),
  events: z.array(CalendarEventV1Schema).max(500).default([]),
});

// =====================================================================================
// V2 individual calendar — gains id, name, color, customCategories (A1, H1, C4)
// =====================================================================================

export const CalendarSchema = z.object({
  /** Stable UUID for this calendar. */
  id: z.string(),
  /** User-facing name (e.g. "Main Calendar", "Fey-Wild Timeline"). */
  name: z.string().min(1).max(60),
  /** Accent color — hex string (e.g. "#6366f1") or tailwind preset name. */
  color: z.string().min(1).max(30),
  /** Which preset was used to initialise (or 'custom'). */
  preset: CalendarPresetEnum,
  /** Structural definition of the calendar. */
  definition: CalendarDefinitionSchema,
  /** Current absolute day index (0-based, integer-only). */
  currentDay: z.number().int().min(0).default(0),
  /** Optional epoch label (e.g. "After the Shattering"). */
  epochLabel: z.string().max(100).default(''),
  /** Optional era name (e.g. "Second Age"). */
  eraName: z.string().max(100).default(''),
  /** Event notes, capped at 200 per calendar. */
  events: z.array(CalendarEventSchema).max(MAX_EVENTS_PER_CALENDAR).default([]),
  /** User-defined event categories beyond the 6 fixed ones. */
  customCategories: z
    .array(CustomCategorySchema)
    .max(MAX_CUSTOM_CATEGORIES)
    .default([]),
});

// =====================================================================================
// V2 multi-calendar envelope — the JSONB blob stored on the campaign row (A1)
// =====================================================================================

export const MultiCalendarEnvelopeSchema = z.object({
  /** Schema version — always 2 for this shape. */
  version: z.literal(CALENDAR_SCHEMA_VERSION),
  /** UUID of the currently active/visible calendar. */
  activeCalendarId: z.string(),
  /** Array of calendars, 1–10 per campaign. */
  calendars: z.array(CalendarSchema).min(1).max(MAX_CALENDARS_PER_CAMPAIGN),
});

/**
 * Canonical CalendarState for the campaign — the v2 multi-calendar envelope.
 * All new code should reference this schema and its inferred type.
 */
export const CalendarStateSchema = MultiCalendarEnvelopeSchema;

// =====================================================================================
// Raw DB parsing — accepts v1 OR v2 for runtime migration (discriminated on `version`)
// =====================================================================================

/**
 * Use this schema when parsing raw JSONB from the database.
 * After parsing, pass through `migrateCalendarState()` to guarantee v2 output.
 */
export const CalendarDataSchema = z.discriminatedUnion('version', [
  CalendarStateV1Schema,
  MultiCalendarEnvelopeSchema,
]);

// =====================================================================================
// Export / Import — portable calendar definition (E1)
// =====================================================================================

export const CalendarExportSchema = z.object({
  /** Export format version for forward compatibility. */
  exportVersion: z.literal(1),
  /** Calendar display name. */
  name: z.string().min(1).max(60),
  /** Preset origin. */
  preset: CalendarPresetEnum,
  /** The calendar's structural definition. */
  definition: CalendarDefinitionSchema,
  /** Epoch label to carry over. */
  epochLabel: z.string().max(100).default(''),
  /** Era name to carry over. */
  eraName: z.string().max(100).default(''),
  /** Custom categories to carry over. */
  customCategories: z
    .array(CustomCategorySchema)
    .max(MAX_CUSTOM_CATEGORIES)
    .default([]),
});

// =====================================================================================
// Default calendar color presets (H1)
// =====================================================================================

/** Curated hex colors for calendar accent differentiation. */
export const CALENDAR_COLOR_PRESETS = [
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#22c55e', // green
  '#eab308', // yellow
  '#f97316', // orange
  '#ef4444', // red
  '#a855f7', // purple
  '#ec4899', // pink
  '#78716c', // stone
] as const;

/** Human-readable names for each preset color (for accessibility). */
export const CALENDAR_COLOR_NAMES: Record<string, string> = {
  '#6366f1': 'Indigo',
  '#3b82f6': 'Blue',
  '#06b6d4': 'Cyan',
  '#22c55e': 'Green',
  '#eab308': 'Yellow',
  '#f97316': 'Orange',
  '#ef4444': 'Red',
  '#a855f7': 'Purple',
  '#ec4899': 'Pink',
  '#78716c': 'Stone',
};

/** Default color assigned to the first / migrated calendar. */
export const DEFAULT_CALENDAR_COLOR = CALENDAR_COLOR_PRESETS[0];

// =====================================================================================
// Type exports
// =====================================================================================

export type CalendarPreset = z.infer<typeof CalendarPresetEnum>;
export type CalendarMonth = z.infer<typeof CalendarMonthSchema>;
export type CalendarMoon = z.infer<typeof CalendarMoonSchema>;
export type CalendarSeason = z.infer<typeof CalendarSeasonSchema>;
export type CalendarDefinition = z.infer<typeof CalendarDefinitionSchema>;
export type CalendarEventCategory = z.infer<typeof CalendarEventCategoryEnum>;
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;
export type CustomCategory = z.infer<typeof CustomCategorySchema>;
export type Calendar = z.infer<typeof CalendarSchema>;
export type MultiCalendarEnvelope = z.infer<typeof MultiCalendarEnvelopeSchema>;
export type CalendarState = z.infer<typeof CalendarStateSchema>;
export type CalendarStateV1 = z.infer<typeof CalendarStateV1Schema>;
export type CalendarData = z.infer<typeof CalendarDataSchema>;
export type CalendarExport = z.infer<typeof CalendarExportSchema>;
