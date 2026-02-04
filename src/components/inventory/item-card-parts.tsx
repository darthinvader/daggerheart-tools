import { ChevronDown, ChevronUp, Pencil, Power, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { ICON_SIZE_MD, Pin, Sparkles, Star } from '@/lib/icons';
import { cn } from '@/lib/utils';

import type { ItemCategory } from './constants';
import type { ItemCardConfigs } from './item-card-utils';

interface ItemBadgesProps {
  category?: ItemCategory;
  rarity: string;
  tierLabel: string;
  configs: ItemCardConfigs;
}

export function ItemBadges({
  category,
  rarity,
  tierLabel,
  configs,
}: ItemBadgesProps) {
  const { categoryConfig, rarityConfig, tierConfig } = configs;
  return (
    <div className="flex flex-wrap gap-1.5">
      {categoryConfig && (
        <Badge className={cn(categoryConfig.bgColor, categoryConfig.color)}>
          <categoryConfig.icon size={ICON_SIZE_MD} className="mr-1" />
          {category}
        </Badge>
      )}
      <Badge className={cn(rarityConfig.bgColor, rarityConfig.color)}>
        <rarityConfig.icon size={ICON_SIZE_MD} className="mr-1" /> {rarity}
      </Badge>
      <Badge variant="outline" className={tierConfig.color}>
        <tierConfig.icon size={ICON_SIZE_MD} className="mr-1" /> {tierLabel}
      </Badge>
    </div>
  );
}

interface FeatureListProps {
  features: Array<{ name: string; description: string }>;
}

export function FeatureList({ features }: FeatureListProps) {
  if (!features.length) return null;
  return (
    <div className="space-y-1.5">
      {features.map((feature, idx) => (
        <div key={idx} className="bg-muted/50 rounded-md p-2 text-sm">
          <span className="font-medium">
            <Sparkles size={ICON_SIZE_MD} className="mr-1 inline-block" />
            {feature.name}:
          </span>{' '}
          <span className="text-muted-foreground">{feature.description}</span>
        </div>
      ))}
    </div>
  );
}

interface QuantityControlsProps {
  quantity: number;
  maxQuantity: number;
  unlimitedQuantity: boolean;
  onQuantityChange: (delta: number) => void;
}

export function QuantityControls({
  quantity,
  maxQuantity,
  unlimitedQuantity,
  onQuantityChange,
}: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0"
        onClick={() => onQuantityChange(-1)}
        disabled={quantity <= 1}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0"
        onClick={() => onQuantityChange(1)}
        disabled={!unlimitedQuantity && quantity >= maxQuantity}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface ItemActionsProps {
  isEquipped: boolean;
  isEquippable: boolean;
  isActivated?: boolean;
  onEquipToggle?: () => void;
  onToggleActivated?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function ItemActions({
  isEquipped,
  isEquippable,
  isActivated = true,
  onEquipToggle,
  onToggleActivated,
  onEdit,
  onRemove,
}: ItemActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {isEquipped && onToggleActivated && (
        <SmartTooltip
          content={isActivated ? 'Deactivate bonuses' : 'Activate bonuses'}
        >
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              isActivated
                ? 'text-green-600 hover:bg-green-100 hover:text-green-700'
                : 'text-muted-foreground hover:bg-muted'
            )}
            onClick={onToggleActivated}
          >
            <Power className="h-4 w-4" />
          </Button>
        </SmartTooltip>
      )}
      {isEquippable && onEquipToggle && (
        <Button
          size="sm"
          variant={isEquipped ? 'default' : 'outline'}
          onClick={onEquipToggle}
        >
          {isEquipped ? (
            <Star size={ICON_SIZE_MD} />
          ) : (
            <Pin size={ICON_SIZE_MD} />
          )}
        </Button>
      )}
      {onEdit && (
        <Button
          size="sm"
          variant="ghost"
          className="text-blue-500 hover:bg-blue-100 hover:text-blue-700"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onRemove && (
        <Button
          size="sm"
          variant="ghost"
          className="text-red-500 hover:bg-red-100 hover:text-red-700"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
