import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DynamicIcon, EquipmentSlotIcons } from '@/lib/icons';

import { getSlotIcon, SLOT_PRESETS, type SlotPresetName } from './constants';

interface SlotTypeSelectorProps {
  slotName: string;
  slotIconKey: string;
  onSlotChange: (slotName: string, slotIconKey: string) => void;
}

/**
 * Dropdown for selecting a slot type (Ring, Necklace, etc.) with
 * custom icon and name fields when "Custom" is selected.
 */
export function SlotTypeSelector({
  slotName,
  slotIconKey,
  onSlotChange,
}: SlotTypeSelectorProps) {
  const isCustom =
    slotName === 'Custom' || !SLOT_PRESETS.some(p => p.name === slotName);
  const displayValue = isCustom ? 'Custom' : slotName;
  const slotIcon = getSlotIcon(slotIconKey as keyof typeof EquipmentSlotIcons);

  const handlePresetChange = (value: SlotPresetName | 'Custom') => {
    const preset = SLOT_PRESETS.find(p => p.name === value);
    if (preset && value !== 'Custom') {
      onSlotChange(preset.name, preset.iconKey);
    } else {
      onSlotChange(slotName === 'Custom' ? slotName : 'Custom', slotIconKey);
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <DynamicIcon icon={slotIcon} className="h-6 w-6" />
      <Select value={displayValue} onValueChange={handlePresetChange}>
        <SelectTrigger className="h-8 w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SLOT_PRESETS.map(preset => (
            <PresetOption key={preset.name} preset={preset} />
          ))}
        </SelectContent>
      </Select>

      {isCustom && (
        <Input
          value={slotName === 'Custom' ? '' : slotName}
          onChange={e => onSlotChange(e.target.value || 'Custom', slotIconKey)}
          placeholder="Slot name..."
          className="h-8 w-[100px]"
          maxLength={20}
          aria-label="Custom slot name"
        />
      )}
    </div>
  );
}

// Separate component to properly memoize the icon
function PresetOption({ preset }: { preset: (typeof SLOT_PRESETS)[number] }) {
  const icon = getSlotIcon(preset.iconKey);
  return (
    <SelectItem value={preset.name}>
      <span className="flex items-center gap-2">
        <DynamicIcon icon={icon} className="h-4 w-4" /> {preset.name}
      </span>
    </SelectItem>
  );
}
