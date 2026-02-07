-- ============================================================================
-- MULTI-CALENDAR (v2)
-- Migrates calendar JSONB from single-calendar (v1) to multi-calendar envelope.
--
-- New JSONB shape:
--   { version: 2, activeCalendarId: uuid, calendars: [...] }
--
-- Constraints updated:
--   - calendar_max_calendars: ≤ 10 calendars per campaign
--   - calendar_total_events_max: ≤ 2000 total events across all calendars
--   - calendar_max_size: ≤ 1 MB (unchanged, carried forward)
--   - Old calendar_events_max_length constraint dropped (replaced by above)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Helper function: count total events across all calendars in a v2 envelope
--    Handles both v1 and v2 shapes gracefully during transition period.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calendar_total_event_count(cal jsonb)
RETURNS integer
LANGUAGE sql IMMUTABLE STRICT AS $$
  SELECT CASE
    -- v2 format: sum events across all calendars (guard: must be array)
    WHEN cal ? 'calendars' AND jsonb_typeof(cal->'calendars') = 'array' THEN
      COALESCE(
        (SELECT SUM(jsonb_array_length(elem->'events'))::int
         FROM jsonb_array_elements(cal->'calendars') AS elem
         WHERE elem ? 'events'
           AND jsonb_typeof(elem->'events') = 'array'),
        0)
    -- v1 format: count events in flat array
    WHEN cal ? 'events' AND jsonb_typeof(cal->'events') = 'array' THEN
      jsonb_array_length(cal->'events')
    ELSE 0
  END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Drop the old single-calendar events constraint
-- ---------------------------------------------------------------------------
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS calendar_events_max_length;

-- ---------------------------------------------------------------------------
-- 3. Max 10 calendars per campaign (v2 envelope)
--    For v1 data: calendar->'calendars' doesn't exist → passes automatically.
-- ---------------------------------------------------------------------------
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS calendar_max_calendars;
ALTER TABLE campaigns ADD CONSTRAINT calendar_max_calendars
  CHECK (
    calendar IS NULL
    OR NOT (calendar ? 'calendars')
    OR (
      jsonb_typeof(calendar->'calendars') = 'array'
      AND jsonb_array_length(calendar->'calendars') <= 10
    )
  );

-- ---------------------------------------------------------------------------
-- 4. Total events across all calendars ≤ 2000
--    Works for both v1 (flat events) and v2 (nested in calendars) data.
-- ---------------------------------------------------------------------------
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS calendar_total_events_max;
ALTER TABLE campaigns ADD CONSTRAINT calendar_total_events_max
  CHECK (
    calendar IS NULL
    OR calendar_total_event_count(calendar) <= 2000
  );

-- ---------------------------------------------------------------------------
-- 5. Size constraint — already exists from 007, ensure it's present
-- ---------------------------------------------------------------------------
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS calendar_max_size;
ALTER TABLE campaigns ADD CONSTRAINT calendar_max_size
  CHECK (calendar IS NULL OR octet_length(calendar::text) <= 1048576);
