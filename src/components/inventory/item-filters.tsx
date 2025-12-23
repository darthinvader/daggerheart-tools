import { Badge } from '@/components/ui/badge';
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
}

export function ItemFilters({
  selectedCategories,
  selectedRarities,
  selectedTiers,
  onToggleCategory,
  onToggleRarity,
  onToggleTier,
}: ItemFiltersProps) {
  return (
    <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
      <div>
        <h4 className="mb-2 text-sm font-medium">📁 Category</h4>
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
                {config.emoji} {cat}
              </Badge>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">💎 Rarity</h4>
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
                {config.emoji} {rarity}
              </Badge>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">🏆 Tier</h4>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TIERS.map(tier => {
            const config = TIER_CONFIG[tier];
            return (
              <Badge
                key={tier}
                variant={selectedTiers.includes(tier) ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-all',
                  selectedTiers.includes(tier) && config.color
                )}
                onClick={() => onToggleTier(tier)}
              >
                {config.emoji} {config.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
