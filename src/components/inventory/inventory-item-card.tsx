import type { LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Star } from '@/lib/icons';
import type {
  EquipmentTier,
  InventoryItemEntry,
  Rarity,
} from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { type ItemCategory, LOCATION_CONFIG } from './constants';
import {
  FeatureList,
  ItemActions,
  ItemBadges,
  QuantityControls,
} from './item-card-parts';
import { getItemConfigs, isEquippableCategory } from './item-card-utils';

interface InventoryItemCardProps {
  item: InventoryItemEntry;
  onEquipToggle?: () => void;
  onQuantityChange?: (delta: number) => void;
  onRemove?: () => void;
  onEdit?: () => void;
  onToggleActivated?: () => void;
  compact?: boolean;
  unlimitedQuantity?: boolean;
}

export function InventoryItemCard({
  item,
  onEquipToggle,
  onQuantityChange,
  onRemove,
  onEdit,
  onToggleActivated,
  compact = false,
  unlimitedQuantity = false,
}: InventoryItemCardProps) {
  const category = (item.item as { category?: ItemCategory }).category;
  const configs = getItemConfigs(
    category,
    item.item.rarity as Rarity,
    item.item.tier as EquipmentTier,
    item.location as keyof typeof LOCATION_CONFIG
  );

  const isEquippable = isEquippableCategory(category);
  const showQuantityControls =
    (item.item.maxQuantity > 1 || unlimitedQuantity) && onQuantityChange;

  if (compact) {
    return (
      <CompactItemCard
        item={item}
        Icon={configs.categoryConfig?.icon ?? Package}
        borderColor={configs.rarityConfig.borderColor}
        bgColor={configs.rarityConfig.bgColor}
      />
    );
  }

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-md',
        configs.rarityConfig.borderColor,
        'border-2'
      )}
    >
      <ItemHeader
        name={item.item.name}
        isEquipped={item.isEquipped}
        Icon={configs.categoryConfig?.icon ?? Package}
        bgColor={configs.rarityConfig.bgColor}
        LocationIcon={configs.locationConfig?.icon}
      />

      <CardContent className="space-y-3 p-4">
        <ItemBadges
          category={category}
          rarity={item.item.rarity}
          tierLabel={configs.tierConfig.label}
          configs={configs}
        />

        {item.item.description && (
          <p className="text-muted-foreground text-sm">
            {item.item.description}
          </p>
        )}

        <FeatureList features={item.item.features ?? []} />

        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            {showQuantityControls && (
              <QuantityControls
                quantity={item.quantity}
                maxQuantity={item.item.maxQuantity}
                unlimitedQuantity={unlimitedQuantity}
                onQuantityChange={onQuantityChange}
              />
            )}
          </div>
          <ItemActions
            isEquipped={item.isEquipped}
            isEquippable={isEquippable}
            isActivated={item.isActivated ?? true}
            onEquipToggle={onEquipToggle}
            onToggleActivated={onToggleActivated}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CompactItemCard({
  item,
  Icon,
  borderColor,
  bgColor,
}: {
  item: InventoryItemEntry;
  Icon: LucideIcon;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border p-2',
        borderColor,
        bgColor
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span className="flex-1 truncate text-sm font-medium">
        {item.item.name}
      </span>
      {item.quantity > 1 && (
        <Badge variant="secondary" className="text-xs">
          ×{item.quantity}
        </Badge>
      )}
      {item.isEquipped && (
        <Badge className="flex items-center gap-1 bg-yellow-500 text-xs text-white">
          <Star className="size-3" /> Equipped
        </Badge>
      )}
    </div>
  );
}

function ItemHeader({
  name,
  isEquipped,
  Icon,
  bgColor,
  LocationIcon,
}: {
  name: string;
  isEquipped: boolean;
  Icon: LucideIcon;
  bgColor: string;
  LocationIcon?: LucideIcon;
}) {
  return (
    <div className={cn('px-3 py-2 sm:px-4', bgColor)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Icon className="size-5 shrink-0" />
          <h3 className="truncate font-semibold">{name}</h3>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1">
          {isEquipped && (
            <Badge className="flex items-center gap-1 bg-yellow-500 text-white">
              <Star className="size-3" />
            </Badge>
          )}
          {LocationIcon && (
            <Badge variant="outline" className="text-xs">
              <LocationIcon className="size-3" />
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
