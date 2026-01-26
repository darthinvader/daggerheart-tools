import type { AdversaryFeatureOverride, AdversaryTracker } from './types';

export type AdversaryAttackState = {
  name: string;
  modifier: string;
  range: string;
  damage: string;
};

export type AdversaryThresholdState = {
  major: number;
  severe: number;
  massive: number | null;
};

export type AdversaryThresholdsObject = Exclude<
  AdversaryTracker['source']['thresholds'],
  string
>;

const EMPTY_ATTACK_STATE: AdversaryAttackState = {
  name: '',
  modifier: '',
  range: '',
  damage: '',
};

function resolveOverride<T>(overrideValue: T | undefined, baseValue: T): T {
  return overrideValue ?? baseValue;
}

export function getSourceThresholds(
  adversary: AdversaryTracker | null
): AdversaryThresholdsObject | null {
  if (!adversary || typeof adversary.source.thresholds === 'string') {
    return null;
  }
  return adversary.source.thresholds;
}

export function getThresholdState(
  adversary: AdversaryTracker | null
): AdversaryThresholdState {
  const base = adversary?.thresholdsOverride ?? getSourceThresholds(adversary);
  return {
    major: base?.major ?? 0,
    severe: base?.severe ?? 0,
    massive: base?.massive ?? null,
  };
}

export function mapAdversaryFeatures(
  features: AdversaryTracker['source']['features']
): AdversaryFeatureOverride[] {
  return features.map((feature, index) => ({
    id: `feature-${index}`,
    name:
      typeof feature === 'string' ? feature.split(':')[0].trim() : feature.name,
    type: typeof feature === 'string' ? undefined : feature.type,
    description: typeof feature === 'string' ? feature : feature.description,
    isCustom: false,
  }));
}

export function getFeaturesState(
  adversary: AdversaryTracker | null
): AdversaryFeatureOverride[] {
  if (!adversary) return [];
  return (
    adversary.featuresOverride ??
    mapAdversaryFeatures(adversary.source.features)
  );
}

export function getAttackState(
  adversary: AdversaryTracker | null
): AdversaryAttackState {
  if (!adversary) return EMPTY_ATTACK_STATE;
  const baseAttack = adversary.source.attack;
  const override = adversary.attackOverride;
  return {
    name: resolveOverride(override?.name, baseAttack.name),
    modifier: String(resolveOverride(override?.modifier, baseAttack.modifier)),
    range: resolveOverride(override?.range, baseAttack.range),
    damage: resolveOverride(override?.damage, baseAttack.damage),
  };
}

export function getSourceAttackState(
  adversary: AdversaryTracker
): AdversaryAttackState {
  return {
    name: adversary.source.attack.name,
    modifier: String(adversary.source.attack.modifier),
    range: adversary.source.attack.range,
    damage: adversary.source.attack.damage,
  };
}

export function getSourceThresholdState(
  adversary: AdversaryTracker
): AdversaryThresholdState {
  const base = getSourceThresholds(adversary);
  return {
    major: base?.major ?? 0,
    severe: base?.severe ?? 0,
    massive: base?.massive ?? null,
  };
}

export function isAttackModified(
  baseAttack: AdversaryTracker['source']['attack'],
  state: AdversaryAttackState
): boolean {
  return (
    state.name !== baseAttack.name ||
    state.modifier !== String(baseAttack.modifier) ||
    state.range !== baseAttack.range ||
    state.damage !== baseAttack.damage
  );
}

export function isThresholdsModified(
  baseThresholds: AdversaryThresholdsObject,
  state: AdversaryThresholdState
): boolean {
  return (
    state.major !== (baseThresholds.major ?? 0) ||
    state.severe !== (baseThresholds.severe ?? 0) ||
    state.massive !== (baseThresholds.massive ?? null)
  );
}

export function buildAttackOverride(
  baseAttack: AdversaryTracker['source']['attack'],
  state: AdversaryAttackState
): AdversaryTracker['attackOverride'] | undefined {
  if (!isAttackModified(baseAttack, state)) return undefined;
  return {
    name: state.name,
    modifier: state.modifier,
    range: state.range,
    damage: state.damage,
  };
}

export function buildThresholdsOverride(
  baseThresholds: AdversaryThresholdsObject | null,
  state: AdversaryThresholdState
): AdversaryTracker['thresholdsOverride'] | undefined {
  if (!baseThresholds || !isThresholdsModified(baseThresholds, state)) {
    return undefined;
  }
  return {
    major: state.major,
    severe: state.severe,
    massive: state.massive,
  };
}
