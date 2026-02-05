import type {
  BeastFeastRecipe,
  FlavorProfile,
  FlavorType,
  Ingredient,
  SpecialIngredient,
} from '../../schemas/beast-feast-cooking';
import {
  FLAVOR_DIE_MAP,
  getIngredientCountFromHP,
} from '../../schemas/beast-feast-cooking';

// =====================================================================================
// Beast Feast Cooking Data
// Pre-defined ingredients, creatures, and recipes for the Beast Feast campaign
// =====================================================================================

/**
 * Helper to create a flavor profile with the correct die.
 */
export function createFlavorProfile(
  name: FlavorType,
  strength: number = 1
): FlavorProfile {
  return {
    name,
    die: FLAVOR_DIE_MAP[name],
    strength: Math.min(3, Math.max(1, strength)),
  };
}

/**
 * Helper to generate a unique ID.
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// =====================================================================================
// Predefined Ingredients from Plover Caves
// =====================================================================================

/**
 * Standard ingredients commonly found in the Plover Caves.
 */
export const PLOVER_CAVE_INGREDIENTS: Omit<Ingredient, 'id' | 'createdAt'>[] = [
  // Shallows Layer - Common ingredients
  {
    name: 'Cave Mushroom Caps',
    description: 'Earthy mushrooms that grow in the damp cave walls.',
    sourceType: 'Bloom',
    sourceCreature: 'Shallows',
    flavorProfiles: [
      createFlavorProfile('Bitter', 1),
      createFlavorProfile('Savory', 1),
    ],
    quantity: 1,
    quality: 'Common',
    notes: '',
  },
  {
    name: 'Glowing Moss',
    description: 'Bioluminescent moss that adds an ethereal quality to dishes.',
    sourceType: 'Bloom',
    sourceCreature: 'Shallows',
    flavorProfiles: [createFlavorProfile('Weird', 1)],
    quantity: 1,
    quality: 'Common',
    notes: '',
  },
  {
    name: 'Rileroot',
    description: 'A bitter root that adds depth to any dish.',
    sourceType: 'Bloom',
    sourceCreature: 'Shallows',
    flavorProfiles: [createFlavorProfile('Bitter', 1)],
    quantity: 1,
    quality: 'Common',
    notes: '',
  },
  {
    name: 'Cave Beetle Shell',
    description: 'Crunchy shells that add texture when ground.',
    sourceType: 'Beast',
    sourceCreature: 'Cave Beetle',
    flavorProfiles: [
      createFlavorProfile('Salty', 1),
      createFlavorProfile('Bitter', 1),
    ],
    quantity: 1,
    quality: 'Common',
    notes: '',
  },
  {
    name: 'Rat Tail',
    description: 'Surprisingly tender when prepared correctly.',
    sourceType: 'Beast',
    sourceCreature: 'Giant Rat',
    flavorProfiles: [createFlavorProfile('Savory', 1)],
    quantity: 1,
    quality: 'Common',
    notes: '',
  },

  // Twilight Layer - Uncommon ingredients
  {
    name: 'Stalactite Honey',
    description: 'Sweet honey collected from cave wasp nests.',
    sourceType: 'Bloom',
    sourceCreature: 'Twilight',
    flavorProfiles: [createFlavorProfile('Sweet', 2)],
    quantity: 1,
    quality: 'Uncommon',
    notes: '',
  },
  {
    name: 'Ooze Marrow',
    description: 'Gelatinous substance with surprising flavor.',
    sourceType: 'Beast',
    sourceCreature: 'Cave Ooze',
    flavorProfiles: [
      createFlavorProfile('Sweet', 1),
      createFlavorProfile('Bitter', 2),
    ],
    quantity: 1,
    quality: 'Uncommon',
    notes: '',
  },
  {
    name: 'Spider Silk Threads',
    description: 'Edible threads that create interesting textures.',
    sourceType: 'Beast',
    sourceCreature: 'Giant Spider',
    flavorProfiles: [createFlavorProfile('Salty', 1)],
    quantity: 1,
    quality: 'Uncommon',
    notes: '',
  },
  {
    name: 'Cave Boar Meat',
    description: 'Rich, fatty meat from the subterranean boar.',
    sourceType: 'Beast',
    sourceCreature: 'Cave Boar',
    flavorProfiles: [
      createFlavorProfile('Savory', 2),
      createFlavorProfile('Salty', 1),
    ],
    quantity: 1,
    quality: 'Uncommon',
    notes: '',
  },
  {
    name: 'Phosphor Berries',
    description: 'Glowing berries with a sour tang.',
    sourceType: 'Bloom',
    sourceCreature: 'Twilight',
    flavorProfiles: [
      createFlavorProfile('Sour', 1),
      createFlavorProfile('Sweet', 1),
    ],
    quantity: 1,
    quality: 'Uncommon',
    notes: '',
  },

  // Abyss Layer - Rare ingredients
  {
    name: 'Basilisk Tongue',
    description: 'A rare delicacy that must be prepared with care.',
    sourceType: 'Beast',
    sourceCreature: 'Basilisk',
    flavorProfiles: [
      createFlavorProfile('Sour', 2),
      createFlavorProfile('Savory', 1),
    ],
    quantity: 1,
    quality: 'Rare',
    notes: '',
  },
  {
    name: 'Crystal Truffle',
    description: 'Rare fungi that grows only in the deepest caves.',
    sourceType: 'Bloom',
    sourceCreature: 'Abyss',
    flavorProfiles: [
      createFlavorProfile('Savory', 2),
      createFlavorProfile('Weird', 1),
    ],
    quantity: 1,
    quality: 'Rare',
    notes: '',
  },
  {
    name: 'Wyvern Tongue',
    description: 'A rare delicacy with an acquired taste.',
    sourceType: 'Beast',
    sourceCreature: 'Wyvern',
    flavorProfiles: [
      createFlavorProfile('Sour', 1),
      createFlavorProfile('Savory', 1),
      createFlavorProfile('Weird', 1),
    ],
    quantity: 1,
    quality: 'Rare',
    notes: '',
  },
  {
    name: 'Direbear Meat',
    description: 'Rich, hearty meat from the fearsome direbear.',
    sourceType: 'Beast',
    sourceCreature: 'Direbear',
    flavorProfiles: [createFlavorProfile('Savory', 3)],
    quantity: 1,
    quality: 'Rare',
    notes: '',
  },
  {
    name: 'Acid Dragon Saliva',
    description: 'Potent acidic secretion, requires careful handling.',
    sourceType: 'Beast',
    sourceCreature: 'Acid Dragon',
    flavorProfiles: [createFlavorProfile('Sour', 2)],
    quantity: 1,
    quality: 'Rare',
    notes: '',
  },

  // Hadral Layer - Legendary ingredients
  {
    name: 'Leviathan Scale Oil',
    description: 'Extracted from the scales of ancient cave leviathans.',
    sourceType: 'Beast',
    sourceCreature: 'Cave Leviathan',
    flavorProfiles: [
      createFlavorProfile('Weird', 2),
      createFlavorProfile('Savory', 1),
    ],
    quantity: 1,
    quality: 'Legendary',
    notes: '',
  },
  {
    name: 'Lure Blossom Petal',
    description: 'Mystical flowers that grow near the ancient Lure.',
    sourceType: 'Bloom',
    sourceCreature: 'Hadral',
    flavorProfiles: [
      createFlavorProfile('Sweet', 1),
      createFlavorProfile('Weird', 2),
    ],
    quantity: 1,
    quality: 'Legendary',
    notes: '',
  },
];

