// Daggerheart Character Types
// Based on the Daggerheart SRD v1.0 - Character Creation and Core Mechanics

// ============================================================================
// CORE GAME MECHANICS
// ============================================================================

/** The six core character traits used for action rolls */
export type CoreTrait = 'Agility' | 'Strength' | 'Finesse' | 'Instinct' | 'Presence' | 'Knowledge';

/** Trait modifier values - flexible number type to handle any homebrew values */
export type TraitModifier = number;

/** Standard starting trait modifiers for character creation (can be customized) */
export const STANDARD_TRAIT_MODIFIERS = [2, 1, 1, 0, 0, -1] as const;

/** The nine available character classes (extendable for homebrew) */
export type ClassName = 'Bard' | 'Druid' | 'Guardian' | 'Ranger' | 'Rogue' | 'Seraph' | 'Sorcerer' | 'Warrior' | 'Wizard' | string;

/** The nine domains available in Daggerheart (extendable for homebrew) */
export type DomainName = 'Arcana' | 'Blade' | 'Bone' | 'Codex' | 'Grace' | 'Midnight' | 'Sage' | 'Splendor' | 'Valor' | string;

/** Available ancestries in the core rules (extendable for homebrew) */
export type AncestryName = 'Clank' | 'Drakona' | 'Dwarf' | 'Elf' | 'Faerie' | 'Faun' | 'Firbolg' | 'Fungril' | 'Galapa' | 'Giant' | 'Goblin' | 'Halfling' | 'Human' | 'Infernis' | 'Katari' | 'Orc' | 'Ribbet' | 'Simiah' | string;

/** Available communities in the core rules (extendable for homebrew) */
export type CommunityName = 'Highborne' | 'Loreborne' | 'Orderborne' | 'Ridgeborne' | 'Seaborne' | 'Slyborne' | 'Underborne' | 'Wanderborne' | 'Wildborne' | string;

/** Domain card types (extendable for homebrew) */
export type DomainCardType = 'Ability' | 'Spell' | 'Grimoire' | string;

/** Usage limit reset conditions (extendable for homebrew) */
export type UsageLimitReset = 'Rest' | 'Long Rest' | 'Session' | 'Encounter' | 'Turn' | string;

// ============================================================================
// CORE GAME CONSTANTS (STARTER/DEFAULT VALUES)
// ============================================================================

/** Standard character classes from the core rules */
export const CORE_CLASSES = ['Bard', 'Druid', 'Guardian', 'Ranger', 'Rogue', 'Seraph', 'Sorcerer', 'Warrior', 'Wizard'] as const;

/** Standard domains from the core rules */
export const CORE_DOMAINS = ['Arcana', 'Blade', 'Bone', 'Codex', 'Grace', 'Midnight', 'Sage', 'Splendor', 'Valor'] as const;

/** Standard ancestries from the core rules */
export const CORE_ANCESTRIES = ['Clank', 'Drakona', 'Dwarf', 'Elf', 'Faerie', 'Faun', 'Firbolg', 'Fungril', 'Galapa', 'Giant', 'Goblin', 'Halfling', 'Human', 'Infernis', 'Katari', 'Orc', 'Ribbet', 'Simiah'] as const;

/** Standard communities from the core rules */
export const CORE_COMMUNITIES = ['Highborne', 'Loreborne', 'Orderborne', 'Ridgeborne', 'Seaborne', 'Slyborne', 'Underborne', 'Wanderborne', 'Wildborne'] as const;

// ============================================================================
// HERITAGE SYSTEM
// ============================================================================

/** Character ancestry with its two features */
export interface Ancestry {
  name: AncestryName;
  description: string;
  firstFeature: AncestryFeature;
  secondFeature: AncestryFeature;
}

/** Individual ancestry feature */
export interface AncestryFeature {
  name: string;
  description: string;
  /** Feature position - affects mixed ancestry combinations */
  position?: 'top' | 'bottom';
  /** Feature type for design guidance */
  featureType?: 'movement' | 'reaction_bonus' | 'roll_manipulation' | 'communication' | 'hp_stress' | 'hope_generation' | 'damage_mitigation' | 'downtime' | 'attack' | 'defense' | 'evasion' | 'flight' | 'stress_management' | 'information' | 'reroll' | 'social';
}

