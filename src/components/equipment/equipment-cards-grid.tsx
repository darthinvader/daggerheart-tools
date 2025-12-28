import { ClickableCard } from './clickable-card';
import { CustomEquipmentSection } from './custom-equipment-section';
import type { EquipmentState } from './equipment-editor';
import { ArmorSummaryCard, WeaponSummaryCard } from './summary';
import {
  getArmorData,
  getWeaponData,
  getWheelchairData,
} from './summary/data-helpers';
import type { EditingSection } from './use-equipment-editor';

interface EquipmentCardsGridProps {
  equipment: EquipmentState;
  readOnly: boolean;
  openSection: (section: EditingSection) => void;
}

export function EquipmentCardsGrid({
  equipment,
  readOnly,
  openSection,
}: EquipmentCardsGridProps) {
  const primaryData = getWeaponData(
    equipment.primaryWeaponMode,
    equipment.primaryWeapon,
    equipment.homebrewPrimaryWeapon
  );
  const secondaryData = getWeaponData(
    equipment.secondaryWeaponMode,
    equipment.secondaryWeapon,
    equipment.homebrewSecondaryWeapon
  );
  const armorData = getArmorData(
    equipment.armorMode,
    equipment.armor,
    equipment.homebrewArmor
  );
  const wheelchairData = getWheelchairData(
    equipment.useCombatWheelchair,
    equipment.wheelchairMode,
    equipment.combatWheelchair,
    equipment.homebrewWheelchair
  );

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ClickableCard
          onClick={() => openSection('primary')}
          disabled={readOnly}
        >
          <WeaponSummaryCard
            icon="⚔️"
            label="Primary Weapon"
            name={primaryData.name}
            isHomebrew={equipment.primaryWeaponMode === 'homebrew'}
            isEmpty={primaryData.isEmpty}
            damage={primaryData.damage}
            range={primaryData.range}
            trait={primaryData.trait}
            burden={primaryData.burden}
            features={primaryData.features}
            tier={primaryData.tier}
            description={primaryData.description}
          />
        </ClickableCard>
        <ClickableCard
          onClick={() => openSection('secondary')}
          disabled={readOnly}
        >
          <WeaponSummaryCard
            icon="🗡️"
            label="Secondary Weapon"
            name={secondaryData.name}
            isHomebrew={equipment.secondaryWeaponMode === 'homebrew'}
            isEmpty={secondaryData.isEmpty}
            damage={secondaryData.damage}
            range={secondaryData.range}
            trait={secondaryData.trait}
            burden={secondaryData.burden}
            features={secondaryData.features}
            tier={secondaryData.tier}
            description={secondaryData.description}
          />
        </ClickableCard>
      </div>

      <div
        className={`grid gap-4 ${equipment.useCombatWheelchair ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}
      >
        <ClickableCard onClick={() => openSection('armor')} disabled={readOnly}>
          <ArmorSummaryCard
            name={armorData.name}
            isHomebrew={equipment.armorMode === 'homebrew'}
            isEmpty={armorData.isEmpty}
            baseScore={armorData.baseScore}
            major={armorData.major}
            severe={armorData.severe}
            evasionMod={armorData.evasionMod}
            agilityMod={armorData.agilityMod}
            armorType={armorData.armorType}
            features={armorData.features}
            tier={armorData.tier}
            description={armorData.description}
          />
        </ClickableCard>
        {equipment.useCombatWheelchair && (
          <ClickableCard
            onClick={() => openSection('wheelchair')}
            disabled={readOnly}
          >
            <WeaponSummaryCard
              icon="♿"
              label="Combat Wheelchair"
              name={wheelchairData.name}
              isHomebrew={equipment.wheelchairMode === 'homebrew'}
              isEmpty={wheelchairData.isEmpty}
              damage={wheelchairData.damage}
              range={wheelchairData.range}
              trait={wheelchairData.trait}
              burden={wheelchairData.burden}
              features={wheelchairData.features}
              tier={wheelchairData.tier}
              frameType={wheelchairData.frameType}
              wheelchairFeatures={wheelchairData.wheelchairFeatures}
              description={wheelchairData.description}
            />
          </ClickableCard>
        )}
      </div>

      {!equipment.useCombatWheelchair && !readOnly && (
        <button
          type="button"
          onClick={() => openSection('wheelchair')}
          className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm transition-colors hover:border-solid"
        >
          ♿ Enable Combat Wheelchair
        </button>
      )}

      <div className="border-t pt-4">
        <ClickableCard
          onClick={() => openSection('custom')}
          disabled={readOnly}
        >
          <CustomEquipmentSection customSlots={equipment.customSlots} />
        </ClickableCard>
      </div>
    </div>
  );
}
