import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Folder, Gem, Trophy } from '@/lib/icons';
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
        <Label className="flex items-center gap-1">
          <Folder className="inline-block size-4" /> Category
        </Label>
        <Select
          value={category}
          onValueChange={v => onCategoryChange(v as ItemCategory)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            {ALL_CATEGORIES.map(cat => {
              const CatIcon = CATEGORY_CONFIG[cat].icon;
              return (
                <SelectItem key={cat} value={cat}>
                  <span className="flex items-center gap-1.5">
                    <CatIcon className="size-3" /> {cat}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <Gem className="inline-block size-4" /> Rarity
        </Label>
        <Select value={rarity} onValueChange={v => onRarityChange(v as Rarity)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            {ALL_RARITIES.map(r => {
              const RarityIcon = RARITY_CONFIG[r].icon;
              return (
                <SelectItem key={r} value={r}>
                  <span className="flex items-center gap-1.5">
                    <RarityIcon className="size-3" /> {r}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <Trophy className="inline-block size-4" /> Tier
        </Label>
        <Select
          value={tier}
          onValueChange={v => onTierChange(v as EquipmentTier)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            {ALL_TIERS.map(t => {
              const TierIcon = TIER_CONFIG[t].icon;
              return (
                <SelectItem key={t} value={t}>
                  <span className="flex items-center gap-1.5">
                    <TierIcon className="size-3" /> {TIER_CONFIG[t].label}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
