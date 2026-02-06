-- ============================================================================
-- CAMPAIGN ENHANCEMENTS
-- Adds missing columns to campaigns table and normalized entity tables
-- to support: Beast Feast toggle, party inventory, campaign phase,
-- session zero, and new entity fields (disposition, atmosphere, etc.)
-- ============================================================================

-- ============================================================================
-- New columns on campaigns table (JSONB primary storage)
-- ============================================================================

-- Party-wide shared inventory / loot
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS party_inventory JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Campaign phase (story arc progression)
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS phase TEXT NOT NULL DEFAULT 'act-1';

-- Beast Feast cooking state (optional, null = never initialized)
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS beast_feast JSONB DEFAULT NULL;

-- Beast Feast feature toggle (many campaigns don't use it)
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS beast_feast_enabled BOOLEAN NOT NULL DEFAULT false;

-- Session Zero framework (optional, null = not yet filled out)
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS session_zero JSONB DEFAULT NULL;

-- ============================================================================
-- New columns on normalized entity tables (for future use / queries)
-- ============================================================================

-- NPC disposition (friendly, neutral, cautious, hostile, unknown)
ALTER TABLE campaign_npcs ADD COLUMN IF NOT EXISTS disposition TEXT NOT NULL DEFAULT 'neutral';

-- Location atmosphere (freeform text)
ALTER TABLE campaign_locations ADD COLUMN IF NOT EXISTS atmosphere TEXT NOT NULL DEFAULT '';

-- Session status, agenda, rewards
ALTER TABLE campaign_sessions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'planned';
ALTER TABLE campaign_sessions ADD COLUMN IF NOT EXISTS agenda TEXT NOT NULL DEFAULT '';
ALTER TABLE campaign_sessions ADD COLUMN IF NOT EXISTS rewards TEXT NOT NULL DEFAULT '';
