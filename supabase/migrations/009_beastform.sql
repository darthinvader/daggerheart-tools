-- Migration: 009_beastform.sql
-- Description: Add beastform column to characters table for Druid polymorphism support

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS beastform JSONB NOT NULL DEFAULT '{
  "active": false,
  "formId": null,
  "activationMethod": null,
  "evolutionBonusTrait": null,
  "activatedAt": null
}'::jsonb;

-- Comment on column
COMMENT ON COLUMN characters.beastform IS 'Stores the current beastform state for Druid characters (polymorph mode)';
