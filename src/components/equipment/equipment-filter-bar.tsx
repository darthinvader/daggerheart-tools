import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
          ⚔️ Primary
          {state.primaryWeapon && (
            <Badge variant="secondary" className="size-2 p-0" />
          )}
        </ToggleGroupItem>
        <ToggleGroupItem value="secondary" size="sm" className="gap-1">
          🗡️ Secondary
          {state.secondaryWeapon && (
            <Badge variant="secondary" className="size-2 p-0" />
          )}
        </ToggleGroupItem>
        <ToggleGroupItem value="armor" size="sm" className="gap-1">
          🛡️ Armor
          {state.armor && <Badge variant="secondary" className="size-2 p-0" />}
        </ToggleGroupItem>
        <ToggleGroupItem value="wheelchair" size="sm" className="gap-1">
          ♿ Wheelchair
          {state.useCombatWheelchair && (
            <Badge variant="secondary" className="size-2 p-0" />
          )}
        </ToggleGroupItem>
        <ToggleGroupItem value="custom" size="sm" className="gap-1">
          ✨ Custom
          {state.customSlots.length > 0 && (
            <Badge variant="secondary" className="px-1 text-xs">
              {state.customSlots.length}
            </Badge>
          )}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
