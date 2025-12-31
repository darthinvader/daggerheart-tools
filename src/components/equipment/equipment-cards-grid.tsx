import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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
import { WeaponsGridRow } from './weapons-grid-row';

interface EquipmentCardsGridProps {
  equipment: EquipmentState;
  readOnly: boolean;
  openSection: (section: EditingSection) => void;
  onToggleWheelchair?: (enabled: boolean) => void;
}

export function EquipmentCardsGrid({
  equipment,
  readOnly,
  openSection,
  onToggleWheelchair,
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
      <WeaponsGridRow
        primaryData={primaryData}
        secondaryData={secondaryData}
        primaryIsHomebrew={equipment.primaryWeaponMode === 'homebrew'}
        secondaryIsHomebrew={equipment.secondaryWeaponMode === 'homebrew'}
        readOnly={readOnly}
        onPrimaryClick={() => openSection('primary')}
        onSecondaryClick={() => openSection('secondary')}
      />

      {/* Row 2: Armor & Combat Wheelchair (if enabled) */}
      <div
        className={`grid gap-3 ${equipment.useCombatWheelchair ? 'sm:grid-cols-2' : ''}`}
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

      {/* Wheelchair Toggle */}
      {!readOnly && onToggleWheelchair && (
        <div className="flex items-center justify-end gap-2 py-1">
          <Label
            htmlFor="wheelchair-toggle"
            className="text-muted-foreground text-xs"
          >
            ♿ Combat Wheelchair
          </Label>
          <Switch
            id="wheelchair-toggle"
            checked={equipment.useCombatWheelchair}
            onCheckedChange={onToggleWheelchair}
          />
        </div>
      )}

      {/* Custom Equipment */}
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
