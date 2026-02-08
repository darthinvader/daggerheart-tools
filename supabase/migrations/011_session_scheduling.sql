-- Session Scheduling: standalone availability polls with shareable voting links
-- Each poll is owned by a GM and optionally linked to a campaign.

-- Drop existing objects so migration is idempotent
DROP FUNCTION IF EXISTS submit_scheduling_vote(text, text, jsonb);
DROP POLICY IF EXISTS scheduling_polls_gm_all ON scheduling_polls;
DROP POLICY IF EXISTS scheduling_polls_read_by_share_code ON scheduling_polls;
DROP INDEX IF EXISTS idx_scheduling_polls_share_code;
DROP INDEX IF EXISTS idx_scheduling_polls_gm_id;
ALTER TABLE IF EXISTS scheduling_polls DROP CONSTRAINT IF EXISTS scheduling_polls_slots_size;

CREATE TABLE IF NOT EXISTS scheduling_polls (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  gm_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id   uuid        REFERENCES campaigns(id) ON DELETE SET NULL,
  title         text        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description   text        NOT NULL DEFAULT '',
  status        text        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'confirmed', 'archived')),
  slots         jsonb       NOT NULL DEFAULT '[]'::jsonb,
  quorum        int         NOT NULL DEFAULT 1 CHECK (quorum >= 1),
  confirmed_slot_id text,
  share_code    text        NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Size guard: cap JSONB payload at 256 KB
ALTER TABLE scheduling_polls
  ADD CONSTRAINT scheduling_polls_slots_size
  CHECK (octet_length(slots::text) <= 262144);

-- Index for share-code lookups (public voting route)
CREATE INDEX IF NOT EXISTS idx_scheduling_polls_share_code
  ON scheduling_polls (share_code);

-- Index for GM dashboard queries
CREATE INDEX IF NOT EXISTS idx_scheduling_polls_gm_id
  ON scheduling_polls (gm_id, created_at DESC);

-- =====================================================================================
-- RLS policies
-- =====================================================================================

ALTER TABLE scheduling_polls ENABLE ROW LEVEL SECURITY;

-- GMs can do everything with their own polls
CREATE POLICY scheduling_polls_gm_all
  ON scheduling_polls
  FOR ALL
  TO authenticated
  USING (gm_id = auth.uid())
  WITH CHECK (gm_id = auth.uid());

-- Anyone authenticated can SELECT a poll by share_code (for voting page)
CREATE POLICY scheduling_polls_read_by_share_code
  ON scheduling_polls
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================================================
-- RPC: submit_scheduling_vote
-- Allows any authenticated user with a valid share_code to submit their votes.
-- No campaign membership check — anyone with the link can vote.
-- =====================================================================================

CREATE OR REPLACE FUNCTION submit_scheduling_vote(
  p_share_code  text,
  p_player_name text,
  p_votes       jsonb   -- [{ "slotId": "...", "value": "available"|"maybe"|"unavailable" }]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id    uuid := auth.uid();
  v_poll_id    uuid;
  v_status     text;
  v_slots      jsonb;
  v_vote       jsonb;
  v_slot_id    text;
  v_value      text;
  v_slot_idx   int;
  v_found      boolean;
  v_now        text := to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"');
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Load the poll by share code
  SELECT id, status, slots
    INTO v_poll_id, v_status, v_slots
    FROM scheduling_polls
   WHERE share_code = p_share_code;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Poll not found';
  END IF;

  IF v_status <> 'open' THEN
    RAISE EXCEPTION 'Poll is not open for voting';
  END IF;

  -- Process each vote
  FOR v_vote IN SELECT * FROM jsonb_array_elements(p_votes)
  LOOP
    v_slot_id := v_vote ->> 'slotId';
    v_value   := v_vote ->> 'value';

    IF v_value NOT IN ('available', 'maybe', 'unavailable') THEN
      RAISE EXCEPTION 'Invalid vote value: %', v_value;
    END IF;

    -- Find the slot index
    v_slot_idx := NULL;
    FOR i IN 0..jsonb_array_length(v_slots) - 1 LOOP
      IF (v_slots -> i) ->> 'id' = v_slot_id THEN
        v_slot_idx := i;
        EXIT;
      END IF;
    END LOOP;

    IF v_slot_idx IS NULL THEN
      RAISE EXCEPTION 'Slot not found: %', v_slot_id;
    END IF;

    -- Upsert the vote in the slot's votes array
    v_found := false;
    FOR j IN 0..jsonb_array_length(v_slots -> v_slot_idx -> 'votes') - 1 LOOP
      IF (v_slots -> v_slot_idx -> 'votes' -> j) ->> 'playerId' = v_user_id::text THEN
        -- Update existing vote
        v_slots := jsonb_set(
          v_slots,
          ARRAY[v_slot_idx::text, 'votes', j::text],
          jsonb_build_object(
            'playerId', v_user_id::text,
            'playerName', p_player_name,
            'value', v_value,
            'updatedAt', v_now
          )
        );
        v_found := true;
        EXIT;
      END IF;
    END LOOP;

    IF NOT v_found THEN
      -- Append new vote
      v_slots := jsonb_set(
        v_slots,
        ARRAY[v_slot_idx::text, 'votes'],
        (v_slots -> v_slot_idx -> 'votes') || jsonb_build_array(
          jsonb_build_object(
            'playerId', v_user_id::text,
            'playerName', p_player_name,
            'value', v_value,
            'updatedAt', v_now
          )
        )
      );
    END IF;
  END LOOP;

  -- Write back
  UPDATE scheduling_polls
     SET slots = v_slots,
         updated_at = now()
   WHERE id = v_poll_id;
END;
$$;

GRANT EXECUTE ON FUNCTION submit_scheduling_vote(text, text, jsonb) TO authenticated;
