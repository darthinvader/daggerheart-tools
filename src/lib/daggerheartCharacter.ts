/**
 * Enhanced Daggerheart Character Model
 * 
 * This model builds upon external AI analysis, combining excellent SRD accuracy
 * with missing critical mechanics like death moves, advancement, and dynamic state.
 * 
 * Design Philosophy:
 * - SRD-accurate core mechanics
 * - Strong TypeScript safety with flexibility
 * - Extensible for homebrew content
 * - Complete gameplay system representation
 */

///////////////////////////
// Core Game Types       //
///////////////////////////

export type RangeBand =
  | "Melee"
  | "Very Close"
  | "Close"
  | "Far"
  | "Very Far"
  | "Out of Range";

export type DamageType = "phy" | "mag";

export type Tier = 1 | 2 | 3 | 4;
export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type TraitName =
  | "Agility"
  | "Strength"
  | "Finesse"
  | "Instinct"
  | "Presence"
  | "Knowledge";

export type TraitValue = -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;

export type ClassName =
  | "Bard"
  | "Druid"
  | "Guardian"
  | "Ranger"
  | "Rogue"
  | "Seraph"
  | "Sorcerer"
  | "Warrior"
  | "Wizard";

export type SubclassName =
  | "Troubadour"
  | "Wordsmith"
  | "Warden of the Elements"
  | "Warden of Renewal"
  | "Stalwart"
  | "Vengeance"
  | "Beastbound"
  | "Wayfinder"
  | "Nightwalker"
  | "Syndicate"
  | "Divine Wielder"
  | "Winged Sentinel"
  | "Elemental Origin"
  | "Primal Origin"
  | "Call of the Brave"
  | "Call of the Slayer"
  | "School of Knowledge"
  | "School of War";

export type DomainName =
  | "Arcana"
  | "Blade"
  | "Bone"
  | "Codex"
  | "Grace"
  | "Midnight"
  | "Sage"
  | "Splendor"
  | "Valor";

export type AncestryName =
  | "Clank"
  | "Drakona"
  | "Dwarf"
  | "Elf"
  | "Faerie"
  | "Faun"
  | "Firbolg"
  | "Fungril"
  | "Galapa"
  | "Giant"
  | "Goblin"
  | "Halfling"
  | "Human"
  | "Infernis"
  | "Katari"
  | "Orc"
  | "Ribbet"
  | "Simiah"
  | "Mixed";

export type CommunityName =
  | "Highborne"
  | "Loreborne"
  | "Orderborne"
  | "Ridgeborne"
  | "Seaborne"
  | "Slyborne"
  | "Underborne"
  | "Wanderborne"
  | "Wildborne";

///////////////////////////
// Enhanced Game State   //
///////////////////////////

export type ConditionType =
  | "Afraid"
  | "Angry"
  | "Blinded"
  | "Cloaked"
  | "Confused"
  | "Dazed"
  | "Distracted"
  | "Hidden"
  | "Immobilized"
  | "Poisoned"
  | "Restrained"
  | "Stunned"
  | "Vulnerable"
  | "Wounded";

export interface Condition {
  type: ConditionType;
  duration?: "temporary" | "session" | "permanent" | "until_cleared";
  source?: string;
  effect?: string;
  data?: Record<string, unknown>;
}

export type ActionType =
  | "Major Action"
  | "Minor Action"
  | "Reaction"
  | "Free Action";

export interface ActionEconomy {
  majorActionsUsed: number;
  minorActionsUsed: number;
  reactionsUsed: number;
  canAct: boolean;
}

///////////////////////////
// Death & Mortality     //
///////////////////////////

export type DeathMoveType =
  | "Last Words"
  | "Inspiring Sacrifice"
  | "Unfinished Business"
  | "Moment of Clarity"
  | "Final Strike"
  | "Protective Instinct";

export interface DeathMove {
  type: DeathMoveType;
  description: string;
  mechanicalEffect?: string;
  narrativeOutcome?: string;
  affectedCharacters?: string[];
  data?: Record<string, unknown>;
}

export interface MortalityState {
  lastHitPointMarked: boolean;
  deathMoveUsed?: DeathMove;
  dying: boolean;
  stabilized: boolean;
  resurrectionCount: number;
}

