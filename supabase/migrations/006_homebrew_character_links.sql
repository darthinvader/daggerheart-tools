-- Homebrew character linking
-- Allows users to link homebrew items to their characters

-- =====================================================================================
-- Link table
-- =====================================================================================

CREATE TABLE IF NOT EXISTS homebrew_character_links (
  homebrew_id UUID NOT NULL REFERENCES homebrew_content(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  added_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (homebrew_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_homebrew_character_links_homebrew_id
  ON homebrew_character_links(homebrew_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_character_links_character_id
  ON homebrew_character_links(character_id);

ALTER TABLE homebrew_character_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Homebrew character links: owner can select" ON homebrew_character_links;
DROP POLICY IF EXISTS "Homebrew character links: owner can insert" ON homebrew_character_links;
DROP POLICY IF EXISTS "Homebrew character links: owner can delete" ON homebrew_character_links;

CREATE POLICY "Homebrew character links: owner can select" ON homebrew_character_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM characters
      WHERE characters.id = homebrew_character_links.character_id
        AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Homebrew character links: owner can insert" ON homebrew_character_links
  FOR INSERT WITH CHECK (
    auth.uid() = added_by
    AND EXISTS (
      SELECT 1
      FROM characters
      WHERE characters.id = homebrew_character_links.character_id
        AND characters.user_id = auth.uid()
    )
    AND can_view_homebrew_content(homebrew_id)
  );

CREATE POLICY "Homebrew character links: owner can delete" ON homebrew_character_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1
      FROM characters
      WHERE characters.id = homebrew_character_links.character_id
        AND characters.user_id = auth.uid()
    )
  );

-- =====================================================================================
-- Helper functions
-- =====================================================================================

CREATE OR REPLACE FUNCTION link_homebrew_to_character(
  homebrew_id UUID,
  character_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Ensure character ownership
  IF NOT EXISTS (
    SELECT 1 FROM characters
    WHERE characters.id = character_id
      AND characters.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'not_owner';
  END IF;

  -- Ensure homebrew is visible to user
  IF NOT can_view_homebrew_content(homebrew_id) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  INSERT INTO homebrew_character_links (homebrew_id, character_id, added_by)
  VALUES (homebrew_id, character_id, auth.uid())
  ON CONFLICT DO NOTHING;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION link_homebrew_to_character(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION unlink_homebrew_from_character(
  homebrew_id UUID,
  character_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  DELETE FROM homebrew_character_links
  WHERE homebrew_character_links.homebrew_id = homebrew_id
    AND homebrew_character_links.character_id = character_id
    AND EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = character_id
        AND characters.user_id = auth.uid()
    );

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION unlink_homebrew_from_character(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION get_character_homebrew(p_character_id UUID)
RETURNS SETOF homebrew_content
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT hc.*
  FROM homebrew_content hc
  JOIN homebrew_character_links hcl
    ON hcl.homebrew_id = hc.id
  WHERE hcl.character_id = p_character_id
    AND hc.deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = p_character_id
        AND characters.user_id = auth.uid()
    );
$$;

GRANT EXECUTE ON FUNCTION get_character_homebrew(UUID) TO authenticated;
