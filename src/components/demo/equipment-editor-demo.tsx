import { useState } from 'react';

import {
  EquipmentEditor,
  type EquipmentState,
} from '@/components/equipment/equipment-editor';

export function EquipmentEditorDemo() {
  const [equipment, setEquipment] = useState<EquipmentState | undefined>(
    undefined
  );

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground text-sm">
        <p>
          Select your character's equipment including primary and secondary
          weapons, armor, and optional combat wheelchair. Toggle "Homebrew" to
          create custom equipment.
        </p>
        <p className="mt-1">
          Use "Add Slot" to create custom equipment slots for rings, necklaces,
          or other gear.
        </p>
      </div>
      <EquipmentEditor value={equipment} onChange={setEquipment} />
    </div>
  );
}
