-- ============================================================================
-- Standalone Battles Table (non-campaign battle tracker)
-- ============================================================================

CREATE TABLE IF NOT EXISTS standalone_battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Untitled Battle',
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_standalone_battles_owner_id ON standalone_battles(owner_id);
CREATE INDEX IF NOT EXISTS idx_standalone_battles_deleted_at ON standalone_battles(deleted_at);

-- RLS
ALTER TABLE standalone_battles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Standalone battles: owner can select" ON standalone_battles;
DROP POLICY IF EXISTS "Standalone battles: owner can insert" ON standalone_battles;
DROP POLICY IF EXISTS "Standalone battles: owner can update" ON standalone_battles;
DROP POLICY IF EXISTS "Standalone battles: owner can delete" ON standalone_battles;

CREATE POLICY "Standalone battles: owner can select" ON standalone_battles
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Standalone battles: owner can insert" ON standalone_battles
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Standalone battles: owner can update" ON standalone_battles
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Standalone battles: owner can delete" ON standalone_battles
  FOR DELETE USING (auth.uid() = owner_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_standalone_battles_updated_at ON standalone_battles;
CREATE TRIGGER update_standalone_battles_updated_at
  BEFORE UPDATE ON standalone_battles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
