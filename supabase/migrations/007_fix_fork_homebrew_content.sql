-- Ensure forking homebrew content always creates a copy and never removes the source.
CREATE OR REPLACE FUNCTION fork_homebrew_content(source_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
  source_record homebrew_content%ROWTYPE;
BEGIN
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Get source content (must be public or user must have access)
  SELECT * INTO source_record
  FROM homebrew_content
  WHERE id = source_id
    AND deleted_at IS NULL
    AND (
      visibility = 'public'
      OR owner_id = auth.uid()
      OR (
        visibility IN ('campaign_only', 'private')
        AND EXISTS (
          SELECT 1 FROM campaigns
          WHERE campaigns.deleted_at IS NULL
            AND campaigns.id = ANY(homebrew_content.campaign_links)
            AND (
              campaigns.gm_id = auth.uid()
              OR campaigns.players @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
            )
        )
      )
    );

  IF source_record.id IS NULL THEN
    RAISE EXCEPTION 'source_not_found';
  END IF;

  -- Create the fork as a new row
  INSERT INTO homebrew_content (
    owner_id,
    content_type,
    visibility,
    name,
    description,
    content,
    tags,
    forked_from,
    campaign_links
  ) VALUES (
    auth.uid(),
    source_record.content_type,
    'private',
    source_record.name || ' (Copy)',
    source_record.description,
    source_record.content,
    source_record.tags,
    source_id,
    '{}'::uuid[]
  )
  RETURNING id INTO new_id;

  -- Increment fork count on source (do not alter the source row otherwise)
  UPDATE homebrew_content
  SET fork_count = fork_count + 1
  WHERE id = source_id
    AND deleted_at IS NULL;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION fork_homebrew_content(UUID) TO authenticated;
