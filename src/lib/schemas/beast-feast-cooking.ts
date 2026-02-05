import { z } from 'zod';

// =====================================================================================
// Beast Feast Campaign - Cooking Mechanics
// Based on Daggerheart Rulebook Chapter 5: Beast Feast Campaign Frame
// =====================================================================================

// =====================================================================================
// Flavor Profiles - The six flavor types with associated dice
// =====================================================================================

/**
 * The six flavor types used in Beast Feast cooking.
 * Each flavor has an associated die size that determines its contribution to meals.
 */
export const FlavorTypeEnum = z.enum([
  'Sweet', // d4
  'Salty', // d6
  'Bitter', // d8
  'Sour', // d10
  'Savory', // d12
  'Weird', // d20
]);

/**
 * Die sizes associated with each flavor type.
 * Smaller dice = more common flavors, larger dice = rarer/more powerful flavors.
 */
export const FlavorDieEnum = z.enum(['d4', 'd6', 'd8', 'd10', 'd12', 'd20']);

/**
 * Maps flavor types to their associated die sizes.
 */
export const FLAVOR_DIE_MAP: Record<
  z.infer<typeof FlavorTypeEnum>,
  z.infer<typeof FlavorDieEnum>
> = {
  Sweet: 'd4',
  Salty: 'd6',
  Bitter: 'd8',
  Sour: 'd10',
  Savory: 'd12',
  Weird: 'd20',
};

/**
 * Numeric die sizes for rolling calculations.
 */
export const DIE_SIZE_MAP: Record<z.infer<typeof FlavorDieEnum>, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

/**
 * A flavor profile represents a specific flavor type and its strength (1-3).
 * Strength determines how many dice of that flavor type are rolled.
 */
export const FlavorProfileSchema = z.object({
  name: FlavorTypeEnum,
  die: FlavorDieEnum,
  strength: z.number().min(1).max(3).default(1),
});

// =====================================================================================
// Ingredients - Items harvested from beasts and blooms
// =====================================================================================

/**
 * The source type for an ingredient - either a slain beast or gathered bloom.
 */
export const IngredientSourceTypeEnum = z.enum(['Beast', 'Bloom']);

/**
 * Ingredient quality tiers affect flavor strength.
 */
export const IngredientQualityEnum = z.enum([
  'Common',
  'Uncommon',
  'Rare',
  'Legendary',
]);

/**
 * Beast Feast Ingredient - A component used in cooking.
 * Each ingredient has 1-3 flavor profiles that contribute to the meal.
 */
export const IngredientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Ingredient name is required'),
  description: z.string().default(''),
  sourceType: IngredientSourceTypeEnum,
  sourceCreature: z.string().default(''), // Name of the beast or environment
  flavorProfiles: z
    .array(FlavorProfileSchema)
    .min(1, 'At least one flavor profile is required')
    .max(3, 'Maximum of 3 flavor profiles per ingredient'),
  quantity: z.number().min(1).default(1),
  quality: IngredientQualityEnum.default('Common'),
  // Optional special feature for rare ingredients
  feature: z
    .object({
      name: z.string(),
      description: z.string(),
    })
    .optional(),
  notes: z.string().default(''),
  createdAt: z.string().datetime().optional(),
});

/**
 * Ingredient with feature - For Leader/Solo adversaries.
 * Examples from the rulebook:
 * - Diregazelle Skull Marrow: Built for Speed (+1 Agility until next short rest)
 * - Holy Cow's Milk: Last Drop (roll last die, add to Meal Rating)
 * - Ghost Scorpion Venom: Spicy (can't clear Stress if match on 8+)
 * - Deathflower: Risky (big reward or death move)
 */
export const SpecialIngredientSchema = IngredientSchema.extend({
  feature: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    effect: z.string().default(''), // Mechanical effect description
    isRisky: z.boolean().default(false), // Does it have negative consequences?
  }),
});

// =====================================================================================
// Harvesting Rules - Based on beast HP
// =====================================================================================

