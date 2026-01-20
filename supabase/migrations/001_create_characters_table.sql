-- Supabase Migration: Create characters table
-- Run this in the Supabase SQL Editor or via supabase db push

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity (name, pronouns, ancestry, community, etc.)
  identity JSONB NOT NULL DEFAULT '{
    "name": "New Character",
    "pronouns": "",
    "ancestry": "",
    "community": "",
    "description": "",
    "calling": "",
    "descriptionDetails": {
      "eyes": "",
      "hair": "",
      "skin": "",
      "body": "",
      "clothing": "",
      "mannerisms": "",
      "other": ""
    },
    "connections": []
  }'::jsonb,

  -- Class selection (class, subclass, mode)
  class_draft JSONB NOT NULL DEFAULT '{"mode": "standard"}'::jsonb,

  -- Domain cards (loadout, vault)
  domains JSONB NOT NULL DEFAULT '{
    "loadout": [],
    "vault": [],
    "creationComplete": false
  }'::jsonb,

  -- Equipment (weapons, armor, items)
  equipment JSONB NOT NULL DEFAULT '{
    "items": [],
    "consumables": {}
  }'::jsonb,

  -- Inventory slots
  inventory JSONB NOT NULL DEFAULT '{
    "slots": [],
    "maxItems": 50,
    "currentWeight": 0,
    "unlimitedSlots": false,
    "unlimitedQuantity": false,
    "metadata": {}
  }'::jsonb,

  -- Level progression
  progression JSONB NOT NULL DEFAULT '{
    "currentLevel": 1,
    "currentTier": "1",
    "availablePoints": 2,
    "spentOptions": {}
  }'::jsonb,

  -- Resources (HP, stress, hope, gold, etc.)
  resources JSONB NOT NULL DEFAULT '{
    "hp": {"current": 6, "max": 6},
    "stress": {"current": 0, "max": 6},
    "evasion": 10,
    "hope": {"current": 2, "max": 6},
    "proficiency": 1,
    "armorScore": {"current": 0, "max": 0},
    "gold": {
      "handfuls": 0,
      "bags": 0,
      "chests": 0,
      "coins": 0,
      "showCoins": false,
      "displayDenomination": "handfuls"
    },
    "autoCalculateHp": true,
    "autoCalculateEvasion": true,
    "autoCalculateArmorScore": true,
    "autoCalculateThresholds": true
  }'::jsonb,

  -- Core scores (evasion, proficiency overrides)
  core_scores JSONB DEFAULT NULL,

  -- Character traits (Agility, Strength, Finesse, Instinct, Presence, Knowledge)
  traits JSONB NOT NULL DEFAULT '{
    "Agility": {"value": 0, "bonus": 0, "marked": false},
    "Strength": {"value": 0, "bonus": 0, "marked": false},
    "Finesse": {"value": 0, "bonus": 0, "marked": false},
    "Instinct": {"value": 0, "bonus": 0, "marked": false},
    "Presence": {"value": 0, "bonus": 0, "marked": false},
    "Knowledge": {"value": 0, "bonus": 0, "marked": false}
  }'::jsonb,

  -- Active conditions
  conditions JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Feature selections/toggles
  features JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Custom/homebrew features
  custom_features JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Damage thresholds settings
  thresholds JSONB DEFAULT NULL,

  -- Level-up history
  leveling JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Experience points
  experience INTEGER NOT NULL DEFAULT 0,

  -- Experiences (background experiences with items array)
  experiences JSONB NOT NULL DEFAULT '{"items": []}'::jsonb,

  -- Ranger companion data
  companion JSONB DEFAULT NULL,
  companion_enabled BOOLEAN NOT NULL DEFAULT false,

  -- Scars from near-death experiences
  scars JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Extra hope slots (from scars)
  extra_hope_slots INTEGER NOT NULL DEFAULT 0,

  -- Companion hope tracking
  companion_hope_filled BOOLEAN NOT NULL DEFAULT false,

  -- Countdown trackers
  countdowns JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Session tracking
  sessions JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_session_id UUID DEFAULT NULL,

  -- Character notes
  notes JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Downtime activities
  downtime_activities JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on identity->name for faster searches
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters ((identity->>'name'));

-- Create index on class for filtering
CREATE INDEX IF NOT EXISTS idx_characters_class ON characters ((class_draft->>'className'));

-- Create index on level for filtering/sorting
CREATE INDEX IF NOT EXISTS idx_characters_level ON characters ((progression->>'currentLevel'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users (adjust as needed)
-- Uncomment and modify these policies based on your auth requirements:

-- CREATE POLICY "Users can view all characters" ON characters
--   FOR SELECT USING (true);

-- CREATE POLICY "Users can insert characters" ON characters
--   FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Users can update characters" ON characters
--   FOR UPDATE USING (true);

-- CREATE POLICY "Users can delete characters" ON characters
--   FOR DELETE USING (true);