///////////////////////////
// Character Advancement //
///////////////////////////

export type AdvancementType =
  | "trait_bonus"
  | "hit_point_slot"
  | "stress_slot"
  | "experience_bonus"
  | "domain_card"
  | "evasion_bonus"
  | "subclass_card"
  | "proficiency_increase"
  | "multiclass";

export interface AdvancementChoice {
  type: AdvancementType;
  description: string;
  taken: boolean;
  level: Level;
  tier: Tier;
  requirements?: string[];
  data?: Record<string, unknown>;
}

export interface MulticlassInfo {
  isMulticlassed: boolean;
  primaryClass: ClassName;
  secondaryClass?: ClassName;
  primarySubclass: SubclassName;
  secondarySubclass?: SubclassName;
  levelsSplit?: { primary: number; secondary: number };
}

///////////////////////////
// Enhanced Equipment    //
///////////////////////////

export type WeaponCategory = "Primary" | "Secondary";
export type WeaponFeatureType =
  | "Reliable" | "Heavy" | "Light" | "Reach" | "Thrown"
  | "Quick" | "Paired" | "Protective" | "Flexible" | "Brutal";

export interface WeaponFeature {
  name: string;
  type: WeaponFeatureType;
  description: string;
  mechanicalEffect?: string;
  trigger?: string;
  cost?: string;
}

export interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  trait: TraitName | "Spellcast";
  range: RangeBand;
  damageDie: string;
  damageType: DamageType;
  burden: "One-Handed" | "Two-Handed";
  features: WeaponFeature[];
  tags?: string[];
  data?: Record<string, unknown>;
}

export interface ArmorFeature {
  name: string;
  description: string;
  mechanicalEffect?: string;
  penalty?: string;
}

export interface Armor {
  id: string;
  name: string;
  baseMajorThreshold: number;
  baseSevereThreshold: number;
  baseArmorScore: number;
  features: ArmorFeature[];
  tags?: string[];
  data?: Record<string, unknown>;
}

export type ConsumableType =
  | "Health Potion" | "Stamina Potion" | "Antidote"
  | "Scroll" | "Bomb" | "Food" | "Other";

export interface Consumable {
  id: string;
  name: string;
  type: ConsumableType;
  effect: string;
  useAction: ActionType;
  quantity: number;
  tags?: string[];
  data?: Record<string, unknown>;
}

///////////////////////////
// Domain Cards Enhanced //
///////////////////////////

export type DomainCardType = "ability" | "spell" | "grimoire";

export interface DomainCardUsage {
  usesPerSession?: number;
  usesPerRest?: number;
  currentUses: number;
  unlimited: boolean;
}

export interface DomainCard {
  id: string;
  level: Level;
  domain: DomainName;
  type: DomainCardType;
  title: string;
  recallCost: number;
  text: string;
  usage?: DomainCardUsage;
  inVault: boolean;
  tags?: string[];
  data?: Record<string, unknown>;
}

export interface Loadout {
  active: string[]; // up to 5 domain card ids
  vault: string[]; // all other acquired domain card ids
}

///////////////////////////
// Resources Enhanced    //
///////////////////////////

export interface HitPoints {
  maxSlots: number;
  marked: number;
  temporaryBonus: number;
}

export interface StressTrack {
  maxSlots: number;
  marked: number;
  temporaryBonus: number;
}

export interface ArmorState {
  majorThreshold: number;
  severeThreshold: number;
  armorScore: number;
  markedSlots: number;
  temporaryBonus: number;
}

export interface HopeState {
  current: number;
  maximum: number;
  sessionGenerated: number;
}

export interface FearState {
  current: number;
  sessionGenerated: number;
  effects: string[];
}

///////////////////////////
// Class Meters Enhanced //
///////////////////////////

export interface RallyState {
  die: "d6" | "d8" | "d10" | "d12";
  distributed: boolean;
  sessionUsed: boolean;
}

export interface UnstoppableState {
  die?: "d4" | "d6";
  value?: number;
  active: boolean;
  generatedThisSession: number;
}

export interface PrayerDiceState {
  dice: number[];
  maxStored: number;
  generatedThisSession: number;
}

