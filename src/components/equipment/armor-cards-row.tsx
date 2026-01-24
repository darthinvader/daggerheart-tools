import { Wheelchair } from '@/lib/icons';

import { ClickableCard } from './clickable-card';
import type { EquipmentState } from './equipment-editor';
import { ArmorSummaryCard, WeaponSummaryCard } from './summary';
import { getArmorData, getWheelchairData } from './summary/data-helpers';
import type { EditingSection } from './use-equipment-editor';

interface ArmorCardsRowProps {
  equipment: EquipmentState;
  readOnly: boolean;
  openSection: (section: EditingSection) => void;
}

export function ArmorCardsRow({
  equipment,
  readOnly,
  openSection,
}: ArmorCardsRowProps) {
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
            icon={Wheelchair}
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
  );
}