/**
 * HP thresholds for ingredient harvesting.
 * Per the rulebook:
 * - 4 or lower: 1 ingredient
 * - 5-7: 2 ingredients
 * - 8-10: 3 ingredients
 * - 12 or higher: 4 ingredients
 */
export const HP_TO_INGREDIENTS_MAP: Array<{
  minHP: number;
  maxHP: number | null;
  ingredientCount: number;
}> = [
  { minHP: 1, maxHP: 4, ingredientCount: 1 },
  { minHP: 5, maxHP: 7, ingredientCount: 2 },
  { minHP: 8, maxHP: 10, ingredientCount: 3 },
  { minHP: 11, maxHP: 11, ingredientCount: 3 }, // Edge case between 10 and 12
  { minHP: 12, maxHP: null, ingredientCount: 4 },
];

/**
 * Calculate number of ingredients from beast HP.
 */
export function getIngredientCountFromHP(maxHP: number): number {
  for (const tier of HP_TO_INGREDIENTS_MAP) {
    if (tier.maxHP === null && maxHP >= tier.minHP) {
      return tier.ingredientCount;
    }
    if (tier.maxHP !== null && maxHP >= tier.minHP && maxHP <= tier.maxHP) {
      return tier.ingredientCount;
    }
  }
  return 1; // Default fallback
}

/**
 * Difficulty-to-flavor mapping for adversaries.
 * Less difficult adversaries use smaller dice, more powerful use larger.
 */
export const DIFFICULTY_FLAVOR_GUIDANCE = {
  easy: ['Sweet', 'Salty', 'Bitter'] as const,
  moderate: ['Salty', 'Bitter', 'Sour'] as const,
  hard: ['Bitter', 'Sour', 'Savory'] as const,
  legendary: ['Sour', 'Savory', 'Weird'] as const,
};

// =====================================================================================
// Bloom Gathering - Hope Die roll table
// =====================================================================================

/**
 * Bloom gathering roll table (Hope Die roll).
 * 1-2: Sweet (1), 3-4: Salty (1), 5-6: Bitter (1),
 * 7-8: Sour (1), 9-10: Savory (1), 11-12: Weird (1)
 */
export const BLOOM_ROLL_TABLE: Array<{
  minRoll: number;
  maxRoll: number;
  flavor: z.infer<typeof FlavorTypeEnum>;
  strength: number;
}> = [
  { minRoll: 1, maxRoll: 2, flavor: 'Sweet', strength: 1 },
  { minRoll: 3, maxRoll: 4, flavor: 'Salty', strength: 1 },
  { minRoll: 5, maxRoll: 6, flavor: 'Bitter', strength: 1 },
  { minRoll: 7, maxRoll: 8, flavor: 'Sour', strength: 1 },
  { minRoll: 9, maxRoll: 10, flavor: 'Savory', strength: 1 },
  { minRoll: 11, maxRoll: 12, flavor: 'Weird', strength: 1 },
];

/**
 * Determine bloom flavor from Hope Die roll.
 */
export function getBloomFlavorFromRoll(
  roll: number
): { flavor: z.infer<typeof FlavorTypeEnum>; strength: number } | null {
  for (const entry of BLOOM_ROLL_TABLE) {
    if (roll >= entry.minRoll && roll <= entry.maxRoll) {
      return { flavor: entry.flavor, strength: entry.strength };
    }
  }
  return null;
}

// =====================================================================================
// Meals - Created from ingredients during downtime
// =====================================================================================

/**
 * Meal quality levels based on cooking success.
 */
export const MealQualityEnum = z.enum([
  'Poor', // Few or no matches
  'Decent', // Some matches
  'Good', // Several matches
  'Excellent', // Many high-value matches
]);

/**
 * A meal created from ingredients during downtime.
 */
