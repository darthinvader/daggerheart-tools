import type { CustomEquipmentSlot } from '@/lib/schemas/equipment';

interface CustomEquipmentSectionProps {
  customSlots: CustomEquipmentSlot[];
}

export function CustomEquipmentSection({
  customSlots,
}: CustomEquipmentSectionProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💎</span>
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
            <div
              key={slot.id}
              className="bg-muted/50 flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <span>{slot.slotIcon}</span>
              <span className="truncate">{slot.name || 'Unnamed'}</span>
            </div>
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
