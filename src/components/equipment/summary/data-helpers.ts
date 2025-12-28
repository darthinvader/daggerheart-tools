import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
  StandardArmor,
} from '@/lib/schemas/equipment';

export function formatDamage(damage?: {
  count: number;
  diceType: number;
  modifier: number;
  type: string;
}) {
  if (!damage) return null;
  const base = `${damage.count}d${damage.diceType}`;
  const mod =
    damage.modifier > 0
      ? `+${damage.modifier}`
      : damage.modifier < 0
        ? String(damage.modifier)
        : '';
  const typeEmoji = damage.type === 'mag' ? '✨' : '⚔️';
  return `${typeEmoji} ${base}${mod} ${damage.type === 'mag' ? 'Magic' : 'Physical'}`;
}

export function getWeaponData(
  mode: 'standard' | 'homebrew',
  standard: PrimaryWeapon | SecondaryWeapon | null,
  homebrew: Partial<PrimaryWeapon | SecondaryWeapon>
) {
  if (mode === 'homebrew') {
    return {
      name: homebrew.name || 'Unnamed Homebrew',
      damage: formatDamage(homebrew.damage),
      range: homebrew.range,
      trait: homebrew.trait,
      burden: homebrew.burden,
      features: homebrew.features ?? [],
      tier: homebrew.tier,
      description: homebrew.description,
      isEmpty: false,
    };
  }
  if (standard) {
    return {
      name: standard.name,
      damage: formatDamage(standard.damage),
      range: standard.range,
      trait: standard.trait,
      burden: standard.burden,
      features: standard.features,
      tier: standard.tier,
      description: standard.description,
      isEmpty: false,
    };
  }
  return { name: 'None equipped', isEmpty: true };
}

export function getArmorData(
  mode: 'standard' | 'homebrew',
  armor: StandardArmor | null,
  homebrew: Partial<StandardArmor>
) {
  if (mode === 'homebrew') {
    return {
      name: homebrew.name || 'Unnamed Homebrew',
      baseScore: homebrew.baseScore,
      major: homebrew.baseThresholds?.major,
      severe: homebrew.baseThresholds?.severe,
      evasionMod: homebrew.evasionModifier,
      agilityMod: homebrew.agilityModifier,
      armorType: homebrew.armorType,
      features: homebrew.features ?? [],
      tier: homebrew.tier,
      description: homebrew.description,
      isEmpty: false,
    };
  }
  if (armor) {
    return {
      name: armor.name,
      baseScore: armor.baseScore,
      major: armor.baseThresholds.major,
      severe: armor.baseThresholds.severe,
      evasionMod: armor.evasionModifier,
      agilityMod: armor.agilityModifier,
      armorType: armor.armorType,
      features: armor.features,
      tier: armor.tier,
      description: armor.description,
      isEmpty: false,
    };
  }
  return { name: 'None equipped', isEmpty: true };
}

export function getWheelchairData(
  enabled: boolean,
  mode: 'standard' | 'homebrew',
  wheelchair: CombatWheelchair | null,
  homebrew: Partial<CombatWheelchair>
) {
  if (!enabled) return { name: 'Not using', isEmpty: true };

  if (mode === 'homebrew') {
    return {
      name: homebrew.name || 'Unnamed Homebrew',
      damage: formatDamage(homebrew.damage),
      range: homebrew.range,
      trait: homebrew.trait,
      burden: homebrew.burden,
      features: homebrew.features ?? [],
      tier: homebrew.tier,
      frameType: homebrew.frameType,
      wheelchairFeatures: homebrew.wheelchairFeatures ?? [],
      description: homebrew.description,
      isEmpty: false,
    };
  }
  if (wheelchair) {
    return {
      name: wheelchair.name,
      damage: formatDamage(wheelchair.damage),
      range: wheelchair.range,
      trait: wheelchair.trait,
      burden: wheelchair.burden,
      features: wheelchair.features,
      tier: wheelchair.tier,
      frameType: wheelchair.frameType,
      wheelchairFeatures: wheelchair.wheelchairFeatures,
      description: wheelchair.description,
      isEmpty: false,
    };
  }
  return { name: 'Not selected', isEmpty: true };
}
