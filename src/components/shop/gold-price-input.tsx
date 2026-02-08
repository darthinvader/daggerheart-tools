import { useCallback, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  goldPartsToHandfuls,
  handfulsToGoldParts,
} from '@/features/shop/gold-math';
import { cn } from '@/lib/utils';

interface GoldPriceInputProps {
  /** Current value in handfuls (can be decimal for coin precision, e.g. 3.5 = 3H 5Co) */
  value: number;
  /** Called with total handfuls when any denomination field changes */
  onChange: (handfuls: number) => void;
  /** Optional class name */
  className?: string;
  /** Whether the input is compact (inline) */
  compact?: boolean;
  /** Whether to show the coins denomination field */
  showCoins?: boolean;
}

const BASE_DENOMINATIONS = [
  { key: 'chests', label: 'Chests', abbr: 'C', max: 99 },
  { key: 'bags', label: 'Bags', abbr: 'B', max: 9 },
  { key: 'handfuls', label: 'Handfuls', abbr: 'H', max: 9 },
] as const;

const COINS_DENOMINATION = {
  key: 'coins' as const,
  label: 'Coins',
  abbr: 'Co',
  max: 9,
};

type DenomKey = 'chests' | 'bags' | 'handfuls' | 'coins';

export function GoldPriceInput({
  value,
  onChange,
  className,
  compact = false,
  showCoins = false,
}: GoldPriceInputProps) {
  const denominations = useMemo(
    () =>
      showCoins
        ? [...BASE_DENOMINATIONS, COINS_DENOMINATION]
        : [...BASE_DENOMINATIONS],
    [showCoins]
  );

  const parts = useMemo(() => handfulsToGoldParts(value), [value]);

  // Local draft state for text editing
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (key: DenomKey, raw: string) => {
      setDrafts(prev => ({ ...prev, [key]: raw }));
      // Fire onChange immediately so the parent saves on every keystroke
      const parsed = Number.parseInt(raw, 10);
      const val = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
      const newParts = { ...parts, [key]: val };
      onChange(goldPartsToHandfuls(newParts));
    },
    [parts, onChange]
  );

  const handleBlur = useCallback((key: DenomKey) => {
    // Clear draft so display snaps to the canonical value
    setDrafts(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {denominations.map(d => {
          const val = drafts[d.key] ?? String(parts[d.key]);
          return (
            <div key={d.key} className="flex items-center gap-0.5">
              <Input
                type="number"
                min={0}
                max={d.max}
                value={val}
                onChange={e => handleChange(d.key, e.target.value)}
                onBlur={() => handleBlur(d.key)}
                className="h-7 w-12 px-1 text-center text-xs"
                aria-label={d.label}
              />
              <span className="text-muted-foreground text-[10px]">
                {d.abbr}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-3', className)}>
      {denominations.map(d => {
        const val = drafts[d.key] ?? String(parts[d.key]);
        return (
          <div key={d.key} className="space-y-1">
            <Label className="text-muted-foreground text-xs">{d.label}</Label>
            <Input
              type="number"
              min={0}
              max={d.max}
              value={val}
              onChange={e => handleChange(d.key, e.target.value)}
              onBlur={() => handleBlur(d.key)}
              className="h-8 w-16 text-sm"
              aria-label={d.label}
            />
          </div>
        );
      })}
    </div>
  );
}
