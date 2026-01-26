-- Supabase Policies and Functions

-- Enable Row Level Security
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Characters policies (owner-only CRUD)
DROP POLICY IF EXISTS "Characters: owner can select" ON characters;
DROP POLICY IF EXISTS "Characters: owner can insert" ON characters;
DROP POLICY IF EXISTS "Characters: owner can update" ON characters;
DROP POLICY IF EXISTS "Characters: owner can delete" ON characters;

CREATE POLICY "Characters: owner can select" ON characters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Characters: owner can insert" ON characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Characters: owner can update" ON characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Characters: owner can delete" ON characters
  FOR DELETE USING (auth.uid() = user_id);

-- GM view policy for campaign characters (read-only)
DROP POLICY IF EXISTS "Characters: gm can view campaign characters" ON characters;

CREATE POLICY "Characters: gm can view campaign characters" ON characters
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM campaigns
      WHERE campaigns.gm_id = auth.uid()
        AND campaigns.deleted_at IS NULL
        AND campaigns.players @> jsonb_build_array(
          jsonb_build_object('characterId', characters.id::text)
        )
    )
  );

-- Campaign policies (GM-only)
DROP POLICY IF EXISTS "Users can view their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can insert their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Players can view campaigns they joined" ON campaigns;

CREATE POLICY "Users can view their own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = gm_id);

CREATE POLICY "Users can insert their own campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = gm_id);

CREATE POLICY "Users can update their own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = gm_id);

CREATE POLICY "Users can delete their own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = gm_id);

-- Invite preview function
CREATE OR REPLACE FUNCTION campaign_invite_preview(invite_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  status TEXT,
  gm_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  RETURN QUERY
  SELECT campaigns.id, campaigns.name, campaigns.status, campaigns.gm_id
  FROM campaigns
  WHERE campaigns.invite_code = campaign_invite_preview.invite_code
    AND campaigns.deleted_at IS NULL
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION campaign_invite_preview(TEXT) TO authenticated;

-- Join campaign via invite code (adds or updates player entry)
CREATE OR REPLACE FUNCTION join_campaign_by_invite(
  invite_code TEXT,
  player_name TEXT,
  character_id UUID,
  character_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  campaign_record RECORD;
  existing_entry JSONB;
  updated_players JSONB;
  joined_at TEXT;
  role_value TEXT;
  name_value TEXT;
  character_name_value TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT id, players
    INTO campaign_record
  FROM campaigns
  WHERE campaigns.invite_code = join_campaign_by_invite.invite_code
    AND campaigns.deleted_at IS NULL
  LIMIT 1;

  IF campaign_record.id IS NULL THEN
    RAISE EXCEPTION 'invalid_invite';
  END IF;

  SELECT elem
    INTO existing_entry
  FROM jsonb_array_elements(COALESCE(campaign_record.players, '[]'::jsonb)) elem
  WHERE elem->>'id' = auth.uid()::text
  LIMIT 1;

  joined_at := COALESCE(existing_entry->>'joinedAt', NOW()::text);
  role_value := COALESCE(existing_entry->>'role', 'player');
  name_value := COALESCE(NULLIF(player_name, ''), existing_entry->>'name', 'Player');
  character_name_value := NULLIF(character_name, '');

  SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
    INTO updated_players
  FROM jsonb_array_elements(COALESCE(campaign_record.players, '[]'::jsonb)) elem
  WHERE elem->>'id' <> auth.uid()::text;

  updated_players := updated_players || jsonb_build_array(
    jsonb_build_object(
      'id', auth.uid()::text,
      'name', name_value,
      'characterId', CASE WHEN character_id IS NULL THEN NULL ELSE character_id::text END,
      'characterName', character_name_value,
      'joinedAt', joined_at,
      'role', role_value
    )
  );

  UPDATE campaigns
  SET players = updated_players
  WHERE id = campaign_record.id;

  RETURN campaign_record.id;
END;
$$;

GRANT EXECUTE ON FUNCTION join_campaign_by_invite(TEXT, TEXT, UUID, TEXT) TO authenticated;
