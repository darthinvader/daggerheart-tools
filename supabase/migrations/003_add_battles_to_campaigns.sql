-- Migration: Add battles column to campaigns table
-- Battle schema supports:
--   - Characters (id, name, hp, stress, evasion, conditions, notes)
--   - Adversaries (id, source, hp, stress, conditions, notes, overrides for attack/thresholds/features, roll history)
--   - Environments (id, source, features, countdown, notes)
--   - Spotlight tracking, fear pool, battle status

-- Add battles JSONB column (array of battle states)
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS battles JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN campaigns.battles IS 'Array of battle tracker states saved to this campaign. Each battle contains characters, adversaries (with optional attack/threshold/feature overrides), environments, spotlight, fear pool, and status.';
