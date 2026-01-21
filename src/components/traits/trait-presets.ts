import type { TraitsState } from './traits-display';

type TraitName = keyof TraitsState;

export type TraitPreset = Record<TraitName, number>;

const TRAIT_PRESETS: Record<string, TraitPreset> = {
  Bard: {
    Agility: 0,
    Strength: -1,
    Finesse: 1,
    Instinct: 0,
    Presence: 2,
    Knowledge: 1,
  },
  Druid: {
    Agility: 0,
    Strength: 0,
    Finesse: -1,
    Instinct: 2,
    Presence: 1,
    Knowledge: 1,
  },
  Guardian: {
    Agility: -1,
    Strength: 2,
    Finesse: 0,
    Instinct: 1,
    Presence: 1,
    Knowledge: 0,
  },
  Ranger: {
    Agility: 2,
    Strength: 0,
    Finesse: 1,
    Instinct: 1,
    Presence: 0,
    Knowledge: -1,
  },
  Rogue: {
    Agility: 1,
    Strength: -1,
    Finesse: 2,
    Instinct: 0,
    Presence: 1,
    Knowledge: 0,
  },
  Seraph: {
    Agility: 0,
    Strength: 1,
    Finesse: -1,
    Instinct: 1,
    Presence: 2,
    Knowledge: 0,
  },
  Sorcerer: {
    Agility: 0,
    Strength: -1,
    Finesse: 0,
    Instinct: 1,
    Presence: 2,
    Knowledge: 1,
  },
  Warrior: {
    Agility: 1,
    Strength: 2,
    Finesse: 0,
    Instinct: 1,
    Presence: 0,
    Knowledge: -1,
  },
  Wizard: {
    Agility: 0,
    Strength: -1,
    Finesse: 0,
    Instinct: 1,
    Presence: 1,
    Knowledge: 2,
  },
};

function normalizeClassName(className?: string): string | null {
  if (!className) return null;
  const primary = className.split('/')[0]?.trim();
  return primary || null;
}

export function getTraitPreset(className?: string): TraitPreset | null {
  const key = normalizeClassName(className);
  if (!key) return null;
  return TRAIT_PRESETS[key] ?? null;
}

export function applyTraitPreset(
  traits: TraitsState,
  preset: TraitPreset
): TraitsState {
  const next = { ...traits };
  (Object.keys(preset) as TraitName[]).forEach(name => {
    next[name] = { ...traits[name], value: preset[name] };
  });
  return next;
}
