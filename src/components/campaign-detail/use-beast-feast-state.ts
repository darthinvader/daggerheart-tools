// Hook for managing Beast Feast state in campaigns
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  getCampaign,
  updateBeastFeastState,
} from '@/features/campaigns/campaign-storage';
import type {
  BeastFeastRecipe,
  BeastFeastState,
  CharacterCookingState,
  Ingredient,
  Meal,
} from '@/lib/schemas/campaign';

interface UseBeastFeastStateOptions {
  campaignId: string;
}

interface UseBeastFeastStateReturn {
  loading: boolean;
  saving: boolean;
  beastFeast: BeastFeastState;
  addIngredient: (ingredient: Ingredient) => Promise<void>;
  removeIngredient: (ingredientId: string) => Promise<void>;
  addRecipe: (recipe: BeastFeastRecipe) => Promise<void>;
  updateRecipe: (recipe: BeastFeastRecipe) => Promise<void>;
  addMeal: (meal: Meal) => Promise<void>;
  setIngredients: (ingredients: Ingredient[]) => Promise<void>;
  updateNotes: (notes: string) => Promise<void>;
  // Character cooking stats functions
  getCharacterCookingStats: (
    characterId: string
  ) => CharacterCookingState | undefined;
  updateCharacterCookingStats: (stats: CharacterCookingState) => Promise<void>;
  incrementMealsContributed: (
    characterId: string,
    characterName?: string
  ) => Promise<void>;
  addRecipeContribution: (
    characterId: string,
    recipeId: string,
    characterName?: string
  ) => Promise<void>;
}

const DEFAULT_BEAST_FEAST_STATE: BeastFeastState = {
  ingredients: [],
  recipes: [],
  meals: [],
  cookingSessions: [],
  characterCookingStats: [],
  totalMealsPrepared: 0,
  notes: '',
};

/** Ensures a value is an array; returns empty array for non-array values. */
function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/** Normalizes raw stored data into a valid BeastFeastState with safe array defaults. */
function sanitizeBeastFeastState(
  raw: Partial<BeastFeastState>
): BeastFeastState {
  return {
    ...DEFAULT_BEAST_FEAST_STATE,
    ...raw,
    ingredients: ensureArray<Ingredient>(raw.ingredients),
    recipes: ensureArray<BeastFeastRecipe>(raw.recipes),
    meals: ensureArray<Meal>(raw.meals),
    cookingSessions: ensureArray(raw.cookingSessions),
    characterCookingStats: ensureArray<CharacterCookingState>(
      raw.characterCookingStats
    ),
  };
}

/** Creates a default CharacterCookingState for a character that has no existing stats. */
function createDefaultCharacterCookingStats(
  characterId: string,
  overrides: Partial<CharacterCookingState> = {},
  characterName?: string
): CharacterCookingState {
  return {
    characterId,
    maxIngredients: 6,
    currentIngredients: [],
    mealsContributed: 0,
    recipesContributed: [],
    notes: characterName ? `Stats for ${characterName}` : '',
    ...overrides,
  };
}

/** Finds a character's cooking stats from the list, or undefined if not present. */
function findCharacterStats(
  stats: CharacterCookingState[],
  characterId: string
): CharacterCookingState | undefined {
  return stats.find(s => s.characterId === characterId);
}

/** Upserts a CharacterCookingState into the list, replacing if characterId matches. */
function upsertCharacterStats(
  existingStats: CharacterCookingState[],
  newStats: CharacterCookingState
): CharacterCookingState[] {
  const existingIndex = existingStats.findIndex(
    s => s.characterId === newStats.characterId
  );
  if (existingIndex >= 0) {
    return existingStats.map((s, i) => (i === existingIndex ? newStats : s));
  }
  return [...existingStats, newStats];
}

