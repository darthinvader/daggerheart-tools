import { Minus, Package, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { PartyInventoryItem } from '@/lib/schemas/campaign';

interface PartyInventoryProps {
  items: PartyInventoryItem[];
  onUpdate: (items: PartyInventoryItem[]) => void;
}

export function PartyInventory({ items, onUpdate }: PartyInventoryProps) {
  const [newItemName, setNewItemName] = useState('');

  const handleAdd = useCallback(() => {
    const name = newItemName.trim();
    if (!name) return;
    onUpdate([...items, { name, quantity: 1, notes: '' }]);
    setNewItemName('');
  }, [items, newItemName, onUpdate]);

  const handleRemove = useCallback(
    (index: number) => {
      onUpdate(items.filter((_, i) => i !== index));
    },
    [items, onUpdate]
  );

  const handleQuantityChange = useCallback(
    (index: number, delta: number) => {
      onUpdate(
        items.map((item, i) => {
          if (i !== index) return item;
          const next = item.quantity + delta;
          return { ...item, quantity: Math.max(1, next) };
        })
      );
    },
    [items, onUpdate]
  );

  const handleNotesChange = useCallback(
    (index: number, notes: string) => {
      onUpdate(
        items.map((item, i) => (i === index ? { ...item, notes } : item))
      );
    },
    [items, onUpdate]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-4 w-4 text-amber-500" />
          Party Loot
        </CardTitle>
        <CardDescription>
          Track shared items, treasure, and loot the party has found.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add item row */}
        <form
          className="flex gap-2"
          onSubmit={e => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <Input
            placeholder="Item name…"
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={!newItemName.trim()}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </form>

        {/* Inventory list */}
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <div className="bg-muted mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full">
              <Package className="text-muted-foreground h-5 w-5" />
            </div>
            <p className="text-muted-foreground text-sm">
              No items yet. Add loot the party has found above.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="flex items-center gap-2 py-2"
              >
                {/* Quantity controls */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleQuantityChange(index, -1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleQuantityChange(index, 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Name + notes */}
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium">{item.name}</span>
                  <Input
                    placeholder="Notes…"
                    value={item.notes}
                    onChange={e => handleNotesChange(index, e.target.value)}
                    className="mt-1 h-7 text-xs"
                  />
                </div>

                {/* Remove */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-7 w-7 shrink-0"
                  onClick={() => handleRemove(index)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
