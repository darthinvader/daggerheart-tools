/**
 * Beastform Data
 *
 * Static definitions for all Druid beastforms per the Daggerheart SRD.
 * Each form specifies tier, trait bonus, evasion bonus, attack stats,
 * advantages, and special features.
 */

import type { CharacterTrait } from '@/lib/character-stats-engine/types';

/** A special feature granted by a beastform */
export interface BeastformFeature {
  name: string;
  description: string;
}

/** Attack definition for a beastform */
export interface BeastformAttack {
  /** Range category */
  range: 'Melee' | 'Very Close' | 'Close' | 'Far';
  /** Trait used for the attack roll */
  trait: CharacterTrait;
  /** Damage dice expression (e.g., 'd8+2') */
  damageDice: string;
}

/** Complete definition for a single beastform */
export interface BeastformDefinition {
  id: string;
  name: string;
  tier: number;
  /** Example creatures this form represents */
  examples: string[];
  /** Trait bonus granted while in this form */
  traitBonus: { trait: CharacterTrait; value: number };
  /** Flat bonus to evasion while in this form */
  evasionBonus: number;
  /** Attack granted by this form */
  attack: BeastformAttack;
  /** Advantages this form grants */
  advantages: string[];
  /** Special features of this form */
  features: BeastformFeature[];
}

// ============================================
// Tier 1 Beastforms
// ============================================