// =====================================================================================
// Featured Ingredients (from Leader/Solo adversaries)
// =====================================================================================

/**
 * Special ingredients with unique mechanical effects.
 */
export const FEATURED_INGREDIENTS: Omit<
  SpecialIngredient,
  'id' | 'createdAt'
>[] = [
  {
    name: 'Diregazelle Skull Marrow',
    description: 'Marrow from the swift diregazelle, infused with speed.',
    sourceType: 'Beast',
    sourceCreature: 'Diregazelle (Leader)',
    flavorProfiles: [
      createFlavorProfile('Sweet', 1),
      createFlavorProfile('Salty', 1),
      createFlavorProfile('Sour', 1),
    ],
    quantity: 1,
    quality: 'Rare',
    feature: {
      name: 'Built for Speed',
      description:
        'You gain a +1 bonus to your Agility until your next short rest.',
      effect: '+1 Agility until short rest',
      isRisky: false,
    },
    notes: '',
  },
  {
    name: "Holy Cow's Milk",
    description: 'Sacred milk from the blessed bovine of the deep caves.',
    sourceType: 'Beast',
    sourceCreature: 'Holy Cow (Solo)',
    flavorProfiles: [createFlavorProfile('Weird', 1)],
    quantity: 1,
    quality: 'Legendary',
    feature: {
      name: 'Last Drop',
      description:
        'When you have only one die remaining while cooking, roll it and add the result to your Meal Rating.',
      effect: 'Roll final die, add to Meal Rating',
      isRisky: false,
    },
    notes: '',
  },
  {
    name: 'Ghost Scorpion Venom',
    description: 'Potent venom that must be handled with extreme care.',
    sourceType: 'Beast',
    sourceCreature: 'Ghost Scorpion (Leader)',
    flavorProfiles: [
      createFlavorProfile('Sour', 1),
      createFlavorProfile('Savory', 1),
    ],
    quantity: 1,
    quality: 'Rare',
    feature: {
      name: 'Spicy',
      description:
        "If your flavor dice match on results of 8 or higher, you can't clear Stress using this dish.",
      effect: 'High matches prevent Stress clearing',
      isRisky: true,
    },
    notes: '',
  },
  {
    name: 'Deathflower',
    description:
      'A dangerously beautiful flower that walks the line between poison and perfection.',
    sourceType: 'Bloom',
    sourceCreature: 'Abyss',
    flavorProfiles: [createFlavorProfile('Bitter', 2)],
    quantity: 1,
    quality: 'Legendary',
    feature: {
      name: 'Risky',
      description:
        'If you roll no matches on your flavor dice, you clear all Hit Points and Stress and gain 3 Hope. If you roll any matches on your flavor dice, your Meal Rating is 0 and you must make a death move.',
      effect: 'No matches = full heal + 3 Hope; Any matches = death move',
      isRisky: true,
    },
    notes: '',
  },
  {
    name: 'Ogre Kidney Stone',
    description: 'An unusual ingredient with surprising sweetness.',
    sourceType: 'Beast',
    sourceCreature: 'Cave Ogre (Leader)',
    flavorProfiles: [
      createFlavorProfile('Sweet', 1),
      createFlavorProfile('Weird', 1),
    ],
    quantity: 1,
    quality: 'Rare',
    feature: {
      name: 'Surprisingly Sweet',
      description:
        'When you eat a dish containing this ingredient, clear 1 additional Stress.',
      effect: 'Clear +1 Stress when eaten',
      isRisky: false,
    },
    notes: '',
  },
  {
    name: 'Phoenix Feather Ash',
    description: 'Ash from a phoenix feather, warm to the touch.',
    sourceType: 'Beast',
    sourceCreature: 'Cave Phoenix (Solo)',
    flavorProfiles: [
      createFlavorProfile('Bitter', 1),
      createFlavorProfile('Weird', 2),
    ],
    quantity: 1,
    quality: 'Legendary',
    feature: {
      name: 'Rising Flame',
      description:
        'If you would mark your last Hit Point while this meal is in effect, instead clear all Hit Points and end the effect.',
      effect: 'Death save: clear all HP instead of dying',
      isRisky: false,
    },
    notes: '',
  },
];

