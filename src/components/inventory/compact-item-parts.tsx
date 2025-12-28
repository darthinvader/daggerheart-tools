import { Minus, Plus, Sparkles, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import {
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
  TIER_CONFIG,
} from './constants';
import { getItemEmoji } from './item-utils';

interface ItemHeaderProps {
  item: AnyItem;
  category: ItemCategory | undefined;
  catConfig: (typeof CATEGORY_CONFIG)[ItemCategory] | null;
  rarityConfig: (typeof RARITY_CONFIG)[Rarity];
  tierConfig: (typeof TIER_CONFIG)[EquipmentTier];
}

export function ItemHeader({
  item,
  category,
  catConfig,
  rarityConfig,
  tierConfig,
}: ItemHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/70 text-2xl shadow-inner dark:bg-gray-800/70">
        {getItemEmoji(item)}
      </div>
      <div className="min-w-0">
        <p className="leading-tight font-semibold">{item.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {catConfig && (
            <Badge
              variant="outline"
              className={cn(
                'gap-1 px-2 py-0.5 text-xs font-medium',
                catConfig.bgColor,
                catConfig.color
              )}
            >
              {catConfig.emoji} {category}
            </Badge>
          )}
          {rarityConfig && (
            <Badge
              variant="outline"
              className={cn(
                'gap-1 px-2 py-0.5 text-xs font-medium',
                rarityConfig.color,
                rarityConfig.borderColor
              )}
            >
              {rarityConfig.emoji} {item.rarity}
            </Badge>
          )}
          {tierConfig && (
            <Badge
              variant="secondary"
              className="gap-1 px-2 py-0.5 text-xs font-medium"
            >
              {tierConfig.emoji} Tier {item.tier}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

interface QuantityBadgeProps {
  quantity: number;
  maxQuantity: number;
  unlimitedQuantity?: boolean;
}

export function QuantityBadge({
  quantity,
  maxQuantity,
  unlimitedQuantity,
}: QuantityBadgeProps) {
  return (
    <SmartTooltip
      content={
        unlimitedQuantity
          ? `📦 ${quantity} in inventory (unlimited stacking)`
          : `📦 ${quantity}/${maxQuantity} max`
      }
    >
      <Badge
        variant="secondary"
        className="shrink-0 bg-white/90 px-3 py-1 text-base font-bold shadow-sm dark:bg-gray-800/90"
      >
        ×{quantity}
      </Badge>
    </SmartTooltip>
  );
}

interface ItemFeaturesProps {
  features: AnyItem['features'];
}

export function ItemFeatures({ features }: ItemFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <h6 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
        ⚡ Features
      </h6>
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="rounded-lg border bg-white/60 px-3 py-2 dark:bg-gray-800/60"
        >
          <span className="font-semibold text-amber-700 dark:text-amber-400">
            {feature.name}
          </span>
          <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}

interface ItemStatsProps {
  maxQuantity: number;
  cost: number | undefined;
  unlimitedQuantity?: boolean;
}

export function ItemStats({
  maxQuantity,
  cost,
  unlimitedQuantity,
}: ItemStatsProps) {
  const showMaxStack = maxQuantity > 1;
  const showCost = cost !== undefined && cost > 0;

  if (!showMaxStack && !showCost) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs">
      {showMaxStack && (
        <SmartTooltip content="📚 Maximum stack size for this item">
          <Badge variant="outline" className="gap-1">
            📚 Max Stack: {unlimitedQuantity ? '∞' : maxQuantity}
          </Badge>
        </SmartTooltip>
      )}
      {showCost && (
        <SmartTooltip content="💰 Item value in gold">
          <Badge
            variant="outline"
            className="gap-1 border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
          >
            💰 {cost} gold
          </Badge>
        </SmartTooltip>
      )}
    </div>
  );
}

interface StatusBadgesProps {
  isEquipped?: boolean;
  isCustom?: boolean;
  isConsumable?: boolean;
}

export function StatusBadges({
  isEquipped,
  isCustom,
  isConsumable,
}: StatusBadgesProps) {
  if (!isEquipped && !isCustom && !isConsumable) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {isEquipped && (
        <Badge className="gap-1 bg-amber-500 text-white shadow-sm">
          ⚔️ Equipped
        </Badge>
      )}
      {isCustom && (
        <Badge className="gap-1 bg-purple-600 text-white shadow-sm">
          ✨ Homebrew
        </Badge>
      )}
      {isConsumable && (
        <Badge
          variant="outline"
          className="gap-1 border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
        >
          🍷 Consumable
        </Badge>
      )}
    </div>
  );
}

export interface ItemActionsProps {
  entryId: string;
  quantity: number;
  canDecrease: boolean;
  canIncrease: boolean;
  isCustom?: boolean;
  onQuantityChange?: (id: string, delta: number) => void;
  onRemove?: (id: string) => void;
  onConvertToHomebrew?: (id: string) => void;
}

export function ItemActions({
  entryId,
  quantity,
  canDecrease,
  canIncrease,
  isCustom,
  onQuantityChange,
  onRemove,
  onConvertToHomebrew,
}: ItemActionsProps) {
  return (
    <div className="mt-4 flex items-center justify-between border-t pt-3">
      <div className="flex items-center gap-1.5">
        {onQuantityChange && (
          <>
            <SmartTooltip
              content={
                canDecrease
                  ? '➖ Decrease quantity'
                  : '⚠️ Minimum quantity reached'
              }
            >
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'size-8',
                  !canDecrease && 'cursor-not-allowed opacity-40'
                )}
                onClick={() => onQuantityChange(entryId, -1)}
                disabled={!canDecrease}
              >
                <Minus className="size-4" />
              </Button>
            </SmartTooltip>
            <span className="w-10 text-center text-base font-bold">
              {quantity}
            </span>
            <SmartTooltip
              content={
                canIncrease
                  ? '➕ Increase quantity'
                  : '⚠️ Maximum quantity reached'
              }
            >
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'size-8',
                  !canIncrease && 'cursor-not-allowed opacity-40'
                )}
                onClick={() => onQuantityChange(entryId, 1)}
                disabled={!canIncrease}
              >
                <Plus className="size-4" />
              </Button>
            </SmartTooltip>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onConvertToHomebrew && !isCustom && (
          <SmartTooltip content="✨ Convert to homebrew - edit and customize this item">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50"
              onClick={() => onConvertToHomebrew(entryId)}
            >
              <Sparkles className="size-4" />
              Homebrew
            </Button>
          </SmartTooltip>
        )}
        {onRemove && (
          <SmartTooltip content="🗑️ Remove from inventory">
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-700 dark:hover:bg-red-950/50"
              onClick={() => onRemove(entryId)}
            >
              <Trash2 className="size-4" />
            </Button>
          </SmartTooltip>
        )}
      </div>
    </div>
  );
}
