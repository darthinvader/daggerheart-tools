import type { ConditionsState } from '@/components/conditions';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Environment } from '@/lib/schemas/environments';

import type {
  AdversaryTracker,
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
