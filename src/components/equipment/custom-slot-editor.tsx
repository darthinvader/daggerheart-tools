import { GripVertical, Trash2 } from 'lucide-react';

import { FeaturesEditor } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DynamicIcon, EquipmentSlotIcons, Sparkles } from '@/lib/icons';

import { getSlotIcon } from './constants';
import { TextField } from './form';
import { SlotTypeSelector } from './slot-type-selector';

/** Represents a custom equipment slot created by the user */
export interface CustomEquipment {
  id: string;
  name: string;
  slotName: string;
  slotIconKey: string;
  description: string;
  features: Array<{ name: string; description: string }>;
  activated?: boolean;
}

interface CustomSlotEditorProps {
  equipment: CustomEquipment;
  onUpdate: (equipment: CustomEquipment) => void;
  onDelete: () => void;
}

/**
 * Editor for a single custom equipment slot.
 * Allows customizing slot type, name, description, and features.
 */
export function CustomSlotEditor({
  equipment,
  onUpdate,
  onDelete,
}: CustomSlotEditorProps) {
  const update = <K extends keyof CustomEquipment>(
    key: K,
    value: CustomEquipment[K]
  ) => {
    onUpdate({ ...equipment, [key]: value });
  };

  return (
    <div className="border-primary/20 from-primary/5 relative rounded-lg border-2 border-dashed bg-gradient-to-br to-transparent p-4">
      <DragHandle />

      <Header
        equipment={equipment}
        onSlotChange={(slotName, slotIconKey) =>
          onUpdate({ ...equipment, slotName, slotIconKey })
        }
        onDelete={onDelete}
      />

      <div className="space-y-3">
        <TextField
          label="Item Name"
          id={`name-${equipment.id}`}
          value={equipment.name}
          onChange={v => update('name', v)}
          placeholder="Name your equipment..."
        />

        <div className="space-y-1.5">
          <span className="text-xs font-medium">Description</span>
          <Textarea
            id={`desc-${equipment.id}`}
            value={equipment.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Describe its appearance, origin, or lore..."
            className="min-h-15 resize-none"
          />
        </div>

        <FeaturesEditor
          features={equipment.features}
          onChange={features => update('features', features)}
        />
      </div>

      <Preview equipment={equipment} />
    </div>
  );
}

function DragHandle() {
  return (
    <div className="text-muted-foreground absolute top-3 -left-2 cursor-grab opacity-50">
      <GripVertical className="h-4 w-4" />
    </div>
  );
}

interface HeaderProps {
  equipment: CustomEquipment;
  onSlotChange: (slotName: string, slotIconKey: string) => void;
  onDelete: () => void;
}

function Header({ equipment, onSlotChange, onDelete }: HeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <SlotTypeSelector
        slotName={equipment.slotName}
        slotIconKey={equipment.slotIconKey}
        onSlotChange={onSlotChange}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-destructive hover:bg-destructive/10 h-8 w-8"
        aria-label="Delete slot"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function Preview({ equipment }: { equipment: CustomEquipment }) {
  if (!equipment.name) return null;

  const filledFeatures = equipment.features.filter(f => f.name);
  const displaySlotName =
    equipment.slotName === 'Custom' ? 'Custom Slot' : equipment.slotName;
  const slotIcon = getSlotIcon(
    equipment.slotIconKey as keyof typeof EquipmentSlotIcons
  );

  return (
    <div className="bg-card mt-4 rounded border p-3">
      <div className="mb-1 flex items-center gap-2">
        <DynamicIcon icon={slotIcon} className="h-5 w-5" />
        <span className="font-semibold">{equipment.name}</span>
        <Badge variant="outline" className="text-[10px]">
          {displaySlotName}
        </Badge>
      </div>
      {equipment.description && (
        <p className="text-muted-foreground text-xs italic">
          {equipment.description}
        </p>
      )}
      {filledFeatures.length > 0 && (
        <div className="mt-2 space-y-2">
          {filledFeatures.map((f, i) => (
            <div key={i} className="bg-muted/50 rounded border p-2">
              <div className="flex items-center gap-1">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 text-[10px]"
                >
                  <Sparkles className="h-3 w-3" /> {f.name}
                </Badge>
              </div>
              {f.description && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {f.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