const SMALL_BEAST: BeastformDefinition = {
  id: 'small-beast',
  name: 'Small Beast',
  tier: 1,
  examples: ['Cat', 'Fox', 'Raven', 'Raccoon'],
  traitBonus: { trait: 'Agility', value: 1 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Agility', damageDice: 'd6' },
  advantages: ['Stealth', 'Perception'],
  features: [
    {
      name: 'Nimble',
      description: 'You have advantage on rolls to hide or escape.',
    },
  ],
};

const MEDIUM_BEAST: BeastformDefinition = {
  id: 'medium-beast',
  name: 'Medium Beast',
  tier: 1,
  examples: ['Wolf', 'Panther', 'Boar', 'Deer'],
  traitBonus: { trait: 'Strength', value: 1 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd8' },
  advantages: ['Tracking', 'Athletics'],
  features: [
    {
      name: 'Pack Tactics',
      description:
        'When attacking a target that is adjacent to an ally, add +1 to your attack roll.',
    },
  ],
};

const AQUATIC_BEAST: BeastformDefinition = {
  id: 'aquatic-beast',
  name: 'Aquatic Beast',
  tier: 1,
  examples: ['Dolphin', 'Seal', 'Large Fish', 'Otter'],
  traitBonus: { trait: 'Finesse', value: 1 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Finesse', damageDice: 'd6' },
  advantages: ['Swimming', 'Underwater Navigation'],
  features: [
    {
      name: 'Aquatic',
      description: 'You can breathe underwater and swim at full speed.',
    },
  ],
};

const INSECT_SWARM: BeastformDefinition = {
  id: 'insect-swarm',
  name: 'Insect Swarm',
  tier: 1,
  examples: ['Swarm of Bees', 'Swarm of Beetles', 'Swarm of Ants'],
  traitBonus: { trait: 'Instinct', value: 1 },
  evasionBonus: 3,
  attack: { range: 'Very Close', trait: 'Instinct', damageDice: 'd4' },
  advantages: ['Scouting', 'Resisting physical attacks'],
  features: [
    {
      name: 'Dispersed',
      description:
        'Physical attacks against you have disadvantage. You can squeeze through any gap that air can pass through.',
    },
  ],
};

const BIRD_OF_PREY: BeastformDefinition = {
  id: 'bird-of-prey',
  name: 'Bird of Prey',
  tier: 1,
  examples: ['Hawk', 'Eagle', 'Owl', 'Falcon'],
  traitBonus: { trait: 'Instinct', value: 1 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Agility', damageDice: 'd6' },
  advantages: ['Perception', 'Aerial Scouting'],
  features: [
    {
      name: 'Flight',
      description: 'You can fly at your normal movement speed.',
    },
  ],
};

const REPTILE: BeastformDefinition = {
  id: 'reptile',
  name: 'Reptile',
  tier: 1,
  examples: ['Snake', 'Lizard', 'Crocodile'],
  traitBonus: { trait: 'Finesse', value: 1 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Finesse', damageDice: 'd6' },
  advantages: ['Stealth', 'Climbing'],
  features: [
    {
      name: 'Venomous',
      description:
        'When you deal damage with your attack, the target takes +1 additional damage at the start of their next turn.',
    },
  ],
};

// ============================================
// Tier 2 Beastforms
// ============================================

const LARGE_BEAST: BeastformDefinition = {
  id: 'large-beast',
  name: 'Large Beast',
  tier: 2,
  examples: ['Bear', 'Tiger', 'Elk', 'Lion'],
  traitBonus: { trait: 'Strength', value: 2 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd10' },
  advantages: ['Intimidation', 'Athletics'],
  features: [
    {
      name: 'Powerful Build',
      description:
        'You can carry, push, or drag heavy objects, and your attacks knock smaller creatures back.',
    },
  ],
};

const GIANT_INSECT: BeastformDefinition = {
  id: 'giant-insect',
  name: 'Giant Insect',
  tier: 2,
  examples: ['Giant Spider', 'Giant Scorpion', 'Giant Beetle'],
  traitBonus: { trait: 'Instinct', value: 2 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Instinct', damageDice: 'd8' },
  advantages: ['Climbing', 'Web-spinning'],
  features: [
    {
      name: 'Web/Venom',
      description:
        'Your attacks can restrain a target until the end of their next turn.',
    },
  ],
};

const DIRE_WOLF: BeastformDefinition = {
  id: 'dire-wolf',
  name: 'Dire Wolf',
  tier: 2,
  examples: ['Dire Wolf', 'Worg', 'Large Canine'],
  traitBonus: { trait: 'Strength', value: 1 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd10' },
  advantages: ['Tracking', 'Pack coordination'],
  features: [
    {
      name: 'Pack Leader',
      description:
        'Allies within Very Close range gain +1 to attack rolls against targets you have damaged this round.',
    },
  ],
};

const LARGE_AQUATIC: BeastformDefinition = {
  id: 'large-aquatic',
  name: 'Large Aquatic Beast',
  tier: 2,
  examples: ['Shark', 'Giant Octopus', 'Whale'],
  traitBonus: { trait: 'Strength', value: 2 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd10' },
  advantages: ['Swimming', 'Deep diving'],
  features: [
    {
      name: 'Deep Dweller',
      description:
        'You can breathe underwater, swim at double speed, and see in darkness.',
    },
  ],
};

const GIANT_BIRD: BeastformDefinition = {
  id: 'giant-bird',
  name: 'Giant Bird',
  tier: 2,
  examples: ['Giant Eagle', 'Roc Hatchling', 'Thunderbird'],
  traitBonus: { trait: 'Agility', value: 2 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Agility', damageDice: 'd8' },
  advantages: ['Aerial combat', 'Carrying allies'],
  features: [
    {
      name: 'Soaring Flight',
      description:
        'You can fly at double speed and carry one willing creature of your size or smaller.',
    },
  ],
};

const ELEMENTAL_BEAST: BeastformDefinition = {
  id: 'elemental-beast',
  name: 'Elemental Beast',
  tier: 2,
  examples: ['Fire Cat', 'Stone Lizard', 'Storm Hawk'],
  traitBonus: { trait: 'Instinct', value: 2 },
  evasionBonus: 1,
  attack: { range: 'Very Close', trait: 'Instinct', damageDice: 'd8' },
  advantages: ['Elemental resistance'],
  features: [
    {
      name: 'Elemental Aura',
      description:
        'Creatures that end their turn within Very Close range of you take 1 damage from your element.',
    },
  ],
};

// ============================================
// Tier 3 Beastforms
// ============================================

const DIRE_BEAR: BeastformDefinition = {
  id: 'dire-bear',
  name: 'Dire Bear',
  tier: 3,
  examples: ['Dire Bear', 'Cave Bear', 'War Bear'],
  traitBonus: { trait: 'Strength', value: 3 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd12' },
  advantages: ['Intimidation', 'Grappling'],
  features: [
    {
      name: 'Terrifying Presence',
      description:
        'Enemies within Close range must succeed on a Fear check or become frightened.',
    },
  ],
};

const WYVERN: BeastformDefinition = {
  id: 'wyvern',
  name: 'Wyvern',
  tier: 3,
  examples: ['Wyvern', 'Drake', 'Young Dragon'],
  traitBonus: { trait: 'Agility', value: 2 },
  evasionBonus: 2,
  attack: { range: 'Very Close', trait: 'Agility', damageDice: 'd10' },
  advantages: ['Flight', 'Diving attacks'],
  features: [
    {
      name: 'Venomous Tail',
      description:
        'Your tail attack deals an additional d6 poison damage on a critical hit.',
    },
    {
      name: 'Flight',
      description: 'You can fly at your normal movement speed.',
    },
  ],
};

const GIANT_SERPENT: BeastformDefinition = {
  id: 'giant-serpent',
  name: 'Giant Serpent',
  tier: 3,
  examples: ['Giant Constrictor', 'Sea Serpent', 'Basilisk'],
  traitBonus: { trait: 'Finesse', value: 3 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Finesse', damageDice: 'd10' },
  advantages: ['Stealth', 'Constriction'],
  features: [
    {
      name: 'Constrict',
      description:
        'On a successful attack, you can grapple the target, restraining them until they break free.',
    },
  ],
};

const MAMMOTH: BeastformDefinition = {
  id: 'mammoth',
  name: 'Mammoth',
  tier: 3,
  examples: ['Mammoth', 'Elephant', 'War Rhino'],
  traitBonus: { trait: 'Strength', value: 3 },
  evasionBonus: 0,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd12' },
  advantages: ['Charging', 'Trampling'],
  features: [
    {
      name: 'Trample',
      description:
        'When you move through spaces occupied by smaller creatures, they must dodge or take d8 damage.',
    },
  ],
};

const ELEMENTAL_TITAN: BeastformDefinition = {
  id: 'elemental-titan',
  name: 'Elemental Titan',
  tier: 3,
  examples: ['Fire Elemental', 'Storm Elemental', 'Earth Golem'],
  traitBonus: { trait: 'Instinct', value: 3 },
  evasionBonus: 1,
  attack: { range: 'Close', trait: 'Instinct', damageDice: 'd10' },
  advantages: ['Elemental immunity', 'Area damage'],
  features: [
    {
      name: 'Elemental Body',
      description:
        'You are immune to damage from your element. Creatures that touch you take d4 elemental damage.',
    },
  ],
};

const GIANT_APE: BeastformDefinition = {
  id: 'giant-ape',
  name: 'Giant Ape',
  tier: 3,
  examples: ['Giant Ape', 'Gorilla King', 'Sasquatch'],
  traitBonus: { trait: 'Strength', value: 2 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd12' },
  advantages: ['Climbing', 'Throwing'],
  features: [
    {
      name: 'Hurl',
      description:
        'You can throw boulders or other large objects at Far range, dealing d10 damage.',
    },
  ],
};

// ============================================
// Tier 4 Beastforms
// ============================================

const ANCIENT_WYRM: BeastformDefinition = {
  id: 'ancient-wyrm',
  name: 'Ancient Wyrm',
  tier: 4,
  examples: ['Elder Dragon', 'Ancient Wyrm', 'Primordial Serpent'],
  traitBonus: { trait: 'Strength', value: 3 },
  evasionBonus: 2,
  attack: { range: 'Close', trait: 'Strength', damageDice: '2d10' },
  advantages: ['Flight', 'Breath weapon', 'Intimidation'],
  features: [
    {
      name: 'Breath Weapon',
      description:
        'Once per beastform, unleash a devastating breath attack dealing 2d12 damage to all creatures in a cone.',
    },
    {
      name: 'Flight',
      description: 'You can fly at your normal movement speed.',
    },
  ],
};

const BEHEMOTH: BeastformDefinition = {
  id: 'behemoth',
  name: 'Behemoth',
  tier: 4,
  examples: ['Tarrasque', 'Behemoth', 'Titan Beast'],
  traitBonus: { trait: 'Strength', value: 4 },
  evasionBonus: 0,
  attack: { range: 'Melee', trait: 'Strength', damageDice: '2d12' },
  advantages: ['Siege', 'Destruction', 'Unstoppable'],
  features: [
    {
      name: 'Unstoppable',
      description:
        'You cannot be restrained, grappled, or knocked prone. You destroy terrain as you move through it.',
    },
  ],
};

const PHOENIX: BeastformDefinition = {
  id: 'phoenix',
  name: 'Phoenix',
  tier: 4,
  examples: ['Phoenix', 'Firebird', 'Sunbird'],
  traitBonus: { trait: 'Instinct', value: 3 },
  evasionBonus: 3,
  attack: { range: 'Close', trait: 'Instinct', damageDice: '2d8' },
  advantages: ['Flight', 'Fire immunity', 'Radiance'],
  features: [
    {
      name: 'Rebirth',
      description:
        'Once per long rest, if you would drop to 0 HP while in this form, you instead heal to half HP and remain in beastform.',
    },
    {
      name: 'Flight',
      description: 'You can fly at your normal movement speed.',
    },
  ],
};

const LEVIATHAN: BeastformDefinition = {
  id: 'leviathan',
  name: 'Leviathan',
  tier: 4,
  examples: ['Kraken', 'Leviathan', 'Sea Dragon'],
  traitBonus: { trait: 'Finesse', value: 3 },
  evasionBonus: 2,
  attack: { range: 'Close', trait: 'Finesse', damageDice: '2d10' },
  advantages: ['Swimming', 'Deep combat', 'Grappling'],
  features: [
    {
      name: 'Tentacles',
      description:
        'You can grapple up to 3 targets simultaneously. Grappled targets take d6 damage at the start of each of their turns.',
    },
  ],
};

const STORM_COLOSSUS: BeastformDefinition = {
  id: 'storm-colossus',
  name: 'Storm Colossus',
  tier: 4,
  examples: ['Storm Giant Form', 'Thunder Titan', 'Tempest Elemental'],
  traitBonus: { trait: 'Instinct', value: 4 },
  evasionBonus: 1,
  attack: { range: 'Far', trait: 'Instinct', damageDice: '2d8' },
  advantages: ['Lightning', 'Area denial', 'Weather control'],
  features: [
    {
      name: 'Storm Aura',
      description:
        'Enemies within Close range take d4 lightning damage at the start of their turn. You control the weather within Far range.',
    },
  ],
};

const PRIMORDIAL_TREANT: BeastformDefinition = {
  id: 'primordial-treant',
  name: 'Primordial Treant',
  tier: 4,
  examples: ['Ancient Treant', 'World Tree Guardian', 'Forest Spirit'],
  traitBonus: { trait: 'Knowledge', value: 3 },
  evasionBonus: 0,
  attack: { range: 'Close', trait: 'Strength', damageDice: '2d10' },
  advantages: ['Nature control', 'Healing', 'Siege'],
  features: [
    {
      name: 'Root Network',
      description:
        'Allies within Close range heal d4 HP at the start of each of their turns. You can communicate telepathically through plants.',
    },
  ],
};

// ============================================
// Complete collection
// ============================================

/** All beastform definitions indexed by tier */
export const BEASTFORMS: readonly BeastformDefinition[] = [
  // Tier 1
  SMALL_BEAST,
  MEDIUM_BEAST,
  AQUATIC_BEAST,
  INSECT_SWARM,
  BIRD_OF_PREY,
  REPTILE,
  // Tier 2
  LARGE_BEAST,
  GIANT_INSECT,
  DIRE_WOLF,
  LARGE_AQUATIC,
  GIANT_BIRD,
  ELEMENTAL_BEAST,
  // Tier 3
  DIRE_BEAR,
  WYVERN,
  GIANT_SERPENT,
  MAMMOTH,
  ELEMENTAL_TITAN,
  GIANT_APE,
  // Tier 4
  ANCIENT_WYRM,
  BEHEMOTH,
  PHOENIX,
  LEVIATHAN,
  STORM_COLOSSUS,
  PRIMORDIAL_TREANT,
] as const;

/**
 * Look up a beastform by its unique ID.
 */
export function getBeastformById(id: string): BeastformDefinition | undefined {
  return BEASTFORMS.find(b => b.id === id);
}

/**
 * Get all beastforms available at or below a given tier.
 * Per SRD, druids can transform into forms of their tier or lower.
 */
export function getBeastformsForTier(tier: number): BeastformDefinition[] {
  return BEASTFORMS.filter(b => b.tier <= tier);
}

/**
 * Get beastforms for a specific tier only.
 */
export function getBeastformsAtTier(tier: number): BeastformDefinition[] {
  return BEASTFORMS.filter(b => b.tier === tier);
}
