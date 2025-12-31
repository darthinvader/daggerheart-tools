import type { AutoCalculateContext, ResourcesState } from './resources-display';

export interface ComputedAutoValues {
  maxHp: number;
  evasion: number;
  armorScore: number;
  thresholdsMajor: number;
  thresholdsSevere: number;
}

/**
 * Compute auto-calculated values from class and armor data.
 * HP = class base HP + (tier - 1) bonus
 * Evasion = class base evasion + armor evasion modifier
 * Armor Score = armor base score
 * Thresholds = armor base thresholds + (level - 1) per threshold
 */
export function computeAutoResources(
  ctx: AutoCalculateContext
): ComputedAutoValues {
  const baseHp = ctx.classHp ?? 6;
  const tierBonus = (ctx.classTier ?? 1) - 1;
  const baseEvasion = ctx.classEvasion ?? 10;
  const armorEvasionMod = ctx.armorEvasionModifier ?? 0;
  const level = ctx.level ?? 1;
  const levelBonus = Math.max(0, level - 1);

  return {
    maxHp: baseHp + tierBonus,
    evasion: baseEvasion + armorEvasionMod,
    armorScore: ctx.armorScore ?? 0,
    thresholdsMajor: (ctx.armorThresholdsMajor ?? 5) + levelBonus,
    thresholdsSevere: (ctx.armorThresholdsSevere ?? 11) + levelBonus,
  };
}

export function updateResourceValue(
  resources: ResourcesState,
  key: keyof ResourcesState,
  current: number,
  max?: number
): ResourcesState {
  const existingResource = resources[key];
  if (!existingResource || typeof existingResource === 'boolean') {
    return resources;
  }
  const newMax = max ?? existingResource.max;
  const clampedCurrent = Math.min(current, newMax);
  return {
    ...resources,
    [key]: { current: clampedCurrent, max: newMax },
  };
}

type AutoToggleField =
  | 'autoCalculateHp'
  | 'autoCalculateEvasion'
  | 'autoCalculateArmorScore'
  | 'autoCalculateThresholds'
  | 'autoCalculateArmor'; // Legacy

export function handleAutoToggleUpdate(
  resources: ResourcesState,
  field: AutoToggleField,
  autoValues: ComputedAutoValues
): ResourcesState {
  const newValue = !resources[field];
  const updates: Partial<ResourcesState> = { [field]: newValue };

  if (newValue) {
    if (field === 'autoCalculateHp') {
      updates.hp = {
        current: Math.min(resources.hp.current, autoValues.maxHp),
        max: autoValues.maxHp,
      };
    } else if (
      field === 'autoCalculateArmorScore' ||
      field === 'autoCalculateArmor'
    ) {
      updates.armorScore = {
        current: autoValues.armorScore,
        max: autoValues.armorScore,
      };
    }
  }

  return { ...resources, ...updates };
}

export function isResourceAutoDisabled(
  key: keyof ResourcesState,
  resources: ResourcesState,
  hasAutoContext: boolean
): boolean {
  if (!hasAutoContext) return false;
  if (key === 'hp' && resources.autoCalculateHp) return true;
  if (
    key === 'armorScore' &&
    (resources.autoCalculateArmorScore || resources.autoCalculateArmor)
  )
    return true;
  return false;
}
