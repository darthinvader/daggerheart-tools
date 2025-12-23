import { AlertTriangle, Check, Minus, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import {
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
  TIER_CONFIG,
} from './constants';

interface PickerItemCardProps {
  item: AnyItem;
  selected: boolean;
  selectedQuantity: number;
  currentInventoryQty: number;
  availableToAdd: number;
  isAtMax: boolean;
  unlimitedQuantity: boolean;
  onToggle: () => void;
  onQuantityChange: (delta: number) => void;
}

export function PickerItemCard({
  item,
  selected,
  selectedQuantity,
  currentInventoryQty,
  availableToAdd,
  isAtMax,
  unlimitedQuantity,
  onToggle,
  onQuantityChange,
}: PickerItemCardProps) {
  const category = (item as { category?: string }).category as ItemCategory;
  const catConfig = category ? CATEGORY_CONFIG[category] : null;
  const rarityConfig = RARITY_CONFIG[item.rarity as Rarity];
  const tierConfig = TIER_CONFIG[item.tier as EquipmentTier];
  const isStackable = item.maxQuantity > 1;

  return (
    <button
      type="button"
      onClick={() => !isAtMax && onToggle()}
      disabled={isAtMax}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 text-left transition-all hover:shadow-md',
        isAtMax && 'cursor-not-allowed opacity-60',
        selected
          ? 'border-green-500 bg-green-50 dark:bg-green-950/40'
          : `${rarityConfig.borderColor} ${rarityConfig.bgColor}`
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-lg dark:bg-gray-800">
        {isAtMax ? (
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        ) : selected ? (
          <Check className="h-5 w-5 text-green-600" />
        ) : (
          (catConfig?.emoji ?? '📦')
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{item.name}</span>
          {isAtMax ? (
            <Badge
              variant="outline"
              className="shrink-0 border-amber-500 text-xs text-amber-600"
            >
              Max ({currentInventoryQty}/{item.maxQuantity})
            </Badge>
          ) : (
            isStackable &&
            currentInventoryQty > 0 && (
              <Badge
                variant="outline"
                className="text-muted-foreground shrink-0 text-xs"
              >
                Owned: {currentInventoryQty}/{item.maxQuantity}
              </Badge>
            )
          )}
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          <span className={cn('text-xs', rarityConfig.color)}>
            {rarityConfig.emoji} {item.rarity}
          </span>
          <span className={cn('text-xs', tierConfig.color)}>
            {tierConfig.emoji} T{item.tier}
          </span>
        </div>
        {item.features && item.features.length > 0 && (
          <div className="mt-2 space-y-1">
            {item.features.map((feature, idx) => (
              <div key={idx} className="text-muted-foreground text-xs">
                <span className="text-foreground font-medium">
                  {feature.name}:
                </span>{' '}
                {feature.description}
              </div>
            ))}
          </div>
        )}
        {selected && (
          <div
            className="mt-2 flex items-center gap-2"
            onClick={e => e.stopPropagation()}
          >
            <span className="text-muted-foreground text-xs">Qty:</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => onQuantityChange(-1)}
              disabled={selectedQuantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="min-w-6 text-center text-sm font-medium">
              {selectedQuantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => onQuantityChange(1)}
              disabled={selectedQuantity >= availableToAdd}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <span className="text-muted-foreground text-xs">
              / {unlimitedQuantity ? '∞' : availableToAdd}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
