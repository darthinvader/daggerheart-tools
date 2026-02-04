// Extracted hook for linked character refresh logic

import * as React from 'react';
import { useEffect, useRef } from 'react';

import type { CharacterTracker } from '@/components/battle-tracker/types';
import { useRefreshLinkedCharacter } from '@/components/battle-tracker/use-character-realtime';

interface UseLinkedCharacterRefreshOptions {
  characters: CharacterTracker[];
  updateCharacter: (
    id: string,
    updater: (prev: CharacterTracker) => CharacterTracker
  ) => void;
  hasLoadedInitialBattle: boolean;
}

export function useLinkedCharacterRefresh({
  characters,
  updateCharacter,
  hasLoadedInitialBattle,
}: UseLinkedCharacterRefreshOptions) {
  const refreshLinkedCharacter = useRefreshLinkedCharacter();
  const refreshedCharacterIdsRef = useRef<Set<string>>(new Set());

  // Store updateCharacter in ref to avoid dependency on unstable reference
  const updateCharacterRef = useRef(updateCharacter);
  // Store characters in ref to access current value without adding to dependencies
  const charactersRef = React.useRef(characters);

  // Update refs in effect to satisfy react-hooks/refs rule
  useEffect(() => {
    updateCharacterRef.current = updateCharacter;
    charactersRef.current = characters;
  });

  // Create stable character IDs string to detect actual roster changes
  // This prevents effect re-runs when characters array reference changes but content is same
  const linkedCharacterIds = characters
    .filter(c => c.isLinkedCharacter && c.sourceCharacterId)
    .map(c => `${c.id}:${c.sourceCharacterId}`)
    .join(',');

  useEffect(() => {
    if (!hasLoadedInitialBattle) return;

    charactersRef.current.forEach(character => {
      if (!character.isLinkedCharacter || !character.sourceCharacterId) return;

      const sourceId = character.sourceCharacterId;
      if (refreshedCharacterIdsRef.current.has(sourceId)) return;

      refreshedCharacterIdsRef.current.add(sourceId);
      void refreshLinkedCharacter(
        sourceId,
        character.id,
        updateCharacterRef.current
      );
    });
  }, [hasLoadedInitialBattle, refreshLinkedCharacter, linkedCharacterIds]);
}
