-- Add soft-delete timestamp for characters
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