export const MealSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Meal name is required'),
  description: z.string().default(''),
  ingredients: z.array(z.string()).min(1), // Ingredient IDs used
  ingredientNames: z.array(z.string()).default([]), // Denormalized for display
  // The flavor dice pool for this meal
  flavorDice: z.array(
    z.object({
      die: FlavorDieEnum,
      count: z.number().min(1),
      source: z.string().default(''), // Which ingredient contributed this
    })
  ),
  // Roll results from cooking
  rollResults: z.array(z.number()).default([]),
  matchedSets: z
    .array(
      z.object({
        value: z.number(),
        diceCount: z.number().min(2),
        totalValue: z.number(), // value * diceCount for each set, or just value
      })
    )
    .default([]),
  mealRating: z.number().min(0).default(0),
  quality: MealQualityEnum.default('Decent'),
  temporaryBenefits: z.array(z.string()).default([]),
  // Special effects from featured ingredients
  specialEffects: z
    .array(
      z.object({
        name: z.string(),
        effect: z.string(),
      })
    )
    .default([]),
  notes: z.string().default(''),
  createdAt: z.string().datetime(),
  sessionNumber: z.number().optional(),
});

// =====================================================================================
// Recipe - A recorded combination in the party's Cookbook
// =====================================================================================

/**
 * A recipe recorded in the party's cookbook.
 * When making a dish with the same flavor profile as a recorded recipe,
 * add tokens equal to current tier that can be discarded instead of dice.
 */
export const BeastFeastRecipeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Recipe name is required'),
  description: z.string().default(''),
  ingredientTypes: z.array(z.string()).default([]), // Generic ingredient types used
  flavorProfile: z.array(FlavorProfileSchema).default([]), // The profile to match
  cookingMethod: z.string().default(''), // How it's prepared
  notes: z.string().default(''),
  timesCooked: z.number().min(1).default(1),
  bestMealRating: z.number().min(0).default(0),
  createdBy: z.string().default(''), // Character name who invented it
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Cookbook - Party's shared recipe collection
// =====================================================================================

/**
 * The party's shared cookbook.
 * Per the rulebook: "The more the characters practice making meals with the
 * same flavor profile, the easier that combination becomes to prepare!"
 */
