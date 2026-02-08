-- Audio/Music Manager: GM soundboard with linked audio tracks and scene presets.
-- Tracks store URLs (YouTube, SoundCloud, direct MP3/OGG) — no file uploads.

-- =====================================================================================
-- Soundboard Tracks
-- =====================================================================================

CREATE TABLE IF NOT EXISTS soundboard_tracks (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  gm_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id   uuid        REFERENCES campaigns(id) ON DELETE SET NULL,
  name          text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  url           text        NOT NULL CHECK (char_length(url) BETWEEN 1 AND 2048),
  source        text        NOT NULL CHECK (source IN ('youtube', 'soundcloud', 'direct')),
  category      text        NOT NULL CHECK (category IN ('ambient', 'music', 'sfx')),
  tags          jsonb       NOT NULL DEFAULT '[]'::jsonb,
  volume        numeric(3,2) NOT NULL DEFAULT 0.50 CHECK (volume >= 0 AND volume <= 1),
  loop          boolean     NOT NULL DEFAULT false,
  sort_order    int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_soundboard_tracks_gm_id
  ON soundboard_tracks (gm_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_soundboard_tracks_campaign_id
  ON soundboard_tracks (campaign_id)
  WHERE campaign_id IS NOT NULL;

ALTER TABLE soundboard_tracks ENABLE ROW LEVEL SECURITY;

-- GMs can CRUD their own tracks
DROP POLICY IF EXISTS soundboard_tracks_gm_all ON soundboard_tracks;
CREATE POLICY soundboard_tracks_gm_all
  ON soundboard_tracks
  FOR ALL
  TO authenticated
  USING (gm_id = auth.uid())
  WITH CHECK (gm_id = auth.uid());

-- =====================================================================================
-- Soundboard Presets (saved "scenes" — combinations of tracks with per-track volumes)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS soundboard_presets (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  gm_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id   uuid        REFERENCES campaigns(id) ON DELETE SET NULL,
  name          text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  description   text        NOT NULL DEFAULT '',
  tracks        jsonb       NOT NULL DEFAULT '[]'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Cap JSONB payload at 256 KB
ALTER TABLE soundboard_presets
  ADD CONSTRAINT soundboard_presets_tracks_size
  CHECK (octet_length(tracks::text) <= 262144);

CREATE INDEX IF NOT EXISTS idx_soundboard_presets_gm_id
  ON soundboard_presets (gm_id, created_at DESC);

ALTER TABLE soundboard_presets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS soundboard_presets_gm_all ON soundboard_presets;
CREATE POLICY soundboard_presets_gm_all
  ON soundboard_presets
  FOR ALL
  TO authenticated
  USING (gm_id = auth.uid())
  WITH CHECK (gm_id = auth.uid());
