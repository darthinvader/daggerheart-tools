import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Wheelchair } from '@/lib/icons';

import { ClickableCard } from './clickable-card';
import { CustomEquipmentSection } from './custom-equipment-section';
import type { EquipmentState } from './equipment-editor';
import {
  EquipmentGrid2x2,
  EquipmentGrid3Col,
} from './equipment-grid-components';
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

  const usesWheelchair = equipment.useCombatWheelchair;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Wheelchair Toggle at the top */}
      {!readOnly && onToggleWheelchair && (
        <div className="flex items-center justify-end gap-2 py-1">
          <Label
            htmlFor="wheelchair-toggle"
            className="text-muted-foreground flex items-center gap-1 text-xs"
          >
            <Wheelchair className="h-4 w-4" /> Combat Wheelchair
          </Label>
          <Switch
            id="wheelchair-toggle"
            checked={equipment.useCombatWheelchair}
            onCheckedChange={onToggleWheelchair}
          />
        </div>
      )}

      {/* Equipment Grid: 2x2 when wheelchair is active, 3-col row otherwise */}
      {usesWheelchair ? (
        <EquipmentGrid2x2
          equipment={equipment}
          primaryData={primaryData}
          secondaryData={secondaryData}
          armorData={armorData}
          wheelchairData={wheelchairData}
          readOnly={readOnly}
          openSection={openSection}
        />
      ) : (
        <EquipmentGrid3Col
          equipment={equipment}
          primaryData={primaryData}
          secondaryData={secondaryData}
          armorData={armorData}
          readOnly={readOnly}
          openSection={openSection}
        />
      )}

      {/* Custom Equipment */}
      <div className="border-t pt-4">
        <ClickableCard
          onClick={() => openSection('custom')}
          disabled={readOnly}
        >
          <CustomEquipmentSection customSlots={equipment.customSlots ?? []} />
        </ClickableCard>
      </div>
    </div>
  );
}
