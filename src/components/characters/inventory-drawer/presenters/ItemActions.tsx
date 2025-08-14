import { Button } from '@/components/ui/button';

export function ItemActions({
  selected,
  qty,
  equipped,
  name,
  onAdd,
  onDecrement,
  onRemoveAll,
  onToggleEquipped,
}: {
  selected: boolean;
  qty: number;
  equipped: boolean;
  name: string;
  onAdd: (name: string) => void;
  onDecrement: (name: string) => void;
  onRemoveAll: (name: string) => void;
  onToggleEquipped: (name: string) => void;
}) {
  return (
    <div className="order-1 flex items-center gap-1 sm:order-2">
      {selected ? (
        <>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-6 w-6 text-xs"
            onClick={() => onDecrement(name)}
            aria-label="Decrease quantity"
          >
            –
          </Button>
          <div className="w-8 text-center text-xs tabular-nums">{qty}</div>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-6 w-6 text-xs"
            onClick={() => onAdd(name)}
            aria-label="Increase quantity"
          >
            +
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-6 px-2 text-xs"
            variant={equipped ? 'default' : 'outline'}
            onClick={() => onToggleEquipped(name)}
            aria-label="Toggle equipped"
          >
            {equipped ? 'Equipped' : 'Equip'}
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-6 px-2 text-xs"
            variant="ghost"
            onClick={() => onRemoveAll(name)}
            aria-label="Remove from inventory"
          >
            Remove
          </Button>
        </>
      ) : (
        <Button
          type="button"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => onAdd(name)}
          aria-label="Add to inventory"
        >
          Add
        </Button>
      )}
    </div>
  );
}