export const CookbookSchema = z.object({
  id: z.string(),
  name: z.string().default("Party's Cookbook"),
  recipes: z.array(BeastFeastRecipeSchema).default([]),
  totalMealsPrepared: z.number().min(0).default(0),
  favoriteRecipeId: z.string().optional(),
  notes: z.string().default(''),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Character Cooking State - Tracks ingredients and cooking capacity
// =====================================================================================

/**
 * Character's cooking-related state for Beast Feast campaigns.
 * A PC can hold ingredients equal to their highest character trait value.
 */
export const CharacterCookingStateSchema = z.object({
  characterId: z.string(),
  maxIngredients: z.number().min(1).default(6), // Based on highest trait
  currentIngredients: z.array(IngredientSchema).default([]),
  mealsContributed: z.number().min(0).default(0),
  recipesContributed: z.array(z.string()).default([]), // Recipe IDs
  notes: z.string().default(''),
});

// =====================================================================================
// Cooking Session - A downtime cooking event
// =====================================================================================

/**
 * A cooking session during downtime where the party makes a meal together.
 * This replaces the standard downtime moves for clearing Stress, HP, or gaining Hope.
 */
export const CookingSessionSchema = z.object({
  id: z.string(),
  sessionNumber: z.number().optional(),
  participantIds: z.array(z.string()).default([]), // Character IDs
  ingredientsUsed: z.array(z.string()).default([]), // Ingredient IDs consumed
  meal: MealSchema.optional(),
  // Tier-based tokens for recipe matching
  tierTokensAdded: z.number().default(0),
  tokensUsed: z.number().default(0),
  // Benefits distributed
  benefitsDistributed: z
    .array(
      z.object({
        characterId: z.string(),
        characterName: z.string().optional(),
        hpCleared: z.number().default(0),
        stressCleared: z.number().default(0),
        hopeGained: z.number().default(0),
      })
    )
    .default([]),
  notes: z.string().default(''),
  createdAt: z.string().datetime(),
});

// =====================================================================================
// Ingredient Generator Tables - For random ingredient creation
// =====================================================================================

/**
 * Beast ingredient types (d20 roll table from rulebook).
 */
export const BEAST_INGREDIENT_TYPES = [
  'Feet',
  'Powder',
  'Limb',
  'Belly',
  'Fat',
  'Eggs',
  'Marrow',
  'Tongue',
  'Brain',
  'Ribs',
  'Organ',
  'Flesh',
  'Stones',
  'Eyes',
  'Jelly',
  'Horn',
  'Meat',
  'Scales',
  'Wings',
  'Secretion',
] as const;

/**
 * Bloom ingredient types (d20 roll table from rulebook).
 */
export const BLOOM_INGREDIENT_TYPES = [
  'Flower',
  'Roots',
  'Stems',
  'Leaves',
  'Bulbs',
  'Nuts',
  'Seeds',
  'Bark',
  'Berries',
  'Fruit',
  'Sap',
  'Pollen',
  'Fungi',
  'Nectar',
  'Pods',
  'Herbs',
  'Algae',
  'Moss',
  'Grain',
  'Rind',
] as const;

/**
 * Interesting properties for any ingredient (d20 roll table).
 */
export const INGREDIENT_PROPERTIES = [
  "It's particularly tender.",
  "It's still wriggling.",
  "It looks like something it isn't.",
  'It has a pungent smell.',
  "It's brightly colored.",
  "It's completely translucent.",
  "It's an odd size or shape.",
  'It has unique markings.',
  'It recoils from the light.',
  'It withers in the dark.',
  'It smells unbelievably good.',
  'It has an unexpected texture.',
  "It's encased in something.",
  "It's filled with something.",
  "It's emitting a colorful gas.",
  'It comes apart in layers.',
  'It must be prepared in a strange way.',
  "It's leathery or cartilaginous.",
  "It's brittle.",
  "It's deadly when consumed raw.",
] as const;

// =====================================================================================
// Example Ingredients from the Rulebook
// =====================================================================================

/**
 * Example ingredients with flavor profiles from the rulebook.
 */
export const EXAMPLE_INGREDIENTS: Array<{
  name: string;
  flavorProfiles: Array<{
    name: z.infer<typeof FlavorTypeEnum>;
    strength: number;
  }>;
  description: string;
}> = [
  {
    name: 'Mushroom caps',
    flavorProfiles: [
      { name: 'Bitter', strength: 1 },
      { name: 'Savory', strength: 2 },
    ],
    description: 'Earthy cave mushrooms with a rich umami flavor.',
  },
  {
    name: 'Wyvern tongue',
    flavorProfiles: [
      { name: 'Sour', strength: 1 },
      { name: 'Savory', strength: 1 },
      { name: 'Weird', strength: 1 },
    ],
    description: 'A rare delicacy with an acquired taste.',
  },
  {
    name: 'Ooze marrow',
    flavorProfiles: [
      { name: 'Sweet', strength: 1 },
      { name: 'Bitter', strength: 2 },
    ],
    description: 'Gelatinous substance extracted from ooze creatures.',
  },
  {
    name: 'Direbear meat',
    flavorProfiles: [{ name: 'Savory', strength: 3 }],
    description: 'Rich, hearty meat from the fearsome direbear.',
  },
  {
    name: 'Acid dragon saliva',
    flavorProfiles: [{ name: 'Sour', strength: 2 }],
    description: 'Potent acidic secretion, requires careful handling.',
  },
  {
    name: 'Cave boar milk',
    flavorProfiles: [
      { name: 'Salty', strength: 1 },
      { name: 'Savory', strength: 1 },
    ],
    description: 'Creamy milk from the subterranean cave boar.',
  },
  {
    name: 'Rileroot',
    flavorProfiles: [{ name: 'Bitter', strength: 1 }],
    description: 'A bitter root that adds depth to dishes.',
  },
  {
    name: 'Ogre kidney stone',
    flavorProfiles: [
      { name: 'Sweet', strength: 1 },
      { name: 'Weird', strength: 1 },
    ],
    description: 'An unusual ingredient with surprising sweetness.',
  },
];

/**
 * Example special ingredients with features.
 */
export const EXAMPLE_SPECIAL_INGREDIENTS: Array<{
  name: string;
  flavorProfiles: Array<{
    name: z.infer<typeof FlavorTypeEnum>;
    strength: number;
  }>;
  feature: { name: string; description: string };
}> = [
  {
    name: 'Diregazelle Skull Marrow',
    flavorProfiles: [
      { name: 'Sweet', strength: 1 },
      { name: 'Salty', strength: 1 },
      { name: 'Sour', strength: 1 },
    ],
    feature: {
      name: 'Built for Speed',
      description:
        'You gain a +1 bonus to your Agility until your next short rest.',
    },
  },
  {
    name: "Holy Cow's Milk",
    flavorProfiles: [{ name: 'Weird', strength: 1 }],
    feature: {
      name: 'Last Drop',
      description:
        'When you have only one die remaining while cooking, roll it and add the result to your Meal Rating.',
    },
  },
  {
    name: 'Ghost Scorpion Venom',
    flavorProfiles: [
      { name: 'Sour', strength: 1 },
      { name: 'Savory', strength: 1 },
    ],
    feature: {
      name: 'Spicy',
      description:
        "If your flavor dice match on results of 8 or higher, you can't clear Stress using this dish.",
    },
  },
  {
    name: 'Deathflower',
    flavorProfiles: [{ name: 'Bitter', strength: 2 }],
    feature: {
      name: 'Risky',
      description:
        'If you roll no matches on your flavor dice, you clear all Hit Points and Stress and gain 3 Hope. If you roll any matches on your flavor dice, your Meal Rating is 0 and you must make a death move.',
    },
  },
];

// =====================================================================================
// Beast Feast Starting Equipment - Weapons and Armor
// =====================================================================================

/**
 * Beast Feast primary weapon options (from rulebook).
 */
export const BEAST_FEAST_PRIMARY_WEAPONS = [
  {
    name: 'Cleaver',
    trait: 'Agility',
    range: 'Melee',
    damage: 'd8 phy',
    burden: 'One-Handed',
    feature: 'Reliable: +1 to attack rolls',
  },
  {
    name: 'Sharpened Rake',
    trait: 'Agility',
    range: 'Melee',
    damage: 'd8+3 phy',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: "Butcher's Axe",
    trait: 'Strength',
    range: 'Melee',
    damage: 'd12+3 phy',
    burden: 'Two-Handed',
    feature: 'Heavy: -1 to Evasion',
  },
  {
    name: 'Iron Skillet',
    trait: 'Strength',
    range: 'Melee',
    damage: 'd8+1 phy',
    burden: 'One-Handed',
    feature: null,
  },
  {
    name: 'Pitchfork',
    trait: 'Strength',
    range: 'Melee',
    damage: 'd10+3 phy',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: 'Sledgehammer',
    trait: 'Strength',
    range: 'Melee',
    damage: 'd10+3 phy',
    burden: 'Two-Handed',
    feature:
      'Massive: -1 to Agility; on a successful attack, roll an additional damage die and discard the lowest result.',
  },
  {
    name: 'Cooking Knife',
    trait: 'Finesse',
    range: 'Melee',
    damage: 'd8+1 phy',
    burden: 'One-Handed',
    feature: null,
  },
  {
    name: 'Walking Staff',
    trait: 'Instinct',
    range: 'Melee',
    damage: 'd10+3 phy',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: 'Rolling Pin',
    trait: 'Presence',
    range: 'Melee',
    damage: 'd8+1 phy',
    burden: 'One-Handed',
    feature: null,
  },
  {
    name: 'Sickle',
    trait: 'Presence',
    range: 'Melee',
    damage: 'd8 phy',
    burden: 'One-Handed',
    feature:
      'Quick: When you make an attack, you can mark a Stress to target another creature within range.',
  },
  {
    name: 'Forge Poker',
    trait: 'Strength',
    range: 'Very Close',
    damage: 'd8+2 phy',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: 'Crop Scythe',
    trait: 'Finesse',
    range: 'Very Close',
    damage: 'd8+2 phy',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: 'Fishing Rod',
    trait: 'Agility',
    range: 'Far',
    damage: 'd6+3 phy',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: 'Slingshot',
    trait: 'Finesse',
    range: 'Far',
    damage: 'd6+3 phy',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: 'Firework Launcher',
    trait: 'Agility',
    range: 'Very Far',
    damage: 'd6+3 phy',
    burden: 'Two-Handed',
    feature: 'Cumbersome: -1 to Finesse',
  },
] as const;

/**
 * Beast Feast magic weapon options (from rulebook).
 */
export const BEAST_FEAST_MAGIC_WEAPONS = [
  {
    name: 'Enchanted Hammer',
    trait: 'Strength',
    range: 'Melee',
    damage: 'd10+1 mag',
    burden: 'One-Handed',
    feature: null,
  },
  {
    name: 'Enchanted Mop',
    trait: 'Strength',
    range: 'Melee',
    damage: 'd10+3 mag',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: 'Enchanted Scissors',
    trait: 'Finesse',
    range: 'Very Close',
    damage: 'd10 mag',
    burden: 'One-Handed',
    feature: null,
  },
  {
    name: 'Enchanted Broomstick',
    trait: 'Instinct',
    range: 'Very Close',
    damage: 'd10+2 mag',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: 'Exploding Potions',
    trait: 'Finesse',
    range: 'Close',
    damage: 'd8 mag',
    burden: 'One-Handed',
    feature: null,
  },
  {
    name: 'Enchanted Forge Lighter',
    trait: 'Instinct',
    range: 'Close',
    damage: 'd8 mag',
    burden: 'One-Handed',
    feature: null,
  },
  {
    name: 'Enchanted Boomerang',
    trait: 'Instinct',
    range: 'Far',
    damage: 'd6+3 mag',
    burden: 'Two-Handed',
    feature: null,
  },
  {
    name: 'Enchanted Kite',
    trait: 'Presence',
    range: 'Far',
    damage: 'd6 mag',
    burden: 'Two-Handed',
    feature:
      'Versatile: This weapon can also be used with these statistics—Presence, Melee, d10.',
  },
  {
    name: 'Whisk Wand',
    trait: 'Knowledge',
    range: 'Far',
    damage: 'd6+1 mag',
    burden: 'One-Handed',
    feature: null,
  },
  {
    name: 'Sparkling Staff',
    trait: 'Knowledge',
    range: 'Very Far',
    damage: 'd6 mag',
    burden: 'Two-Handed',
    feature:
      'Powerful: On a successful attack, roll an additional damage die and discard the lowest result.',
  },
] as const;

/**
 * Beast Feast armor options (from rulebook).
 */
export const BEAST_FEAST_ARMOR = [
  {
    name: 'Quilted Clothing',
    baseThresholds: '5 / 11',
    baseScore: 3,
    feature: 'Flexible: +1 to Evasion',
  },
  {
    name: 'Leather Apron',
    baseThresholds: '6 / 13',
    baseScore: 3,
    feature: null,
  },
  {
    name: 'Tree Bark Armor',
    baseThresholds: '7 / 15',
    baseScore: 4,
    feature: 'Heavy: -1 to Evasion',
  },
  {
    name: 'Baking Tray Breastplate',
    baseThresholds: '8 / 17',
    baseScore: 4,
    feature: 'Very Heavy: -2 to Evasion; -1 to Agility',
  },
] as const;

// =====================================================================================
// Berry's Restaurant - The cave restaurant chain
// =====================================================================================

/**
 * Berry's Restaurant - Chain of cave restaurants.
 * When near an open Berry's during downtime, PCs can spend gold for food.
 */
export const BerrysRestaurantSchema = z.object({
  id: z.string(),
  locationName: z.string().default("Berry's"),
  caveLayer: z
    .enum(['Shallows', 'Twilight', 'Abyss', 'Hadral'])
    .default('Shallows'),
  isOpen: z.boolean().default(true),
  specialOfTheDay: z.string().optional(),
  rumors: z.array(z.string()).default([]),
  notes: z.string().default(''),
});

// =====================================================================================
// Type Exports
// =====================================================================================

export type FlavorType = z.infer<typeof FlavorTypeEnum>;
export type FlavorDie = z.infer<typeof FlavorDieEnum>;
export type FlavorProfile = z.infer<typeof FlavorProfileSchema>;
export type IngredientSourceType = z.infer<typeof IngredientSourceTypeEnum>;
export type IngredientQuality = z.infer<typeof IngredientQualityEnum>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type SpecialIngredient = z.infer<typeof SpecialIngredientSchema>;
export type MealQuality = z.infer<typeof MealQualityEnum>;
export type Meal = z.infer<typeof MealSchema>;
export type BeastFeastRecipe = z.infer<typeof BeastFeastRecipeSchema>;
export type Cookbook = z.infer<typeof CookbookSchema>;
export type CharacterCookingState = z.infer<typeof CharacterCookingStateSchema>;
export type CookingSession = z.infer<typeof CookingSessionSchema>;
export type BerrysRestaurant = z.infer<typeof BerrysRestaurantSchema>;

// =====================================================================================
// Utility Functions
// =====================================================================================

/**
 * Calculate the total flavor dice pool from an array of ingredients.
 */
export function calculateFlavorDicePool(ingredients: Ingredient[]): Array<{
  die: FlavorDie;
  count: number;
  sources: string[];
}> {
  const diceMap: Map<FlavorDie, { count: number; sources: string[] }> =
    new Map();

  for (const ingredient of ingredients) {
    for (const profile of ingredient.flavorProfiles) {
      const existing = diceMap.get(profile.die);
      if (existing) {
        existing.count += profile.strength;
        existing.sources.push(ingredient.name);
      } else {
        diceMap.set(profile.die, {
          count: profile.strength,
          sources: [ingredient.name],
        });
      }
    }
  }

  return Array.from(diceMap.entries()).map(([die, data]) => ({
    die,
    count: data.count,
    sources: data.sources,
  }));
}

/**
 * Calculate meal rating from matched dice sets.
 * Each matched set's value equals the matched number (not multiplied).
 */
export function calculateMealRating(
  matchedSets: Array<{ value: number; diceCount: number }>
): number {
  return matchedSets.reduce((total, set) => total + set.value, 0);
}

/**
 * Determine meal quality based on meal rating.
 */
export function getMealQualityFromRating(mealRating: number): MealQuality {
  if (mealRating <= 3) return 'Poor';
  if (mealRating <= 8) return 'Decent';
  if (mealRating <= 15) return 'Good';
  return 'Excellent';
}

/**
 * Check if a meal's flavor profile matches a recorded recipe.
 * Returns true if all the recipe's flavor types are present in the meal.
 */
export function doesMealMatchRecipe(
  mealFlavorProfiles: FlavorProfile[],
  recipeFlavorProfiles: FlavorProfile[]
): boolean {
  const mealFlavors = new Set(mealFlavorProfiles.map(p => p.name));
  return recipeFlavorProfiles.every(p => mealFlavors.has(p.name));
}

/**
 * Get tier tokens for recipe matching.
 * Per the rulebook: add tokens equal to party's current tier.
 */
export function getTierTokensForRecipeMatch(partyTier: number): number {
  return Math.max(1, Math.min(4, partyTier));
}
