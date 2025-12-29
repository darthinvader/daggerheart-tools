import { ArmorCardsRow } from './armor-cards-row';
import { ClickableCard } from './clickable-card';
import { CustomEquipmentSection } from './custom-equipment-section';
import type { EquipmentState } from './equipment-editor';
import type { EditingSection } from './use-equipment-editor';
import { WeaponCardsRow } from './weapon-cards-row';

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
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <WeaponCardsRow
        equipment={equipment}
        readOnly={readOnly}
        openSection={openSection}
      />

      <ArmorCardsRow
        equipment={equipment}
        readOnly={readOnly}
        openSection={openSection}
      />

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
