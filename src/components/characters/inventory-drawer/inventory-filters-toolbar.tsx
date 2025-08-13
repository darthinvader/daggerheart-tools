// no React import needed with automatic JSX runtime
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type CategoryFilter =
  | ''
  | 'Utility'
  | 'Consumable'
  | 'Potion'
  | 'Relic'
  | 'Weapon Modification'
  | 'Armor Modification'
  | 'Recipe';

export type InventoryFiltersToolbarProps = {
  category: CategoryFilter;
  onCategoryChange: (v: CategoryFilter) => void;
  rarity: '' | 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  onRarityChange: (
    v: '' | 'Common' | 'Uncommon' | 'Rare' | 'Legendary'
  ) => void;
  tier: '' | '1' | '2' | '3' | '4';
  onTierChange: (v: '' | '1' | '2' | '3' | '4') => void;
  className?: string;
};

export function InventoryFiltersToolbar({
  category,
  onCategoryChange,
  rarity,
  onRarityChange,
  tier,
  onTierChange,
  className,
}: InventoryFiltersToolbarProps) {
  return (
    <div className={className ?? 'grid grid-cols-1 gap-2 sm:grid-cols-3'}>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="text-muted-foreground text-xs">Category</div>
        <Select
          value={(category || 'all') as string}
          onValueChange={(v: string) =>
            onCategoryChange(v === 'all' ? '' : (v as CategoryFilter))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Utility">Utility</SelectItem>
            <SelectItem value="Consumable">Consumable</SelectItem>
            <SelectItem value="Potion">Potion</SelectItem>
            <SelectItem value="Relic">Relic</SelectItem>
            <SelectItem value="Weapon Modification">
              Weapon Modification
            </SelectItem>
            <SelectItem value="Armor Modification">
              Armor Modification
            </SelectItem>
            <SelectItem value="Recipe">Recipe</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="text-muted-foreground text-xs">Rarity</div>
        <Select
          value={(rarity || 'all') as string}
          onValueChange={(v: string) =>
            onRarityChange(v === 'all' ? '' : (v as typeof rarity))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Common">Common</SelectItem>
            <SelectItem value="Uncommon">Uncommon</SelectItem>
            <SelectItem value="Rare">Rare</SelectItem>
            <SelectItem value="Legendary">Legendary</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="text-muted-foreground text-xs">Tier</div>
        <Select
          value={(tier || 'all') as string}
          onValueChange={(v: string) =>
            onTierChange(v === 'all' ? '' : (v as typeof tier))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
