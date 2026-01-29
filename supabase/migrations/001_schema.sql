-- ============================================================================
-- SCHEMA - All Tables, Indexes, and Enums
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Enums
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE homebrew_content_type AS ENUM (
    'adversary',
    'environment',
    'domain_card',
    'class',
    'subclass',
    'ancestry',
    'community',
    'equipment',
    'item'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE homebrew_visibility AS ENUM (
    'private',
    'public',
    'campaign_only'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- Shared Trigger Function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Characters Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,

  -- Identity
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

  -- Class selection
  class_draft JSONB NOT NULL DEFAULT '{"mode": "standard"}'::jsonb,

  -- Domain cards
  domains JSONB NOT NULL DEFAULT '{
    "loadout": [],
    "vault": [],
    "creationComplete": false
  }'::jsonb,

  -- Equipment
  equipment JSONB NOT NULL DEFAULT '{
    "items": [],
    "consumables": {}
  }'::jsonb,

  -- Inventory
  inventory JSONB NOT NULL DEFAULT '{
    "slots": [],
    "maxItems": 50,
    "currentWeight": 0,
    "unlimitedSlots": false,
    "unlimitedQuantity": false,
    "metadata": {}
  }'::jsonb,

  -- Progression
  progression JSONB NOT NULL DEFAULT '{
    "currentLevel": 1,
    "currentTier": "1",
    "availablePoints": 2,
    "spentOptions": {}
  }'::jsonb,

  -- Resources
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

  -- Core scores
  core_scores JSONB DEFAULT NULL,

  -- Traits
  traits JSONB NOT NULL DEFAULT '{
    "Agility": {"value": 0, "bonus": 0, "marked": false},
    "Strength": {"value": 0, "bonus": 0, "marked": false},
    "Finesse": {"value": 0, "bonus": 0, "marked": false},
    "Instinct": {"value": 0, "bonus": 0, "marked": false},
    "Presence": {"value": 0, "bonus": 0, "marked": false},
    "Knowledge": {"value": 0, "bonus": 0, "marked": false}
  }'::jsonb,

  -- Conditions
  conditions JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Features
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_features JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Thresholds
  thresholds JSONB DEFAULT NULL,

  -- Leveling
  leveling JSONB NOT NULL DEFAULT '[]'::jsonb,
  experience INTEGER NOT NULL DEFAULT 0,
  experiences JSONB NOT NULL DEFAULT '{"items": []}'::jsonb,

  -- Companion
  companion JSONB DEFAULT NULL,
  companion_enabled BOOLEAN NOT NULL DEFAULT false,
  companion_hope_filled BOOLEAN NOT NULL DEFAULT false,

  -- Scars
  scars JSONB NOT NULL DEFAULT '[]'::jsonb,
  extra_hope_slots INTEGER NOT NULL DEFAULT 0,

  -- Trackers
  countdowns JSONB NOT NULL DEFAULT '[]'::jsonb,
  sessions JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_session_id UUID DEFAULT NULL,

  -- Notes
  notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  downtime_activities JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Quick view
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

  -- Flags
  is_new_character BOOLEAN NOT NULL DEFAULT true,
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Character indexes
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters((identity->>'name'));
CREATE INDEX IF NOT EXISTS idx_characters_class ON characters((class_draft->>'className'));
CREATE INDEX IF NOT EXISTS idx_characters_level ON characters((progression->>'currentLevel'));
CREATE INDEX IF NOT EXISTS idx_characters_deleted_at ON characters(deleted_at);

