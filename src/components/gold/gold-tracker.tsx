/* eslint-disable max-lines-per-function */
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type GoldDenomination = 'coins' | 'handfuls' | 'bags' | 'chests';

interface GoldTrackerProps {
  initialCoins?: number;
  initialHandfuls?: number;
  initialBags?: number;
  initialChests?: number;
  showCoinsInitially?: boolean;
  displayDenomination?: GoldDenomination;
  onChange?: (gold: GoldState) => void;
}

interface GoldState {
  coins: number;
  handfuls: number;
  bags: number;
  chests: number;
  showCoins: boolean;
  displayDenomination: GoldDenomination;
}

interface DenominationRowProps {
  label: string;
  emoji: string;
  value: number;
  maxValue: number;
  onChange: (value: number) => void;
}

function DenominationRow({
  label,
  emoji,
  value,
  maxValue,
  onChange,
}: DenominationRowProps) {
  const handleEmojiClick = (index: number) => {
    onChange(index + 1);
  };

  const handleDecrement = () => {
    if (value > 0) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < maxValue) onChange(value + 1);
  };

  const handleReset = () => {
    onChange(0);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-[80px] items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-muted-foreground w-6 text-center text-sm tabular-nums">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleDecrement}
          disabled={value === 0}
          aria-label={`Decrease ${label}`}
        >
          -
        </Button>

        <div className="hidden flex-wrap gap-0.5 sm:flex">
          {Array.from({ length: maxValue }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleEmojiClick(i)}
              className={cn(
                'size-6 cursor-pointer text-base transition-opacity select-none',
                i < value ? 'opacity-100' : 'opacity-30 grayscale'
              )}
              aria-label={`Set ${label} to ${i + 1}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleIncrement}
          disabled={value === maxValue}
          aria-label={`Increase ${label}`}
        >
          +
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleReset}
          disabled={value === 0}
          className="text-muted-foreground"
          aria-label={`Reset ${label} to zero`}
        >
          ×
        </Button>
      </div>
    </div>
  );
}

const EMOJI_COIN = String.fromCodePoint(0x1fa99);
const EMOJI_FIST = String.fromCodePoint(0x1f91b);
const EMOJI_MONEYBAG = String.fromCodePoint(0x1f4b0);
const EMOJI_TROPHY = String.fromCodePoint(0x1f3c6);

export function GoldTracker({
  initialCoins = 0,
  initialHandfuls = 0,
  initialBags = 0,
  initialChests = 0,
  showCoinsInitially = false,
  displayDenomination: initialDenomination = 'handfuls',
  onChange,
}: GoldTrackerProps) {
  const [coins, setCoins] = useState(initialCoins);
  const [handfuls, setHandfuls] = useState(initialHandfuls);
  const [bags, setBags] = useState(initialBags);
  const [chests, setChests] = useState(initialChests);
  const [showCoins, setShowCoins] = useState(showCoinsInitially);
  const [totalDenomination, setTotalDenomination] =
    useState<GoldDenomination>(initialDenomination);

  const updateGold = (
    newState: Partial<GoldState & { displayDenomination: GoldDenomination }>
  ) => {
    const state: GoldState = {
      coins: newState.coins ?? coins,
      handfuls: newState.handfuls ?? handfuls,
      bags: newState.bags ?? bags,
      chests: newState.chests ?? chests,
      showCoins: newState.showCoins ?? showCoins,
      displayDenomination: newState.displayDenomination ?? totalDenomination,
    };
    onChange?.(state);
  };

  const handleCoinsChange = (value: number) => {
    setCoins(value);
    updateGold({ coins: value });
  };

  const handleHandfulsChange = (value: number) => {
    setHandfuls(value);
    updateGold({ handfuls: value });
  };

  const handleBagsChange = (value: number) => {
    setBags(value);
    updateGold({ bags: value });
  };

  const handleChestsChange = (value: number) => {
    setChests(value);
    updateGold({ chests: value });
  };

  const calculateTotalInCoins = () => {
    return coins + handfuls * 10 + bags * 100 + chests * 1000;
  };

  const calculateTotal = (
    denomination: 'coins' | 'handfuls' | 'bags' | 'chests'
  ) => {
    const totalCoins = calculateTotalInCoins();
    switch (denomination) {
      case 'coins':
        return totalCoins;
      case 'handfuls':
        return totalCoins / 10;
      case 'bags':
        return totalCoins / 100;
      case 'chests':
        return totalCoins / 1000;
    }
  };

  const denominationLabels = {
    coins: 'Coins',
    handfuls: 'Handfuls',
    bags: 'Bags',
    chests: 'Chests',
  };

  const availableDenominations = showCoins
    ? (['coins', 'handfuls', 'bags', 'chests'] as const)
    : (['handfuls', 'bags', 'chests'] as const);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Checkbox
          id="show-coins"
          checked={showCoins}
          onCheckedChange={checked => {
            const enabled = checked === true;
            setShowCoins(enabled);
            if (!enabled) {
              setCoins(0);
              if (totalDenomination === 'coins') {
                setTotalDenomination('handfuls');
              }
            }
            updateGold({ showCoins: enabled, coins: enabled ? coins : 0 });
          }}
        />
        <Label htmlFor="show-coins" className="text-sm">
          Track individual coins (1/10 of a handful)
        </Label>
      </div>

      <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
        {showCoins && (
          <DenominationRow
            label="Coins"
            emoji={EMOJI_COIN}
            value={coins}
            maxValue={10}
            onChange={handleCoinsChange}
          />
        )}

        <DenominationRow
          label="Handfuls"
          emoji={EMOJI_FIST}
          value={handfuls}
          maxValue={10}
          onChange={handleHandfulsChange}
        />

        <DenominationRow
          label="Bags"
          emoji={EMOJI_MONEYBAG}
          value={bags}
          maxValue={10}
          onChange={handleBagsChange}
        />

        <DenominationRow
          label="Chests"
          emoji={EMOJI_TROPHY}
          value={chests}
          maxValue={10}
          onChange={handleChestsChange}
        />
      </div>

      <div className="text-muted-foreground space-y-2 text-xs">
        <p>
          <strong>Conversion:</strong> 1 Chest = 10 Bags, 1 Bag = 10 Handfuls
          {showCoins && ', 1 Handful = 10 Coins'}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <strong>Total:</strong>
          <span className="font-mono">
            {(() => {
              const value = calculateTotal(totalDenomination);
              const decimals =
                totalDenomination === 'coins'
                  ? 0
                  : totalDenomination === 'handfuls'
                    ? 1
                    : totalDenomination === 'bags'
                      ? 2
                      : 3;
              return parseFloat(value.toFixed(decimals)).toString();
            })()}
          </span>
          <div className="flex gap-1">
            {availableDenominations.map(denom => (
              <button
                key={denom}
                type="button"
                onClick={() => {
                  setTotalDenomination(denom);
                  updateGold({ displayDenomination: denom });
                }}
                className={cn(
                  'rounded px-2 py-0.5 text-xs transition-colors',
                  totalDenomination === denom
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                )}
              >
                {denominationLabels[denom]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