export interface SlayerDiceState {
  pool: number[];
  max: number;
  usedThisSession: number;
}

export interface ClassMeters {
  rally?: RallyState;
  unstoppable?: UnstoppableState;
  prayerDice?: PrayerDiceState;
  slayer?: SlayerDiceState;
  data?: Record<string, unknown>;
}

///////////////////////////
// Session & Dynamic State //
///////////////////////////

export interface SessionState {
  sessionNumber: number;
  startDate: Date;
  endDate?: Date;
  restsTaken: number;
  majorMilestones: string[];
  notes?: string;
}

export interface TemporaryEffect {
  id: string;
  name: string;
  description: string;
  duration: "round" | "scene" | "session" | "rest" | "permanent";
  remainingDuration?: number;
  source: string;
  mechanicalEffect?: string;
  tags?: string[];
}

export interface DynamicState {
  currentSession: SessionState;
  conditions: Condition[];
  temporaryEffects: TemporaryEffect[];
  actionEconomy: ActionEconomy;
  lastRollResult?: {
    type: string;
    total: number;
    hopeGenerated: number;
    fearGenerated: number;
    timestamp: Date;
  };
}

///////////////////////////
// Core Character Types  //
///////////////////////////

export type Traits = Record<TraitName, TraitValue>;

export interface Experience {
  id: string;
  name: string;
  modifier: number;
  timesUsed: number;
  notes?: string;
  data?: Record<string, unknown>;
}

export interface FeatureRef {
  name: string;
  text: string;
  tags?: string[];
  data?: Record<string, unknown>;
}

export interface Heritage {
  ancestry: AncestryName;
  ancestryFeatures: FeatureRef[];
  community: CommunityName;
  communityFeature: FeatureRef;
  notes?: string;
  data?: Record<string, unknown>;
}

export interface ClassFeature {
  name: string;
  text: string;
  actionType?: ActionType;
  cost?: string;
  trigger?: string;
}

export interface HopeFeature {
  name: string;
  cost: number;
  text: string;
  timesUsed: number;
}

export interface Subclass {
  name: SubclassName;
  spellcastTrait?: TraitName;
  foundation: FeatureRef;
  specialization?: FeatureRef;
  mastery?: FeatureRef;
}

export interface ClassKit {
  className: ClassName;
  startingEvasion: number;
  startingHP: number;
  classItems: string[];
  classFeature: ClassFeature;
  classHopeFeature: HopeFeature;
  subclasses: Subclass[];
  domains: DomainName[];
}

export interface Gold {
  handfuls: number;
  bags: number;
  chests: number;
}

export interface Equipment {
  activeWeapons: {
    primary?: Weapon | null;
    secondary?: Weapon | null;
  };
  inventoryWeapons: Weapon[];
  activeArmor?: Armor | null;
  inventory: InventoryItem[];
  consumables: Consumable[];
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity?: number;
  description?: string;
  tags?: string[];
  data?: Record<string, unknown>;
}

export interface Background {
  notes?: string;
  questions?: { question: string; answer: string }[];
  bonds?: string[];
  ideals?: string[];
  flaws?: string[];
  secrets?: string[];
}

export interface Connection {
  pcId: string;
  pcName: string;
  description: string;
  strength: "weak" | "moderate" | "strong";
  type: "friendly" | "romantic" | "rival" | "family" | "professional" | "mysterious";
  notes?: string;
}

///////////////////////////
// Main Character Interface //
///////////////////////////

export interface PlayerCharacter {
  // Core Identity
  id: string;
  name: string;
  pronouns?: string;
  description?: string;

  // Core Stats
  level: Level;
  tier: Tier;
  evasion: number;
  proficiency: number;

  // Character Building
  traits: Traits;
  experiences: Experience[];
  domains: {
    deck: Record<string, DomainCard>;
    loadout: Loadout;
  };

  // Heritage & Class
  heritage: Heritage;
  classKit: ClassKit;
  subclass: Subclass;
  multiclass?: MulticlassInfo;

  // Resources
  resources: {
    hp: HitPoints;
    stress: StressTrack;
    armor: ArmorState;
    hope: HopeState;
    fear?: FearState;
    classMeters?: ClassMeters;
    gold?: Gold;
  };

