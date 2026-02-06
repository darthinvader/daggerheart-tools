import { type ReactNode, useCallback, useMemo } from 'react';

import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import { Coins, HandMetal, Package, Trophy } from '@/lib/icons';
import type { Gold } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

interface QuickGoldInfoProps {
  gold: Gold;
  onChange?: (gold: Gold) => void;
  className?: string;
}

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
    <div className="quick-gold-denomination">
      <span className="quick-gold-denomination-icon">{icon}</span>
      {onChange ? (
        <NumberControl value={value} onChange={onChange} min={0} size="sm" />
      ) : (
        <span className="quick-gold-denomination-value">{value}</span>
      )}
      <span className="quick-gold-denomination-label">{label}</span>
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

  // Gold total in handfuls: 1 chest = 10 bags, 1 bag = 10 handfuls, 1 handful = 10 coins
  const totalHandfuls = useMemo(() => {
    const coins = gold.showCoins ? (gold.coins ?? 0) / 10 : 0;
    return coins + gold.handfuls + gold.bags * 10 + gold.chests * 100;
  }, [gold]);

  return (
    <div className={cn('quick-gold-card', className)}>
      {gold.showCoins && (
        <GoldDenomination
          label="Coins"
          icon={<Coins className="size-3.5" />}
          value={gold.coins ?? 0}
          onChange={onChange ? v => handleChange('coins', v) : undefined}
        />
      )}
      <GoldDenomination
        label="Handfuls"
        icon={<HandMetal className="size-3.5" />}
        value={gold.handfuls}
        onChange={onChange ? v => handleChange('handfuls', v) : undefined}
      />
      <GoldDenomination
        label="Bags"
        icon={<Package className="size-3.5" />}
        value={gold.bags}
        onChange={onChange ? v => handleChange('bags', v) : undefined}
      />
      <GoldDenomination
        label="Chests"
        icon={<Trophy className="size-3.5" />}
        value={gold.chests}
        onChange={onChange ? v => handleChange('chests', v) : undefined}
      />
      {/* Gold total summary */}
      {totalHandfuls > 0 && (
        <div className="quick-gold-total">
          ≈ {totalHandfuls.toFixed(totalHandfuls % 1 === 0 ? 0 : 1)} handfuls
          total
        </div>
      )}
    </div>
  );
}
