import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, Package, Sparkles } from '@/lib/icons';
import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import {
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
  TIER_CONFIG,
} from './constants';
import {
  MaxBadge,
  OwnedBadge,
  QuantitySelector,
  RarityTierDisplay,
} from './picker-item-parts';

function getCardIcon(
  isAtMax: boolean,
  selected: boolean,
  Icon: LucideIcon
): React.ReactNode {
  if (isAtMax) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  if (selected) return <Check className="h-5 w-5 text-green-600" />;
  return <Icon className="size-5" />;
}

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
  onConvertToHomebrew?: () => void;
  /** Optional price label displayed below rarity/tier (used by shop) */
  priceLabel?: React.ReactNode;
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
  onConvertToHomebrew,
  priceLabel,
}: PickerItemCardProps) {
  const category = (item as { category?: string }).category as ItemCategory;
  const catConfig = category ? CATEGORY_CONFIG[category] : null;
  const rarityConfig = RARITY_CONFIG[item.rarity as Rarity];
  const tierConfig = TIER_CONFIG[item.tier as EquipmentTier];
  const isStackable = item.maxQuantity > 1;

  const handleCardClick = () => {
    if (!isAtMax) onToggle();
  };

  return (
    <div
      role="button"
      tabIndex={isAtMax ? -1 : 0}
      onClick={handleCardClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={cn(
        'flex w-full cursor-pointer items-start gap-3 rounded-lg border-2 p-3 text-left transition-all select-none hover:shadow-md',
        isAtMax && 'cursor-not-allowed opacity-60',
        selected
          ? 'border-green-500 bg-green-50 dark:bg-green-950/40'
          : `${rarityConfig.borderColor} ${rarityConfig.bgColor}`
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-lg dark:bg-gray-800">
        {getCardIcon(isAtMax, selected, catConfig?.icon ?? Package)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{item.name}</span>
          {isAtMax ? (
            <MaxBadge
              currentQty={currentInventoryQty}
              maxQty={item.maxQuantity}
            />
          ) : (
            isStackable &&
            currentInventoryQty > 0 && (
              <OwnedBadge
                currentQty={currentInventoryQty}
                maxQty={item.maxQuantity}
              />
            )
          )}
        </div>
        <RarityTierDisplay
          rarityConfig={rarityConfig}
          tierConfig={tierConfig}
          rarity={item.rarity}
          tier={item.tier}
        />
        {priceLabel && (
          <div className="text-muted-foreground mt-1 text-xs font-medium">
            {priceLabel}
          </div>
        )}
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
          <QuantitySelector
            quantity={selectedQuantity}
            maxAvailable={availableToAdd}
            unlimitedQuantity={unlimitedQuantity}
            onQuantityChange={onQuantityChange}
          />
        )}
        {onConvertToHomebrew && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 gap-1 px-2 text-xs text-purple-600 hover:bg-purple-100 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
            onClick={e => {
              e.stopPropagation();
              onConvertToHomebrew();
            }}
          >
            <Sparkles className="h-3 w-3" />
            Make Homebrew
          </Button>
        )}
      </div>
    </div>
  );
}
