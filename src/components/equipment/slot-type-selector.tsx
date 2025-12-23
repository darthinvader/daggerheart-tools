import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SLOT_PRESETS, type SlotPresetName } from './constants';

interface SlotTypeSelectorProps {
  slotName: string;
  slotIcon: string;
  onSlotChange: (slotName: string, slotIcon: string) => void;
}

/**
 * Dropdown for selecting a slot type (Ring, Necklace, etc.) with
 * custom icon and name fields when "Custom" is selected.
 */
export function SlotTypeSelector({
  slotName,
  slotIcon,
  onSlotChange,
}: SlotTypeSelectorProps) {
  const isCustom =
    slotName === 'Custom' || !SLOT_PRESETS.some(p => p.name === slotName);
  const displayValue = isCustom ? 'Custom' : slotName;

  const handlePresetChange = (value: SlotPresetName | 'Custom') => {
    const preset = SLOT_PRESETS.find(p => p.name === value);
    if (preset && value !== 'Custom') {
      onSlotChange(preset.name, preset.icon);
    } else {
      onSlotChange(slotName === 'Custom' ? slotName : 'Custom', slotIcon);
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <span className="text-2xl">{slotIcon}</span>
      <Select value={displayValue} onValueChange={handlePresetChange}>
        <SelectTrigger className="h-8 w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SLOT_PRESETS.map(preset => (
            <SelectItem key={preset.name} value={preset.name}>
              {preset.icon} {preset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isCustom && (
        <>
          <Input
            value={slotIcon}
            onChange={e => onSlotChange(slotName, e.target.value)}
            placeholder="🎲"
            className="h-8 w-14 text-center"
            maxLength={2}
            aria-label="Custom icon"
          />
          <Input
            value={slotName === 'Custom' ? '' : slotName}
            onChange={e => onSlotChange(e.target.value || 'Custom', slotIcon)}
            placeholder="Slot name..."
            className="h-8 w-[100px]"
            maxLength={20}
            aria-label="Custom slot name"
          />
        </>
      )}
    </div>
  );
}
