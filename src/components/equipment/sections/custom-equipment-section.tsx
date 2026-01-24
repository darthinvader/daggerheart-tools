import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gem, Plus } from '@/lib/icons';

import { type CustomEquipment, CustomSlotEditor } from '../custom-slot-editor';

interface CustomEquipmentSectionProps {
  slots: CustomEquipment[];
  onAdd: () => void;
  onUpdate: (id: string, equipment: CustomEquipment) => void;
  onDelete: (id: string) => void;
  hideTitle?: boolean;
}

export function CustomEquipmentSection({
  slots,
  onAdd,
  onUpdate,
  onDelete,
  hideTitle = false,
}: CustomEquipmentSectionProps) {
  const addButton = (
    <Button variant="outline" size="sm" onClick={onAdd}>
      <Plus className="mr-1 h-4 w-4" />
      Add Slot
    </Button>
  );

  const slotsList = (
    <div className="space-y-4">
      {slots.map(slot => (
        <CustomSlotEditor
          key={slot.id}
          equipment={slot}
          onUpdate={eq => onUpdate(slot.id, eq)}
          onDelete={() => onDelete(slot.id)}
        />
      ))}
    </div>
  );

  const emptyState = (
    <div className="py-8 text-center">
      <p className="text-muted-foreground mb-2">No custom equipment yet</p>
      <Button variant="outline" onClick={onAdd}>
        <Plus className="mr-1 h-4 w-4" />
        Add Your First Custom Slot
      </Button>
    </div>
  );

  if (hideTitle) {
    return (
      <div className="flex min-h-0 flex-1 flex-col space-y-4">
        {slots.length === 0 ? (
          emptyState
        ) : (
          <>
            {slotsList}
            <div className="flex justify-center">{addButton}</div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <Gem className="h-5 w-5" /> Custom Equipment
          </span>
          {slots.length > 0 && (
            <Badge variant="secondary">{slots.length}</Badge>
          )}
        </div>
        {addButton}
      </div>
      <p className="text-muted-foreground text-xs">
        Rings, necklaces, cloaks, and other custom gear
      </p>
      {slots.length === 0 ? emptyState : slotsList}
    </div>
  );
}
