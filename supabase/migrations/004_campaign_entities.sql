-- ============================================================================
-- CAMPAIGN ENTITIES REDESIGN
-- Adds Organizations and restructures relationships between
-- Sessions, NPCs, Locations, Quests, and Organizations
-- ============================================================================

-- ============================================================================
-- Add organizations column to campaigns table (JSONB for now, like other entities)
-- ============================================================================

ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS organizations JSONB NOT NULL DEFAULT '[]'::jsonb;

-- ============================================================================
-- Enums
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE campaign_npc_status AS ENUM ('active', 'deceased', 'missing', 'retired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_quest_type AS ENUM ('main', 'side', 'personal', 'faction', 'rumor', 'hook');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_quest_status AS ENUM ('available', 'active', 'completed', 'failed', 'abandoned');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_quest_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_location_type AS ENUM ('city', 'town', 'village', 'dungeon', 'wilderness', 'landmark', 'building', 'region', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_organization_type AS ENUM ('guild', 'faction', 'government', 'religious', 'criminal', 'mercenary', 'merchant', 'secret', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- Campaign Organizations Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Core fields
  name TEXT NOT NULL,
  type campaign_organization_type NOT NULL DEFAULT 'other',
  description TEXT NOT NULL DEFAULT '',
  goals_objectives TEXT NOT NULL DEFAULT '',

  -- Secret info (GM only)
  secrets TEXT NOT NULL DEFAULT '',

  -- Headquarters location (single link)
  headquarters_id UUID DEFAULT NULL,

  -- Metadata
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_organizations_campaign_id ON campaign_organizations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_organizations_name ON campaign_organizations(name);
CREATE INDEX IF NOT EXISTS idx_campaign_organizations_type ON campaign_organizations(type);
CREATE INDEX IF NOT EXISTS idx_campaign_organizations_tags ON campaign_organizations USING GIN(tags);

DROP TRIGGER IF EXISTS update_campaign_organizations_updated_at ON campaign_organizations;
CREATE TRIGGER update_campaign_organizations_updated_at
  BEFORE UPDATE ON campaign_organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Campaign NPCs Table (normalized from JSONB)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_npcs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Core fields
  name TEXT NOT NULL,
  title_role TEXT NOT NULL DEFAULT '',
  status campaign_npc_status NOT NULL DEFAULT 'active',

  -- Description
  description TEXT NOT NULL DEFAULT '',
  personality TEXT NOT NULL DEFAULT '',
  motivation TEXT NOT NULL DEFAULT '',
  background_history TEXT NOT NULL DEFAULT '',

  -- Secret info (GM only)
  secrets TEXT NOT NULL DEFAULT '',

  -- Legacy faction field (for backwards compatibility, prefer organization link)
  faction TEXT NOT NULL DEFAULT '',

  -- Metadata
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_npcs_campaign_id ON campaign_npcs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_npcs_name ON campaign_npcs(name);
CREATE INDEX IF NOT EXISTS idx_campaign_npcs_status ON campaign_npcs(status);
CREATE INDEX IF NOT EXISTS idx_campaign_npcs_tags ON campaign_npcs USING GIN(tags);

DROP TRIGGER IF EXISTS update_campaign_npcs_updated_at ON campaign_npcs;
CREATE TRIGGER update_campaign_npcs_updated_at
  BEFORE UPDATE ON campaign_npcs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Campaign Locations Table (normalized from JSONB)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Core fields
  name TEXT NOT NULL,
  type campaign_location_type NOT NULL DEFAULT 'other',
  description TEXT NOT NULL DEFAULT '',
  current_state TEXT NOT NULL DEFAULT '',
  history_lore TEXT NOT NULL DEFAULT '',

  -- Secret info (GM only)
  secrets TEXT NOT NULL DEFAULT '',

  -- Points of Interest (embedded JSONB array)
  points_of_interest JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Metadata
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- POI structure: [{name: string, description: string, significance: string}]

CREATE INDEX IF NOT EXISTS idx_campaign_locations_campaign_id ON campaign_locations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_locations_name ON campaign_locations(name);
CREATE INDEX IF NOT EXISTS idx_campaign_locations_type ON campaign_locations(type);
CREATE INDEX IF NOT EXISTS idx_campaign_locations_tags ON campaign_locations USING GIN(tags);

DROP TRIGGER IF EXISTS update_campaign_locations_updated_at ON campaign_locations;
CREATE TRIGGER update_campaign_locations_updated_at
  BEFORE UPDATE ON campaign_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Campaign Quests Table (normalized from JSONB)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Core fields
  title TEXT NOT NULL,
  status campaign_quest_status NOT NULL DEFAULT 'available',
  priority campaign_quest_priority NOT NULL DEFAULT 'medium',
  type campaign_quest_type NOT NULL DEFAULT 'side',
  description TEXT NOT NULL DEFAULT '',

  -- Objectives and rewards (embedded JSONB arrays)
  objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
  rewards JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Story elements
  foreshadowing TEXT NOT NULL DEFAULT '',
  consequences TEXT NOT NULL DEFAULT '',

  -- Metadata
  notes TEXT NOT NULL DEFAULT '',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Objectives structure: [{id: string, text: string, completed: boolean}]
-- Rewards structure: [{id: string, description: string}]

CREATE INDEX IF NOT EXISTS idx_campaign_quests_campaign_id ON campaign_quests(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_quests_title ON campaign_quests(title);
CREATE INDEX IF NOT EXISTS idx_campaign_quests_status ON campaign_quests(status);
CREATE INDEX IF NOT EXISTS idx_campaign_quests_type ON campaign_quests(type);

DROP TRIGGER IF EXISTS update_campaign_quests_updated_at ON campaign_quests;
CREATE TRIGGER update_campaign_quests_updated_at
  BEFORE UPDATE ON campaign_quests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Campaign Sessions Table (normalized from JSONB)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Core fields
  session_number INTEGER NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  date_played DATE DEFAULT NULL,
  summary TEXT NOT NULL DEFAULT '',

  -- Key highlights (embedded JSONB array of strings)
  key_highlights JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Legacy fields for player notes
  player_notes JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(campaign_id, session_number)
);

CREATE INDEX IF NOT EXISTS idx_campaign_sessions_campaign_id ON campaign_sessions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sessions_session_number ON campaign_sessions(session_number);
CREATE INDEX IF NOT EXISTS idx_campaign_sessions_date_played ON campaign_sessions(date_played);

DROP TRIGGER IF EXISTS update_campaign_sessions_updated_at ON campaign_sessions;
CREATE TRIGGER update_campaign_sessions_updated_at
  BEFORE UPDATE ON campaign_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Junction Tables for Many-to-Many Relationships
-- ============================================================================

-- ============================================================================
-- NPC <-> Organization (Key Members, Allies, Enemies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_npc_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  npc_id UUID NOT NULL REFERENCES campaign_npcs(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES campaign_organizations(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'member', -- 'member', 'ally', 'enemy', 'leader'

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(npc_id, organization_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_campaign_npc_organizations_npc_id ON campaign_npc_organizations(npc_id);
CREATE INDEX IF NOT EXISTS idx_campaign_npc_organizations_org_id ON campaign_npc_organizations(organization_id);

-- ============================================================================
-- NPC <-> NPC (Allies, Enemies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_npc_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  npc_id UUID NOT NULL REFERENCES campaign_npcs(id) ON DELETE CASCADE,
  related_npc_id UUID NOT NULL REFERENCES campaign_npcs(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'ally', -- 'ally', 'enemy', 'neutral'

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(npc_id, related_npc_id),
  CHECK(npc_id != related_npc_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_npc_relationships_npc_id ON campaign_npc_relationships(npc_id);
CREATE INDEX IF NOT EXISTS idx_campaign_npc_relationships_related_id ON campaign_npc_relationships(related_npc_id);

-- ============================================================================
-- NPC <-> Location
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_npc_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  npc_id UUID NOT NULL REFERENCES campaign_npcs(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES campaign_locations(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(npc_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_npc_locations_npc_id ON campaign_npc_locations(npc_id);
CREATE INDEX IF NOT EXISTS idx_campaign_npc_locations_location_id ON campaign_npc_locations(location_id);

-- ============================================================================
-- Organization <-> Organization (Allies, Enemies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_organization_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES campaign_organizations(id) ON DELETE CASCADE,
  related_organization_id UUID NOT NULL REFERENCES campaign_organizations(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'ally', -- 'ally', 'enemy', 'neutral'

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(organization_id, related_organization_id),
  CHECK(organization_id != related_organization_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_org_relationships_org_id ON campaign_organization_relationships(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaign_org_relationships_related_id ON campaign_organization_relationships(related_organization_id);

-- ============================================================================
-- Organization <-> Location
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_organization_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES campaign_organizations(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES campaign_locations(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(organization_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_org_locations_org_id ON campaign_organization_locations(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaign_org_locations_location_id ON campaign_organization_locations(location_id);

-- ============================================================================
-- Organization <-> Quest
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_organization_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES campaign_organizations(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES campaign_quests(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(organization_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_org_quests_org_id ON campaign_organization_quests(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaign_org_quests_quest_id ON campaign_organization_quests(quest_id);

-- ============================================================================
-- Location <-> Quest
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_location_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES campaign_locations(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES campaign_quests(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(location_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_location_quests_location_id ON campaign_location_quests(location_id);
CREATE INDEX IF NOT EXISTS idx_campaign_location_quests_quest_id ON campaign_location_quests(quest_id);

-- ============================================================================
-- Session <-> Location (Locations Visited)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_session_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES campaign_locations(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_session_locations_session_id ON campaign_session_locations(session_id);
CREATE INDEX IF NOT EXISTS idx_campaign_session_locations_location_id ON campaign_session_locations(location_id);

-- ============================================================================
-- Session <-> NPC (NPCs Involved with metadata)
-- This is the "double link" - stores role, actions, notes per session-npc pair
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_session_npcs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
  npc_id UUID NOT NULL REFERENCES campaign_npcs(id) ON DELETE CASCADE,

  -- Session-specific NPC info
  role TEXT NOT NULL DEFAULT '',
  actions_taken TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id, npc_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_session_npcs_session_id ON campaign_session_npcs(session_id);
CREATE INDEX IF NOT EXISTS idx_campaign_session_npcs_npc_id ON campaign_session_npcs(npc_id);

DROP TRIGGER IF EXISTS update_campaign_session_npcs_updated_at ON campaign_session_npcs;
CREATE TRIGGER update_campaign_session_npcs_updated_at
  BEFORE UPDATE ON campaign_session_npcs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Session-NPC <-> Location (Where the NPC was during the session)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_session_npc_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_npc_id UUID NOT NULL REFERENCES campaign_session_npcs(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES campaign_locations(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_npc_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_session_npc_locations_snpc_id ON campaign_session_npc_locations(session_npc_id);
CREATE INDEX IF NOT EXISTS idx_campaign_session_npc_locations_location_id ON campaign_session_npc_locations(location_id);

-- ============================================================================
-- Session-NPC <-> Quest (Quests the NPC was involved in during the session)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_session_npc_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_npc_id UUID NOT NULL REFERENCES campaign_session_npcs(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES campaign_quests(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_npc_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_session_npc_quests_snpc_id ON campaign_session_npc_quests(session_npc_id);
CREATE INDEX IF NOT EXISTS idx_campaign_session_npc_quests_quest_id ON campaign_session_npc_quests(quest_id);

-- ============================================================================
-- Session <-> Quest
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_session_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES campaign_quests(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_session_quests_session_id ON campaign_session_quests(session_id);
CREATE INDEX IF NOT EXISTS idx_campaign_session_quests_quest_id ON campaign_session_quests(quest_id);

-- ============================================================================
-- Session <-> Organization
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_session_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES campaign_organizations(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_session_orgs_session_id ON campaign_session_organizations(session_id);
CREATE INDEX IF NOT EXISTS idx_campaign_session_orgs_org_id ON campaign_session_organizations(organization_id);

-- ============================================================================
-- Quest <-> NPC (NPCs Involved in Quest with metadata)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_quest_npcs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_id UUID NOT NULL REFERENCES campaign_quests(id) ON DELETE CASCADE,
  npc_id UUID NOT NULL REFERENCES campaign_npcs(id) ON DELETE CASCADE,

  -- Quest-specific NPC info
  role TEXT NOT NULL DEFAULT '',
  actions_taken TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(quest_id, npc_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_quest_npcs_quest_id ON campaign_quest_npcs(quest_id);
CREATE INDEX IF NOT EXISTS idx_campaign_quest_npcs_npc_id ON campaign_quest_npcs(npc_id);

DROP TRIGGER IF EXISTS update_campaign_quest_npcs_updated_at ON campaign_quest_npcs;
CREATE TRIGGER update_campaign_quest_npcs_updated_at
  BEFORE UPDATE ON campaign_quest_npcs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Quest-NPC <-> Location
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_quest_npc_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_npc_id UUID NOT NULL REFERENCES campaign_quest_npcs(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES campaign_locations(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(quest_npc_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_quest_npc_locations_qnpc_id ON campaign_quest_npc_locations(quest_npc_id);
CREATE INDEX IF NOT EXISTS idx_campaign_quest_npc_locations_location_id ON campaign_quest_npc_locations(location_id);

-- ============================================================================
-- Quest-NPC <-> Session
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_quest_npc_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_npc_id UUID NOT NULL REFERENCES campaign_quest_npcs(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(quest_npc_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_quest_npc_sessions_qnpc_id ON campaign_quest_npc_sessions(quest_npc_id);
CREATE INDEX IF NOT EXISTS idx_campaign_quest_npc_sessions_session_id ON campaign_quest_npc_sessions(session_id);

-- ============================================================================
-- Quest <-> PC (Player Characters involved in Quest with metadata)
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_quest_characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_id UUID NOT NULL REFERENCES campaign_quests(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,

  -- Quest-specific character info
  role TEXT NOT NULL DEFAULT '',
  actions_taken TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(quest_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_quest_characters_quest_id ON campaign_quest_characters(quest_id);
CREATE INDEX IF NOT EXISTS idx_campaign_quest_characters_character_id ON campaign_quest_characters(character_id);

DROP TRIGGER IF EXISTS update_campaign_quest_characters_updated_at ON campaign_quest_characters;
CREATE TRIGGER update_campaign_quest_characters_updated_at
  BEFORE UPDATE ON campaign_quest_characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Quest-Character <-> Location
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_quest_character_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_character_id UUID NOT NULL REFERENCES campaign_quest_characters(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES campaign_locations(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(quest_character_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_quest_char_locations_qc_id ON campaign_quest_character_locations(quest_character_id);
CREATE INDEX IF NOT EXISTS idx_campaign_quest_char_locations_location_id ON campaign_quest_character_locations(location_id);

-- ============================================================================
-- Quest-Character <-> Session
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_quest_character_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_character_id UUID NOT NULL REFERENCES campaign_quest_characters(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(quest_character_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_quest_char_sessions_qc_id ON campaign_quest_character_sessions(quest_character_id);
CREATE INDEX IF NOT EXISTS idx_campaign_quest_char_sessions_session_id ON campaign_quest_character_sessions(session_id);

-- ============================================================================
-- Add foreign key for organization headquarters after locations table exists
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'campaign_organizations_headquarters_id_fkey'
  ) THEN
    ALTER TABLE campaign_organizations
    ADD CONSTRAINT campaign_organizations_headquarters_id_fkey
    FOREIGN KEY (headquarters_id) REFERENCES campaign_locations(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================================
-- Row Level Security Policies
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE campaign_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_npcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_npc_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_npc_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_npc_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_organization_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_organization_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_organization_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_location_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_session_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_session_npcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_session_npc_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_session_npc_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_session_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_session_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_quest_npcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_quest_npc_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_quest_npc_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_quest_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_quest_character_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_quest_character_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Helper function to check campaign access
-- ============================================================================

CREATE OR REPLACE FUNCTION user_can_access_campaign(campaign_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM campaigns c
    WHERE c.id = campaign_uuid
    AND c.deleted_at IS NULL
    AND (
      c.gm_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(c.players) AS p
        WHERE (p->>'id')::uuid = auth.uid()
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Policies for campaign_organizations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view organizations in their campaigns" ON campaign_organizations;
CREATE POLICY "Users can view organizations in their campaigns"
  ON campaign_organizations FOR SELECT
  USING (user_can_access_campaign(campaign_id));

DROP POLICY IF EXISTS "GM can insert organizations" ON campaign_organizations;
CREATE POLICY "GM can insert organizations"
  ON campaign_organizations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can update organizations" ON campaign_organizations;
CREATE POLICY "GM can update organizations"
  ON campaign_organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can delete organizations" ON campaign_organizations;
CREATE POLICY "GM can delete organizations"
  ON campaign_organizations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_npcs
-- ============================================================================

DROP POLICY IF EXISTS "Users can view npcs in their campaigns" ON campaign_npcs;
CREATE POLICY "Users can view npcs in their campaigns"
  ON campaign_npcs FOR SELECT
  USING (user_can_access_campaign(campaign_id));

DROP POLICY IF EXISTS "GM can insert npcs" ON campaign_npcs;
CREATE POLICY "GM can insert npcs"
  ON campaign_npcs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can update npcs" ON campaign_npcs;
CREATE POLICY "GM can update npcs"
  ON campaign_npcs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can delete npcs" ON campaign_npcs;
CREATE POLICY "GM can delete npcs"
  ON campaign_npcs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_locations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view locations in their campaigns" ON campaign_locations;
CREATE POLICY "Users can view locations in their campaigns"
  ON campaign_locations FOR SELECT
  USING (user_can_access_campaign(campaign_id));

DROP POLICY IF EXISTS "GM can insert locations" ON campaign_locations;
CREATE POLICY "GM can insert locations"
  ON campaign_locations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can update locations" ON campaign_locations;
CREATE POLICY "GM can update locations"
  ON campaign_locations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can delete locations" ON campaign_locations;
CREATE POLICY "GM can delete locations"
  ON campaign_locations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_quests
-- ============================================================================

DROP POLICY IF EXISTS "Users can view quests in their campaigns" ON campaign_quests;
CREATE POLICY "Users can view quests in their campaigns"
  ON campaign_quests FOR SELECT
  USING (user_can_access_campaign(campaign_id));

DROP POLICY IF EXISTS "GM can insert quests" ON campaign_quests;
CREATE POLICY "GM can insert quests"
  ON campaign_quests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can update quests" ON campaign_quests;
CREATE POLICY "GM can update quests"
  ON campaign_quests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can delete quests" ON campaign_quests;
CREATE POLICY "GM can delete quests"
  ON campaign_quests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_sessions
-- ============================================================================

DROP POLICY IF EXISTS "Users can view sessions in their campaigns" ON campaign_sessions;
CREATE POLICY "Users can view sessions in their campaigns"
  ON campaign_sessions FOR SELECT
  USING (user_can_access_campaign(campaign_id));

DROP POLICY IF EXISTS "GM can insert sessions" ON campaign_sessions;
CREATE POLICY "GM can insert sessions"
  ON campaign_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can update sessions" ON campaign_sessions;
CREATE POLICY "GM can update sessions"
  ON campaign_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "GM can delete sessions" ON campaign_sessions;
CREATE POLICY "GM can delete sessions"
  ON campaign_sessions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = campaign_id AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Macro for junction table policies (they inherit access from parent entities)
-- ============================================================================

-- Helper function to get campaign_id from an entity
CREATE OR REPLACE FUNCTION get_campaign_id_from_npc(npc_uuid UUID)
RETURNS UUID AS $$
  SELECT campaign_id FROM campaign_npcs WHERE id = npc_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_campaign_id_from_location(location_uuid UUID)
RETURNS UUID AS $$
  SELECT campaign_id FROM campaign_locations WHERE id = location_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_campaign_id_from_quest(quest_uuid UUID)
RETURNS UUID AS $$
  SELECT campaign_id FROM campaign_quests WHERE id = quest_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_campaign_id_from_session(session_uuid UUID)
RETURNS UUID AS $$
  SELECT campaign_id FROM campaign_sessions WHERE id = session_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_campaign_id_from_organization(org_uuid UUID)
RETURNS UUID AS $$
  SELECT campaign_id FROM campaign_organizations WHERE id = org_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- Policies for campaign_npc_organizations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view npc_organizations" ON campaign_npc_organizations;
CREATE POLICY "Users can view npc_organizations"
  ON campaign_npc_organizations FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_npc(npc_id)));

DROP POLICY IF EXISTS "GM can manage npc_organizations" ON campaign_npc_organizations;
CREATE POLICY "GM can manage npc_organizations"
  ON campaign_npc_organizations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_npc(npc_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_npc_relationships
-- ============================================================================

DROP POLICY IF EXISTS "Users can view npc_relationships" ON campaign_npc_relationships;
CREATE POLICY "Users can view npc_relationships"
  ON campaign_npc_relationships FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_npc(npc_id)));

DROP POLICY IF EXISTS "GM can manage npc_relationships" ON campaign_npc_relationships;
CREATE POLICY "GM can manage npc_relationships"
  ON campaign_npc_relationships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_npc(npc_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_npc_locations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view npc_locations" ON campaign_npc_locations;
CREATE POLICY "Users can view npc_locations"
  ON campaign_npc_locations FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_npc(npc_id)));

DROP POLICY IF EXISTS "GM can manage npc_locations" ON campaign_npc_locations;
CREATE POLICY "GM can manage npc_locations"
  ON campaign_npc_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_npc(npc_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_organization_relationships
-- ============================================================================

DROP POLICY IF EXISTS "Users can view org_relationships" ON campaign_organization_relationships;
CREATE POLICY "Users can view org_relationships"
  ON campaign_organization_relationships FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_organization(organization_id)));

DROP POLICY IF EXISTS "GM can manage org_relationships" ON campaign_organization_relationships;
CREATE POLICY "GM can manage org_relationships"
  ON campaign_organization_relationships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_organization(organization_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_organization_locations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view org_locations" ON campaign_organization_locations;
CREATE POLICY "Users can view org_locations"
  ON campaign_organization_locations FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_organization(organization_id)));

DROP POLICY IF EXISTS "GM can manage org_locations" ON campaign_organization_locations;
CREATE POLICY "GM can manage org_locations"
  ON campaign_organization_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_organization(organization_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_organization_quests
-- ============================================================================

DROP POLICY IF EXISTS "Users can view org_quests" ON campaign_organization_quests;
CREATE POLICY "Users can view org_quests"
  ON campaign_organization_quests FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_organization(organization_id)));

DROP POLICY IF EXISTS "GM can manage org_quests" ON campaign_organization_quests;
CREATE POLICY "GM can manage org_quests"
  ON campaign_organization_quests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_organization(organization_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_location_quests
-- ============================================================================

DROP POLICY IF EXISTS "Users can view location_quests" ON campaign_location_quests;
CREATE POLICY "Users can view location_quests"
  ON campaign_location_quests FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_location(location_id)));

DROP POLICY IF EXISTS "GM can manage location_quests" ON campaign_location_quests;
CREATE POLICY "GM can manage location_quests"
  ON campaign_location_quests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_location(location_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_session_locations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view session_locations" ON campaign_session_locations;
CREATE POLICY "Users can view session_locations"
  ON campaign_session_locations FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_session(session_id)));

DROP POLICY IF EXISTS "GM can manage session_locations" ON campaign_session_locations;
CREATE POLICY "GM can manage session_locations"
  ON campaign_session_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_session(session_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_session_npcs
-- ============================================================================

DROP POLICY IF EXISTS "Users can view session_npcs" ON campaign_session_npcs;
CREATE POLICY "Users can view session_npcs"
  ON campaign_session_npcs FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_session(session_id)));

DROP POLICY IF EXISTS "GM can manage session_npcs" ON campaign_session_npcs;
CREATE POLICY "GM can manage session_npcs"
  ON campaign_session_npcs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_session(session_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_session_npc_locations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view session_npc_locations" ON campaign_session_npc_locations;
CREATE POLICY "Users can view session_npc_locations"
  ON campaign_session_npc_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaign_session_npcs snpc
      WHERE snpc.id = session_npc_id
      AND user_can_access_campaign(get_campaign_id_from_session(snpc.session_id))
    )
  );

DROP POLICY IF EXISTS "GM can manage session_npc_locations" ON campaign_session_npc_locations;
CREATE POLICY "GM can manage session_npc_locations"
  ON campaign_session_npc_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaign_session_npcs snpc
      JOIN campaigns c ON c.id = get_campaign_id_from_session(snpc.session_id)
      WHERE snpc.id = session_npc_id
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_session_npc_quests
-- ============================================================================

DROP POLICY IF EXISTS "Users can view session_npc_quests" ON campaign_session_npc_quests;
CREATE POLICY "Users can view session_npc_quests"
  ON campaign_session_npc_quests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaign_session_npcs snpc
      WHERE snpc.id = session_npc_id
      AND user_can_access_campaign(get_campaign_id_from_session(snpc.session_id))
    )
  );

DROP POLICY IF EXISTS "GM can manage session_npc_quests" ON campaign_session_npc_quests;
CREATE POLICY "GM can manage session_npc_quests"
  ON campaign_session_npc_quests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaign_session_npcs snpc
      JOIN campaigns c ON c.id = get_campaign_id_from_session(snpc.session_id)
      WHERE snpc.id = session_npc_id
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_session_quests
-- ============================================================================

DROP POLICY IF EXISTS "Users can view session_quests" ON campaign_session_quests;
CREATE POLICY "Users can view session_quests"
  ON campaign_session_quests FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_session(session_id)));

DROP POLICY IF EXISTS "GM can manage session_quests" ON campaign_session_quests;
CREATE POLICY "GM can manage session_quests"
  ON campaign_session_quests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_session(session_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_session_organizations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view session_organizations" ON campaign_session_organizations;
CREATE POLICY "Users can view session_organizations"
  ON campaign_session_organizations FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_session(session_id)));

DROP POLICY IF EXISTS "GM can manage session_organizations" ON campaign_session_organizations;
CREATE POLICY "GM can manage session_organizations"
  ON campaign_session_organizations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_session(session_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_quest_npcs
-- ============================================================================

DROP POLICY IF EXISTS "Users can view quest_npcs" ON campaign_quest_npcs;
CREATE POLICY "Users can view quest_npcs"
  ON campaign_quest_npcs FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_quest(quest_id)));

DROP POLICY IF EXISTS "GM can manage quest_npcs" ON campaign_quest_npcs;
CREATE POLICY "GM can manage quest_npcs"
  ON campaign_quest_npcs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_quest(quest_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_quest_npc_locations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view quest_npc_locations" ON campaign_quest_npc_locations;
CREATE POLICY "Users can view quest_npc_locations"
  ON campaign_quest_npc_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaign_quest_npcs qnpc
      WHERE qnpc.id = quest_npc_id
      AND user_can_access_campaign(get_campaign_id_from_quest(qnpc.quest_id))
    )
  );

DROP POLICY IF EXISTS "GM can manage quest_npc_locations" ON campaign_quest_npc_locations;
CREATE POLICY "GM can manage quest_npc_locations"
  ON campaign_quest_npc_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaign_quest_npcs qnpc
      JOIN campaigns c ON c.id = get_campaign_id_from_quest(qnpc.quest_id)
      WHERE qnpc.id = quest_npc_id
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_quest_npc_sessions
-- ============================================================================

DROP POLICY IF EXISTS "Users can view quest_npc_sessions" ON campaign_quest_npc_sessions;
CREATE POLICY "Users can view quest_npc_sessions"
  ON campaign_quest_npc_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaign_quest_npcs qnpc
      WHERE qnpc.id = quest_npc_id
      AND user_can_access_campaign(get_campaign_id_from_quest(qnpc.quest_id))
    )
  );

DROP POLICY IF EXISTS "GM can manage quest_npc_sessions" ON campaign_quest_npc_sessions;
CREATE POLICY "GM can manage quest_npc_sessions"
  ON campaign_quest_npc_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaign_quest_npcs qnpc
      JOIN campaigns c ON c.id = get_campaign_id_from_quest(qnpc.quest_id)
      WHERE qnpc.id = quest_npc_id
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_quest_characters
-- ============================================================================

DROP POLICY IF EXISTS "Users can view quest_characters" ON campaign_quest_characters;
CREATE POLICY "Users can view quest_characters"
  ON campaign_quest_characters FOR SELECT
  USING (user_can_access_campaign(get_campaign_id_from_quest(quest_id)));

DROP POLICY IF EXISTS "GM can manage quest_characters" ON campaign_quest_characters;
CREATE POLICY "GM can manage quest_characters"
  ON campaign_quest_characters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = get_campaign_id_from_quest(quest_id)
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_quest_character_locations
-- ============================================================================

DROP POLICY IF EXISTS "Users can view quest_character_locations" ON campaign_quest_character_locations;
CREATE POLICY "Users can view quest_character_locations"
  ON campaign_quest_character_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaign_quest_characters qc
      WHERE qc.id = quest_character_id
      AND user_can_access_campaign(get_campaign_id_from_quest(qc.quest_id))
    )
  );

DROP POLICY IF EXISTS "GM can manage quest_character_locations" ON campaign_quest_character_locations;
CREATE POLICY "GM can manage quest_character_locations"
  ON campaign_quest_character_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaign_quest_characters qc
      JOIN campaigns c ON c.id = get_campaign_id_from_quest(qc.quest_id)
      WHERE qc.id = quest_character_id
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- Policies for campaign_quest_character_sessions
-- ============================================================================

DROP POLICY IF EXISTS "Users can view quest_character_sessions" ON campaign_quest_character_sessions;
CREATE POLICY "Users can view quest_character_sessions"
  ON campaign_quest_character_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaign_quest_characters qc
      WHERE qc.id = quest_character_id
      AND user_can_access_campaign(get_campaign_id_from_quest(qc.quest_id))
    )
  );

DROP POLICY IF EXISTS "GM can manage quest_character_sessions" ON campaign_quest_character_sessions;
CREATE POLICY "GM can manage quest_character_sessions"
  ON campaign_quest_character_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaign_quest_characters qc
      JOIN campaigns c ON c.id = get_campaign_id_from_quest(qc.quest_id)
      WHERE qc.id = quest_character_id
      AND c.gm_id = auth.uid() AND c.deleted_at IS NULL
    )
  );

-- ============================================================================
-- View for fetching full campaign data with all entities
-- ============================================================================

CREATE OR REPLACE VIEW campaign_full_data AS
SELECT
  c.id as campaign_id,
  c.name as campaign_name,
  c.gm_id,
  c.status,
  -- Organizations count
  (SELECT COUNT(*) FROM campaign_organizations o WHERE o.campaign_id = c.id) as organization_count,
  -- NPCs count
  (SELECT COUNT(*) FROM campaign_npcs n WHERE n.campaign_id = c.id) as npc_count,
  -- Locations count
  (SELECT COUNT(*) FROM campaign_locations l WHERE l.campaign_id = c.id) as location_count,
  -- Quests count
  (SELECT COUNT(*) FROM campaign_quests q WHERE q.campaign_id = c.id) as quest_count,
  -- Sessions count
  (SELECT COUNT(*) FROM campaign_sessions s WHERE s.campaign_id = c.id) as session_count
FROM campaigns c
WHERE c.deleted_at IS NULL;

-- Grant access to the view
GRANT SELECT ON campaign_full_data TO authenticated;
