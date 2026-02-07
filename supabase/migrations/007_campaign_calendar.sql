-- ============================================================================
-- CAMPAIGN CALENDAR
-- Adds calendar_enabled toggle and calendar JSONB column to campaigns table.
-- Follows the Beast Feast pattern: feature toggle + optional JSONB blob.
-- ============================================================================

-- Feature toggle
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS calendar_enabled BOOLEAN NOT NULL DEFAULT false;

-- Calendar state (NULL = never initialised)
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS calendar JSONB DEFAULT NULL;

-- Defensive CHECK: events array length ≤ 500
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS calendar_events_max_length;
ALTER TABLE campaigns ADD CONSTRAINT calendar_events_max_length
  CHECK (
    calendar IS NULL
    OR NOT (calendar ? 'events')
    OR (
      jsonb_typeof(calendar->'events') = 'array'
      AND jsonb_array_length(calendar->'events') <= 500
    )
  );

-- Defensive CHECK: total calendar payload ≤ 1 MB
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS calendar_max_size;
ALTER TABLE campaigns ADD CONSTRAINT calendar_max_size
  CHECK (calendar IS NULL OR octet_length(calendar::text) <= 1048576);