  // Equipment
  equipment: Equipment;

  // Narrative
  background?: Background;
  connections?: Connection[];

  // Advancement
  advancement: {
    availableChoices: AdvancementChoice[];
    choicesMade: AdvancementChoice[];
    experiencePoints?: number;
    milestones: string[];
  };

  // Mortality
  mortality: MortalityState;

  // Dynamic State
  dynamicState: DynamicState;

  // Extensibility
  tags?: string[];
  data?: Record<string, unknown>;
}

///////////////////////////
// Default Values        //
///////////////////////////

export const DEFAULT_TRAIT_DISTRIBUTION = [2, 1, 1, 0, 0, -1] as const;

export const DEFAULT_TRAITS: Traits = {
  Agility: 0,
  Strength: 0,
  Finesse: 0,
  Instinct: 0,
  Presence: 0,
  Knowledge: 0,
} as const;

export const DEFAULT_HIT_POINTS: HitPoints = {
  maxSlots: 0,
  marked: 0,
  temporaryBonus: 0,
} as const;

export const DEFAULT_STRESS: StressTrack = {
  maxSlots: 6,
  marked: 0,
  temporaryBonus: 0,
} as const;

export const DEFAULT_ARMOR_STATE: ArmorState = {
  majorThreshold: 0,
  severeThreshold: 0,
  armorScore: 0,
  markedSlots: 0,
  temporaryBonus: 0,
} as const;

export const DEFAULT_HOPE_STATE: HopeState = {
  current: 2,
  maximum: 6,
  sessionGenerated: 0,
} as const;

export const DEFAULT_FEAR_STATE: FearState = {
  current: 0,
  sessionGenerated: 0,
  effects: [],
} as const;

export const DEFAULT_MORTALITY_STATE: MortalityState = {
  lastHitPointMarked: false,
  dying: false,
  stabilized: false,
  resurrectionCount: 0,
} as const;

export const DEFAULT_ACTION_ECONOMY: ActionEconomy = {
  majorActionsUsed: 0,
  minorActionsUsed: 0,
  reactionsUsed: 0,
  canAct: true,
} as const;

///////////////////////////
// Builder Functions     //
///////////////////////////

export function deriveTier(level: Level): Tier {
  if (level === 1) return 1;
  if (level <= 4) return 2;
  if (level <= 7) return 3;
  return 4;
}

export function calculateEvasion(
  character: PlayerCharacter,
  includeTemporary: boolean = true
): number {
  let evasion = character.evasion;

  if (character.equipment.activeArmor?.features) {
    // Apply armor evasion modifiers
    character.equipment.activeArmor.features.forEach(feature => {
      if (feature.name.includes("Flexible")) evasion += 1;
      if (feature.name.includes("Heavy")) evasion -= 1;
    });
  }

  if (includeTemporary && character.dynamicState.temporaryEffects) {
    // Apply temporary evasion bonuses
    character.dynamicState.temporaryEffects.forEach(effect => {
      if (effect.mechanicalEffect?.includes("evasion")) {
        // Parse evasion bonus from effect
        const match = effect.mechanicalEffect.match(/([+-]\d+) evasion/i);
        if (match) evasion += parseInt(match[1]);
      }
    });
  }

  return evasion;
}

export function canUseDeathMove(character: PlayerCharacter): boolean {
  return character.mortality.lastHitPointMarked &&
    !character.mortality.deathMoveUsed &&
    !character.mortality.dying;
}

export function hasAdvancementChoice(
  character: PlayerCharacter,
  level: Level
): boolean {
  return character.advancement.availableChoices.some(
    choice => choice.level === level && !choice.taken
  );
}

export function getDomainCardsInLoadout(character: PlayerCharacter): DomainCard[] {
  return character.domains.loadout.active
    .map(id => character.domains.deck[id])
    .filter(Boolean);
}

export function canRecallCard(
  character: PlayerCharacter,
  cardId: string
): boolean {
  const card = character.domains.deck[cardId];
  if (!card || !card.inVault) return false;

  return character.resources.stress.marked >= card.recallCost;
}
