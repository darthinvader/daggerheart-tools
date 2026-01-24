import { PawPrint, Sparkles, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

import type { SlotData } from './hope-slot-utils';

export type { SlotData };

interface HopeSlotProps {
  slot: SlotData;
  onClick?: () => void;
  readOnly?: boolean;
}

function getSlotClassName(
  isScarred: boolean,
  isFilled: boolean,
  isBonus: boolean,
  readOnly?: boolean
): string {
  const base =
    'flex size-8 items-center justify-center rounded-lg border-2 transition-all duration-200 sm:size-10';

  if (isScarred) {
    return cn(base, 'bg-destructive/20 border-destructive cursor-not-allowed');
  }
  if (isFilled && isBonus) {
    return cn(base, 'border-emerald-600 bg-emerald-500 hover:bg-emerald-600');
  }
  if (isFilled) {
    return cn(base, 'border-blue-600 bg-blue-500 hover:bg-blue-600');
  }
  if (isBonus) {
    return cn(
      base,
      'border-dashed border-emerald-300 bg-emerald-50 hover:border-emerald-500 dark:bg-emerald-950/30'
    );
  }
  return cn(
    base,
    'bg-muted border-border hover:border-blue-400',
    readOnly && 'cursor-default'
  );
}

function getSlotIcon(
  isScarred: boolean,
  isFilled: boolean,
  isBonus: boolean
): ReactNode {
  if (isScarred) {
    return <X className="text-destructive size-4 sm:size-5" strokeWidth={3} />;
  }
  if (isFilled) {
    return isBonus ? (
      <PawPrint className="size-4 text-white sm:size-5" />
    ) : (
      <Sparkles className="size-4 text-white sm:size-5" />
    );
  }
  if (isBonus) {
    return <PawPrint className="size-3 text-emerald-500" />;
  }
  return null;
}

export function HopeSlot({ slot, onClick, readOnly }: HopeSlotProps) {
  const { index, isFilled, isScarred, scar, isBonus } = slot;

  const slotContent = (
    <button
      type="button"
      onClick={onClick}
      disabled={readOnly || isScarred}
      className={getSlotClassName(isScarred, isFilled, isBonus, readOnly)}
      aria-label={`Hope slot ${index + 1}${isBonus ? ' (companion bonus)' : ''}${isScarred ? ' (scarred)' : isFilled ? ' (filled)' : ' (empty)'}`}
    >
      {getSlotIcon(isScarred, isFilled, isBonus)}
    </button>
  );

  if (!isScarred || !scar) {
    return slotContent;
  }

  return (
    <SmartTooltip
      content={
        <div className="space-y-1">
          <div className="font-semibold">
            Scar: {scar.description || 'Unmarked Scar'}
          </div>
          {scar.narrativeImpact && (
            <div className="text-muted-foreground text-xs">
              {scar.narrativeImpact}
            </div>
          )}
        </div>
      }
    >
      {slotContent}
    </SmartTooltip>
  );
}