/** Character community with its feature */
export interface Community {
  name: CommunityName;
  description: string;
  feature: CommunityFeature;
  /** Whether this is a core community or homebrew/setting-specific */
  isCore?: boolean;
  /** Setting or campaign frame this community belongs to */
  setting?: string;
  /** Community type for design guidance */
  communityType?: 'location_based' | 'ideal_based' | 'circumstance_based';
}

/** Community feature */
export interface CommunityFeature {
  name: string;
  description: string;
}

/** Complete heritage (ancestry + community) */
export interface Heritage {
  ancestry: Ancestry;
  community: Community;
  /** True if this is a mixed ancestry (features from two different ancestries) */
  isMixedAncestry?: boolean;
  mixedAncestrySource?: {
    firstFeatureFrom: AncestryName;
    secondFeatureFrom: AncestryName;
  };
}

// ============================================================================
// CLASS SYSTEM
// ============================================================================

/** Character class definition */
export interface CharacterClass {
  name: string; // Flexible string to allow homebrew classes
  description: string;
  domains: [string, string]; // Each class has exactly 2 domains (flexible strings)
  startingEvasion: number;
  startingHitPoints: number;
  classFeatures: ClassFeature[];
  hopeFeature: ClassFeature; // Special feature that costs 3 Hope
  startingEquipment: string[];
}

/** Class feature */
export interface ClassFeature {
  name: string;
  description: string;
  level: number;
  type: string; // Flexible to allow custom feature types
}

/** Subclass definition */
export interface Subclass {
  name: string;
  parentClass: string; // Flexible string to allow homebrew classes
  description: string;
  spellcastTrait: string; // Flexible string to allow custom traits
  foundationFeature: ClassFeature;
  specializationFeature: ClassFeature;
  masteryFeature: ClassFeature;
}

// ============================================================================
// DOMAIN SYSTEM
// ============================================================================

/** Domain card definition */
export interface DomainCard {
  name: string;
  domain: string; // Flexible string to allow homebrew domains
  level: number; // Flexible number for any level system
  type: string; // Flexible string to allow custom card types
  recallCost: number; // Cost in Stress to swap from vault to loadout
  description: string;
  features: DomainCardFeature[];
  /** Recall cost guidelines from Homebrew Kit */
  recallCostGuidance?: {
    reasoning: 'basic' | 'powerful' | 'grimoire' | 'vault_tax' | 'high_level';
    notes?: string;
  };
  /** Loadout bonus - level 7 cards that provide bonuses for domain focus */
  loadoutBonus?: {
    minimumCards: number; // Usually 4
    bonusType: string;
    bonusDescription: string;
  };
}

/** Individual feature on a domain card */
export interface DomainCardFeature {
  name?: string;
  description: string;
  usageLimit?: UsageLimit;
  /** Token system for tracking usage or effects */
  tokenSystem?: {
    maxTokens: number;
    currentTokens: number;
    tokenSource: 'trait' | 'tier' | 'level' | 'proficiency' | 'roll' | 'fixed';
    tokenSourceValue?: string; // e.g., 'Agility', '1-4', 'Spellcast Roll'
    spendCondition?: string;
    removeCondition?: string;
  };
  /** Whether this card can be placed in vault (temporarily or permanently) */
  vaultPlacement?: {
    canPlace: boolean;
    permanent?: boolean; // If true, can only be used once per campaign
    reason?: string;
  };
}

/** Usage limit for domain card features */
export interface UsageLimit {
  uses: number;
  reset: string; // Flexible string to allow custom reset conditions
  description?: string;
}

// ============================================================================
// EQUIPMENT SYSTEM
// ============================================================================

/** Weapon tiers (flexible number for any tier system) */
export type WeaponTier = number;

/** Armor tiers (flexible number for any tier system) */
export type ArmorTier = number;

/** Standard weapon tiers from core rules */
export const STANDARD_WEAPON_TIERS = [1, 2, 3, 4, 5] as const;

