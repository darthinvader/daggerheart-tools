import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Axe, Shield, Sparkles, Sword, Wheelchair } from '@/lib/icons';

import type { EquipmentState } from './equipment-editor';

export type EquipmentFilter =
  | 'all'
  | 'primary'
  | 'secondary'
  | 'armor'
  | 'wheelchair'
  | 'custom';

interface EquipmentFilterBarProps {
  filter: EquipmentFilter;
  onFilterChange: (filter: EquipmentFilter) => void;
  state: EquipmentState;
}

export function EquipmentFilterBar({
  filter,
  onFilterChange,
  state,
}: EquipmentFilterBarProps) {
  const handleChange = (value: string) => {
    onFilterChange((value || 'all') as EquipmentFilter);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Filter:</span>
      <ToggleGroup
        type="single"
        value={filter}
        onValueChange={handleChange}
        className="flex-wrap"
      >
        <ToggleGroupItem value="all" size="sm">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="primary" size="sm" className="gap-1">
          <Sword className="h-4 w-4" /> Primary
          {state.primaryWeapon && (
            <Badge variant="secondary" className="size-2 p-0" />
          )}
        </ToggleGroupItem>
        <ToggleGroupItem value="secondary" size="sm" className="gap-1">
          <Axe className="h-4 w-4" /> Secondary
          {state.secondaryWeapon && (
            <Badge variant="secondary" className="size-2 p-0" />
          )}
        </ToggleGroupItem>
        <ToggleGroupItem value="armor" size="sm" className="gap-1">
          <Shield className="h-4 w-4" /> Armor
          {state.armor && <Badge variant="secondary" className="size-2 p-0" />}
        </ToggleGroupItem>
        <ToggleGroupItem value="wheelchair" size="sm" className="gap-1">
          <Wheelchair className="h-4 w-4" /> Wheelchair
          {state.useCombatWheelchair && (
            <Badge variant="secondary" className="size-2 p-0" />
          )}
        </ToggleGroupItem>
        <ToggleGroupItem value="custom" size="sm" className="gap-1">
          <Sparkles className="h-4 w-4" /> Custom
          {(state.customSlots?.length ?? 0) > 0 && (
            <Badge variant="secondary" className="px-1 text-xs">
              {state.customSlots?.length ?? 0}
            </Badge>
          )}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
