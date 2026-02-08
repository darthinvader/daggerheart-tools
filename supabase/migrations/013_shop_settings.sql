-- Add shop feature columns to campaigns table
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS shop_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shop_settings jsonb NOT NULL DEFAULT '{}'::jsonb;
