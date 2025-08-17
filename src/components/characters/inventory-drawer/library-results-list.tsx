// no React import needed with automatic JSX runtime
import { VirtualList } from '@/components/ui/virtual-list';
import type {
  ArmorModification,
  Consumable,
  Potion,
  Recipe,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';

import { ItemMeta } from './library/item-meta';
import { ItemActions } from './presenters/ItemActions';
import { ItemBadges } from './presenters/ItemBadges';
import { ItemFeatures } from './presenters/ItemFeatures';
import { emojiForItem } from './presenters/emoji';

// no React import needed with automatic JSX runtime

export type LibraryItem =
  | UtilityItem
  | Consumable
  | Potion
  | Relic
  | WeaponModification
  | ArmorModification
  | Recipe;

export type SelectedInfo = {
  quantity: number;
  isEquipped?: boolean;
  location?: string;
};

export type LibraryResultsListProps = {
  items: LibraryItem[];
  selectedByName: Record<string, SelectedInfo | undefined>;
  onAdd: (name: string) => void;
  onDecrement: (name: string) => void;
  onRemoveAll: (name: string) => void;
  onToggleEquipped: (name: string) => void;
};

// emoji helper moved to presenters/emoji.ts

export function LibraryResultsList({
  items,
  selectedByName,
  onAdd,
  onDecrement,
  onRemoveAll,
  onToggleEquipped,
}: LibraryResultsListProps) {
  if (!items.length) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No items match your search and filters.
      </div>
    );
  }

  function RowContent({
    item: it,
    index: _index,
  }: {
    item: LibraryItem;
    index: number;
  }) {
    const sel = selectedByName[it.name];
    const selected = !!sel && (sel.quantity ?? 0) > 0;
    const qty = sel?.quantity ?? 0;
    const emoji = emojiForItem(it);
    const equipped = !!(sel?.isEquipped || sel?.location === 'equipped');
    return (
      <div className="p-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <ItemActions
            selected={selected}
            qty={qty}
            equipped={equipped}
            name={it.name}
            onAdd={onAdd}
            onDecrement={onDecrement}
            onRemoveAll={onRemoveAll}
            onToggleEquipped={onToggleEquipped}
          />

          <div className="order-2 min-w-0 flex-1 sm:order-1">
            <div className="text-sm font-semibold break-words">
              <span className="mr-1" aria-hidden>
                {emoji}
              </span>
              {it.name}
              {selected && qty > 1 ? (
                <span className="ml-2 rounded bg-blue-100 px-1 py-0.5 text-[11px] text-blue-900 dark:bg-blue-500/20 dark:text-blue-200">
                  x{qty}
                </span>
              ) : null}
            </div>
            <ItemBadges item={it} />
            <ItemFeatures item={it} />
            {(() => {
              // Utility
              if ((it as { category?: string }).category === 'Utility') {
                return <ItemMeta item={it as UtilityItem} />;
              }
              // Consumable (includes Potion)
              if ((it as { category?: string }).category === 'Consumable') {
                return <ItemMeta item={it as Consumable | Potion} />;
              }
              // Relic
              if ((it as { category?: string }).category === 'Relic') {
                return <ItemMeta item={it as Relic} />;
              }
              // Weapon Modification
              if (
                (it as { category?: string }).category === 'Weapon Modification'
              ) {
                return <ItemMeta item={it as WeaponModification} />;
              }
              // Armor Modification
              if (
                (it as { category?: string }).category === 'Armor Modification'
              ) {
                return <ItemMeta item={it as ArmorModification} />;
              }
              // Recipe
              if ((it as { category?: string }).category === 'Recipe') {
                return <ItemMeta item={it as Recipe} />;
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <VirtualList
      items={items}
      getKey={it => it.name}
      estimateSize={() => 96}
      overscan={12}
      ariaLabel="Inventory library results"
      smallListThreshold={30}
      // Apply text size to container; ul already has divide classes inside VirtualList
      className="text-sm"
      renderRow={({ item, index }) => <RowContent item={item} index={index} />}
    />
  );
}
