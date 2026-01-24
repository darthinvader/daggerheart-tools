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

interface ItemFiltersProps {
  selectedCategories: ItemCategory[];
  selectedRarities: Rarity[];
  selectedTiers: EquipmentTier[];
  onToggleCategory: (cat: ItemCategory) => void;
  onToggleRarity: (rarity: Rarity) => void;
  onToggleTier: (tier: EquipmentTier) => void;
  allowedTiers?: string[];
  lockTiers?: boolean;
}

export function ItemFilters({
  selectedCategories,
  selectedRarities,
  selectedTiers,
  onToggleCategory,
  onToggleRarity,
  onToggleTier,
  allowedTiers,
  lockTiers = false,
}: ItemFiltersProps) {
  const tiersToShow =
    allowedTiers && allowedTiers.length > 0
      ? ALL_TIERS.filter(tier => allowedTiers.includes(tier))
      : ALL_TIERS;

  return (
    <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
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
                variant={
                  selectedCategories.includes(cat) ? 'default' : 'outline'
                }
                className={cn(
                  'cursor-pointer transition-all',
                  selectedCategories.includes(cat) &&
                    `${config.bgColor} ${config.color}`
                )}
                onClick={() => onToggleCategory(cat)}
              >
                <config.icon className="size-3" /> {cat}
              </Badge>
            );
          })}
        </div>
      </div>

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
                  'cursor-pointer transition-all',
                  selectedRarities.includes(rarity) &&
                    `${config.bgColor} ${config.color}`
                )}
                onClick={() => onToggleRarity(rarity)}
              >
                <config.icon className="size-3" /> {rarity}
              </Badge>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
          <Trophy className="inline-block size-4" /> Tier
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {tiersToShow.map(tier => {
            const config = TIER_CONFIG[tier];
            return (
              <Badge
                key={tier}
                variant={selectedTiers.includes(tier) ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-all',
                  selectedTiers.includes(tier) && config.color
                )}
                onClick={() => !lockTiers && onToggleTier(tier)}
                aria-disabled={lockTiers}
              >
                <config.icon className="size-3" /> {config.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
