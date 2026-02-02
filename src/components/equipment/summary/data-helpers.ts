import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
  StandardArmor,
} from '@/lib/schemas/equipment';

import type { EquipmentMode } from '../equipment-mode-tabs';

export type WeaponDisplayData = ReturnType<typeof getWeaponData>;
export type ArmorDisplayData = ReturnType<typeof getArmorData>;
export type WheelchairDisplayData = ReturnType<typeof getWheelchairData>;

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
  return `${base}${mod} ${damage.type === 'mag' ? 'Magic' : 'Physical'}`;
}

export function getWeaponData(
  mode: EquipmentMode,
  standard: PrimaryWeapon | SecondaryWeapon | null,
  homebrew: Partial<PrimaryWeapon | SecondaryWeapon>,
  custom?: Partial<PrimaryWeapon | SecondaryWeapon>
) {
  // Homebrew and custom use the same shape
  if (mode === 'homebrew' || mode === 'custom') {
    const data = mode === 'custom' ? (custom ?? homebrew) : homebrew;
    return {
      name:
        data.name ||
        (mode === 'custom' ? 'Unnamed Custom' : 'Unnamed Homebrew'),
      damage: formatDamage(data.damage),
      range: data.range,
      trait: data.trait,
      burden: data.burden,
      features: data.features ?? [],
      tier: data.tier,
      description: data.description,
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
  mode: EquipmentMode,
  armor: StandardArmor | null,
  homebrew: Partial<StandardArmor>,
  custom?: Partial<StandardArmor>
) {
  // Homebrew and custom use the same shape
  if (mode === 'homebrew' || mode === 'custom') {
    const data = mode === 'custom' ? (custom ?? homebrew) : homebrew;
    return {
      name:
        data.name ||
        (mode === 'custom' ? 'Unnamed Custom' : 'Unnamed Homebrew'),
      baseScore: data.baseScore,
      major: data.baseThresholds?.major,
      severe: data.baseThresholds?.severe,
      evasionMod: data.evasionModifier,
      agilityMod: data.agilityModifier,
      armorType: data.armorType,
      features: data.features ?? [],
      tier: data.tier,
      description: data.description,
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
  mode: EquipmentMode,
  wheelchair: CombatWheelchair | null,
  homebrew: Partial<CombatWheelchair>,
  custom?: Partial<CombatWheelchair>
) {
  if (!enabled) return { name: 'Not using', isEmpty: true };

  // Homebrew and custom use the same shape
  if (mode === 'homebrew' || mode === 'custom') {
    const data = mode === 'custom' ? (custom ?? homebrew) : homebrew;
    return {
      name:
        data.name ||
        (mode === 'custom' ? 'Unnamed Custom' : 'Unnamed Homebrew'),
      damage: formatDamage(data.damage),
      range: data.range,
      trait: data.trait,
      burden: data.burden,
      features: data.features ?? [],
      tier: data.tier,
      frameType: data.frameType,
      wheelchairFeatures: data.wheelchairFeatures ?? [],
      description: data.description,
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