// =====================================================================================
// Beast-to-Ingredient Mapping
// =====================================================================================

/**
 * Maps beast names to their harvestable ingredients.
 */
export interface BeastIngredientData {
  beastName: string;
  maxHP: number;
  ingredientCount: number;
  possibleIngredients: string[];
  caveLayer: 'Shallows' | 'Twilight' | 'Abyss' | 'Hadral';
  isFeatured: boolean;
}

/**
 * Pre-defined beasts and their ingredients for the Plover Caves.
 */
export const PLOVER_CAVE_BEASTS: BeastIngredientData[] = [
  // Shallows
  {
    beastName: 'Cave Beetle',
    maxHP: 3,
    ingredientCount: getIngredientCountFromHP(3),
    possibleIngredients: ['Cave Beetle Shell'],
    caveLayer: 'Shallows',
    isFeatured: false,
  },
  {
    beastName: 'Giant Rat',
    maxHP: 4,
    ingredientCount: getIngredientCountFromHP(4),
    possibleIngredients: ['Rat Tail'],
    caveLayer: 'Shallows',
    isFeatured: false,
  },
  {
    beastName: 'Cave Bat Swarm',
    maxHP: 5,
    ingredientCount: getIngredientCountFromHP(5),
    possibleIngredients: ['Bat Wing Membrane', 'Bat Guano Fertilizer'],
    caveLayer: 'Shallows',
    isFeatured: false,
  },

  // Twilight
  {
    beastName: 'Cave Ooze',
    maxHP: 6,
    ingredientCount: getIngredientCountFromHP(6),
    possibleIngredients: ['Ooze Marrow', 'Ooze Core'],
    caveLayer: 'Twilight',
    isFeatured: false,
  },
  {
    beastName: 'Giant Spider',
    maxHP: 7,
    ingredientCount: getIngredientCountFromHP(7),
    possibleIngredients: ['Spider Silk Threads', 'Spider Venom Gland'],
    caveLayer: 'Twilight',
    isFeatured: false,
  },
  {
    beastName: 'Cave Boar',
    maxHP: 8,
    ingredientCount: getIngredientCountFromHP(8),
    possibleIngredients: ['Cave Boar Meat', 'Cave Boar Tusk', 'Cave Boar Fat'],
    caveLayer: 'Twilight',
    isFeatured: false,
  },
  {
    beastName: 'Ghost Scorpion',
    maxHP: 10,
    ingredientCount: getIngredientCountFromHP(10),
    possibleIngredients: [
      'Ghost Scorpion Venom',
      'Scorpion Carapace',
      'Scorpion Stinger',
    ],
    caveLayer: 'Twilight',
    isFeatured: true,
  },

  // Abyss
  {
    beastName: 'Basilisk',
    maxHP: 12,
    ingredientCount: getIngredientCountFromHP(12),
    possibleIngredients: [
      'Basilisk Tongue',
      'Basilisk Eye',
      'Basilisk Scales',
      'Basilisk Heart',
    ],
    caveLayer: 'Abyss',
    isFeatured: false,
  },
  {
    beastName: 'Wyvern',
    maxHP: 14,
    ingredientCount: getIngredientCountFromHP(14),
    possibleIngredients: [
      'Wyvern Tongue',
      'Wyvern Wing Leather',
      'Wyvern Flame Sac',
      'Wyvern Meat',
    ],
    caveLayer: 'Abyss',
    isFeatured: false,
  },
  {
    beastName: 'Diregazelle',
    maxHP: 15,
    ingredientCount: getIngredientCountFromHP(15),
    possibleIngredients: [
      'Diregazelle Skull Marrow',
      'Diregazelle Haunch',
      'Diregazelle Antler',
      'Diregazelle Hide',
    ],
    caveLayer: 'Abyss',
    isFeatured: true,
  },
  {
    beastName: 'Direbear',
    maxHP: 18,
    ingredientCount: getIngredientCountFromHP(18),
    possibleIngredients: [
      'Direbear Meat',
      'Direbear Fat',
      'Direbear Liver',
      'Direbear Paw',
    ],
    caveLayer: 'Abyss',
    isFeatured: false,
  },

  // Hadral
  {
    beastName: 'Cave Leviathan',
    maxHP: 25,
    ingredientCount: getIngredientCountFromHP(25),
    possibleIngredients: [
      'Leviathan Scale Oil',
      'Leviathan Heart',
      'Leviathan Fin',
      'Leviathan Eye',
    ],
    caveLayer: 'Hadral',
    isFeatured: true,
  },
  {
    beastName: 'Holy Cow',
    maxHP: 30,
    ingredientCount: getIngredientCountFromHP(30),
    possibleIngredients: [
      "Holy Cow's Milk",
      'Sacred Beef',
      'Blessed Hide',
      'Golden Horn',
    ],
    caveLayer: 'Hadral',
    isFeatured: true,
  },
];

