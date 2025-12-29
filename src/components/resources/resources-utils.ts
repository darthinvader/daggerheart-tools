import type { AutoCalculateContext, ResourcesState } from './resources-display';

export function computeAutoResources(ctx: AutoCalculateContext) {
  const baseHp = ctx.classHp ?? 6;
  const tierBonus = (ctx.classTier ?? 1) - 1;
  return {
    maxHp: baseHp + tierBonus,
    armorScore: ctx.armorScore ?? 0,
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

export function handleAutoToggleUpdate(
  resources: ResourcesState,
  field: 'autoCalculateHp' | 'autoCalculateArmor',
  autoValues: { maxHp: number; armorScore: number }
): ResourcesState {
  const newValue = !resources[field];
  const updates: Partial<ResourcesState> = { [field]: newValue };

  if (newValue) {
    if (field === 'autoCalculateHp') {
      updates.hp = {
        current: Math.min(resources.hp.current, autoValues.maxHp),
        max: autoValues.maxHp,
      };
    } else if (field === 'autoCalculateArmor') {
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
  if (key === 'armorScore' && resources.autoCalculateArmor) return true;
  return false;
}
