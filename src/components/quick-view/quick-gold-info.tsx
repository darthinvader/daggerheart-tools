import { useCallback } from 'react';

import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import type { Gold } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

interface QuickGoldInfoProps {
  gold: Gold;
  onChange?: (gold: Gold) => void;
  className?: string;
}

const EMOJI_FIST = '🤛';
const EMOJI_MONEYBAG = '💰';
const EMOJI_TROPHY = '🏆';
const EMOJI_COIN = '🪙';

interface GoldDenominationProps {
  label: string;
  emoji: string;
  value: number;
  onChange?: (value: number) => void;
}

function GoldDenomination({
  label,
  emoji,
  value,
  onChange,
}: GoldDenominationProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs">{emoji}</span>
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
      <span className="text-lg">💰</span>
      {gold.showCoins && (
        <GoldDenomination
          label="Coins"
          emoji={EMOJI_COIN}
          value={gold.coins ?? 0}
          onChange={onChange ? v => handleChange('coins', v) : undefined}
        />
      )}
      <GoldDenomination
        label="Handfuls"
        emoji={EMOJI_FIST}
        value={gold.handfuls}
        onChange={onChange ? v => handleChange('handfuls', v) : undefined}
      />
      <GoldDenomination
        label="Bags"
        emoji={EMOJI_MONEYBAG}
        value={gold.bags}
        onChange={onChange ? v => handleChange('bags', v) : undefined}
      />
      <GoldDenomination
        label="Chests"
        emoji={EMOJI_TROPHY}
        value={gold.chests}
        onChange={onChange ? v => handleChange('chests', v) : undefined}
      />
    </div>
  );
}