/** Standard armor tiers from core rules */
export const STANDARD_ARMOR_TIERS = [1, 2, 3, 4, 5] as const;

/** Weapon definition */
export interface Weapon {
  name: string;
  tier: WeaponTier;
  damageDie: string; // e.g., "d6+1", "2d4"
  properties: string[];
  isOneHanded: boolean;
  isTwoHanded: boolean;
  description?: string;
}

/** Armor definition */
export interface Armor {
  name: string;
  tier: ArmorTier;
  baseScore: number;
  baseThresholds: {
    minor: number;
    major: number;
  };
  properties: string[];
  description?: string;
}

/** Generic equipment item */
export interface Equipment {
  name: string;
  type: string; // Flexible string to allow custom equipment types
  description: string;
  properties?: string[];
  quantity?: number;
}

// ============================================================================
// EXPERIENCE SYSTEM
// ============================================================================

/** Character experience - skills/backgrounds that provide bonuses */
export interface Experience {
  name: string;
  modifier: number; // Usually +2 at character creation
  description?: string;
}

// ============================================================================
// CHARACTER CONNECTIONS
// ============================================================================

/** Character connection to another PC */
export interface Connection {
  targetCharacterName: string;
  question: string;
  answer: string;
}

// ============================================================================
// MAIN CHARACTER INTERFACE
// ============================================================================

/** Complete Daggerheart character */
export interface DaggerheartCharacter {
  // ===== BASIC INFORMATION =====
  name: string;
  pronouns?: string;
  description?: string;
  level: number; // 1-10

  // ===== HERITAGE =====
  heritage: Heritage;

  // ===== CLASS & SUBCLASS =====
  class: CharacterClass;
  subclass: Subclass;

  // ===== TRAITS =====
  /** Core trait modifiers - flexible to handle any custom trait system */
  traits: Record<string, TraitModifier>;

  // ===== DERIVED STATS =====
  hitPoints: {
    current: number;
    maximum: number;
  };
  evasion: number;
  stress: {
    current: number; // Number of stress marked (0-6)
    maximum: number; // Usually 6
  };
  hope: number; // Current Hope tokens
  proficiency: number; // Usually equal to level

  // ===== DAMAGE THRESHOLDS =====
  damageThresholds: {
    minor: number; // Base threshold + level
    major: number; // Base threshold + level
  };
  armorScore: number;

  // ===== EQUIPMENT =====
  activeWeapon: {
    primary?: Weapon;
    secondary?: Weapon; // For one-handed weapons
  };
  activeArmor: Armor;
  inventory: Equipment[];
  gold: {
    handfuls: number; // Each handful represents a unit of wealth
  };

  // ===== DOMAIN CARDS =====
  /** Active domain cards (max 5) */
  loadout: DomainCard[];
  /** Inactive domain cards */
  vault: DomainCard[];

  // ===== EXPERIENCES =====
  experiences: Experience[];

  // ===== BACKGROUND =====
  background?: {
    description: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };

  // ===== CONNECTIONS =====
  connections: Connection[];

  // ===== OPTIONAL FEATURES =====
  /** For Rangers and other classes with companions */
  companion?: Companion;

  // ===== NOTES =====
  notes?: string;
  characterDescription?: string;
}

// ============================================================================
// COMPANION SYSTEM (for Rangers, etc.)
// ============================================================================

/** Animal companion or similar */
export interface Companion {
  name: string;
  type: string; // e.g., "Wolf", "Eagle", "Bear"
  description?: string;
  evasion: number;
  experiences: Experience[];
  attack: {
    name: string;
    damageDie: string;
    description: string;
  };
  notes?: string;
}

// ============================================================================
// CHARACTER CREATION HELPERS
// ============================================================================

/** Helper interface for character creation process */
export interface CharacterCreationData {
  // Step 1: Class selection
  selectedClass?: string;
  selectedSubclass?: string;

  // Step 2: Heritage selection
  selectedAncestry?: string;
  selectedCommunity?: string;
  isMixedAncestry?: boolean;

  // Step 3: Trait assignment (flexible for any trait system)
  traitAssignments?: Record<string, TraitModifier>;

