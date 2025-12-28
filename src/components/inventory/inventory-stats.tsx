import { Plus, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { InventoryState } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

export function EmptyInventoryDisplay({
  maxSlots,
  unlimitedSlots,
  onAddClick,
  onCustomClick,
}: {
  maxSlots: number;
  unlimitedSlots?: boolean;
  onAddClick?: () => void;
  onCustomClick?: () => void;
}) {
  const hasActions = onAddClick || onCustomClick;

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">🎒</span>
      <p className="text-muted-foreground mt-2">Inventory is empty</p>
      <p className="text-muted-foreground text-sm">
        {hasActions
          ? 'Add some items from the catalog or create your own custom items.'
          : 'Click edit to add items to your inventory'}
      </p>
      <Badge variant="outline" className="mt-3 gap-1">
        🎒 {unlimitedSlots ? '0/∞' : `0/${maxSlots}`} slots
      </Badge>
      {hasActions && (
        <div className="mt-4 flex gap-2">
          {onCustomClick && (
            <Button variant="outline" onClick={onCustomClick}>
              <Sparkles className="mr-1 size-4" />
              Create Custom
            </Button>
          )}
          {onAddClick && (
            <Button onClick={onAddClick}>
              <Plus className="mr-1 size-4" />
              Browse Items
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function InventoryStats({ inventory }: { inventory: InventoryState }) {
  const totalItems = inventory.items.length;
  const equippedItems = inventory.items.filter(i => i.isEquipped).length;
  const customItems = inventory.items.filter(i => i.isCustom).length;
  const totalQuantity = inventory.items.reduce((sum, i) => sum + i.quantity, 0);
  const unlimitedSlots = inventory.unlimitedSlots;

  return (
    <div className="flex flex-wrap gap-2">
      <SmartTooltip content="Total unique items">
        <Badge variant="outline" className="gap-1">
          📦 {totalItems} Item{totalItems !== 1 ? 's' : ''}
        </Badge>
      </SmartTooltip>
      {equippedItems > 0 && (
        <SmartTooltip content="Currently equipped items">
          <Badge
            variant="outline"
            className="gap-1 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30"
          >
            ✅ {equippedItems} Equipped
          </Badge>
        </SmartTooltip>
      )}
      {customItems > 0 && (
        <SmartTooltip content="Custom/homebrew items">
          <Badge
            variant="outline"
            className="gap-1 border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30"
          >
            ✨ {customItems} Custom
          </Badge>
        </SmartTooltip>
      )}
      <SmartTooltip
        content={
          unlimitedSlots
            ? 'Unlimited slots'
            : `${totalQuantity}/${inventory.maxSlots} slots used`
        }
      >
        <Badge
          variant="outline"
          className={cn(
            'gap-1',
            !unlimitedSlots && totalQuantity >= inventory.maxSlots
              ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/30'
              : ''
          )}
        >
          🎒{' '}
          {unlimitedSlots
            ? `${totalQuantity}/∞`
            : `${totalQuantity}/${inventory.maxSlots}`}
        </Badge>
      </SmartTooltip>
    </div>
  );
}
