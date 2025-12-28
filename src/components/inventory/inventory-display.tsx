import { Minus, Plus, Search } from 'lucide-react';

import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { InventoryState } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { InventoryEditor } from './inventory-editor';

interface InventoryDisplayProps {
  inventory: InventoryState;
  onChange?: (inventory: InventoryState) => void;
  className?: string;
  readOnly?: boolean;
}

function EmptyInventoryDisplay({
  maxSlots,
  unlimitedSlots,
}: {
  maxSlots: number;
  unlimitedSlots?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">🎒</span>
      <p className="text-muted-foreground mt-2">Inventory is empty</p>
      <p className="text-muted-foreground text-sm">
        Click edit to add items to your inventory
      </p>
      <Badge variant="outline" className="mt-3 gap-1">
        🎒 {unlimitedSlots ? '0/∞' : `0/${maxSlots}`} slots
      </Badge>
    </div>
  );
}

function InventoryStats({
  inventory,
  unlimitedSlots,
}: {
  inventory: InventoryState;
  unlimitedSlots?: boolean;
}) {
  const totalItems = inventory.items.length;
  const equippedItems = inventory.items.filter(i => i.isEquipped).length;
  const customItems = inventory.items.filter(i => i.isCustom).length;
  const totalQuantity = inventory.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex flex-wrap gap-2">
      <SmartTooltip content="Total unique items">
        <Badge variant="outline" className="gap-1">
          📦 {totalItems} Item{totalItems !== 1 ? 's' : ''}
        </Badge>
      </SmartTooltip>
      {totalQuantity > totalItems && (
        <SmartTooltip content="Total quantity including stacks">
          <Badge
            variant="outline"
            className="gap-1 border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
          >
            🔢 {totalQuantity} Total
          </Badge>
        </SmartTooltip>
      )}
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
            : `${totalItems}/${inventory.maxSlots} slots used`
        }
      >
        <Badge
          variant="outline"
          className={cn(
            'gap-1',
            !unlimitedSlots && totalItems >= inventory.maxSlots
              ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/30'
              : ''
          )}
        >
          🎒{' '}
          {unlimitedSlots
            ? `${totalItems}/∞`
            : `${totalItems}/${inventory.maxSlots}`}
        </Badge>
      </SmartTooltip>
    </div>
  );
}

interface CompactInventoryListProps {
  inventory: InventoryState;
  searchQuery?: string;
  onQuantityChange?: (id: string, delta: number) => void;
  readOnly?: boolean;
}

