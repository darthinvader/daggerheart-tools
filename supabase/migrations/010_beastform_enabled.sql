-- Add beastform_enabled boolean column to characters table
-- Mirrors the companion_enabled pattern for optional rules toggling
ALTER TABLE characters ADD COLUMN IF NOT EXISTS beastform_enabled BOOLEAN NOT NULL DEFAULT false;
