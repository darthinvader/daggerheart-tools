import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type CharacterRecord,
  type CharacterSummary,
  createCharacter,
  createDefaultCharacter,
  deleteCharacter,
  fetchAllCharacters,
  fetchCharacter,
  toCharacterSummary,
  updateCharacter,
} from '@/lib/api/characters';
import { characterQueryKeys } from '@/lib/api/query-client';
import { generateId } from '@/lib/utils';

// Hook: Fetch all characters as summaries
export function useCharactersQuery() {
  return useQuery({
    queryKey: characterQueryKeys.list(),
    queryFn: async (): Promise<CharacterSummary[]> => {
      const characters = await fetchAllCharacters();
      return characters.map(toCharacterSummary);
    },
  });
}

// Hook: Fetch single character by ID
export function useCharacterQuery(id: string) {
  return useQuery({
    queryKey: characterQueryKeys.detail(id),
    queryFn: () => fetchCharacter(id),
    enabled: Boolean(id),
  });
}

// Hook: Create new character mutation
export function useCreateCharacterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name?: string): Promise<CharacterRecord> => {
      const id = generateId();
      const character = createDefaultCharacter(id);
      if (name) {
        character.identity.name = name;
      }
      return createCharacter(character);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: characterQueryKeys.all });
    },
  });
}

// Hook: Update character mutation
export function useUpdateCharacterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CharacterRecord>;
    }): Promise<CharacterRecord> => {
      return updateCharacter(id, updates);
    },
    onSuccess: data => {
      void queryClient.invalidateQueries({ queryKey: characterQueryKeys.all });
      void queryClient.setQueryData(characterQueryKeys.detail(data.id), data);
    },
  });
}

// Hook: Delete character mutation
export function useDeleteCharacterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCharacter,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: characterQueryKeys.all });
    },
  });
}
