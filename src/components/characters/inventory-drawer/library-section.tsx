import {
  type CategoryFilter,
  InventoryFiltersToolbar,
} from '@/components/characters/inventory-drawer/inventory-filters-toolbar';
import {
  type LibraryItem,
  LibraryResultsList,
} from '@/components/characters/inventory-drawer/library-results-list';
import { Input } from '@/components/ui/input';

export type SelectedMap = Record<
  string,
  { quantity: number; isEquipped?: boolean; location?: string } | undefined
>;

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  category: CategoryFilter;
  onCategoryChange: (next: CategoryFilter) => void;
  rarity: '' | 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  onRarityChange: (
    next: '' | 'Common' | 'Uncommon' | 'Rare' | 'Legendary'
  ) => void;
  tier: '' | '1' | '2' | '3' | '4';
  onTierChange: (next: '' | '1' | '2' | '3' | '4') => void;
  items: LibraryItem[];
  selectedByName: SelectedMap;
  onAdd: (name: string | null) => void;
  onDecrement: (name: string) => void;
  onRemoveAll: (name: string) => void;
  onToggleEquipped: (name: string) => void;
};

export function LibrarySection({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  rarity,
  onRarityChange,
  tier,
  onTierChange,
  items,
  selectedByName,
  onAdd,
  onDecrement,
  onRemoveAll,
  onToggleEquipped,
}: Props) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">Add from library</div>
      <Input
        placeholder="Search items"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        inputMode="search"
        enterKeyHint="search"
      />
      {/* Filters */}
      <InventoryFiltersToolbar
        category={category}
        onCategoryChange={onCategoryChange}
        rarity={rarity}
        onRarityChange={onRarityChange}
        tier={tier}
        onTierChange={onTierChange}
        className="grid grid-cols-1 gap-2 sm:grid-cols-3"
      />
      {/* Browsable results list with accents */}
      <div className="max-h-[45dvh] overflow-auto rounded border">
        <LibraryResultsList
          items={items}
          selectedByName={selectedByName}
          onAdd={onAdd}
          onDecrement={onDecrement}
          onRemoveAll={onRemoveAll}
          onToggleEquipped={onToggleEquipped}
        />
      </div>
    </div>
  );
}
