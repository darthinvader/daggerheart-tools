import type { ConditionsState } from '@/components/conditions';
import type { CharacterRecord } from '@/lib/api/characters';
import {
  buildEngineInput,
  calculateCharacterStats,
  getStatTotals,
} from '@/lib/character-stats-engine';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Environment } from '@/lib/schemas/environments';

import type {
  AdversaryTracker,
  BattleCard,
  CharacterTracker,
  EnvironmentFeatureEntry,
  EnvironmentTracker,
  NewCharacterDraft,
  TrackerSelection,
} from './types';

export const EMPTY_CONDITIONS: ConditionsState = { items: [] };

export const DEFAULT_CHARACTER_DRAFT: NewCharacterDraft = {
  name: '',
  evasion: '10',
  hpMax: '6',
  stressMax: '6',
};

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
  const parts = [thresholds.major, thresholds.severe, thresholds.massive]
    .filter(value => value !== null && value !== undefined)
    .map(value => String(value));
  return parts.join('/') || '—';
}

export function normalizeEnvironmentFeature(
  feature: Environment['features'][number],
  index: number
): EnvironmentFeatureEntry {
  if (typeof feature === 'string') {
    const [rawName, ...rest] = feature.split(' - ');
    const name = rest.length > 0 ? rawName.trim() : `Feature ${index + 1}`;
    const description = rest.length > 0 ? rest.join(' - ') : feature;
    return {
      id: `feature-${index}-${rawName}`,
      name,
      description,
      active: false,
    };
  }
  return {
    id: `feature-${index}-${feature.name}`,
    name: feature.name,
    description: feature.description,
    type: feature.type,
    active: false,
  };
}

export function toNumber(
  value: string,
  fallback: number,
  options?: { max?: number }
): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  if (options?.max !== undefined) return Math.min(parsed, options.max);
  return parsed;
}

export function getSpotlightLabel(
  spotlight: TrackerSelection,
  characters: CharacterTracker[],
  adversaries: AdversaryTracker[],
  environments: EnvironmentTracker[]
): string {
  if (spotlight.kind === 'character') {
    return characters.find(entry => entry.id === spotlight.id)?.name ?? '—';
  }
  if (spotlight.kind === 'adversary') {
    return (
      adversaries.find(entry => entry.id === spotlight.id)?.source.name ?? '—'
    );
  }
  return (
    environments.find(entry => entry.id === spotlight.id)?.source.name ?? '—'
  );
}

/**
 * Convert a CharacterRecord to a CharacterTracker with computed stats.
 * Uses the character-stats-engine to calculate HP, Evasion, Stress, etc.
 */
