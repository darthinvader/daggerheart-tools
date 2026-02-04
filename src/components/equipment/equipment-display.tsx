import { useCallback } from 'react';

import { Shield } from '@/lib/icons';
import { cn } from '@/lib/utils';

import { EquipmentCardsGrid } from './equipment-cards-grid';
import { EquipmentEditDialog } from './equipment-edit-dialog';
import type { EquipmentState } from './equipment-editor';
import { useEquipmentEditor } from './use-equipment-editor';

interface EquipmentDisplayProps {
  equipment: EquipmentState;
  onChange?: (equipment: EquipmentState) => void;
  className?: string;
  readOnly?: boolean;
  hideDialogHeader?: boolean;
  allowedTiers?: string[];
}

export function EquipmentDisplay({
  equipment,
  onChange,
  className,
  readOnly = false,
  hideDialogHeader = false,
  allowedTiers,
}: EquipmentDisplayProps) {
  const {
    editingSection,
    draftEquipment,
    openSection,
    closeSection,
    handleSave,
    updateDraft,
    handleAddCustomSlot,
  } = useEquipmentEditor(equipment, onChange);

  const handleToggleWheelchair = useCallback(
    (enabled: boolean) => {
      onChange?.({ ...equipment, useCombatWheelchair: enabled });
    },
    [equipment, onChange]
  );

  const handleTogglePrimaryActivated = useCallback(() => {
    onChange?.({
      ...equipment,
      primaryWeaponActivated: equipment.primaryWeaponActivated === false,
    });
  }, [equipment, onChange]);

  const handleToggleSecondaryActivated = useCallback(() => {
    onChange?.({
      ...equipment,
      secondaryWeaponActivated: equipment.secondaryWeaponActivated === false,
    });
  }, [equipment, onChange]);

  const handleToggleArmorActivated = useCallback(() => {
    onChange?.({
      ...equipment,
      armorActivated: equipment.armorActivated === false,
    });
  }, [equipment, onChange]);

  const handleToggleWheelchairActivated = useCallback(() => {
    onChange?.({
      ...equipment,
      wheelchairActivated: equipment.wheelchairActivated === false,
    });
  }, [equipment, onChange]);

  return (
    <>
      <section
        className={cn(
          'bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors',
          className
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Equipment</h3>
          </div>
        </div>

        <EquipmentCardsGrid
          equipment={equipment}
          readOnly={readOnly}
          openSection={openSection}
          onToggleWheelchair={readOnly ? undefined : handleToggleWheelchair}
          onTogglePrimaryActivated={
            readOnly ? undefined : handleTogglePrimaryActivated
          }
          onToggleSecondaryActivated={
            readOnly ? undefined : handleToggleSecondaryActivated
          }
          onToggleArmorActivated={
            readOnly ? undefined : handleToggleArmorActivated
          }
          onToggleWheelchairActivated={
            readOnly ? undefined : handleToggleWheelchairActivated
          }
        />
      </section>

      <EquipmentEditDialog
        editingSection={editingSection}
        draftEquipment={draftEquipment}
        updateDraft={updateDraft}
        handleAddCustomSlot={handleAddCustomSlot}
        closeSection={closeSection}
        handleSave={handleSave}
        hideDialogHeader={hideDialogHeader}
        allowedTiers={allowedTiers}
      />
    </>
  );
}
