import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import {
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
  TIER_CONFIG,
} from './constants';

interface ItemPreviewBadgeProps {
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  tier: EquipmentTier;
}

export function ItemPreviewBadge({
  name,
  category,
  rarity,
  tier,
}: ItemPreviewBadgeProps) {
  const catConfig = CATEGORY_CONFIG[category];
  const rarityConfig = RARITY_CONFIG[rarity];
  const tierConfig = TIER_CONFIG[tier];

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-3',
        rarityConfig.borderColor,
        rarityConfig.bgColor
      )}
    >
      <div className="flex items-center gap-2 text-lg font-semibold">
        <span>{catConfig.emoji}</span>
        <span>{name || 'New Item'}</span>
      </div>
      <div className="mt-1 flex gap-1.5">
        <Badge className={cn(catConfig.bgColor, catConfig.color)}>
          {catConfig.emoji} {category}
        </Badge>
        <Badge className={cn(rarityConfig.bgColor, rarityConfig.color)}>
          {rarityConfig.emoji} {rarity}
        </Badge>
        <Badge variant="outline" className={tierConfig.color}>
          {tierConfig.emoji} {tierConfig.label}
        </Badge>
      </div>
    </div>
  );
}

interface QuantityConsumableRowProps {
  maxQuantity: number;
  isConsumable: boolean;
  onMaxQuantityChange: (v: number) => void;
  onConsumableChange: (v: boolean) => void;
}

export function QuantityConsumableRow({
  maxQuantity,
  isConsumable,
  onMaxQuantityChange,
  onConsumableChange,
}: QuantityConsumableRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <Label htmlFor="max-qty">📦 Max Quantity</Label>
        <Input
          id="max-qty"
          type="number"
          min={1}
          max={99}
          value={maxQuantity}
          onChange={e =>
            onMaxQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
          }
        />
      </div>
      <div className="flex items-end pb-2">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isConsumable}
            onChange={e => onConsumableChange(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm">🧪 Consumable</span>
        </label>
      </div>
    </div>
  );
}
