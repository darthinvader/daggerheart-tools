import { Minus, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { RarityConfig, TierConfig } from './constants';

interface MaxBadgeProps {
  currentQty: number;
  maxQty: number;
}

export function MaxBadge({ currentQty, maxQty }: MaxBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="shrink-0 border-amber-500 text-xs text-amber-600"
    >
      Max ({currentQty}/{maxQty})
    </Badge>
  );
}

interface OwnedBadgeProps {
  currentQty: number;
  maxQty: number;
}

export function OwnedBadge({ currentQty, maxQty }: OwnedBadgeProps) {
  return (
    <Badge variant="outline" className="text-muted-foreground shrink-0 text-xs">
      Owned: {currentQty}/{maxQty}
    </Badge>
  );
}

interface RarityTierDisplayProps {
  rarityConfig: RarityConfig;
  tierConfig: TierConfig;
  rarity: string;
  tier: string;
}

export function RarityTierDisplay({
  rarityConfig,
  tierConfig,
  rarity,
  tier,
}: RarityTierDisplayProps) {
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      <span
        className={cn('flex items-center gap-0.5 text-xs', rarityConfig.color)}
      >
        <rarityConfig.icon className="size-3" /> {rarity}
      </span>
      <span
        className={cn('flex items-center gap-0.5 text-xs', tierConfig.color)}
      >
        <tierConfig.icon className="size-3" /> T{tier}
      </span>
    </div>
  );
}

interface QuantitySelectorProps {
  quantity: number;
  maxAvailable: number;
  unlimitedQuantity: boolean;
  onQuantityChange: (delta: number) => void;
}

export function QuantitySelector({
  quantity,
  maxAvailable,
  unlimitedQuantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  const handleClick = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    onQuantityChange(delta);
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="text-muted-foreground text-xs">Qty:</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={e => handleClick(e, -1)}
        disabled={quantity <= 1}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="min-w-6 text-center text-sm font-medium">
        {quantity}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={e => handleClick(e, 1)}
        disabled={quantity >= maxAvailable}
      >
        <Plus className="h-3 w-3" />
      </Button>
      <span className="text-muted-foreground text-xs">
        / {unlimitedQuantity ? '∞' : maxAvailable}
      </span>
    </div>
  );
}
