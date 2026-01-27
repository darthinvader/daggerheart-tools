import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type CharacterRecord,
  type CharacterSummary,
  createCharacter,
  createDefaultCharacter,
  deleteCharacter,
  emptyRecyclingBin,
  fetchAllCharacters,
  fetchCharacter,
  permanentlyDeleteCharacter,
  restoreCharacter,
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
      // Set the detail cache directly with the fresh response data
      queryClient.setQueryData(characterQueryKeys.detail(data.id), data);
      // Invalidate the list to refetch summaries (can't derive from detail response)
      void queryClient.invalidateQueries({
        queryKey: characterQueryKeys.list(),
      });
    },
  });
}

// Hook: Delete character mutation
export function useDeleteCharacterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCharacter,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: characterQueryKeys.list() });
      const previous = queryClient.getQueryData<CharacterSummary[]>(
        characterQueryKeys.list()
      );

      queryClient.setQueryData<CharacterSummary[]>(
        characterQueryKeys.list(),
        current =>
          (current ?? []).map(character =>
            character.id === id
              ? { ...character, deletedAt: new Date().toISOString() }
              : character
          )
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(characterQueryKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: characterQueryKeys.all });
    },
  });
}

export function useRestoreCharacterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreCharacter,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: characterQueryKeys.list() });
      const previous = queryClient.getQueryData<CharacterSummary[]>(
        characterQueryKeys.list()
      );

      queryClient.setQueryData<CharacterSummary[]>(
        characterQueryKeys.list(),
        current =>
          (current ?? []).map(character =>
            character.id === id ? { ...character, deletedAt: null } : character
          )
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(characterQueryKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: characterQueryKeys.all });
    },
  });
}

export function usePermanentlyDeleteCharacterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentlyDeleteCharacter,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: characterQueryKeys.list() });
      const previous = queryClient.getQueryData<CharacterSummary[]>(
        characterQueryKeys.list()
      );

      queryClient.setQueryData<CharacterSummary[]>(
        characterQueryKeys.list(),
        current => (current ?? []).filter(character => character.id !== id)
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(characterQueryKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: characterQueryKeys.all });
    },
  });
}

export function useEmptyRecyclingBinMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: emptyRecyclingBin,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: characterQueryKeys.list() });
      const previous = queryClient.getQueryData<CharacterSummary[]>(
        characterQueryKeys.list()
      );

      queryClient.setQueryData<CharacterSummary[]>(
        characterQueryKeys.list(),
        current => (current ?? []).filter(character => !character.deletedAt)
      );

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(characterQueryKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: characterQueryKeys.all });
    },
  });
}
