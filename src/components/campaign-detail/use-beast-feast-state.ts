// Hook for managing Beast Feast state in campaigns
import { useCallback, useEffect, useState } from 'react';

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
          setBeastFeast(campaign.beastFeast ?? DEFAULT_BEAST_FEAST_STATE);
        }
      } catch (error) {
        console.error('Error loading Beast Feast state:', error);
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
    async (newState: BeastFeastState) => {
      setSaving(true);
      try {
        await updateBeastFeastState(campaignId, newState);
        setBeastFeast(newState);
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
      const newState: BeastFeastState = {
        ...beastFeast,
        ingredients: [...beastFeast.ingredients, ingredient],
      };
      await saveState(newState);
    },
    [beastFeast, saveState]
  );

  const removeIngredient = useCallback(
    async (ingredientId: string) => {
      const newState: BeastFeastState = {
        ...beastFeast,
        ingredients: beastFeast.ingredients.filter(i => i.id !== ingredientId),
      };
      await saveState(newState);
    },
    [beastFeast, saveState]
  );

  const addRecipe = useCallback(
    async (recipe: BeastFeastRecipe) => {
      const newState: BeastFeastState = {
        ...beastFeast,
        recipes: [...beastFeast.recipes, recipe],
      };
      await saveState(newState);
    },
    [beastFeast, saveState]
  );

  const updateRecipe = useCallback(
    async (recipe: BeastFeastRecipe) => {
      const newState: BeastFeastState = {
        ...beastFeast,
        recipes: beastFeast.recipes.map(r => (r.id === recipe.id ? recipe : r)),
      };
      await saveState(newState);
    },
    [beastFeast, saveState]
  );

  const addMeal = useCallback(
    async (meal: Meal) => {
      const newState: BeastFeastState = {
        ...beastFeast,
        meals: [...beastFeast.meals, meal],
        totalMealsPrepared: beastFeast.totalMealsPrepared + 1,
      };
      await saveState(newState);
    },
    [beastFeast, saveState]
  );

  const setIngredients = useCallback(
    async (ingredients: Ingredient[]) => {
      const newState: BeastFeastState = {
        ...beastFeast,
        ingredients,
      };
      await saveState(newState);
    },
    [beastFeast, saveState]
  );

  const updateNotes = useCallback(
    async (notes: string) => {
      const newState: BeastFeastState = {
        ...beastFeast,
        notes,
      };
      await saveState(newState);
    },
    [beastFeast, saveState]
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
      const existingStats = beastFeast.characterCookingStats ?? [];
      const existingIndex = existingStats.findIndex(
        s => s.characterId === stats.characterId
      );

      let newCharacterStats: CharacterCookingState[];
      if (existingIndex >= 0) {
        newCharacterStats = existingStats.map((s, i) =>
          i === existingIndex ? stats : s
        );
      } else {
        newCharacterStats = [...existingStats, stats];
      }

      const newState: BeastFeastState = {
        ...beastFeast,
        characterCookingStats: newCharacterStats,
      };
      await saveState(newState);
    },
    [beastFeast, saveState]
  );

  const incrementMealsContributed = useCallback(
    async (characterId: string, characterName?: string) => {
      const existingStats = beastFeast.characterCookingStats ?? [];
      const existing = existingStats.find(s => s.characterId === characterId);

      if (existing) {
        await updateCharacterCookingStats({
          ...existing,
          mealsContributed: existing.mealsContributed + 1,
        });
      } else {
        // Create new stats for this character
        const newStats: CharacterCookingState = {
          characterId,
          maxIngredients: 6, // Default based on typical trait value
          currentIngredients: [],
          mealsContributed: 1,
          recipesContributed: [],
          notes: characterName ? `Stats for ${characterName}` : '',
        };
        await updateCharacterCookingStats(newStats);
      }
    },
    [beastFeast.characterCookingStats, updateCharacterCookingStats]
  );

  const addRecipeContribution = useCallback(
    async (characterId: string, recipeId: string, characterName?: string) => {
      const existingStats = beastFeast.characterCookingStats ?? [];
      const existing = existingStats.find(s => s.characterId === characterId);

      if (existing) {
        // Only add if not already contributed
        if (!existing.recipesContributed.includes(recipeId)) {
          await updateCharacterCookingStats({
            ...existing,
            recipesContributed: [...existing.recipesContributed, recipeId],
          });
        }
      } else {
        // Create new stats for this character
        const newStats: CharacterCookingState = {
          characterId,
          maxIngredients: 6,
          currentIngredients: [],
          mealsContributed: 0,
          recipesContributed: [recipeId],
          notes: characterName ? `Stats for ${characterName}` : '',
        };
        await updateCharacterCookingStats(newStats);
      }
    },
    [beastFeast.characterCookingStats, updateCharacterCookingStats]
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
