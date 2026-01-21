-- Add quick view preferences to characters
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS quick_view JSONB NOT NULL DEFAULT '{
  "sections": {
    "traits": true,
    "vitals": true,
    "coreScores": true,
    "thresholds": true,
    "ancestry": true,
    "community": true,
    "class": true,
    "gold": true,
    "conditions": true,
    "companion": true,
    "experiences": true,
    "equipment": true,
    "loadout": true,
    "inventory": true
  }
}'::jsonb;