export function characterRecordToTracker(
  character: CharacterRecord
): CharacterTracker {
  // Build input for stats engine
  const classSelection = {
    className: character.classDraft?.className ?? null,
    isHomebrew: character.classDraft?.mode === 'homebrew',
    homebrewClass: character.classDraft?.homebrewClass,
  };

  const progression = {
    currentLevel: character.progression?.currentLevel ?? 1,
    tier:
      character.progression?.currentLevel <= 2
        ? 1
        : character.progression?.currentLevel <= 4
          ? 2
          : character.progression?.currentLevel <= 7
            ? 3
            : 4,
  };

  // Calculate stats using the engine (pass null for equipment and traits to avoid type issues)
  // We primarily use resources for actual values anyway
  const input = buildEngineInput(classSelection, null, progression, null);
  const stats = calculateCharacterStats(input);
  const totals = getStatTotals(stats);

  // Get HP and stress from resources if available (allows for overrides)
  const resources = character.resources;
  const hpMax = resources?.hp?.max ?? totals.hp;
  const hpCurrent = resources?.hp?.current ?? hpMax;
  const stressMax = resources?.stress?.max ?? 6;
  const stressCurrent = resources?.stress?.current ?? 0;

  // Get evasion from resources or calculate
  const evasion = resources?.evasion ?? totals.evasion;

  // Get armor score and slots
  const armorScore = resources?.armorScore?.max ?? totals.armorScore;
  const armorSlotsCurrent = resources?.armorScore?.current ?? armorScore;

  // Get hope
  const hopeMax = resources?.hope?.max ?? 6;
  const hopeCurrent = resources?.hope?.current ?? 0;

  // Get gold - convert gold object to total coins for display
  const goldObj = resources?.gold;
  const gold = goldObj
    ? (goldObj.coins ?? 0) +
      (goldObj.handfuls ?? 0) * 10 +
      (goldObj.bags ?? 0) * 100 +
      (goldObj.chests ?? 0) * 1000
    : 0;

  // Convert loadout cards to BattleCards
  const loadout: BattleCard[] = (character.domains?.loadout ?? []).map(
    card => ({
      name: card.name,
      level: card.level,
      domain: card.domain,
      type: card.type,
      description: card.description,
      hopeCost: card.hopeCost,
      recallCost: card.recallCost,
      stressCost: card.stressCost,
    })
  );

  // Convert conditions from array of objects to ConditionsState
  const conditionItems = Array.isArray(character.conditions)
    ? character.conditions.map(c => c.name)
    : [];
  const conditions: ConditionsState = { items: conditionItems };

  // Get equipment names (API uses primaryWeapon/secondaryWeapon, not primary/secondary)
  const primaryWeapon = character.equipment?.primaryWeapon?.name ?? undefined;
  const secondaryWeapon =
    character.equipment?.secondaryWeapon?.name ?? undefined;
  const armor = character.equipment?.armor?.name ?? undefined;

  // Get experiences
  const experiences = character.experiences?.items ?? [];

  return {
    id: crypto.randomUUID(),
    kind: 'character',
    name: character.identity?.name || 'Unnamed Character',
    evasion,
    hp: { current: hpCurrent, max: hpMax },
    stress: { current: stressCurrent, max: stressMax },
    conditions,
    notes: '',
    sourceCharacterId: character.id,
    className: character.classDraft?.className ?? undefined,
    subclassName: character.classDraft?.subclassName ?? undefined,
    loadout,
    armorScore,
    thresholds: {
      major: totals.thresholdsMajor,
      severe: totals.thresholdsSevere,
      massive: totals.thresholdsSevere * 2, // Massive = 2× Severe
    },
    // Mark as linked - stats are read-only, synced from player
    isLinkedCharacter: true,

    // Extended identity
    ancestry: character.identity?.ancestry ?? undefined,
    community: character.identity?.community ?? undefined,
    pronouns: character.identity?.pronouns ?? undefined,

    // Progression
    level: progression.currentLevel,
    tier: progression.tier,
    proficiency: totals.proficiency,

    // Resources
    hope: { current: hopeCurrent, max: hopeMax },
    armorSlots: { current: armorSlotsCurrent, max: armorScore },
    gold,

    // Experiences
    experiences,

    // Equipment summary
    primaryWeapon,
    secondaryWeapon,
    armor,

    // Equipment details (for full display)
    equipment: {
      primary: character.equipment?.primaryWeapon
        ? {
            name: character.equipment.primaryWeapon.name,
            damage: formatWeaponDamage(
              character.equipment.primaryWeapon.damage
            ),
            range: character.equipment.primaryWeapon.range ?? '',
            traits: character.equipment.primaryWeapon.trait
              ? [character.equipment.primaryWeapon.trait]
              : [],
          }
        : undefined,
      secondary: character.equipment?.secondaryWeapon
        ? {
            name: character.equipment.secondaryWeapon.name,
            damage: formatWeaponDamage(
              character.equipment.secondaryWeapon.damage
            ),
            range: character.equipment.secondaryWeapon.range,
            traits: character.equipment.secondaryWeapon.trait
              ? [character.equipment.secondaryWeapon.trait]
              : [],
          }
        : undefined,
      armor: character.equipment?.armor
        ? {
            name: character.equipment.armor.name,
            feature: character.equipment.armor.features?.[0]?.description,
            thresholds: character.equipment.armor.baseThresholds
              ? {
                  major: character.equipment.armor.baseThresholds.major ?? 0,
                  severe: character.equipment.armor.baseThresholds.severe ?? 0,
                }
              : undefined,
          }
        : undefined,
    },

    // Core scores from traits
    coreScores: {
      agility: character.traits?.Agility?.value,
      strength: character.traits?.Strength?.value,
      finesse: character.traits?.Finesse?.value,
      instinct: character.traits?.Instinct?.value,
      presence: character.traits?.Presence?.value,
      knowledge: character.traits?.Knowledge?.value,
    },

    // Traits (full object for marked/bonus display)
    traits: character.traits,

    // Inventory items (API uses 'slots' for inventory items)
    inventory: (character.inventory?.slots ?? [])
      .filter(slot => slot.item?.name)
      .map(slot => ({
        name: slot.item?.name ?? 'Unknown Item',
        quantity: slot.quantity ?? 1,
        tier: slot.item?.tier,
      })),

    // Vault cards
    vaultCards: (character.domains?.vault ?? []).map(card => ({
      name: card.name,
      level: card.level,
      domain: card.domain,
      type: card.type,
      description: card.description,
      hopeCost: card.hopeCost,
      recallCost: card.recallCost,
      stressCost: card.stressCost,
    })),
  };
}
