import type { EquipmentState } from '@/components/equipment';
import type { CustomEquipment } from '@/components/equipment/custom-slot-editor';
import { Badge } from '@/components/ui/badge';
import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
} from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { ExpandableFeaturesList } from './expandable-feature';

interface QuickEquipmentInfoProps {
  equipment: EquipmentState;
  className?: string;
}

interface WeaponSummary {
  name: string;
  type: 'Primary' | 'Secondary' | 'Wheelchair';
  range: string;
  burden: string;
  damage: string;
  features: { name: string; description: string }[];
  frameType?: string;
}

interface ArmorSummary {
  name: string;
  score: number;
  evasionMod: number;
  major: number;
  severe: number;
  features: { name: string; description: string }[];
}

function buildWeaponSummary(
  weapon: Partial<PrimaryWeapon> | Partial<SecondaryWeapon> | null,
  type: 'Primary' | 'Secondary'
): WeaponSummary | null {
  if (!weapon?.name) return null;
  return {
    name: weapon.name,
    type,
    range: String(weapon.range ?? 'Melee'),
    burden: String(weapon.burden ?? 'One-Handed'),
    damage: weapon.damage
      ? `${weapon.damage.count ?? 1}d${weapon.damage.diceType}`
      : '-',
    features: weapon.features ?? [],
  };
}

function buildWheelchairSummary(
  wheelchair: Partial<CombatWheelchair> | null
): WeaponSummary | null {
  if (!wheelchair?.name) return null;
  return {
    name: wheelchair.name,
    type: 'Wheelchair',
    range: String(wheelchair.range ?? 'Melee'),
    burden: String(wheelchair.burden ?? 'Two-Handed'),
    damage: wheelchair.damage
      ? `${wheelchair.damage.count ?? 1}d${wheelchair.damage.diceType}`
      : '-',
    features: wheelchair.features ?? [],
    frameType: wheelchair.frameType,
  };
}

function getWeaponSummary(equipment: EquipmentState): WeaponSummary[] {
  const weapons: WeaponSummary[] = [];

  const primaryWeapon =
    equipment.primaryWeaponMode === 'homebrew'
      ? equipment.homebrewPrimaryWeapon
      : equipment.primaryWeapon;
  const primary = buildWeaponSummary(primaryWeapon, 'Primary');
  if (primary) weapons.push(primary);

  const secondaryWeapon =
    equipment.secondaryWeaponMode === 'homebrew'
      ? equipment.homebrewSecondaryWeapon
      : equipment.secondaryWeapon;
  const secondary = buildWeaponSummary(secondaryWeapon, 'Secondary');
  if (secondary) weapons.push(secondary);

  // Add combat wheelchair if enabled
  if (equipment.useCombatWheelchair) {
    const wheelchair =
      equipment.wheelchairMode === 'homebrew'
        ? equipment.homebrewWheelchair
        : equipment.combatWheelchair;
    const wheelchairSummary = buildWheelchairSummary(wheelchair);
    if (wheelchairSummary) weapons.push(wheelchairSummary);
  }

  return weapons;
}

function getArmorSummary(equipment: EquipmentState): ArmorSummary | null {
  const armor =
    equipment.armorMode === 'homebrew'
      ? equipment.homebrewArmor
      : equipment.armor;

  if (!armor?.name) return null;

  return {
    name: armor.name,
    score: armor.baseScore ?? 0,
    evasionMod: armor.evasionModifier ?? 0,
    major: armor.baseThresholds?.major ?? 0,
    severe: armor.baseThresholds?.severe ?? 0,
    features: armor.features ?? [],
  };
}

function WeaponCard({ weapon }: { weapon: WeaponSummary }) {
  const typeIcon =
    weapon.type === 'Wheelchair'
      ? '♿'
      : weapon.type === 'Primary'
        ? '⚔️'
        : '🗡️';
  return (
    <div className="rounded border p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-medium">
          {typeIcon} {weapon.name}
        </span>
        <Badge variant="outline" className="text-xs">
          {weapon.type}
          {weapon.frameType && ` (${weapon.frameType})`}
        </Badge>
      </div>
      <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
        <span>🎯 {weapon.damage}</span>
        <span>📏 {weapon.range}</span>
        <span>🤚 {weapon.burden}</span>
      </div>
      {weapon.features.length > 0 && (
        <div className="mt-2">
          <ExpandableFeaturesList features={weapon.features} />
        </div>
      )}
    </div>
  );
}

function ArmorCard({ armor }: { armor: ArmorSummary }) {
  return (
    <div className="rounded border p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-medium">{armor.name}</span>
        <Badge variant="outline" className="text-xs">
          Armor
        </Badge>
      </div>
      <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
        <span>🛡️ Score: {armor.score}</span>
        <span>
          ⚡ Major: {armor.major}+ / Severe: {armor.severe}+
        </span>
        {armor.evasionMod !== 0 && (
          <span>
            🏃 Evasion: {armor.evasionMod >= 0 ? '+' : ''}
            {armor.evasionMod}
          </span>
        )}
      </div>
      {armor.features.length > 0 && (
        <div className="mt-2">
          <ExpandableFeaturesList features={armor.features} />
        </div>
      )}
    </div>
  );
}

function CustomSlotCard({ slot }: { slot: CustomEquipment }) {
  return (
    <div className="rounded border p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-medium">
          {slot.slotIcon} {slot.name}
        </span>
        <Badge variant="outline" className="text-xs">
          {slot.slotName}
        </Badge>
      </div>
      {slot.description && (
        <p className="text-muted-foreground mb-1 text-xs">{slot.description}</p>
      )}
      {slot.features.length > 0 && (
        <div className="mt-2">
          <ExpandableFeaturesList features={slot.features} />
        </div>
      )}
    </div>
  );
}

export function QuickEquipmentInfo({
  equipment,
  className,
}: QuickEquipmentInfoProps) {
  const weapons = getWeaponSummary(equipment);
  const armor = getArmorSummary(equipment);
  const customSlots = equipment.customSlots ?? [];

  const hasEquipment =
    weapons.length > 0 || armor !== null || customSlots.length > 0;

  if (!hasEquipment) {
    return (
      <div className={cn('bg-card rounded-lg border p-3', className)}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <span className="text-muted-foreground">No equipment</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">🛡️</span>
        <span className="font-semibold">Equipment</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {weapons.map((w, i) => (
          <WeaponCard key={i} weapon={w} />
        ))}
        {armor && <ArmorCard armor={armor} />}
        {customSlots.map(slot => (
          <CustomSlotCard key={slot.id} slot={slot} />
        ))}
      </div>
    </div>
  );
}
