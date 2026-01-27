import type { ConditionsState } from '@/components/conditions';
import type { CharacterRecord } from '@/lib/api/characters';
import {
  buildEngineInput,
  calculateCharacterStats,
  getStatTotals,
  getTierFromLevel,
} from '@/lib/character-stats-engine';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { BattleEnvironmentFeature } from '@/lib/schemas/battle';
import type { EnvironmentFeature } from '@/lib/schemas/environments';

import type {
  AdversaryTracker,
  BattleCard,
  CharacterTracker,
  EnvironmentTracker,
  NewCharacterDraft,
  TrackerSelection,
} from './types';
import {
  buildConditions,
  buildResourceSnapshot,
  type ResourceSnapshot,
} from './utils.character';

export const EMPTY_CONDITIONS: ConditionsState = { items: [] };

export const DEFAULT_CHARACTER_DRAFT: NewCharacterDraft = {
  name: '',
  evasion: '10',
  hpMax: '6',
  stressMax: '6',
};

export function toNumber(
  value: string | number,
  fallback: number,
  options?: { min?: number; max?: number }
) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) return fallback;
  let next = parsed;
  if (options?.min !== undefined) {
    next = Math.max(options.min, next);
  }
  if (options?.max !== undefined) {
    next = Math.min(options.max, next);
  }
  return next;
}

export function normalizeEnvironmentFeature(
  feature: string | EnvironmentFeature,
  index: number
): BattleEnvironmentFeature {
  const id = `feature-${index}`;
  if (typeof feature === 'string') {
    // Parse feature string format: "Feature Name - Type: Description"
    // or "Feature Name - Description"
    const dashMatch = feature.match(/^([^-]+)\s*-\s*(.*)$/);
    if (dashMatch) {
      const name = dashMatch[1].trim();
      const rest = dashMatch[2].trim();
      // Check if the rest starts with a type like "Passive:", "Action:", "Reaction:"
      const typeMatch = rest.match(/^(Passive|Action|Reaction):\s*(.*)$/i);
      if (typeMatch) {
        return {
          id,
          name,
          description: typeMatch[2].trim(),
          type: typeMatch[1],
          active: false,
        };
      }
      return {
        id,
        name,
        description: rest,
        active: false,
      };
    }
    // Fallback: use the whole string as both name and description
    return {
      id,
      name: feature,
      description: feature,
      active: false,
    };
  }

  return {
    id,
    name: feature.name,
    description: feature.description,
    type: feature.type,
    active: false,
  };
}

export function getSpotlightLabel(
  selection: TrackerSelection,
  characters: CharacterTracker[],
  adversaries: AdversaryTracker[],
  environments: EnvironmentTracker[]
) {
  if (selection.kind === 'character') {
    return (
      characters.find(item => item.id === selection.id)?.name ??
      'Unknown Character'
    );
  }
  if (selection.kind === 'adversary') {
    return (
      adversaries.find(item => item.id === selection.id)?.source.name ??
      'Unknown Adversary'
    );
  }
  return (
    environments.find(item => item.id === selection.id)?.source.name ??
    'Unknown Environment'
  );
}

/** Format weapon damage object to display string */
export function formatWeaponDamage(damage?: {
  count?: number;
  diceType?: number;
  modifier?: number;
  type?: string;
}): string {
  if (!damage || !damage.diceType) return '';
  const base = `${damage.count ?? 1}d${damage.diceType}`;
  const mod = damage.modifier
    ? damage.modifier > 0
      ? `+${damage.modifier}`
      : String(damage.modifier)
    : '';
  const typeLabel = damage.type === 'mag' ? 'Magic' : 'Phy';
  return `${base}${mod} ${typeLabel}`;
}

export function formatAttack(attack: Adversary['attack']) {
  return `${attack.modifier} · ${attack.range} · ${attack.damage}`;
}

