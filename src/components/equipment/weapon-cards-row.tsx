import { Axe, Sword } from '@/lib/icons';

import { ClickableCard } from './clickable-card';
import type { EquipmentState } from './equipment-editor';
import { WeaponSummaryCard } from './summary';
import { getWeaponData } from './summary/data-helpers';
import type { EditingSection } from './use-equipment-editor';

interface WeaponCardsRowProps {
  equipment: EquipmentState;
  readOnly: boolean;
  openSection: (section: EditingSection) => void;
}

export function WeaponCardsRow({
  equipment,
  readOnly,
  openSection,
}: WeaponCardsRowProps) {
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ClickableCard onClick={() => openSection('primary')} disabled={readOnly}>
        <WeaponSummaryCard
          icon={Sword}
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
          icon={Axe}
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
  );
}