// =====================================================================================
// Starter Recipes for the Party Cookbook
// =====================================================================================

/**
 * Basic recipes that new adventurers might know.
 */
export const STARTER_RECIPES: Omit<
  BeastFeastRecipe,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: 'Simple Cave Stew',
    description: 'A hearty stew that any villager can prepare.',
    ingredientTypes: ['Meat', 'Mushroom', 'Root'],
    flavorProfile: [
      createFlavorProfile('Savory', 1),
      createFlavorProfile('Bitter', 1),
    ],
    cookingMethod: 'Boil all ingredients together until tender.',
    notes: 'Good for clearing minor fatigue.',
    timesCooked: 1,
    bestMealRating: 0,
    createdBy: 'Elmore Village Tradition',
  },
  {
    name: 'Roasted Meat on a Stick',
    description: 'The simplest way to prepare fresh meat.',
    ingredientTypes: ['Meat'],
    flavorProfile: [createFlavorProfile('Savory', 1)],
    cookingMethod: 'Skewer and roast over open flame.',
    notes: 'Quick and filling.',
    timesCooked: 1,
    bestMealRating: 0,
    createdBy: 'Elmore Village Tradition',
  },
  {
    name: 'Bitter Mushroom Soup',
    description: 'A warming soup perfect for cold cave exploration.',
    ingredientTypes: ['Mushroom', 'Root'],
    flavorProfile: [createFlavorProfile('Bitter', 2)],
    cookingMethod: 'Simmer mushrooms with bitter roots.',
    notes: 'Acquired taste, but effective.',
    timesCooked: 1,
    bestMealRating: 0,
    createdBy: 'Elmore Village Tradition',
  },
];