export function formatThresholds(thresholds: Adversary['thresholds']) {
  if (typeof thresholds === 'string') return thresholds;
  const major = thresholds.major ?? '—';
  const severe = thresholds.severe ?? '—';
  const massive =
    typeof thresholds.massive === 'number'
      ? thresholds.massive
      : typeof thresholds.severe === 'number'
        ? thresholds.severe * 2
        : '—';
  return `${major}/${severe}/${massive}`;
}

// Helper: Convert domain cards to BattleCards
function convertToBattleCards(
  cards:
    | CharacterRecord['domains']['loadout']
    | CharacterRecord['domains']['vault']
): BattleCard[] {
  return (cards ?? []).map(card => ({
    name: card.name,
    level: card.level,
    domain: card.domain,
    type: card.type,
    description: card.description,
    hopeCost: card.hopeCost,
    recallCost: card.recallCost,
    stressCost: card.stressCost,
  }));
}

// Helper: Convert weapon to equipment detail
function convertWeapon(weapon?: CharacterRecord['equipment']['primaryWeapon']) {
  if (!weapon) return undefined;
  return {
    name: weapon.name,
    damage: formatWeaponDamage(weapon.damage),
    range: weapon.range ?? '',
    traits: weapon.trait ? [weapon.trait] : [],
    features: weapon.features?.map(f => f.description).filter(Boolean) ?? [],
  };
}

// Helper: Convert armor to equipment detail
function convertArmor(armor?: CharacterRecord['equipment']['armor']) {
  if (!armor) return undefined;
  const allFeatures =
    armor.features?.map(f => f.description).filter(Boolean) ?? [];
  return {
    name: armor.name,
    feature: allFeatures[0],
    features: allFeatures,
    thresholds: armor.baseThresholds
      ? {
          major: armor.baseThresholds.major ?? 0,
          severe: armor.baseThresholds.severe ?? 0,
        }
      : undefined,
  };
}

// Helper: Extract core scores from traits
function extractCoreScores(traits?: CharacterRecord['traits']) {
  return {
    agility: traits?.Agility?.value,
    strength: traits?.Strength?.value,
    finesse: traits?.Finesse?.value,
    instinct: traits?.Instinct?.value,
    presence: traits?.Presence?.value,
    knowledge: traits?.Knowledge?.value,
  };
}

// Helper: Convert inventory slots to simple items
function convertInventory(slots?: CharacterRecord['inventory']['slots']) {
  return (slots ?? [])
    .filter(slot => slot.item?.name)
    .map(slot => ({
      name: slot.item?.name ?? 'Unknown Item',
      quantity: slot.quantity ?? 1,
      tier: slot.item?.tier,
      description: slot.item?.description,
      category: slot.item?.category,
      features: slot.item?.features,
    }));
}

function buildThresholds(totals: ReturnType<typeof getStatTotals>) {
  return {
    major: totals.thresholdsMajor,
    severe: totals.thresholdsSevere,
    massive: totals.thresholdsSevere * 2,
  };
}

function buildEquipmentSummary(character: CharacterRecord) {
  return {
    primaryWeapon: character.equipment?.primaryWeapon?.name ?? undefined,
    secondaryWeapon: character.equipment?.secondaryWeapon?.name ?? undefined,
    armor: character.equipment?.armor?.name ?? undefined,
    equipment: {
      primary: convertWeapon(character.equipment?.primaryWeapon),
      secondary: convertWeapon(character.equipment?.secondaryWeapon),
      armor: convertArmor(character.equipment?.armor),
    },
  };
}

function buildIdentityInfo(character: CharacterRecord) {
  return {
    name: character.identity?.name || 'Unnamed Character',
    ancestry: character.identity?.ancestry ?? undefined,
    community: character.identity?.community ?? undefined,
    pronouns: character.identity?.pronouns ?? undefined,
  };
}

function buildClassInfo(character: CharacterRecord) {
  return {
    className: character.classDraft?.className ?? undefined,
    subclassName: character.classDraft?.subclassName ?? undefined,
  };
}

function buildLoadoutCards(character: CharacterRecord) {
  return convertToBattleCards(character.domains?.loadout);
}

function buildVaultCards(character: CharacterRecord) {
  return convertToBattleCards(character.domains?.vault);
}

