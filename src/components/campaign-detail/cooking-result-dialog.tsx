// Beast Feast Cooking Result Dialog
// Displays the results of cooking a meal, including dice rolls, matched sets, and special effects

import { ChefHat, Clock, Sparkles, Star, XCircle } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FlavorType } from '@/lib/schemas/beast-feast-cooking';
import {
  DIE_SIZE_MAP,
  type FlavorDie,
} from '@/lib/schemas/beast-feast-cooking';

// =====================================================================================
// Types
// =====================================================================================

export interface MatchedSet {
  value: number;
  diceCount: number;
  flavorType?: FlavorType;
}

export interface SpecialEffect {
  name: string;
  effect: string;
  ingredientName: string;
  isRisky?: boolean;
}

export interface FlavorDiceEntry {
  die: FlavorDie;
  count: number;
  flavorType: FlavorType;
}

export interface CookingResult {
  mealName: string;
  ingredientNames: string[];
  flavorDicePool: FlavorDiceEntry[];
  rollResults: Array<{ value: number; die: FlavorDie; flavorType: FlavorType }>;
  matchedSets: MatchedSet[];
  mealRating: number;
  quality: 'Poor' | 'Decent' | 'Good' | 'Excellent';
  specialEffects: SpecialEffect[];
  temporaryBenefits?: string[];
  duration?: number; // Hours the meal effects last
}

export interface CookingResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cookingResult: CookingResult | null;
  onSaveRecipe?: (mealName: string) => void;
}

// =====================================================================================
// Flavor Colors (consistent with beast-feast-tab-content)
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

const qualityStyles: Record<CookingResult['quality'], string> = {
  Poor: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/40',
  Decent: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/40',
  Good: 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/40',
  Excellent:
    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
};

const qualityStars: Record<CookingResult['quality'], number> = {
  Poor: 1,
  Decent: 2,
  Good: 3,
  Excellent: 4,
};

// =====================================================================================
// Helper Functions
// =====================================================================================

/**
 * Simulates rolling dice for the flavor pool.
 */
export function rollFlavorDice(
  flavorPool: FlavorDiceEntry[]
): Array<{ value: number; die: FlavorDie; flavorType: FlavorType }> {
  const results: Array<{
    value: number;
    die: FlavorDie;
    flavorType: FlavorType;
  }> = [];

  for (const entry of flavorPool) {
    const dieSize = DIE_SIZE_MAP[entry.die];
    for (let i = 0; i < entry.count; i++) {
      results.push({
        value: Math.floor(Math.random() * dieSize) + 1,
        die: entry.die,
        flavorType: entry.flavorType,
      });
    }
  }

  return results.sort((a, b) => b.value - a.value);
}

/**
 * Finds matched sets from dice roll results.
 * A matched set is 2+ dice showing the same value.
 */
