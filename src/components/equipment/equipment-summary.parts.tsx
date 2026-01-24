import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Axe, Gem, Sword, Wheelchair } from '@/lib/icons';
import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
  StandardArmor,
} from '@/lib/schemas/equipment';

import type { CustomEquipment } from './custom-slot-editor';
import {
  ArmorSummaryCard,
  CustomEquipmentSummaryCard,
  WeaponSummaryCard,
} from './summary';
import {
  getArmorData,
  getWeaponData,
  getWheelchairData,
} from './summary/data-helpers';

interface EquipmentSummaryProps {
  primaryWeapon: PrimaryWeapon | null;
  primaryWeaponMode: 'standard' | 'homebrew';
  homebrewPrimaryWeapon: Partial<PrimaryWeapon>;
  secondaryWeapon: SecondaryWeapon | null;
  secondaryWeaponMode: 'standard' | 'homebrew';
  homebrewSecondaryWeapon: Partial<SecondaryWeapon>;
  armor: StandardArmor | null;
  armorMode: 'standard' | 'homebrew';
  homebrewArmor: Partial<StandardArmor>;
  useCombatWheelchair: boolean;
  combatWheelchair: CombatWheelchair | null;
  wheelchairMode: 'standard' | 'homebrew';
  homebrewWheelchair: Partial<CombatWheelchair>;
  customSlots: CustomEquipment[];
}

export function EquipmentSummary(props: EquipmentSummaryProps) {
  const primaryData = getWeaponData(
    props.primaryWeaponMode,
    props.primaryWeapon,
    props.homebrewPrimaryWeapon
  );
  const secondaryData = getWeaponData(
    props.secondaryWeaponMode,
    props.secondaryWeapon,
    props.homebrewSecondaryWeapon
  );
  const armorData = getArmorData(
    props.armorMode,
    props.armor,
    props.homebrewArmor
  );
  const wheelchairData = getWheelchairData(
    props.useCombatWheelchair,
    props.wheelchairMode,
    props.combatWheelchair,
    props.homebrewWheelchair
  );

  const hasEquipment =
    !primaryData.isEmpty ||
    !secondaryData.isEmpty ||
    !armorData.isEmpty ||
    !wheelchairData.isEmpty ||
    (props.customSlots?.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      <WeaponGrid
        primaryData={primaryData}
        secondaryData={secondaryData}
        primaryMode={props.primaryWeaponMode}
        secondaryMode={props.secondaryWeaponMode}
      />
      <ArmorGrid
        armorData={armorData}
        wheelchairData={wheelchairData}
        armorMode={props.armorMode}
        useCombatWheelchair={props.useCombatWheelchair}
        wheelchairMode={props.wheelchairMode}
      />
      <CustomSlotsSection slots={props.customSlots ?? []} />
      {!hasEquipment && <EmptyMessage />}
    </div>
  );
}

function WeaponGrid({
  primaryData,
  secondaryData,
  primaryMode,
  secondaryMode,
}: {
  primaryData: ReturnType<typeof getWeaponData>;
  secondaryData: ReturnType<typeof getWeaponData>;
  primaryMode: 'standard' | 'homebrew';
  secondaryMode: 'standard' | 'homebrew';
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <WeaponSummaryCard
        icon={Sword}
        label="Primary Weapon"
        name={primaryData.name}
        isHomebrew={primaryMode === 'homebrew'}
        isEmpty={primaryData.isEmpty}
        damage={primaryData.damage}
        range={primaryData.range}
        trait={primaryData.trait}
        burden={primaryData.burden}
        features={primaryData.features}
        tier={primaryData.tier}
      />
      <WeaponSummaryCard
        icon={Axe}
        label="Secondary Weapon"
        name={secondaryData.name}
        isHomebrew={secondaryMode === 'homebrew'}
        isEmpty={secondaryData.isEmpty}
        damage={secondaryData.damage}
        range={secondaryData.range}
        trait={secondaryData.trait}
        burden={secondaryData.burden}
        features={secondaryData.features}
        tier={secondaryData.tier}
      />
    </div>
  );
}

function ArmorGrid({
  armorData,
  wheelchairData,
  armorMode,
  useCombatWheelchair,
  wheelchairMode,
}: {
  armorData: ReturnType<typeof getArmorData>;
  wheelchairData: ReturnType<typeof getWheelchairData>;
  armorMode: 'standard' | 'homebrew';
  useCombatWheelchair: boolean;
  wheelchairMode: 'standard' | 'homebrew';
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ArmorSummaryCard
        name={armorData.name}
        isHomebrew={armorMode === 'homebrew'}
        isEmpty={armorData.isEmpty}
        baseScore={armorData.baseScore}
        major={armorData.major}
        severe={armorData.severe}
        evasionMod={armorData.evasionMod}
        agilityMod={armorData.agilityMod}
        armorType={armorData.armorType}
        features={armorData.features}
        tier={armorData.tier}
      />
      <WeaponSummaryCard
        icon={Wheelchair}
        label="Combat Wheelchair"
        name={wheelchairData.name}
        isHomebrew={useCombatWheelchair && wheelchairMode === 'homebrew'}
        isEmpty={wheelchairData.isEmpty}
        damage={wheelchairData.damage}
        range={wheelchairData.range}
        trait={wheelchairData.trait}
        burden={wheelchairData.burden}
        features={wheelchairData.features}
        tier={wheelchairData.tier}
        frameType={wheelchairData.frameType}
        wheelchairFeatures={wheelchairData.wheelchairFeatures}
      />
    </div>
  );
}

function CustomSlotsSection({ slots }: { slots: CustomEquipment[] }) {
  if (slots.length === 0) return null;

  return (
    <>
      <Separator />
      <div>
        <h4 className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
          <Gem className="h-4 w-4" /> Custom Equipment
          <Badge variant="secondary">{slots.length}</Badge>
        </h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slots.map(slot => (
            <CustomEquipmentSummaryCard key={slot.id} slot={slot} />
          ))}
        </div>
      </div>
    </>
  );
}

function EmptyMessage() {
  return (
    <p className="text-muted-foreground py-4 text-center text-sm">
      No equipment selected yet. Start by choosing your weapons and armor above.
    </p>
  );
}
