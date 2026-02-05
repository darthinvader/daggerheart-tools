// Beast Feast Campaign Frame - Cooking Mechanics Tab Content
// Provides ingredient inventory, cooking UI, and party cookbook management

import {
  ChefHat,
  Loader2,
  Package,
  Plus,
  Trash2,
  User,
  UtensilsCrossed,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import { useCampaign } from '@/features/campaigns/use-campaign-query';
import { PLOVER_CAVE_INGREDIENTS } from '@/lib/data/beast-feast/cooking-data';
import type {
  BeastFeastRecipe,
  FlavorType,
  Ingredient,
} from '@/lib/schemas/beast-feast-cooking';
import { FLAVOR_DIE_MAP } from '@/lib/schemas/beast-feast-cooking';
import type { CharacterCookingState } from '@/lib/schemas/campaign';

import {
  calculateMealRating,
  type CookingResult,
  CookingResultDialog,
  findMatchedSets,
  type FlavorDiceEntry,
  generateMealName,
  getMealQuality,
  rollFlavorDice,
} from './cooking-result-dialog';
import { useBeastFeastState } from './use-beast-feast-state';

// =====================================================================================
// Flavor Badge Component
// =====================================================================================

const flavorColors: Record<FlavorType, string> = {
  Sweet: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/40',
  Salty:
    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
  Bitter:
    'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  Sour: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/40',
  Savory: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40',
  Weird:
    'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40',
};

function FlavorBadge({
  flavor,
  strength,
}: {
  flavor: FlavorType;
  strength: number;
}) {
  return (
    <Badge variant="outline" className={flavorColors[flavor]}>
      {flavor} ({FLAVOR_DIE_MAP[flavor]}) ×{strength}
    </Badge>
  );
}

// =====================================================================================
// Ingredient Card Component
// =====================================================================================

interface IngredientCardProps {
  ingredient: Ingredient;
  onSelect?: () => void;
  onRemove?: () => void;
  isSelected?: boolean;
  showRemove?: boolean;
}

function IngredientCard({
  ingredient,
  onSelect,
  onRemove,
  isSelected = false,
  showRemove = false,
}: IngredientCardProps) {
  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'hover:bg-muted/50 cursor-pointer'
      }`}
      onClick={onSelect}
    >
      <div className="mb-1 flex items-start justify-between">
        <div className="font-medium">{ingredient.name}</div>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {ingredient.quality}
          </Badge>
          {showRemove && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={e => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <p className="text-muted-foreground mb-2 text-xs">
        {ingredient.description}
      </p>
      <div className="mb-1 text-xs">
        <span className="text-muted-foreground">Source:</span>{' '}
        {ingredient.sourceType === 'Beast'
          ? ingredient.sourceCreature
          : ingredient.sourceType}
      </div>
      <div className="flex flex-wrap gap-1">
        {ingredient.flavorProfiles.map((fp, i) => (
          <FlavorBadge key={i} flavor={fp.name} strength={fp.strength} />
        ))}
      </div>
    </div>
  );
}

// =====================================================================================
// Recipe Card Component
// =====================================================================================

interface RecipeCardProps {
  recipe: BeastFeastRecipe;
}

function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-1 flex items-start justify-between">
        <div className="font-medium">{recipe.name}</div>
        <Badge variant="outline">{recipe.timesCooked}× cooked</Badge>
      </div>
      {recipe.description && (
        <p className="text-muted-foreground mb-2 text-xs">
          {recipe.description}
        </p>
      )}
      <div className="mb-2 flex flex-wrap gap-1">
        {recipe.flavorProfile.map((fp, i) => (
          <FlavorBadge key={i} flavor={fp.name} strength={fp.strength} />
        ))}
      </div>
      {recipe.bestMealRating > 0 && (
        <div className="text-muted-foreground text-xs">
          Best rating: {recipe.bestMealRating}
        </div>
      )}
    </div>
  );
}

// =====================================================================================
// Character Cooking Stats Card Component
// =====================================================================================

interface CharacterCookingStatsCardProps {
  characterName: string;
  stats: CharacterCookingState | undefined;
  ingredientCount: number;
}

function CharacterCookingStatsCard({
  characterName,
  stats,
  ingredientCount,
}: CharacterCookingStatsCardProps) {
  const maxIngredients = stats?.maxIngredients ?? 6;
  const mealsContributed = stats?.mealsContributed ?? 0;
  const recipesDiscovered = stats?.recipesContributed?.length ?? 0;
  const capacityPercentage = Math.min(
    100,
    (ingredientCount / maxIngredients) * 100
  );

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <User className="text-muted-foreground h-4 w-4" />
        <span className="font-medium">{characterName}</span>
      </div>

      <div className="space-y-2">
        {/* Ingredient Capacity */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              Ingredient Capacity
            </span>
            <span className="text-muted-foreground">
              {ingredientCount} / {maxIngredients}
            </span>
          </div>
          <Progress value={capacityPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-muted/50 flex items-center justify-between rounded px-2 py-1">
            <span className="text-muted-foreground">Meals contributed:</span>
            <span className="font-medium">{mealsContributed}</span>
          </div>
          <div className="bg-muted/50 flex items-center justify-between rounded px-2 py-1">
            <span className="text-muted-foreground">Recipes discovered:</span>
            <span className="font-medium">{recipesDiscovered}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================================
// Sample Data - Initial state for demo purposes
// =====================================================================================

function generateIngredientId(): string {
  return `ing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// =====================================================================================
// Beast Feast Tab Content Component
// =====================================================================================

interface BeastFeastTabContentProps {
  campaignId: string;
}

export function BeastFeastTabContent({
  campaignId,
}: BeastFeastTabContentProps) {
  // Get campaign data for players
  const { data: campaign } = useCampaign(campaignId);
  const players = campaign?.players ?? [];

  // Use persistent state from campaign storage
  const {
    loading,
    saving,
    beastFeast,
    addIngredient,
    removeIngredient,
    addRecipe,
    setIngredients,
    getCharacterCookingStats,
    incrementMealsContributed,
    addRecipeContribution,
  } = useBeastFeastState({ campaignId });

  const ingredients = beastFeast.ingredients;
  const recipes = beastFeast.recipes;

  // State for cooking UI
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientToAdd, setIngredientToAdd] = useState<string>('');
  const [selectedCookId, setSelectedCookId] = useState<string>('');

  // State for cooking result dialog
  const [showCookingResult, setShowCookingResult] = useState(false);
  const [cookingResult, setCookingResult] = useState<CookingResult | null>(
    null
  );

  // Toggle ingredient selection for cooking
  const toggleIngredientSelection = useCallback((ingredientId: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  }, []);

  // Add a new ingredient from the predefined list
  const handleAddIngredient = useCallback(async () => {
    if (!ingredientToAdd) return;

    const template = PLOVER_CAVE_INGREDIENTS.find(
      ing => ing.name === ingredientToAdd
    );
    if (!template) return;

    const newIngredient: Ingredient = {
      ...template,
      id: generateIngredientId(),
      createdAt: new Date().toISOString(),
    };

    try {
      await addIngredient(newIngredient);
      setIngredientToAdd('');
    } catch (error) {
      console.error('Failed to add ingredient:', error);
      toast.error('Failed to add ingredient. Please try again.');
    }
  }, [ingredientToAdd, addIngredient]);

  // Remove an ingredient from inventory
  const handleRemoveIngredient = useCallback(
    async (ingredientId: string) => {
      try {
        await removeIngredient(ingredientId);
        setSelectedIngredients(prev => prev.filter(id => id !== ingredientId));
      } catch (error) {
        console.error('Failed to remove ingredient:', error);
        toast.error('Failed to remove ingredient. Please try again.');
      }
    },
    [removeIngredient]
  );

  // Cook selected ingredients
  const handleCookMeal = useCallback(async () => {
    if (selectedIngredients.length === 0) return;

    // Get the selected ingredient objects
    const selectedObjects = ingredients.filter(ing =>
      selectedIngredients.includes(ing.id)
    );

    // Step 1: Build the flavor dice pool from selected ingredients
    const flavorDicePool: FlavorDiceEntry[] = [];
    const flavorMap = new Map<FlavorType, number>();

    for (const ing of selectedObjects) {
      for (const fp of ing.flavorProfiles) {
        const current = flavorMap.get(fp.name) ?? 0;
        flavorMap.set(fp.name, current + fp.strength);
      }
    }

    for (const [flavorType, count] of flavorMap) {
      flavorDicePool.push({
        die: FLAVOR_DIE_MAP[flavorType],
        count,
        flavorType,
      });
    }

    // Step 2: Roll the dice
    const rollResults = rollFlavorDice(flavorDicePool);

    // Step 3: Find matched sets
    const matchedSets = findMatchedSets(rollResults);

    // Step 4: Calculate meal rating and quality
    const mealRating = calculateMealRating(matchedSets);
    const quality = getMealQuality(mealRating);

    // Step 5: Extract special effects from featured ingredients
    const specialEffects = selectedObjects
      .filter(ing => ing.feature)
      .map(ing => ({
        name: ing.feature!.name,
        effect: ing.feature!.effect,
        ingredientName: ing.name,
        isRisky: ing.feature?.isRisky ?? false,
      }));

    // Step 6: Build the cooking result
    const ingredientNames = selectedObjects.map(ing => ing.name);
    const result: CookingResult = {
      mealName: generateMealName(ingredientNames),
      ingredientNames,
      flavorDicePool,
      rollResults,
      matchedSets,
      mealRating,
      quality,
      specialEffects,
    };

    // Step 7: Show the result dialog
    setCookingResult(result);
    setShowCookingResult(true);

    // Step 8: Remove the used ingredients (persist to storage)
    try {
      const remainingIngredients = ingredients.filter(
        ing => !selectedIngredients.includes(ing.id)
      );
      await setIngredients(remainingIngredients);
      setSelectedIngredients([]);

      // Step 9: Track character cooking contribution
      if (selectedCookId) {
        const selectedPlayer = players.find(
          p => p.characterId === selectedCookId
        );
        await incrementMealsContributed(
          selectedCookId,
          selectedPlayer?.characterName
        );
      }
    } catch (error) {
      console.error('Failed to save cooking state:', error);
      toast.error('Failed to save cooking result. Please try again.');
    }
  }, [
    selectedIngredients,
    ingredients,
    setIngredients,
    selectedCookId,
    players,
    incrementMealsContributed,
  ]);

  // Save a new recipe from cooking result
  const handleSaveRecipe = useCallback(
    async (mealName: string) => {
      if (!cookingResult) return;

      // Find the selected cook's name
      const selectedPlayer = players.find(
        p => p.characterId === selectedCookId
      );
      const createdByName = selectedPlayer?.characterName ?? '';

      const recipeId = `recipe-${Date.now()}`;
      const newRecipe: BeastFeastRecipe = {
        id: recipeId,
        name: mealName,
        description: `A dish made from ${cookingResult.ingredientNames.join(', ')}.`,
        ingredientTypes: cookingResult.ingredientNames,
        flavorProfile: cookingResult.flavorDicePool.map(entry => ({
          name: entry.flavorType,
          die: entry.die,
          strength: entry.count,
        })),
        cookingMethod: '',
        notes: '',
        timesCooked: 1,
        bestMealRating: cookingResult.mealRating,
        createdBy: createdByName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await addRecipe(newRecipe);

        // Track recipe contribution for the selected cook
        if (selectedCookId) {
          await addRecipeContribution(selectedCookId, recipeId, createdByName);
        }
        toast.success('Recipe saved to cookbook!');
      } catch (error) {
        console.error('Failed to save recipe:', error);
        toast.error('Failed to save recipe. Please try again.');
      }
    },
    [cookingResult, addRecipe, selectedCookId, players, addRecipeContribution]
  );

  // Get selected ingredient objects
  const selectedIngredientObjects = ingredients.filter(ing =>
    selectedIngredients.includes(ing.id)
  );

  // Show loading state
  if (loading) {
    return (
      <TabsContent value="beast-feast" className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading Beast Feast data...</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="beast-feast" className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-500" />
            Beast Feast Cooking
            {saving && (
              <Badge variant="outline" className="ml-2 gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage ingredients, cook meals, and record recipes for your Beast
            Feast campaign. During downtime, the party can cook together using
            ingredients harvested from beasts and blooms.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ingredient Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ingredient Inventory</CardTitle>
            <CardDescription>
              Ingredients the party has collected. Click to select for cooking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add ingredient controls */}
            <div className="flex gap-2">
              <Select
                value={ingredientToAdd}
                onValueChange={setIngredientToAdd}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add ingredient..." />
                </SelectTrigger>
                <SelectContent>
                  {PLOVER_CAVE_INGREDIENTS.map(ing => (
                    <SelectItem key={ing.name} value={ing.name}>
                      {ing.name} ({ing.quality})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddIngredient}
                disabled={!ingredientToAdd || saving}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Ingredient list */}
            <ScrollArea className="h-96">
              <div className="space-y-2 pr-4">
                {ingredients.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    No ingredients in inventory. Add some to start cooking!
                  </p>
                ) : (
                  ingredients.map(ingredient => (
                    <IngredientCard
                      key={ingredient.id}
                      ingredient={ingredient}
                      isSelected={selectedIngredients.includes(ingredient.id)}
                      onSelect={() => toggleIngredientSelection(ingredient.id)}
                      onRemove={() => handleRemoveIngredient(ingredient.id)}
                      showRemove
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Cooking Area */}
        <div className="space-y-6">
          {/* Cook Meal Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UtensilsCrossed className="h-4 w-4 text-amber-500" />
                Cook a Meal
              </CardTitle>
              <CardDescription>
                Select a chef and ingredients from inventory, then cook to
                create a meal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chef Selection */}
              {players.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <User className="h-3 w-3" />
                    Chef
                  </div>
                  <Select
                    value={selectedCookId}
                    onValueChange={setSelectedCookId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select who's cooking..." />
                    </SelectTrigger>
                    <SelectContent>
                      {players
                        .filter(p => p.characterId && p.characterName)
                        .map(player => (
                          <SelectItem
                            key={player.characterId}
                            value={player.characterId!}
                          >
                            {player.characterName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedIngredientObjects.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  Select ingredients from the inventory to cook.
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      Selected ({selectedIngredientObjects.length}):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredientObjects.map(ing => (
                        <Badge
                          key={ing.id}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleIngredientSelection(ing.id)}
                        >
                          {ing.name} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Flavor Dice Pool:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedIngredientObjects.flatMap(ing =>
                        ing.flavorProfiles.map((fp, i) => (
                          <FlavorBadge
                            key={`${ing.id}-${i}`}
                            flavor={fp.name}
                            strength={fp.strength}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleCookMeal}
                    disabled={selectedIngredientObjects.length === 0 || saving}
                  >
                    <ChefHat className="mr-2 h-4 w-4" />
                    Cook Meal
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Party Cookbook */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Party Cookbook</CardTitle>
              <CardDescription>
                Recorded recipes. Cooking matching flavor profiles grants bonus
                tokens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2 pr-4">
                  {recipes.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center text-sm">
                      No recipes recorded yet. Cook meals to discover recipes!
                    </p>
                  ) : (
                    recipes.map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Character Cooking Stats */}
          {players.filter(p => p.characterId && p.characterName).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-blue-500" />
                  Chef Stats
                </CardTitle>
                <CardDescription>
                  Track each character's cooking contributions and ingredient
                  capacity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {players
                    .filter(p => p.characterId && p.characterName)
                    .map(player => (
                      <CharacterCookingStatsCard
                        key={player.characterId}
                        characterName={player.characterName!}
                        stats={getCharacterCookingStats(player.characterId!)}
                        ingredientCount={ingredients.length}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Cooking Result Dialog */}
      <CookingResultDialog
        isOpen={showCookingResult}
        onClose={() => setShowCookingResult(false)}
        cookingResult={cookingResult}
        onSaveRecipe={handleSaveRecipe}
      />
    </TabsContent>
  );
}
