import { type ReactNode, useCallback } from 'react';

import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import { Coins, HandMetal, Package, Trophy } from '@/lib/icons';
import type { Gold } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

interface QuickGoldInfoProps {
  gold: Gold;
  onChange?: (gold: Gold) => void;
  className?: string;
}

const ICON_FIST = <HandMetal className="size-4" />;
const ICON_MONEYBAG = <Package className="size-4" />;
const ICON_TROPHY = <Trophy className="size-4" />;
const ICON_COIN = <Coins className="size-4" />;

interface GoldDenominationProps {
  label: string;
  icon: ReactNode;
  value: number;
  onChange?: (value: number) => void;
}

function GoldDenomination({
  label,
  icon,
  value,
  onChange,
}: GoldDenominationProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-muted-foreground">{icon}</span>
      {onChange ? (
        <NumberControl value={value} onChange={onChange} min={0} size="sm" />
      ) : (
        <span className="font-bold">{value}</span>
      )}
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  );
}

export function QuickGoldInfo({
  gold,
  onChange,
  className,
}: QuickGoldInfoProps) {
  const handleChange = useCallback(
    (key: 'chests' | 'bags' | 'handfuls' | 'coins', value: number) => {
      onChange?.({ ...gold, [key]: value });
    },
    [gold, onChange]
  );

  return (
    <div
      className={cn(
        'bg-card flex flex-wrap items-center justify-center gap-4 rounded-lg border p-3',
        className
      )}
    >
      <Coins className="size-5" />
      {gold.showCoins && (
        <GoldDenomination
          label="Coins"
          icon={ICON_COIN}
          value={gold.coins ?? 0}
          onChange={onChange ? v => handleChange('coins', v) : undefined}
        />
      )}
      <GoldDenomination
        label="Handfuls"
        icon={ICON_FIST}
        value={gold.handfuls}
        onChange={onChange ? v => handleChange('handfuls', v) : undefined}
      />
      <GoldDenomination
        label="Bags"
        icon={ICON_MONEYBAG}
        value={gold.bags}
        onChange={onChange ? v => handleChange('bags', v) : undefined}
      />
      <GoldDenomination
        label="Chests"
        icon={ICON_TROPHY}
        value={gold.chests}
        onChange={onChange ? v => handleChange('chests', v) : undefined}
      />
    </div>
  );
}
