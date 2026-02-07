import { Badge } from '@/components/ui/badge';
import { Folder, Gem, Trophy } from '@/lib/icons';
import type { EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import {
  ALL_CATEGORIES,
  ALL_RARITIES,
  ALL_TIERS,
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
  TIER_CONFIG,
} from './constants';

export interface InventoryFilters {
  categories: ItemCategory[];
  rarities: Rarity[];
  tiers: EquipmentTier[];
}

interface InventoryFiltersPanelProps {
  filters: InventoryFilters;
  onToggleCategory: (cat: ItemCategory) => void;
  onToggleRarity: (rarity: Rarity) => void;
  onToggleTier: (tier: EquipmentTier) => void;
}

export function InventoryFiltersPanel({
  filters,
  onToggleCategory,
  onToggleRarity,
  onToggleTier,
}: InventoryFiltersPanelProps) {
  return (
    <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
      <CategoryFilter
        selectedCategories={filters.categories}
        onToggle={onToggleCategory}
      />
      <RarityFilter
        selectedRarities={filters.rarities}
        onToggle={onToggleRarity}
      />
      <TierFilter selectedTiers={filters.tiers} onToggle={onToggleTier} />
    </div>
  );
}

function CategoryFilter({
  selectedCategories,
  onToggle,
}: {
  selectedCategories: ItemCategory[];
  onToggle: (cat: ItemCategory) => void;
}) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
        <Folder className="inline-block size-4" /> Category
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {ALL_CATEGORIES.map(cat => {
          const config = CATEGORY_CONFIG[cat];
          return (
            <Badge
              key={cat}
              variant={selectedCategories.includes(cat) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                selectedCategories.includes(cat) &&
                  `${config.bgColor} ${config.color}`
              )}
              role="button"
              tabIndex={0}
              onClick={() => onToggle(cat)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggle(cat);
                }
              }}
            >
              <config.icon className="size-3" /> {cat}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

function RarityFilter({
  selectedRarities,
  onToggle,
}: {
  selectedRarities: Rarity[];
  onToggle: (rarity: Rarity) => void;
}) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
        <Gem className="inline-block size-4" /> Rarity
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {ALL_RARITIES.map(rarity => {
          const config = RARITY_CONFIG[rarity];
          return (
            <Badge
              key={rarity}
              variant={
                selectedRarities.includes(rarity) ? 'default' : 'outline'
              }
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                selectedRarities.includes(rarity) &&
                  `${config.bgColor} ${config.color}`
              )}
              role="button"
              tabIndex={0}
              onClick={() => onToggle(rarity)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggle(rarity);
                }
              }}
            >
              <config.icon className="size-3" /> {rarity}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

function TierFilter({
  selectedTiers,
  onToggle,
}: {
  selectedTiers: EquipmentTier[];
  onToggle: (tier: EquipmentTier) => void;
}) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
        <Trophy className="inline-block size-4" /> Tier
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {ALL_TIERS.map(tier => {
          const config = TIER_CONFIG[tier];
          return (
            <Badge
              key={tier}
              variant={selectedTiers.includes(tier) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                selectedTiers.includes(tier) && config.color
              )}
              role="button"
              tabIndex={0}
              onClick={() => onToggle(tier)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggle(tier);
                }
              }}
            >
              <config.icon className="size-3" /> {config.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