-- Character updated_at trigger
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Campaigns Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  frame JSONB NOT NULL DEFAULT '{}'::jsonb,
  gm_id UUID NOT NULL,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  sessions JSONB NOT NULL DEFAULT '[]'::jsonb,
  npcs JSONB NOT NULL DEFAULT '[]'::jsonb,
  locations JSONB NOT NULL DEFAULT '[]'::jsonb,
  quests JSONB NOT NULL DEFAULT '[]'::jsonb,
  story_threads JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Session prep
  session_prep_checklist JSONB NOT NULL DEFAULT '[
    {"id": "default-1", "text": "Review last session notes", "checked": false},
    {"id": "default-2", "text": "Check active quests & objectives", "checked": false},
    {"id": "default-3", "text": "Prepare 2-3 NPC voices/mannerisms", "checked": false},
    {"id": "default-4", "text": "Have a yes, and backup plan", "checked": false},
    {"id": "default-5", "text": "Note player character goals", "checked": false},
    {"id": "default-6", "text": "Prepare one memorable description", "checked": false},
    {"id": "default-7", "text": "Check the Fear track", "checked": false}
  ]'::jsonb,

  -- Battles (battle tracker states)
  battles JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Invite
  invite_code TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  notes TEXT NOT NULL DEFAULT '',

  -- Soft delete
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaign indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_gm_id ON campaigns(gm_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_name ON campaigns(name);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_deleted_at ON campaigns(deleted_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_invite_code ON campaigns(invite_code);

-- Campaign updated_at trigger
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Homebrew Content Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS homebrew_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL,
  content_type homebrew_content_type NOT NULL,
  visibility homebrew_visibility NOT NULL DEFAULT 'private',
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  forked_from UUID REFERENCES homebrew_content(id) ON DELETE SET NULL,
  campaign_links UUID[] NOT NULL DEFAULT '{}',

  -- Counts
  fork_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  star_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,

  -- Soft delete
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Homebrew indexes
CREATE INDEX IF NOT EXISTS idx_homebrew_owner_id ON homebrew_content(owner_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_content_type ON homebrew_content(content_type);
CREATE INDEX IF NOT EXISTS idx_homebrew_visibility ON homebrew_content(visibility);
CREATE INDEX IF NOT EXISTS idx_homebrew_name ON homebrew_content(name);
CREATE INDEX IF NOT EXISTS idx_homebrew_deleted_at ON homebrew_content(deleted_at);
CREATE INDEX IF NOT EXISTS idx_homebrew_campaign_links ON homebrew_content USING GIN(campaign_links);
CREATE INDEX IF NOT EXISTS idx_homebrew_tags ON homebrew_content USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_homebrew_owner_type ON homebrew_content(owner_id, content_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_homebrew_public ON homebrew_content(visibility, content_type) WHERE visibility = 'public' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_homebrew_forked_from ON homebrew_content(forked_from) WHERE forked_from IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_homebrew_star_count ON homebrew_content(star_count);
CREATE INDEX IF NOT EXISTS idx_homebrew_comment_count ON homebrew_content(comment_count);

-- Homebrew updated_at trigger
DROP TRIGGER IF EXISTS update_homebrew_content_updated_at ON homebrew_content;
CREATE TRIGGER update_homebrew_content_updated_at
  BEFORE UPDATE ON homebrew_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Homebrew Stars Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS homebrew_stars (
  homebrew_id UUID NOT NULL REFERENCES homebrew_content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (homebrew_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_homebrew_stars_user_id ON homebrew_stars(user_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_stars_homebrew_id ON homebrew_stars(homebrew_id);

-- ============================================================================
-- Homebrew Collections Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS homebrew_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  is_quicklist BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_homebrew_collections_owner_quicklist
  ON homebrew_collections(owner_id)
  WHERE is_quicklist = TRUE AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_homebrew_collections_owner_id ON homebrew_collections(owner_id);

-- Collections updated_at trigger
DROP TRIGGER IF EXISTS update_homebrew_collections_updated_at ON homebrew_collections;
CREATE TRIGGER update_homebrew_collections_updated_at
  BEFORE UPDATE ON homebrew_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Homebrew Collection Items Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS homebrew_collection_items (
  collection_id UUID NOT NULL REFERENCES homebrew_collections(id) ON DELETE CASCADE,
  homebrew_id UUID NOT NULL REFERENCES homebrew_content(id) ON DELETE CASCADE,
  added_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, homebrew_id)
);

CREATE INDEX IF NOT EXISTS idx_homebrew_collection_items_homebrew_id ON homebrew_collection_items(homebrew_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_collection_items_collection_id ON homebrew_collection_items(collection_id);

-- ============================================================================
-- Homebrew Comments Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS homebrew_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homebrew_id UUID NOT NULL REFERENCES homebrew_content(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  body TEXT NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homebrew_comments_homebrew_id ON homebrew_comments(homebrew_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_comments_author_id ON homebrew_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_comments_deleted_at ON homebrew_comments(deleted_at);

-- Comments updated_at trigger
DROP TRIGGER IF EXISTS update_homebrew_comments_updated_at ON homebrew_comments;
CREATE TRIGGER update_homebrew_comments_updated_at
  BEFORE UPDATE ON homebrew_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Homebrew Character Links Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS homebrew_character_links (
  homebrew_id UUID NOT NULL REFERENCES homebrew_content(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  added_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (homebrew_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_homebrew_character_links_homebrew_id ON homebrew_character_links(homebrew_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_character_links_character_id ON homebrew_character_links(character_id);

-- ============================================================================
-- Schema complete. Run 002_policies_and_functions.sql next.
-- ============================================================================
