import { RotateCcw, Shield, ShieldOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';

import { ArmorSlotIcon } from './armor-slot-icon';
import {
  consumeArmorSlot,
  getCurrentArmor,
  getMaxArmor,
  groupSlotsBySource,
  repairAllArmor,
  repairArmorSlot,
} from './armor-utils';
import type { ArmorSlot, ArmorSlotsState } from './types';

interface ArmorSlotsDisplayProps {
  state: ArmorSlotsState;
  onChange: (state: ArmorSlotsState) => void;
}

export function ArmorSlotsDisplay({ state, onChange }: ArmorSlotsDisplayProps) {
  const current = getCurrentArmor(state);
  const max = getMaxArmor(state);
  const groupedSlots = groupSlotsBySource(state.slots);

  const handleUseArmor = () => {
    onChange({ ...state, slots: consumeArmorSlot(state.slots) });
  };

  const handleRepairAll = () => {
    onChange({ ...state, slots: repairAllArmor(state.slots) });
  };

  const handleClickSlot = (slot: ArmorSlot) => {
    if (slot.state === 'used' || slot.state === 'damaged') {
      onChange({ ...state, slots: repairArmorSlot(state.slots, slot.id) });
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5" />
            Armor
          </h3>
          <span className="text-muted-foreground text-lg font-medium">
            {current} / {max}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseArmor}
            disabled={current <= 0}
          >
            <ShieldOff className="mr-1 h-4 w-4" />
            Use Armor
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRepairAll}
            disabled={current >= max}
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Repair All
          </Button>
        </div>

        {/* Slots by Source */}
        <div className="space-y-3">
          {Array.from(groupedSlots.entries()).map(([source, slots]) => (
            <div key={source}>
              <div className="text-muted-foreground mb-1.5 text-xs font-medium">
                {source}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {slots.map(slot => (
                  <ArmorSlotIcon
                    key={slot.id}
                    slot={slot}
                    size="md"
                    onClick={
                      slot.state === 'used' || slot.state === 'damaged'
                        ? () => handleClickSlot(slot)
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <Separator />
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-slate-500" />
            Available
          </span>
          <span className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-amber-500" />
            Used
          </span>
          <span className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-orange-500/50" />
            Damaged
          </span>
          <span className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-red-500/30" />
            Broken
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
}
