// Extracted hook for linked character refresh logic

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

  useEffect(() => {
    if (!hasLoadedInitialBattle) return;

    characters.forEach(character => {
      if (!character.isLinkedCharacter || !character.sourceCharacterId) return;

      const sourceId = character.sourceCharacterId;
      if (refreshedCharacterIdsRef.current.has(sourceId)) return;

      refreshedCharacterIdsRef.current.add(sourceId);
      void refreshLinkedCharacter(sourceId, character.id, updateCharacter);
    });
  }, [
    hasLoadedInitialBattle,
    refreshLinkedCharacter,
    updateCharacter,
    characters,
  ]);
}
