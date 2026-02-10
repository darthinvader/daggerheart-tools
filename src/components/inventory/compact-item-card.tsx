import { memo } from 'react';

import { Pencil } from '@/lib/icons';
import type { InventoryState } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import {
  ItemActions,
  ItemFeatures,
  ItemHeader,
  ItemStats,
  QuantityBadge,
  StatusBadges,
} from './compact-item-parts';
import { getItemDetails } from './item-utils';

export interface CompactItemCardProps {
  entry: InventoryState['items'][number];
  unlimitedQuantity?: boolean;
  onQuantityChange?: (id: string, delta: number) => void;
  onRemove?: (id: string) => void;
  onConvertToHomebrew?: (id: string) => void;
  onEdit?: (id: string) => void;
  readOnly?: boolean;
}

export const CompactItemCard = memo(function CompactItemCard({
  entry,
  unlimitedQuantity,
  onQuantityChange,
  onRemove,
  onConvertToHomebrew,
  onEdit,
  readOnly,
}: CompactItemCardProps) {
  const { item } = entry;
  const { category, catConfig, rarityConfig, tierConfig } =
    getItemDetails(item);

  const canDecrease = entry.quantity > 1;
  const canIncrease = unlimitedQuantity || entry.quantity < item.maxQuantity;

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md',
        rarityConfig?.borderColor,
        rarityConfig?.bgColor,
        entry.isEquipped && 'ring-2 ring-amber-500 dark:ring-offset-gray-900',
        entry.isCustom && 'ring-2 ring-purple-500 dark:ring-offset-gray-900'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <ItemHeader
          item={item}
          category={category}
          catConfig={catConfig}
          rarityConfig={rarityConfig}
          tierConfig={tierConfig}
        />
        <QuantityBadge
          quantity={entry.quantity}
          maxQuantity={item.maxQuantity}
          unlimitedQuantity={unlimitedQuantity}
        />
      </div>

      {item.description && (
        <div className="mt-3 rounded-lg bg-white/50 p-3 dark:bg-gray-800/50">
          <p className="text-muted-foreground flex items-start gap-1.5 text-sm leading-relaxed">
            <Pencil className="mt-0.5 size-3.5 shrink-0" /> {item.description}
          </p>
        </div>
      )}

      <ItemFeatures features={item.features} />
      <ItemStats
        maxQuantity={item.maxQuantity}
        cost={item.cost}
        unlimitedQuantity={unlimitedQuantity}
      />
      <StatusBadges
        isEquipped={entry.isEquipped}
        isCustom={entry.isCustom}
        isConsumable={item.isConsumable}
      />

      {!readOnly && (
        <ItemActions
          entryId={entry.id}
          quantity={entry.quantity}
          canDecrease={canDecrease}
          canIncrease={canIncrease}
          isCustom={entry.isCustom}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          onConvertToHomebrew={onConvertToHomebrew}
          onEdit={onEdit}
        />
      )}
    </div>
  );
});
