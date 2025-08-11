// React import not required with automatic JSX runtime
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

type Props = {
  slot: InventorySlot;
  index: number;
  expanded: boolean;
  onToggleExpanded: (index: number) => void;
  onIncQty: (index: number, delta: number) => void;
  onToggleEquipped: (index: number, checked: boolean) => void;
  onChangeLocation: (index: number, loc: InventorySlot['location']) => void;
  onRemove: (index: number) => void;
};

export function SlotRow({
  slot: s,
  index: idx,
  expanded,
  onToggleExpanded,
  onIncQty,
  onToggleEquipped,
  onChangeLocation,
  onRemove,
}: Props) {
  return (
    <div className="border-muted rounded border">
      <button
        type="button"
        className="hover:bg-muted/50 flex w-full items-center justify-between p-2 text-left"
        onClick={() => onToggleExpanded(idx)}
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{s.item.name}</div>
          <div className="text-muted-foreground text-xs">
            {s.item.rarity} • Tier {s.item.tier}
          </div>
        </div>
        <div className="text-muted-foreground text-xs">Details</div>
      </button>
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
      {expanded ? (
        <div className="text-muted-foreground border-t p-2 text-xs">
          {s.item.description ? (
            <div className="mb-1">{s.item.description}</div>
          ) : null}
          {Array.isArray(s.item.features) && s.item.features.length ? (
            <ul className="list-disc pl-4">
              {s.item.features.map((f, i) => (
                <li key={i}>
                  <span className="font-medium">{f.name}:</span> {f.description}
                </li>
              ))}
            </ul>
          ) : (
            <div>No extra details.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
