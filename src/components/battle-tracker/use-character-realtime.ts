import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';

import { fetchCharacter } from '@/lib/api/characters';
import { characterQueryKeys } from '@/lib/api/query-client';
import { supabase } from '@/lib/supabase';

import type { CharacterTracker } from './types';
import { characterRecordToTracker } from './utils';

// Debug flag - set to true to see realtime logs in console
const DEBUG_REALTIME = import.meta.env.DEV;

function log(...args: unknown[]) {
  if (DEBUG_REALTIME) {
    console.info('[BattleRealtime]', ...args);
  }
}

/**
 * Subscribe to realtime updates for campaign characters in battle.
 * When a player updates their character (HP, stress, conditions, etc.),
 * this hook will automatically sync those changes to the battle tracker.
 *
 * This hook:
 * 1. Watches for Supabase realtime UPDATE events on the characters table
 * 2. When a linked character is updated, fetches the full record from the API
 * 3. Converts it to a CharacterTracker and updates the battle roster
 * 4. Preserves DM notes (which are battle-specific, not character-specific)
 *
 * @param characters - Current list of CharacterTrackers in the battle
 * @param onCharacterUpdate - Callback to update a specific character in the roster
 */
export function useCharacterRealtimeSync(
  characters: CharacterTracker[],
  onCharacterUpdate: (
    id: string,
    fn: (prev: CharacterTracker) => CharacterTracker
  ) => void
) {
  const queryClient = useQueryClient();

  // Stable reference for the update callback
  const onCharacterUpdateRef = useRef(onCharacterUpdate);

  // Get all source character IDs that need realtime updates with stable identity
  const sourceCharacterIds = useMemo(() => {
    return characters
      .filter(c => c.sourceCharacterId && c.isLinkedCharacter)
      .map(c => ({
        trackerId: c.id,
        sourceId: c.sourceCharacterId!,
      }));
  }, [characters]);

  // Create a stable string key for the subscription identity
  // This prevents recreating the subscription when the array reference changes
  const subscriptionKey = useMemo(() => {
    const ids = sourceCharacterIds.map(c => c.sourceId).sort();
    return ids.join(',');
  }, [sourceCharacterIds]);

  // Keep a stable ref of sourceCharacterIds for use in callback
  const sourceCharacterIdsRef = useRef(sourceCharacterIds);

  // Update refs when values change (must be in effect per React 19)
  useEffect(() => {
    onCharacterUpdateRef.current = onCharacterUpdate;
    sourceCharacterIdsRef.current = sourceCharacterIds;
  });

  // Handler for when a character is updated - fetch fresh data and update tracker
  const handleCharacterUpdate = useCallback(
    async (characterId: string) => {
      // Find the tracker mapping for this character
      const mapping = sourceCharacterIdsRef.current.find(
        m => m.sourceId === characterId
      );

      if (!mapping) {
        log('No mapping found for character:', characterId);
        return;
      }

      log('Fetching updated character:', characterId);

      try {
        // Fetch the full character record from the API
        // This ensures we get properly validated data with all computed fields
        const character = await fetchCharacter(characterId);

        // Convert to a tracker
        const newTracker = characterRecordToTracker(character);

        // Update the character in the roster, preserving DM notes and tracker ID
        onCharacterUpdateRef.current(mapping.trackerId, prev => ({
          ...newTracker,
          id: prev.id, // Keep the tracker ID (battle-specific)
          notes: prev.notes, // Preserve DM notes (battle-specific)
        }));

        log('Updated tracker for character:', characterId);

        // Also invalidate the query cache so other components get fresh data
        void queryClient.invalidateQueries({
          queryKey: characterQueryKeys.detail(characterId),
        });
      } catch (error) {
        console.error(
          '[BattleRealtime] Failed to fetch character:',
          characterId,
          error
        );
      }
    },
    [queryClient]
  );

  // Set up Supabase realtime subscription
  useEffect(() => {
    if (subscriptionKey.length === 0) {
      log('No linked characters to watch');
      return;
    }

    const characterIds = subscriptionKey.split(',');
    log('Setting up realtime subscription for characters:', characterIds);

    // Create a unique channel name based on the characters being watched
    // Using a hash of the IDs to keep the name short but unique
    const channelName = `battle-chars-${hashString(subscriptionKey)}`;
    const channel = supabase.channel(channelName);

    // Listen for postgres changes on the characters table
    // We subscribe to ALL updates on the table and filter in the handler
    // because Supabase's filter syntax for multiple IDs can be problematic
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'characters',
      },
      payload => {
        const updatedId = (payload.new as { id?: string })?.id;
        if (!updatedId) {
          log('Received update without ID');
          return;
        }

        // Check if this is a character we're watching
        if (!characterIds.includes(updatedId)) {
          return; // Not a character we care about
        }

        log('Received realtime update for character:', updatedId);

        // Fetch fresh data and update the tracker
        void handleCharacterUpdate(updatedId);
      }
    );

    // Subscribe to the channel
    channel.subscribe(status => {
      log('Subscription status:', status);
      if (status === 'SUBSCRIBED') {
        log('Successfully subscribed to character updates');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('[BattleRealtime] Failed to subscribe to channel');
        toast.error('Lost real-time connection');
      }
    });

    return () => {
      log('Cleaning up realtime subscription');
      void supabase.removeChannel(channel);
    };
  }, [subscriptionKey, handleCharacterUpdate]);
}

/**
 * Simple hash function to create a short unique string from character IDs
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Hook to manually refresh a linked character's data from the backend.
 * Useful for cases where realtime might not trigger (e.g., initial load, reconnection).
 */
export function useRefreshLinkedCharacter() {
  const queryClient = useQueryClient();

  return useCallback(
    async (
      sourceCharacterId: string,
      trackerId: string,
      onUpdate: (
        id: string,
        fn: (prev: CharacterTracker) => CharacterTracker
      ) => void
    ) => {
      try {
        const character = await fetchCharacter(sourceCharacterId);
        const newTracker = characterRecordToTracker(character);

        onUpdate(trackerId, prev => ({
          ...newTracker,
          id: prev.id,
          notes: prev.notes,
        }));

        // Invalidate cache
        void queryClient.invalidateQueries({
          queryKey: characterQueryKeys.detail(sourceCharacterId),
        });

        return true;
      } catch (error) {
        console.error('Failed to refresh linked character:', error);
        return false;
      }
    },
    [queryClient]
  );
}
