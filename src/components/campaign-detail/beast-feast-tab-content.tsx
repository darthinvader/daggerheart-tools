// Beast Feast Campaign Frame - Cooking Mechanics Tab Content
// Provides ingredient inventory, cooking UI, and party cookbook management

import { ChefHat, Plus, Trash2, UtensilsCrossed } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import { PLOVER_CAVE_INGREDIENTS } from '@/lib/data/beast-feast/cooking-data';
import type {
  BeastFeastRecipe,
  FlavorType,
  Ingredient,
} from '@/lib/schemas/beast-feast-cooking';
import { FLAVOR_DIE_MAP } from '@/lib/schemas/beast-feast-cooking';

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
// Sample Data - Initial state for demo purposes
// =====================================================================================

function generateIngredientId(): string {
  return `ing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createSampleIngredients(): Ingredient[] {
  // Take a few sample ingredients from the predefined list
  const samples = PLOVER_CAVE_INGREDIENTS.slice(0, 5);
  return samples.map(ing => ({
    ...ing,
    id: generateIngredientId(),
    createdAt: new Date().toISOString(),
  }));
}

function createSampleRecipes(): BeastFeastRecipe[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'recipe-1',
      name: 'Cave Mushroom Stew',
      description: 'A hearty stew made from cave mushrooms and bitter roots.',
      ingredientTypes: ['Mushroom', 'Root'],
      flavorProfile: [
        { name: 'Bitter', die: 'd8', strength: 2 },
        { name: 'Savory', die: 'd12', strength: 1 },
      ],
      cookingMethod: 'Slow cook over low heat',
      notes: 'Party favorite',
      timesCooked: 3,
      bestMealRating: 12,
      createdBy: '',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'recipe-2',
      name: 'Sweet Honey Glaze',
      description: 'A sweet glaze perfect for roasted meats.',
      ingredientTypes: ['Honey', 'Berries'],
      flavorProfile: [
        { name: 'Sweet', die: 'd4', strength: 2 },
        { name: 'Sour', die: 'd10', strength: 1 },
      ],
      cookingMethod: 'Reduce until thick',
      notes: '',
      timesCooked: 1,
      bestMealRating: 8,
      createdBy: '',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

// =====================================================================================
// Beast Feast Tab Content Component
// =====================================================================================

interface BeastFeastTabContentProps {
  campaignId: string;
}

export function BeastFeastTabContent({
  campaignId: _campaignId,
}: BeastFeastTabContentProps) {
  // State for ingredient inventory
  const [ingredients, setIngredients] = useState<Ingredient[]>(() =>
    createSampleIngredients()
  );

  // State for party cookbook
  const [recipes] = useState<BeastFeastRecipe[]>(() => createSampleRecipes());

  // State for cooking UI
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientToAdd, setIngredientToAdd] = useState<string>('');

  // Toggle ingredient selection for cooking
  const toggleIngredientSelection = useCallback((ingredientId: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  }, []);

  // Add a new ingredient from the predefined list
  const handleAddIngredient = useCallback(() => {
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

    setIngredients(prev => [...prev, newIngredient]);
    setIngredientToAdd('');
  }, [ingredientToAdd]);

  // Remove an ingredient from inventory
  const handleRemoveIngredient = useCallback((ingredientId: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== ingredientId));
    setSelectedIngredients(prev => prev.filter(id => id !== ingredientId));
  }, []);

  // Cook selected ingredients (basic demo - just removes them)
  const handleCookMeal = useCallback(() => {
    if (selectedIngredients.length === 0) return;

    // In a full implementation, this would:
    // 1. Calculate the flavor dice pool
    // 2. Roll the dice
    // 3. Find matching sets
    // 4. Calculate meal rating
    // 5. Apply benefits to characters
    // 6. Potentially record a new recipe

    // For now, just remove the used ingredients
    setIngredients(prev =>
      prev.filter(ing => !selectedIngredients.includes(ing.id))
    );
    setSelectedIngredients([]);

    // TODO: Show cooking result dialog
  }, [selectedIngredients]);

  // Get selected ingredient objects
  const selectedIngredientObjects = ingredients.filter(ing =>
    selectedIngredients.includes(ing.id)
  );

  return (
    <TabsContent value="beast-feast" className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-500" />
            Beast Feast Cooking
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
                disabled={!ingredientToAdd}
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
                Select ingredients from inventory, then cook to create a meal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    disabled={selectedIngredientObjects.length === 0}
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
        </div>
      </div>
    </TabsContent>
  );
}
