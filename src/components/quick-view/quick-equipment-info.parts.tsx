import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import type { EquipmentState } from '@/components/equipment';
import type { CustomEquipment } from '@/components/equipment/custom-slot-editor';
import { Badge } from '@/components/ui/badge';
import {
  Footprints,
  Hand,
  Ruler,
  Shield,
  Sword,
  Target,
  Wheelchair,
} from '@/lib/icons';
import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
} from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

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

function formatDamage(
  damage: { count?: number; diceType?: number; modifier?: number } | undefined
): string {
  if (!damage?.diceType) return '-';
  const base = `${damage.count ?? 1}d${damage.diceType}`;
  if (damage.modifier && damage.modifier !== 0) {
    return damage.modifier > 0
      ? `${base}+${damage.modifier}`
      : `${base}${damage.modifier}`;
  }
  return base;
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
    damage: formatDamage(weapon.damage),
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
    damage: formatDamage(wheelchair.damage),
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
  const [expanded, setExpanded] = useState(false);
  const TypeIcon =
    weapon.type === 'Wheelchair'
      ? Wheelchair
      : weapon.type === 'Primary'
        ? Sword
        : Target;
  const hasFeatures = weapon.features.length > 0;

  return (
    <div className="quick-equipment-item">
      <button
        type="button"
        onClick={() => hasFeatures && setExpanded(!expanded)}
        className={cn(
          'quick-equipment-item-header',
          hasFeatures && 'cursor-pointer hover:opacity-80'
        )}
        disabled={!hasFeatures}
      >
        <div className="quick-equipment-item-info">
          <span className="quick-equipment-item-name">
            {hasFeatures && (
              <span className="text-muted-foreground">
                {expanded ? (
                  <ChevronDown className="inline size-3" />
                ) : (
                  <ChevronRight className="inline size-3" />
                )}
              </span>
            )}
            <TypeIcon className="size-3.5" /> {weapon.name}
          </span>
        </div>
        <Badge variant="outline" className="quick-equipment-type-badge">
          {weapon.type}
          {weapon.frameType && ` (${weapon.frameType})`}
        </Badge>
      </button>
      {/* Prominent damage/range/burden row */}
      <div className="quick-equipment-stats-row">
        <span className="quick-equipment-damage-dice">
          <Target className="size-3" />
          {weapon.damage}
        </span>
        <span className="quick-equipment-stat-pill">
          <Ruler className="size-2.5" /> {weapon.range}
        </span>
        <span className="quick-equipment-stat-pill">
          <Hand className="size-2.5" /> {weapon.burden}
        </span>
      </div>
      {expanded && hasFeatures && (
        <div className="quick-equipment-features">
          {weapon.features.map((f, i) => (
            <div key={i} className="quick-equipment-feature">
              <span className="font-medium">{f.name}</span>
              {f.description && (
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {f.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArmorCard({ armor }: { armor: ArmorSummary }) {
  const [expanded, setExpanded] = useState(false);
  const hasFeatures = armor.features.length > 0;
  const evasionStr =
    armor.evasionMod !== 0
      ? ` ${armor.evasionMod >= 0 ? '+' : ''}${armor.evasionMod}`
      : '';

  return (
    <div className="quick-equipment-item">
      <button
        type="button"
        onClick={() => hasFeatures && setExpanded(!expanded)}
        className={cn(
          'quick-equipment-item-header',
          hasFeatures && 'cursor-pointer hover:opacity-80'
        )}
        disabled={!hasFeatures}
      >
        <div className="quick-equipment-item-info">
          <span className="quick-equipment-item-name">
            {hasFeatures && (
              <span className="text-muted-foreground">
                {expanded ? (
                  <ChevronDown className="inline size-3" />
                ) : (
                  <ChevronRight className="inline size-3" />
                )}
              </span>
            )}
            <Shield className="size-3.5" /> {armor.name}
          </span>
        </div>
        <Badge variant="outline" className="quick-equipment-type-badge">
          Armor
        </Badge>
      </button>
      <div className="quick-equipment-stats-row">
        <span className="quick-equipment-stat-pill">Score: {armor.score}</span>
        <span className="quick-equipment-stat-pill text-yellow-500">
          Major: {armor.major}+
        </span>
        <span className="quick-equipment-stat-pill text-orange-500">
          Severe: {armor.severe}+
        </span>
        {armor.evasionMod !== 0 && (
          <span className="quick-equipment-stat-pill">
            <Footprints className="size-2.5" />
            {evasionStr}
          </span>
        )}
      </div>
      {expanded && hasFeatures && (
        <div className="quick-equipment-features">
          {armor.features.map((f, i) => (
            <div key={i} className="quick-equipment-feature">
              <span className="font-medium">{f.name}</span>
              {f.description && (
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {f.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomSlotCard({ slot }: { slot: CustomEquipment }) {
  const [expanded, setExpanded] = useState(false);
  const hasContent = slot.features.length > 0 || Boolean(slot.description);

  return (
    <div className="quick-equipment-item">
      <button
        type="button"
        onClick={() => hasContent && setExpanded(!expanded)}
        className={cn(
          'quick-equipment-item-header',
          hasContent && 'cursor-pointer hover:opacity-80'
        )}
        disabled={!hasContent}
      >
        <span className="quick-equipment-item-name">
          {hasContent && (
            <span className="text-muted-foreground">
              {expanded ? (
                <ChevronDown className="inline size-3" />
              ) : (
                <ChevronRight className="inline size-3" />
              )}
            </span>
          )}
          {slot.name}
        </span>
        <Badge variant="outline" className="quick-equipment-type-badge">
          {slot.slotName}
        </Badge>
      </button>
      {expanded && hasContent && (
        <div className="quick-equipment-features">
          {slot.description && (
            <p className="text-muted-foreground text-[11px]">
              {slot.description}
            </p>
          )}
          {slot.features.map((f, i) => (
            <div key={i} className="quick-equipment-feature">
              <span className="font-medium">{f.name}</span>
              {f.description && (
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {f.description}
                </p>
              )}
            </div>
          ))}
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
      <div className={cn('quick-equipment-empty', className)}>
        <Shield className="size-4" />
        <span className="text-muted-foreground text-sm">No equipment</span>
      </div>
    );
  }

  return (
    <div className={cn('quick-equipment-card', className)}>
      {/* Weapons category */}
      {weapons.length > 0 && (
        <div className="quick-equipment-category">
          <h4 className="quick-equipment-category-label">
            <Sword className="size-3" /> Weapons
          </h4>
          <div className="quick-equipment-list">
            {weapons.map((w, i) => (
              <WeaponCard key={i} weapon={w} />
            ))}
          </div>
        </div>
      )}

      {/* Armor category */}
      {armor && (
        <div className="quick-equipment-category">
          <h4 className="quick-equipment-category-label">
            <Shield className="size-3" /> Armor & Defense
          </h4>
          <div className="quick-equipment-list">
            <ArmorCard armor={armor} />
          </div>
        </div>
      )}

      {/* Custom slots category */}
      {customSlots.length > 0 && (
        <div className="quick-equipment-category">
          <h4 className="quick-equipment-category-label">Custom Gear</h4>
          <div className="quick-equipment-list">
            {customSlots.map(slot => (
              <CustomSlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