  // Step 5: Equipment selection
  selectedPrimaryWeapon?: string;
  selectedSecondaryWeapon?: string;
  selectedArmor?: string;
  selectedClassItem?: string;
  selectedPotion?: string; // Flexible string for any potion type

  // Step 6: Background
  backgroundAnswers?: Array<{
    question: string;
    answer: string;
  }>;

  // Step 7: Experiences
  selectedExperiences?: Array<{
    name: string;
    modifier: number;
  }>;

  // Step 8: Domain cards
  selectedDomainCards?: string[];

  // Step 9: Connections
  connections?: Connection[];
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/** Validation result for character creation */
export interface CharacterValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// EXPORT UTILITY TYPES & STARTER CONFIGURATIONS
// ============================================================================

/** Standard class-domain combinations from the core rules */
export const STANDARD_CLASS_DOMAINS = {
  'Bard': ['Codex', 'Grace'],
  'Druid': ['Arcana', 'Sage'],
  'Guardian': ['Blade', 'Valor'],
  'Ranger': ['Bone', 'Sage'],
  'Rogue': ['Grace', 'Midnight'],
  'Seraph': ['Splendor', 'Valor'],
  'Sorcerer': ['Arcana', 'Midnight'],
  'Warrior': ['Blade', 'Bone'],
  'Wizard': ['Codex', 'Splendor']
} as const;

/** Starting values for new characters */
export const CHARACTER_DEFAULTS = {
  level: 1,
  startingStressSlots: 6,
  startingHope: 2,
  maxLoadoutSize: 5,
  startingProficiency: 1,
  startingExperienceModifier: 2,
  numberOfStartingExperiences: 2,
  numberOfStartingDomainCards: 2
} as const;

// ============================================================================
// HOMEBREW DESIGN GUIDELINES (from Homebrew Kit)
// ============================================================================

/** Recall cost guidelines from the Homebrew Kit */
export const RECALL_COST_GUIDELINES = {
  BASIC: { cost: 0, description: 'Cards intended to be easily usable' },
  MODERATE: { cost: 1, description: 'Standard utility cards' },
  POWERFUL: { cost: 2, description: 'More specific or powerful cards' },
  HIGH_LEVEL: { cost: 3, description: 'Most powerful, higher-level cards' },
  EXCEPTIONAL: { cost: 4, description: 'Exceptional power or complexity' }
} as const;

/** Top Feature types from Homebrew Kit design guidance */
export const TOP_FEATURE_TYPES = [
  'experience_bonus',      // Bonuses to experience (clank's "Purposeful Design")
  'movement',             // Special movement or terrain navigation
  'reaction_bonus',       // Bonuses on reaction rolls
  'roll_manipulation',    // Manipulating rolls or roll results
  'communication',        // Communication or connection to others
  'hp_stress_bonus',      // Additional HP or Stress slots
  'hope_generation',      // Gaining Hope
  'damage_mitigation'     // Damage mitigation and healing
] as const;

/** Bottom Feature types from Homebrew Kit design guidance */
export const BOTTOM_FEATURE_TYPES = [
  'downtime_benefit',     // Downtime move benefits
  'innate_attack',        // Innate attack capabilities
  'specialty_defense',    // Specialty defenses
  'evasion_manipulation', // Evasion manipulation
  'flight',              // Flight capability
  'stress_management',    // Stress management
  'information_gathering', // Information gathering
  'rerolls',             // Re-rolls
  'social_bonus'         // Social bonuses
] as const;

/** Community feature types from Homebrew Kit */
export const COMMUNITY_FEATURE_TYPES = [
  'skill_advantage',      // Advantage on certain actions or situations
  'world_interaction',    // Particular way of interacting with the world
  'cultural_knowledge'    // Cultural practices and collective knowledge
] as const;

/** Domain card scaling options from Homebrew Kit */
export const SCALING_MECHANICS = {
  SMALL: { source: 'tier', range: '1-4', description: 'Small scale for powerful features' },
  MEDIUM: { source: 'trait_or_proficiency', range: '1-6', description: 'Medium range scaling' },
  LARGE: { source: 'level', range: '1-10', description: 'Full level range scaling' }
} as const;