export function findMatchedSets(
  rolls: Array<{ value: number; die: FlavorDie; flavorType: FlavorType }>
): MatchedSet[] {
  const valueCounts = new Map<
    number,
    { count: number; flavorType?: FlavorType }
  >();

  for (const roll of rolls) {
    const existing = valueCounts.get(roll.value);
    if (existing) {
      existing.count++;
    } else {
      valueCounts.set(roll.value, { count: 1, flavorType: roll.flavorType });
    }
  }

  return Array.from(valueCounts.entries())
    .filter(([, data]) => data.count >= 2)
    .map(([value, data]) => ({
      value,
      diceCount: data.count,
      flavorType: data.flavorType,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculates the meal rating from matched sets.
 * Per the rulebook: sum of the matched values (not multiplied by count).
 */
export function calculateMealRating(matchedSets: MatchedSet[]): number {
  return matchedSets.reduce((sum, set) => sum + set.value, 0);
}

/**
 * Determines meal quality from the rating.
 */
export function getMealQuality(rating: number): CookingResult['quality'] {
  if (rating >= 16) return 'Excellent';
  if (rating >= 9) return 'Good';
  if (rating >= 4) return 'Decent';
  return 'Poor';
}

/**
 * Generates a simple meal name from ingredients.
 */
export function generateMealName(ingredientNames: string[]): string {
  if (ingredientNames.length === 0) return 'Mystery Dish';
  if (ingredientNames.length === 1) return `Simple ${ingredientNames[0]}`;
  if (ingredientNames.length === 2)
    return `${ingredientNames[0]} & ${ingredientNames[1]}`;
  return `${ingredientNames[0]} Medley`;
}

// =====================================================================================
// Sub-Components
// =====================================================================================

function MealHeader({
  mealName,
  rating,
  quality,
}: {
  mealName: string;
  rating: number;
  quality: CookingResult['quality'];
}) {
  return (
    <div className="text-center">
      <h3 className="mb-2 text-xl font-bold">{mealName}</h3>
      <div className="flex items-center justify-center gap-3">
        <Badge variant="outline" className={qualityStyles[quality]}>
          {quality}
        </Badge>
        <div className="flex items-center gap-1">
          {Array.from({ length: qualityStars[quality] }).map((_, i) => (
            <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-muted-foreground text-sm">
          Rating: <strong>{rating}</strong>
        </span>
      </div>
    </div>
  );
}

function DiceRollsDisplay({
  rolls,
}: {
  rolls: Array<{ value: number; die: FlavorDie; flavorType: FlavorType }>;
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Dice Rolled</h4>
      <div className="flex flex-wrap gap-2">
        {rolls.map((roll, i) => (
          <div
            key={i}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 ${flavorColors[roll.flavorType]}`}
          >
            <span className="font-mono font-bold">{roll.value}</span>
            <span className="text-xs opacity-70">({roll.die})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchedSetsDisplay({ sets }: { sets: MatchedSet[] }) {
  if (sets.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Matched Sets</h4>
        <div className="text-muted-foreground flex items-center gap-2 rounded-lg border border-dashed p-4 text-center text-sm">
          <XCircle className="size-4" />
          No matching dice values found. Better luck next time!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Matched Sets</h4>
      <div className="space-y-2">
        {sets.map((set, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-lg border p-3 ${
              set.flavorType ? flavorColors[set.flavorType] : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold">
                {set.diceCount}x
              </span>
              <span>dice showing</span>
              <span className="font-mono text-lg font-bold">{set.value}</span>
            </div>
            <Badge variant="secondary">+{set.value} rating</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecialEffectsDisplay({ effects }: { effects: SpecialEffect[] }) {
  if (effects.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="size-4 text-purple-500" />
        Special Effects
      </h4>
      <div className="space-y-2">
        {effects.map((effect, i) => (
          <div
            key={i}
            className={`rounded-lg border p-3 ${
              effect.isRisky
                ? 'border-destructive/50 bg-destructive/10'
                : 'border-purple-500/40 bg-purple-500/10'
            }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium">{effect.name}</span>
              <span className="text-muted-foreground text-xs">
                from {effect.ingredientName}
              </span>
            </div>
            <p className="text-sm">{effect.effect}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MealBenefitsDisplay({
  benefits,
  duration,
}: {
  benefits: string[];
  duration?: number;
}) {
  if (benefits.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="size-4 text-amber-500" />
        Temporary Benefits
        {duration && (
          <Badge
            variant="outline"
            className="ml-auto border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          >
            <Clock className="mr-1 size-3" />
            {duration} {duration === 1 ? 'hour' : 'hours'}
          </Badge>
        )}
      </h4>
      <div className="flex flex-wrap gap-2">
        {benefits.map((benefit, i) => (
          <Badge
            key={i}
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          >
            <Sparkles className="mr-1 size-3" />
            {benefit}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function IngredientsUsedDisplay({ ingredients }: { ingredients: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Ingredients Used</h4>
      <div className="flex flex-wrap gap-1">
        {ingredients.map((name, i) => (
          <Badge key={i} variant="secondary">
            {name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function SaveRecipeForm({
  initialName,
  onSave,
  onCancel,
}: {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const [recipeName, setRecipeName] = useState(initialName);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipe-name">Recipe Name</Label>
        <Input
          id="recipe-name"
          value={recipeName}
          onChange={e => setRecipeName(e.target.value)}
          placeholder="Enter a name for this recipe..."
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(recipeName)}
          disabled={!recipeName.trim()}
        >
          Save Recipe
        </Button>
      </div>
    </div>
  );
}

// =====================================================================================
// Main Component
// =====================================================================================

export function CookingResultDialog({
  isOpen,
  onClose,
  cookingResult,
  onSaveRecipe,
}: CookingResultDialogProps) {
  const [showSaveRecipe, setShowSaveRecipe] = useState(false);

  if (!cookingResult) return null;

  const handleClose = () => {
    setShowSaveRecipe(false);
    onClose();
  };

  const handleSaveRecipe = (name: string) => {
    onSaveRecipe?.(name);
    setShowSaveRecipe(false);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="w-[98vw] max-w-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <ChefHat className="size-5" />
            {cookingResult.quality === 'Poor'
              ? 'Meal Prepared...'
              : 'Meal Prepared Successfully!'}
          </DialogTitle>
          <DialogDescription>
            {cookingResult.quality === 'Excellent'
              ? 'An exceptional dish! The flavors harmonize perfectly.'
              : cookingResult.quality === 'Good'
                ? 'A satisfying meal with great flavor combinations.'
                : cookingResult.quality === 'Decent'
                  ? 'An acceptable meal. Room for improvement.'
                  : 'This meal could use some work. Try different flavor combinations.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 py-4 pr-4">
            {!showSaveRecipe ? (
              <>
                <MealHeader
                  mealName={cookingResult.mealName}
                  rating={cookingResult.mealRating}
                  quality={cookingResult.quality}
                />

                <DiceRollsDisplay rolls={cookingResult.rollResults} />

                <MatchedSetsDisplay sets={cookingResult.matchedSets} />

                <SpecialEffectsDisplay effects={cookingResult.specialEffects} />

                {cookingResult.temporaryBenefits &&
                  cookingResult.temporaryBenefits.length > 0 && (
                    <MealBenefitsDisplay
                      benefits={cookingResult.temporaryBenefits}
                      duration={cookingResult.duration}
                    />
                  )}

                <IngredientsUsedDisplay
                  ingredients={cookingResult.ingredientNames}
                />
              </>
            ) : (
              <SaveRecipeForm
                initialName={cookingResult.mealName}
                onSave={handleSaveRecipe}
                onCancel={() => setShowSaveRecipe(false)}
              />
            )}
          </div>
        </ScrollArea>

        {!showSaveRecipe && (
          <DialogFooter>
            {onSaveRecipe && (
              <Button variant="outline" onClick={() => setShowSaveRecipe(true)}>
                Save as Recipe
              </Button>
            )}
            <Button onClick={handleClose}>Continue</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