function CompactInventoryList({
  inventory,
  searchQuery,
  onQuantityChange,
  readOnly,
}: CompactInventoryListProps) {
  const filteredItems = searchQuery
    ? inventory.items.filter(entry =>
        entry.item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : inventory.items;

  const groupedByLocation = filteredItems.reduce<
    Record<string, typeof inventory.items>
  >((acc, item) => {
    const location = item.location ?? 'backpack';
    if (!acc[location]) acc[location] = [];
    acc[location].push(item);
    return acc;
  }, {});

  const locationEmojis: Record<string, string> = {
    backpack: '🎒',
    equipped: '⚔️',
    saddlebags: '🐴',
    companion: '🐕',
  };

  if (filteredItems.length === 0 && searchQuery) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No items match &quot;{searchQuery}&quot;
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedByLocation).map(([location, items]) => (
        <div key={location}>
          <h5 className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <span>{locationEmojis[location] ?? '📍'}</span>
            <span className="capitalize">{location}</span>
            <span className="text-muted-foreground">({items.length})</span>
          </h5>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(entry => (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-3',
                  entry.isEquipped &&
                    'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/20',
                  entry.isCustom &&
                    'border-purple-300 bg-purple-50/50 dark:border-purple-700 dark:bg-purple-900/20'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getItemEmoji(entry.item)}</span>
                  <div>
                    <p className="text-sm font-medium">{entry.item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      ×{entry.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!readOnly && onQuantityChange && (
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => onQuantityChange(entry.id, -1)}
                        disabled={entry.quantity <= 1}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => onQuantityChange(entry.id, 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  )}
                  {entry.isEquipped && (
                    <Badge variant="secondary" className="text-xs">
                      ⚔️
                    </Badge>
                  )}
                  {entry.isCustom && (
                    <Badge variant="secondary" className="text-xs">
                      ✨
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const ITEM_EMOJI_MAP: Record<string, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  potion: '🧪',
  tool: '🔧',
  scroll: '📜',
  food: '🍖',
  gem: '💎',
  book: '📚',
};

function getItemEmoji(item: { category?: string; type?: string }): string {
  const searchStr = `${item.category ?? ''} ${item.type ?? ''}`.toLowerCase();
  for (const [key, emoji] of Object.entries(ITEM_EMOJI_MAP)) {
    if (searchStr.includes(key)) return emoji;
  }
  return '📦';
}

interface InventoryContentProps {
  inventory: InventoryState;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onQuantityChange?: (id: string, delta: number) => void;
  onMaxSlotsChange?: (delta: number) => void;
  readOnly?: boolean;
}

function InventoryContent({
  inventory,
  searchQuery = '',
  onSearchChange,
  onQuantityChange,
  onMaxSlotsChange,
  readOnly,
}: InventoryContentProps) {
  const hasItems = inventory.items.length > 0;

  if (!hasItems) {
    return (
      <EmptyInventoryDisplay
        maxSlots={inventory.maxSlots}
        unlimitedSlots={inventory.unlimitedSlots}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <InventoryStats
          inventory={inventory}
          unlimitedSlots={inventory.unlimitedSlots}
        />
        <div className="flex items-center gap-2">
          {!readOnly && onMaxSlotsChange && !inventory.unlimitedSlots && (
            <div className="flex items-center gap-1">
              <SmartTooltip content="Decrease max slots">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => onMaxSlotsChange(-1)}
                  disabled={inventory.maxSlots <= inventory.items.length}
                >
                  <Minus className="size-3" />
                </Button>
              </SmartTooltip>
              <SmartTooltip content="Increase max slots">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => onMaxSlotsChange(1)}
                >
                  <Plus className="size-3" />
                </Button>
              </SmartTooltip>
            </div>
          )}
          {onSearchChange && inventory.items.length > 5 && (
            <div className="relative w-full sm:w-auto">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pl-9 sm:w-48"
              />
            </div>
          )}
        </div>
      </div>
      <Separator />
      <CompactInventoryList
        inventory={inventory}
        searchQuery={searchQuery}
        onQuantityChange={onQuantityChange}
        readOnly={readOnly}
      />
    </div>
  );
}

export function InventoryDisplay({
  inventory,
  onChange,
  className,
  readOnly = false,
}: InventoryDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftInventory, setDraftInventory] =
    useState<InventoryState>(inventory);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraftInventory(inventory);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, inventory]);

  const handleSave = useCallback(() => {
    onChange?.(draftInventory);
  }, [draftInventory, onChange]);

  const handleCancel = useCallback(() => {
    setDraftInventory(inventory);
  }, [inventory]);

  const handleChange = useCallback((newInventory: InventoryState) => {
    setDraftInventory(newInventory);
  }, []);

  const handleQuantityChange = useCallback(
    (id: string, delta: number) => {
      const updated: InventoryState = {
        ...inventory,
        items: inventory.items.map(item => {
          if (item.id !== id) return item;
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }),
      };
      onChange?.(updated);
    },
    [inventory, onChange]
  );

  const handleMaxSlotsChange = useCallback(
    (delta: number) => {
      const newMax = Math.max(
        inventory.items.length,
        inventory.maxSlots + delta
      );
      onChange?.({
        ...inventory,
        maxSlots: newMax,
      });
    },
    [inventory, onChange]
  );

  return (
    <EditableSection
      title="Inventory"
      emoji="🎒"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="xl"
      className={cn(className)}
      editTitle="Manage Inventory"
      editDescription="Add, remove, and organize items in your inventory."
      editContent={
        <InventoryEditor value={draftInventory} onChange={handleChange} />
      }
    >
      <InventoryContent
        inventory={inventory}
        searchQuery={searchQuery}
        onSearchChange={readOnly ? undefined : setSearchQuery}
        onQuantityChange={readOnly ? undefined : handleQuantityChange}
        onMaxSlotsChange={readOnly ? undefined : handleMaxSlotsChange}
        readOnly={readOnly}
      />
    </EditableSection>
  );
}
