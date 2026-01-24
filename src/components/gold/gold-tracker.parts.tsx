import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Coins, Grip, Package, Trophy } from '@/lib/icons';
import { cn } from '@/lib/utils';

import { useGoldTrackerState } from './use-gold-tracker-state';

type GoldDenomination = 'coins' | 'handfuls' | 'bags' | 'chests';

interface GoldState {
  coins: number;
  handfuls: number;
  bags: number;
  chests: number;
  showCoins: boolean;
  displayDenomination: GoldDenomination;
}

interface GoldTrackerProps {
  initialCoins?: number;
  initialHandfuls?: number;
  initialBags?: number;
  initialChests?: number;
  showCoinsInitially?: boolean;
  displayDenomination?: GoldDenomination;
  onChange?: (gold: GoldState) => void;
}

interface DenominationRowProps {
  label: string;
  icon: LucideIcon;
  value: number;
  maxValue: number;
  onChange: (value: number) => void;
}

function DenominationRow({
  label,
  icon: Icon,
  value,
  maxValue,
  onChange,
}: DenominationRowProps) {
  const handleIconClick = (index: number) => {
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
      <div className="flex min-w-20 items-center gap-2">
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
              onClick={() => handleIconClick(i)}
              className={cn(
                'flex size-6 cursor-pointer items-center justify-center transition-opacity select-none',
                i < value ? 'opacity-100' : 'opacity-30 grayscale'
              )}
              aria-label={`Set ${label} to ${i + 1}`}
            >
              <Icon className="size-4" />
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
          variant="outline"
          size="icon-sm"
          onClick={handleReset}
          disabled={value === 0}
          className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Reset ${label} to zero`}
        >
          ×
        </Button>
      </div>
    </div>
  );
}

const DENOMINATION_ICONS: Record<GoldDenomination, LucideIcon> = {
  coins: Coins,
  handfuls: Grip,
  bags: Package,
  chests: Trophy,
};

const DENOMINATION_LABELS: Record<GoldDenomination, string> = {
  coins: 'Coins',
  handfuls: 'Handfuls',
  bags: 'Bags',
  chests: 'Chests',
};

interface DenominationGridProps {
  showCoins: boolean;
  coins: number;
  handfuls: number;
  bags: number;
  chests: number;
  onCoinsChange: (value: number) => void;
  onHandfulsChange: (value: number) => void;
  onBagsChange: (value: number) => void;
  onChestsChange: (value: number) => void;
}

function DenominationGrid({
  showCoins,
  coins,
  handfuls,
  bags,
  chests,
  onCoinsChange,
  onHandfulsChange,
  onBagsChange,
  onChestsChange,
}: DenominationGridProps) {
  return (
    <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
      {showCoins && (
        <DenominationRow
          label="Coins"
          icon={DENOMINATION_ICONS.coins}
          value={coins}
          maxValue={10}
          onChange={onCoinsChange}
        />
      )}
      <DenominationRow
        label="Handfuls"
        icon={DENOMINATION_ICONS.handfuls}
        value={handfuls}
        maxValue={10}
        onChange={onHandfulsChange}
      />
      <DenominationRow
        label="Bags"
        icon={DENOMINATION_ICONS.bags}
        value={bags}
        maxValue={10}
        onChange={onBagsChange}
      />
      <DenominationRow
        label="Chests"
        icon={DENOMINATION_ICONS.chests}
        value={chests}
        maxValue={10}
        onChange={onChestsChange}
      />
    </div>
  );
}

interface TotalDisplayProps {
  showCoins: boolean;
  totalDenomination: GoldDenomination;
  displayTotal: number;
  onDenominationChange: (denom: GoldDenomination) => void;
}

function TotalDisplay({
  showCoins,
  totalDenomination,
  displayTotal,
  onDenominationChange,
}: TotalDisplayProps) {
  const availableDenominations = showCoins
    ? (['coins', 'handfuls', 'bags', 'chests'] as const)
    : (['handfuls', 'bags', 'chests'] as const);

  const formatDisplayTotal = () => {
    const decimals =
      totalDenomination === 'coins'
        ? 0
        : totalDenomination === 'handfuls'
          ? 1
          : totalDenomination === 'bags'
            ? 2
            : 3;
    return parseFloat(displayTotal.toFixed(decimals)).toString();
  };

  return (
    <div className="text-muted-foreground space-y-2 text-xs">
      <p>
        <strong>Conversion:</strong> 1 Chest = 10 Bags, 1 Bag = 10 Handfuls
        {showCoins && ', 1 Handful = 10 Coins'}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <strong>Total:</strong>
        <span className="font-mono">{formatDisplayTotal()}</span>
        <div className="flex gap-1">
          {availableDenominations.map(denom => (
            <button
              key={denom}
              type="button"
              onClick={() => onDenominationChange(denom)}
              className={cn(
                'rounded px-2 py-0.5 text-xs transition-colors',
                totalDenomination === denom
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {DENOMINATION_LABELS[denom]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GoldTracker({
  initialCoins = 0,
  initialHandfuls = 0,
  initialBags = 0,
  initialChests = 0,
  showCoinsInitially = false,
  displayDenomination: initialDenomination = 'handfuls',
  onChange,
}: GoldTrackerProps) {
  const {
    coins,
    handfuls,
    bags,
    chests,
    showCoins,
    totalDenomination,
    displayTotal,
    handleCoinsChange,
    handleHandfulsChange,
    handleBagsChange,
    handleChestsChange,
    handleShowCoinsChange,
    handleDenominationChange,
  } = useGoldTrackerState({
    initialCoins,
    initialHandfuls,
    initialBags,
    initialChests,
    showCoinsInitially,
    displayDenomination: initialDenomination,
    onChange,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Checkbox
          id="show-coins"
          checked={showCoins}
          onCheckedChange={checked => handleShowCoinsChange(checked === true)}
        />
        <Label htmlFor="show-coins" className="text-sm">
          Track individual coins (1/10 of a handful)
        </Label>
      </div>

      <DenominationGrid
        showCoins={showCoins}
        coins={coins}
        handfuls={handfuls}
        bags={bags}
        chests={chests}
        onCoinsChange={handleCoinsChange}
        onHandfulsChange={handleHandfulsChange}
        onBagsChange={handleBagsChange}
        onChestsChange={handleChestsChange}
      />

      <TotalDisplay
        showCoins={showCoins}
        totalDenomination={totalDenomination}
        displayTotal={displayTotal}
        onDenominationChange={handleDenominationChange}
      />
    </div>
  );
}
