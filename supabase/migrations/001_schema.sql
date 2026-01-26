-- Supabase Schema: Core tables, columns, indexes, and triggers

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Owner (auth.users)
  user_id UUID,

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

  -- Quick view preferences
  quick_view JSONB NOT NULL DEFAULT '{
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
  }'::jsonb,

  -- New character flag
  is_new_character BOOLEAN NOT NULL DEFAULT true,

  -- Soft delete timestamp
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure added columns exist for existing tables
ALTER TABLE characters ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS quick_view JSONB NOT NULL DEFAULT '{
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
ALTER TABLE characters ADD COLUMN IF NOT EXISTS is_new_character BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Character indexes
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters ((identity->>'name'));
CREATE INDEX IF NOT EXISTS idx_characters_class ON characters ((class_draft->>'className'));
CREATE INDEX IF NOT EXISTS idx_characters_level ON characters ((progression->>'currentLevel'));
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters (user_id);

-- Character updated_at trigger
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Campaign name
  name TEXT NOT NULL,

  -- Campaign frame (pitch, tones, themes, touchstones, etc.)
  frame JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- GM user ID (references auth.users)
  gm_id UUID NOT NULL,

  -- Players array
  players JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Session notes array
  sessions JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- NPCs array
  npcs JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Locations array
  locations JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Quests array
  quests JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Story threads array
  story_threads JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Session prep checklist
  session_prep_checklist JSONB NOT NULL DEFAULT '[
    {"id": "default-1", "text": "Review last session notes", "checked": false},
    {"id": "default-2", "text": "Check active quests & objectives", "checked": false},
    {"id": "default-3", "text": "Prepare 2-3 NPC voices/mannerisms", "checked": false},
    {"id": "default-4", "text": "Have a yes, and backup plan", "checked": false},
    {"id": "default-5", "text": "Note player character goals", "checked": false},
    {"id": "default-6", "text": "Prepare one memorable description", "checked": false},
    {"id": "default-7", "text": "Check the Fear track", "checked": false}
  ]'::jsonb,

  -- Invite code for players to join
  invite_code TEXT,

  -- Campaign status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),

  -- Free-form notes
  notes TEXT NOT NULL DEFAULT '',

  -- Soft delete timestamp (NULL = not deleted)
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaign indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_gm_id ON campaigns (gm_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_name ON campaigns (name);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns (status);
CREATE INDEX IF NOT EXISTS idx_campaigns_deleted_at ON campaigns (deleted_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_invite_code ON campaigns (invite_code);

-- Campaign updated_at trigger
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
