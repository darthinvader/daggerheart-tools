import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { memo } from 'react';

import {
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
  TIER_CONFIG,
} from '@/components/inventory/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package } from '@/lib/icons';
import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { formatGoldAmount } from '../../features/shop/gold-math';
import type { ResolvedPrice } from '../../features/shop/resolve-item-price';

interface ShopItemCardProps {
  item: AnyItem;
  price: ResolvedPrice;
  cartQuantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export const ShopItemCard = memo(function ShopItemCard({
  item,
  price,
  cartQuantity,
  onAdd,
  onRemove,
}: ShopItemCardProps) {
  const category = (item as { category?: string }).category as
    | ItemCategory
    | undefined;
  const catConfig = category ? CATEGORY_CONFIG[category] : null;
  const rarityConfig = RARITY_CONFIG[item.rarity as Rarity];
  const tierConfig = TIER_CONFIG[item.tier as EquipmentTier];
  const CatIcon = catConfig?.icon ?? Package;

  const weight =
    'weight' in item ? (item as { weight?: string }).weight : undefined;

  return (
    <div
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border-2 p-3 transition-all',
        cartQuantity > 0
          ? 'border-green-500 bg-green-50 dark:bg-green-950/40'
          : `${rarityConfig?.borderColor ?? 'border-border'} ${rarityConfig?.bgColor ?? ''}`
      )}
    >
      {/* Category icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-lg dark:bg-gray-800">
        {cartQuantity > 0 ? (
          <ShoppingCart className="h-5 w-5 text-green-600" />
        ) : (
          <CatIcon className="size-5" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{item.name}</span>
          {weight && (
            <Badge variant="outline" className="text-[10px] capitalize">
              {weight}
            </Badge>
          )}
        </div>

        {/* Rarity + Tier display (matching PickerItemCard style) */}
        <div className="mt-0.5 flex items-center gap-3 text-xs">
          {rarityConfig && (
            <span className={cn('flex items-center gap-1', rarityConfig.color)}>
              <rarityConfig.icon className="size-3" />
              {item.rarity}
            </span>
          )}
          {tierConfig && (
            <span className={cn('flex items-center gap-1', tierConfig.color)}>
              <tierConfig.icon className="size-3" />
              Tier {item.tier}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
          <span>{formatGoldAmount(price.handfuls)}</span>
          {price.source === 'override' && (
            <Badge variant="outline" className="text-[10px]">
              GM Price
            </Badge>
          )}
          {'isConsumable' in item &&
            (item as { isConsumable?: boolean }).isConsumable && (
              <Badge variant="outline" className="text-[10px] text-orange-400">
                Consumable
              </Badge>
            )}
        </div>

        {/* Features */}
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

        {/* Cart controls */}
        {cartQuantity > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={e => {
                e.stopPropagation();
                onRemove();
              }}
              aria-label={`Remove ${item.name} from cart`}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="min-w-[1.5rem] text-center text-sm font-semibold">
              {cartQuantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={e => {
                e.stopPropagation();
                onAdd();
              }}
              aria-label={`Add another ${item.name}`}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Add to cart button (when not in cart) */}
      {cartQuantity === 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onAdd}
          aria-label={`Add ${item.name} to cart`}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});
