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
}

export function EquipmentDisplay({
  equipment,
  onChange,
  className,
  readOnly = false,
  hideDialogHeader = false,
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
            <span className="text-xl">🛡️</span>
            <h3 className="text-lg font-semibold">Equipment</h3>
          </div>
        </div>

        <EquipmentCardsGrid
          equipment={equipment}
          readOnly={readOnly}
          openSection={openSection}
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
      />
    </>
  );
}