export function useBeastFeastState({
  campaignId,
}: UseBeastFeastStateOptions): UseBeastFeastStateReturn {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [beastFeast, setBeastFeast] = useState<BeastFeastState>(
    DEFAULT_BEAST_FEAST_STATE
  );

  // Load initial state
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const campaign = await getCampaign(campaignId);
        if (!cancelled && campaign) {
          const raw = campaign.beastFeast ?? DEFAULT_BEAST_FEAST_STATE;
          setBeastFeast(sanitizeBeastFeastState(raw));
        }
      } catch (error) {
        console.error('Error loading Beast Feast state:', error);
        toast.error('Failed to load Beast Feast data');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  // Helper to save state
  const saveState = useCallback(
    async (updater: (prev: BeastFeastState) => BeastFeastState) => {
      setSaving(true);
      try {
        let newState!: BeastFeastState;
        setBeastFeast(prev => {
          newState = updater(prev);
          return newState;
        });
        await updateBeastFeastState(campaignId, newState);
      } catch (error) {
        console.error('Error saving Beast Feast state:', error);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [campaignId]
  );

  const addIngredient = useCallback(
    async (ingredient: Ingredient) => {
      await saveState(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient],
      }));
    },
    [saveState]
  );

  const removeIngredient = useCallback(
    async (ingredientId: string) => {
      await saveState(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter(i => i.id !== ingredientId),
      }));
    },
    [saveState]
  );

  const addRecipe = useCallback(
    async (recipe: BeastFeastRecipe) => {
      await saveState(prev => ({
        ...prev,
        recipes: [...prev.recipes, recipe],
      }));
    },
    [saveState]
  );

  const updateRecipe = useCallback(
    async (recipe: BeastFeastRecipe) => {
      await saveState(prev => ({
        ...prev,
        recipes: prev.recipes.map(r => (r.id === recipe.id ? recipe : r)),
      }));
    },
    [saveState]
  );

  const addMeal = useCallback(
    async (meal: Meal) => {
      await saveState(prev => ({
        ...prev,
        meals: [...prev.meals, meal],
        totalMealsPrepared: prev.totalMealsPrepared + 1,
      }));
    },
    [saveState]
  );

  const setIngredients = useCallback(
    async (ingredients: Ingredient[]) => {
      await saveState(prev => ({
        ...prev,
        ingredients,
      }));
    },
    [saveState]
  );

  const updateNotes = useCallback(
    async (notes: string) => {
      await saveState(prev => ({
        ...prev,
        notes,
      }));
    },
    [saveState]
  );

  // Character cooking stats functions
  const getCharacterCookingStats = useCallback(
    (characterId: string): CharacterCookingState | undefined => {
      return beastFeast.characterCookingStats?.find(
        stats => stats.characterId === characterId
      );
    },
    [beastFeast.characterCookingStats]
  );

  const updateCharacterCookingStats = useCallback(
    async (stats: CharacterCookingState) => {
      await saveState(prev => ({
        ...prev,
        characterCookingStats: upsertCharacterStats(
          prev.characterCookingStats ?? [],
          stats
        ),
      }));
    },
    [saveState]
  );

  const incrementMealsContributed = useCallback(
    async (characterId: string, characterName?: string) => {
      await saveState(prev => {
        const existingStats = prev.characterCookingStats ?? [];
        const existing = findCharacterStats(existingStats, characterId);
        const updated = existing
          ? { ...existing, mealsContributed: existing.mealsContributed + 1 }
          : createDefaultCharacterCookingStats(
              characterId,
              { mealsContributed: 1 },
              characterName
            );
        return {
          ...prev,
          characterCookingStats: upsertCharacterStats(existingStats, updated),
        };
      });
    },
    [saveState]
  );

  const addRecipeContribution = useCallback(
    async (characterId: string, recipeId: string, characterName?: string) => {
      await saveState(prev => {
        const existingStats = prev.characterCookingStats ?? [];
        const existing = findCharacterStats(existingStats, characterId);

        if (existing?.recipesContributed.includes(recipeId)) {
          return prev; // Already contributed, no change
        }

        const updated = existing
          ? {
              ...existing,
              recipesContributed: [...existing.recipesContributed, recipeId],
            }
          : createDefaultCharacterCookingStats(
              characterId,
              { recipesContributed: [recipeId] },
              characterName
            );

        return {
          ...prev,
          characterCookingStats: upsertCharacterStats(existingStats, updated),
        };
      });
    },
    [saveState]
  );

  return {
    loading,
    saving,
    beastFeast,
    addIngredient,
    removeIngredient,
    addRecipe,
    updateRecipe,
    addMeal,
    setIngredients,
    updateNotes,
    // Character cooking stats
    getCharacterCookingStats,
    updateCharacterCookingStats,
    incrementMealsContributed,
    addRecipeContribution,
  };
}