function buildClassSelection(character: CharacterRecord) {
  const className = character.classDraft?.className ?? null;
  if (!className) return null;
  const isHomebrew = character.classDraft?.mode === 'homebrew';
  return {
    className,
    isHomebrew,
    homebrewClass: character.classDraft?.homebrewClass,
  };
}

function buildProgression(character: CharacterRecord) {
  const currentLevel = character.progression?.currentLevel ?? 1;
  return {
    currentLevel,
    tier: getTierFromLevel(currentLevel),
  };
}

function buildTrackerBase({
  character,
  identity,
  classInfo,
  loadout,
  vaultCards,
  progression,
  totals,
  resourceSnapshot,
  conditions,
  equipmentSummary,
}: {
  character: CharacterRecord;
  identity: ReturnType<typeof buildIdentityInfo>;
  classInfo: ReturnType<typeof buildClassInfo>;
  loadout: ReturnType<typeof buildLoadoutCards>;
  vaultCards: ReturnType<typeof buildVaultCards>;
  progression: ReturnType<typeof buildProgression>;
  totals: ReturnType<typeof getStatTotals>;
  resourceSnapshot: ResourceSnapshot;
  conditions: ConditionsState;
  equipmentSummary: ReturnType<typeof buildEquipmentSummary>;
}): CharacterTracker {
  return {
    id: crypto.randomUUID(),
    kind: 'character',
    name: identity.name,
    evasion: resourceSnapshot.evasion,
    hp: { current: resourceSnapshot.hpCurrent, max: resourceSnapshot.hpMax },
    stress: {
      current: resourceSnapshot.stressCurrent,
      max: resourceSnapshot.stressMax,
    },
    conditions,
    notes: '',
    sourceCharacterId: character.id,
    className: classInfo.className,
    subclassName: classInfo.subclassName,
    loadout,
    armorScore: resourceSnapshot.armorScore,
    thresholds: buildThresholds(totals),
    isLinkedCharacter: true,
    ancestry: identity.ancestry,
    community: identity.community,
    pronouns: identity.pronouns,
    level: progression.currentLevel,
    tier: progression.tier,
    proficiency: totals.proficiency,
    hope: {
      current: resourceSnapshot.hopeCurrent,
      max: resourceSnapshot.hopeMax,
    },
    armorSlots: {
      current: resourceSnapshot.armorSlotsCurrent,
      max: resourceSnapshot.armorScore,
    },
    gold: resourceSnapshot.gold,
    experiences: character.experiences?.items ?? [],
    primaryWeapon: equipmentSummary.primaryWeapon,
    secondaryWeapon: equipmentSummary.secondaryWeapon,
    armor: equipmentSummary.armor,
    equipment: equipmentSummary.equipment,
    coreScores: extractCoreScores(character.traits),
    traits: character.traits,
    inventory: convertInventory(character.inventory?.slots),
    vaultCards,
  };
}

/**
 * Convert a CharacterRecord to a CharacterTracker with computed stats.
 * Uses the character-stats-engine to calculate HP, Evasion, Stress, etc.
 */
export function characterRecordToTracker(
  character: CharacterRecord
): CharacterTracker {
  const classSelection = buildClassSelection(character);
  const progression = buildProgression(character);

  // Calculate stats using the engine
  const input = buildEngineInput(classSelection, null, progression, null);
  const stats = calculateCharacterStats(input);
  const totals = getStatTotals(stats);
  const resourceSnapshot = buildResourceSnapshot(character, totals);
  const conditions = buildConditions(character);
  const equipmentSummary = buildEquipmentSummary(character);
  const identity = buildIdentityInfo(character);
  const classInfo = buildClassInfo(character);
  const loadout = buildLoadoutCards(character);
  const vaultCards = buildVaultCards(character);
  return buildTrackerBase({
    character,
    identity,
    classInfo,
    loadout,
    vaultCards,
    progression,
    totals,
    resourceSnapshot,
    conditions,
    equipmentSummary,
  });
}
