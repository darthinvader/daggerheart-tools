import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { InventorySlot } from '@/lib/schemas/equipment';

export function SlotRowHeader({
  s,
  idx,
  onIncQty,
  onToggleEquipped,
  onChangeLocation,
  onRemove,
}: {
  s: InventorySlot;
  idx: number;
  onIncQty: (index: number, delta: number) => void;
  onToggleEquipped: (index: number, checked: boolean) => void;
  onChangeLocation: (index: number, loc: InventorySlot['location']) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 pt-0">
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label="Decrease quantity"
        onClick={() => onIncQty(idx, -1)}
      >
        -
      </Button>
      <div className="w-8 text-center tabular-nums">{s.quantity}</div>
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label="Increase quantity"
        onClick={() => onIncQty(idx, 1)}
      >
        +
      </Button>
      <div className="flex items-center gap-1">
        <Label htmlFor={`equipped-${idx}`} className="text-xs">
          Eqp
        </Label>
        <Switch
          id={`equipped-${idx}`}
          checked={!!s.isEquipped}
          onCheckedChange={checked => onToggleEquipped(idx, !!checked)}
          aria-label="Equipped"
        />
      </div>
      <Select
        value={s.location}
        onValueChange={val =>
          onChangeLocation(idx, val as InventorySlot['location'])
        }
      >
        <SelectTrigger className="w-[8.25rem]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="backpack">Backpack</SelectItem>
          <SelectItem value="belt">Belt</SelectItem>
          <SelectItem value="equipped">Equipped</SelectItem>
          <SelectItem value="stored">Stored</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        aria-label="Remove"
        onClick={() => onRemove(idx)}
      >
        Remove
      </Button>
    </div>
  );
}
