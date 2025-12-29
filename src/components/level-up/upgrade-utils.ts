import { getSubclassByName } from '@/lib/data/classes';
import type { ClassSubclassPair } from '@/lib/schemas/class-selection';

import type { UpgradeOption } from './upgrade-option-card';

/**
 * Get available upgrade options for a single class pair based on tier and unlocked features
 */
function getUpgradeOptionsForClass(
  classPair: ClassSubclassPair,
  unlocked: string[],
  targetTier: string
): UpgradeOption[] {
  const subclass = getSubclassByName(
    classPair.className,
    classPair.subclassName
  );
  if (!subclass) return [];

  const options: UpgradeOption[] = [];

  const foundationFeatures = subclass.features.filter(
    f => f.type === 'foundation'
  );
  const specializationFeatures = subclass.features.filter(
    f => f.type === 'specialization'
  );
  const masteryFeatures = subclass.features.filter(f => f.type === 'mastery');

  const hasFoundation = foundationFeatures.length > 0;
  const hasUnlockedSpecialization = specializationFeatures.some(f =>
    unlocked.includes(f.name)
  );
  const hasUnlockedMastery = masteryFeatures.some(f =>
    unlocked.includes(f.name)
  );

  const canUpgradeToSpecialization =
    hasFoundation &&
    !hasUnlockedSpecialization &&
    (targetTier === '5-7' || targetTier === '8-10');

  if (canUpgradeToSpecialization) {
    for (const feature of specializationFeatures) {
      if (!unlocked.includes(feature.name)) {
        options.push({
          className: classPair.className,
          subclassName: classPair.subclassName,
          feature,
          upgradeType: 'specialization',
        });
      }
    }
  }

  const canUpgradeToMastery =
    hasUnlockedSpecialization && !hasUnlockedMastery && targetTier === '8-10';

  if (canUpgradeToMastery) {
    for (const feature of masteryFeatures) {
      if (!unlocked.includes(feature.name)) {
        options.push({
          className: classPair.className,
          subclassName: classPair.subclassName,
          feature,
          upgradeType: 'mastery',
        });
      }
    }
  }

  return options;
}

/**
 * Get all available upgrade options across all classes
 */
export function getAvailableUpgrades(
  classes: ClassSubclassPair[],
  unlockedFeatures: Record<string, string[]>,
  targetTier: string
): UpgradeOption[] {
  return classes.flatMap(classPair => {
    const key = `${classPair.className}:${classPair.subclassName}`;
    const unlocked = unlockedFeatures[key] ?? [];
    return getUpgradeOptionsForClass(classPair, unlocked, targetTier);
  });
}

/**
 * Group upgrade options by class key for display
 */
export function groupUpgradesByClass(
  options: UpgradeOption[]
): Record<string, UpgradeOption[]> {
  const grouped: Record<string, UpgradeOption[]> = {};
  for (const option of options) {
    const key = `${option.className} - ${option.subclassName}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(option);
  }
  return grouped;
}
