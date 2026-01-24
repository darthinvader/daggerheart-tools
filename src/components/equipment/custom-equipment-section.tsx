import { Gem } from '@/lib/icons';

import type { CustomEquipment } from './custom-slot-editor';
import { CustomEquipmentSummaryCard } from './summary';

interface CustomEquipmentSectionProps {
  customSlots: CustomEquipment[];
}

export function CustomEquipmentSection({
  customSlots,
}: CustomEquipmentSectionProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gem className="h-5 w-5" />
          <span className="font-semibold">Custom Equipment</span>
          {customSlots.length > 0 && (
            <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
              {customSlots.length}
            </span>
          )}
        </div>
      </div>
      {customSlots.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {customSlots.map(slot => (
            <CustomEquipmentSummaryCard key={slot.id} slot={slot} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          No custom equipment. Click to add rings, necklaces, cloaks, etc.
        </p>
      )}
    </div>
  );
}