// =====================================================================================
// Cooking Utility Functions
// =====================================================================================

/**
 * Create a new ingredient with ID and timestamp.
 */
export function createIngredient(
  data: Omit<Ingredient, 'id' | 'createdAt'>
): Ingredient {
  return {
    ...data,
    id: generateId('ing'),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Create a new special ingredient with ID and timestamp.
 */
export function createSpecialIngredient(
  data: Omit<SpecialIngredient, 'id' | 'createdAt'>
): SpecialIngredient {
  return {
    ...data,
    id: generateId('sp-ing'),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Create a new recipe with IDs and timestamps.
 */
export function createRecipe(
  data: Omit<BeastFeastRecipe, 'id' | 'createdAt' | 'updatedAt'>
): BeastFeastRecipe {
  const now = new Date().toISOString();
  return {
    ...data,
    id: generateId('recipe'),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get ingredients for a beast by name.
 */
export function getIngredientsForBeast(beastName: string): string[] {
  const beast = PLOVER_CAVE_BEASTS.find(
    b => b.beastName.toLowerCase() === beastName.toLowerCase()
  );
  return beast?.possibleIngredients ?? [];
}

/**
 * Get ingredient count for a beast by HP.
 */
export function getIngredientCountForBeast(maxHP: number): number {
  return getIngredientCountFromHP(maxHP);
}

/**
 * Get random bloom from a cave layer.
 */
export function getRandomBloom(
  layer: 'Shallows' | 'Twilight' | 'Abyss' | 'Hadral'
): Omit<Ingredient, 'id' | 'createdAt'> | null {
  const blooms = PLOVER_CAVE_INGREDIENTS.filter(
    i => i.sourceType === 'Bloom' && i.sourceCreature === layer
  );
  if (blooms.length === 0) return null;
  return blooms[Math.floor(Math.random() * blooms.length)];
}

/**
 * Get a featured ingredient for a leader/solo adversary.
 */
export function getFeaturedIngredient(
  creatureName: string
): Omit<SpecialIngredient, 'id' | 'createdAt'> | null {
  return (
    FEATURED_INGREDIENTS.find(i =>
      i.sourceCreature.toLowerCase().includes(creatureName.toLowerCase())
    ) ?? null
  );
}
