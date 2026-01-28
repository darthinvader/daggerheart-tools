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
  const [expanded, setExpanded] = useState(false);
  const TypeIcon =
    weapon.type === 'Wheelchair'
      ? Wheelchair
      : weapon.type === 'Primary'
        ? Sword
        : Target;
  const hasFeatures = weapon.features.length > 0;

  return (
    <div className="rounded border p-1.5 sm:p-2">
      <button
        type="button"
        onClick={() => hasFeatures && setExpanded(!expanded)}
        className={cn(
          'flex w-full items-center justify-between gap-1 text-left sm:gap-2',
          hasFeatures && 'cursor-pointer hover:opacity-80'
        )}
        disabled={!hasFeatures}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-0.5 sm:gap-x-2 sm:gap-y-1">
          <span className="flex shrink-0 items-center gap-0.5 text-sm font-medium sm:gap-1 sm:text-base">
            {hasFeatures && (
              <span className="text-muted-foreground">
                {expanded ? (
                  <ChevronDown className="inline h-3 w-3" />
                ) : (
                  <ChevronRight className="inline h-3 w-3" />
                )}
              </span>
            )}
            <TypeIcon className="size-3 sm:size-4" /> {weapon.name}
          </span>
          <span className="text-muted-foreground flex shrink-0 items-center gap-0.5 text-[10px] sm:gap-1 sm:text-xs">
            <Target className="size-2.5 sm:size-3" /> {weapon.damage} ·{' '}
            <Ruler className="size-2.5 sm:size-3" /> {weapon.range} ·{' '}
            <Hand className="size-2.5 sm:size-3" /> {weapon.burden}
          </span>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px] sm:text-xs">
          {weapon.type}
          {weapon.frameType && ` (${weapon.frameType})`}
        </Badge>
      </button>
      {expanded && hasFeatures && (
        <div className="mt-2 ml-4 space-y-2 border-l pl-2">
          {weapon.features.map((f, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium">{f.name}</span>
              {f.description && (
                <p className="text-muted-foreground text-xs leading-relaxed">
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
    <div className="rounded border p-1.5 sm:p-2">
      <button
        type="button"
        onClick={() => hasFeatures && setExpanded(!expanded)}
        className={cn(
          'flex w-full items-center justify-between gap-1 text-left sm:gap-2',
          hasFeatures && 'cursor-pointer hover:opacity-80'
        )}
        disabled={!hasFeatures}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-0.5 sm:gap-x-2 sm:gap-y-1">
          <span className="flex shrink-0 items-center gap-0.5 text-sm font-medium sm:gap-1 sm:text-base">
            {hasFeatures && (
              <span className="text-muted-foreground">
                {expanded ? (
                  <ChevronDown className="inline h-3 w-3" />
                ) : (
                  <ChevronRight className="inline h-3 w-3" />
                )}
              </span>
            )}
            <Shield className="size-3 sm:size-4" /> {armor.name}
          </span>
          <span className="text-muted-foreground flex shrink-0 flex-wrap items-center gap-0.5 text-[10px] sm:gap-1 sm:text-xs">
            Score: {armor.score} · Major: {armor.major}+ · Severe:{' '}
            {armor.severe}+
            {armor.evasionMod !== 0 && (
              <>
                · <Footprints className="size-2.5 sm:size-3" />
                {evasionStr}
              </>
            )}
          </span>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px] sm:text-xs">
          Armor
        </Badge>
      </button>
      {expanded && hasFeatures && (
        <div className="mt-2 ml-4 space-y-2 border-l pl-2">
          {armor.features.map((f, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium">{f.name}</span>
              {f.description && (
                <p className="text-muted-foreground text-xs leading-relaxed">
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
    <div className="rounded border p-2">
      <button
        type="button"
        onClick={() => hasContent && setExpanded(!expanded)}
        className={cn(
          'flex w-full items-center justify-between gap-2 text-left',
          hasContent && 'cursor-pointer hover:opacity-80'
        )}
        disabled={!hasContent}
      >
        <span className="font-medium">
          {hasContent && (
            <span className="text-muted-foreground mr-1">
              {expanded ? (
                <ChevronDown className="inline h-3 w-3" />
              ) : (
                <ChevronRight className="inline h-3 w-3" />
              )}
            </span>
          )}
          {slot.name}
        </span>
        <Badge variant="outline" className="shrink-0 text-xs">
          {slot.slotName}
        </Badge>
      </button>
      {expanded && hasContent && (
        <div className="mt-2 ml-4 space-y-2 border-l pl-2">
          {slot.description && (
            <p className="text-muted-foreground text-xs">{slot.description}</p>
          )}
          {slot.features.map((f, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium">{f.name}</span>
              {f.description && (
                <p className="text-muted-foreground text-xs leading-relaxed">
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
      <div className={cn('bg-card rounded-lg border p-3', className)}>
        <div className="flex items-center gap-2">
          <Shield className="size-5" />
          <span className="text-muted-foreground">No equipment</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-lg border p-2 sm:p-3', className)}>
      <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
        <Shield className="size-4 sm:size-5" />
        <span className="text-sm font-semibold sm:text-base">Equipment</span>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-2">
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
