import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EquipmentTier, Rarity } from '@/lib/schemas/equipment';

import {
  ALL_CATEGORIES,
  ALL_RARITIES,
  ALL_TIERS,
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
  TIER_CONFIG,
} from './constants';

interface ItemPropertySelectorsProps {
  category: ItemCategory;
  rarity: Rarity;
  tier: EquipmentTier;
  onCategoryChange: (cat: ItemCategory) => void;
  onRarityChange: (rarity: Rarity) => void;
  onTierChange: (tier: EquipmentTier) => void;
}

export function ItemPropertySelectors({
  category,
  rarity,
  tier,
  onCategoryChange,
  onRarityChange,
  onTierChange,
}: ItemPropertySelectorsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="space-y-2">
        <Label>📁 Category</Label>
        <Select
          value={category}
          onValueChange={v => onCategoryChange(v as ItemCategory)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            {ALL_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_CONFIG[cat].emoji} {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>💎 Rarity</Label>
        <Select value={rarity} onValueChange={v => onRarityChange(v as Rarity)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            {ALL_RARITIES.map(r => (
              <SelectItem key={r} value={r}>
                {RARITY_CONFIG[r].emoji} {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>🏆 Tier</Label>
        <Select
          value={tier}
          onValueChange={v => onTierChange(v as EquipmentTier)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            {ALL_TIERS.map(t => (
              <SelectItem key={t} value={t}>
                {TIER_CONFIG[t].emoji} {TIER_CONFIG[t].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
