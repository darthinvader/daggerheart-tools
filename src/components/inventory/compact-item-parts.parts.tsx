import {
  Coins,
  FlaskConical,
  Library,
  Minus,
  Pencil,
  Plus,
  Scale,
  Sparkles,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/lib/icons';
import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import { getItemWeight } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import {
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
  TIER_CONFIG,
} from './constants';
import { getItemIcon } from './item-utils';

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
  const itemIcon = getItemIcon(item);
  const weight = getItemWeight(item);
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/70 shadow-inner dark:bg-gray-800/70">
        <DynamicIcon icon={itemIcon} className="size-6" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="leading-tight font-semibold">{item.name}</p>
          {weight > 0 && (
            <Badge
              variant="outline"
              className="text-muted-foreground border-muted gap-1 px-1.5 py-0 text-xs font-medium"
              title={`Weight: ${weight} unit${weight !== 1 ? 's' : ''}`}
            >
              <Scale className="size-3" />
              {weight}
            </Badge>
          )}
        </div>
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
              <catConfig.icon className="size-3" /> {category}
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
              <rarityConfig.icon className="size-3" /> {item.rarity}
            </Badge>
          )}
          {tierConfig && (
            <Badge
              variant="secondary"
              className="gap-1 px-2 py-0.5 text-xs font-medium"
            >
              <tierConfig.icon className="size-3" /> Tier {item.tier}
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
    <Badge
      variant="secondary"
      className="shrink-0 bg-white/90 px-3 py-1 text-base font-bold shadow-sm dark:bg-gray-800/90"
      title={
        unlimitedQuantity
          ? `${quantity} in inventory (unlimited stacking)`
          : `${quantity}/${maxQuantity} max`
      }
    >
      ×{quantity}
    </Badge>
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
        <Badge
          variant="outline"
          className="gap-1"
          title="Maximum stack size for this item"
        >
          <Library className="size-3" /> Max Stack:{' '}
          {unlimitedQuantity ? '∞' : maxQuantity}
        </Badge>
      )}
      {showCost && (
        <Badge
          variant="outline"
          className="gap-1 border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
          title="Item value in gold"
        >
          <Coins className="size-3" /> {cost} gold
        </Badge>
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
          <FlaskConical className="size-3" /> Consumable
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
  onEdit?: (id: string) => void;
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
  onEdit,
}: ItemActionsProps) {
  return (
    <div className="mt-4 flex items-center justify-between border-t pt-3">
      <div className="flex items-center gap-1.5">
        {onQuantityChange && (
          <>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'size-8',
                !canDecrease && 'cursor-not-allowed opacity-40'
              )}
              onClick={() => onQuantityChange(entryId, -1)}
              disabled={!canDecrease}
              title={
                canDecrease ? 'Decrease quantity' : 'Minimum quantity reached'
              }
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-10 text-center text-base font-bold">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'size-8',
                !canIncrease && 'cursor-not-allowed opacity-40'
              )}
              onClick={() => onQuantityChange(entryId, 1)}
              disabled={!canIncrease}
              title={
                canIncrease ? 'Increase quantity' : 'Maximum quantity reached'
              }
            >
              <Plus className="size-4" />
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isCustom && onEdit && (
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50"
            onClick={() => onEdit(entryId)}
            title="Edit homebrew item"
          >
            <Pencil className="size-4" />
          </Button>
        )}
        {onConvertToHomebrew && !isCustom && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50"
            onClick={() => onConvertToHomebrew(entryId)}
            title="Convert to homebrew - edit and customize this item"
          >
            <Sparkles className="size-4" />
            Homebrew
          </Button>
        )}
        {onRemove && (
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-700 dark:hover:bg-red-950/50"
            onClick={() => onRemove(entryId)}
            title="Remove from inventory"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
