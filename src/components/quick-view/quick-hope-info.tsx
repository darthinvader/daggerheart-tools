import { useCallback } from 'react';

import type { HopeWithScarsState } from '@/components/scars';
import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import { Check, Circle, PawPrint, Skull, Sparkles } from '@/lib/icons';
import type { Scar } from '@/lib/schemas/session-state';
import { cn } from '@/lib/utils';

interface QuickHopeInfoProps {
  state: HopeWithScarsState;
  onChange?: (state: HopeWithScarsState) => void;
  bonusHopeSlots?: number;
  className?: string;
}

function ScarItem({ scar }: { scar: Scar }) {
  return (
    <span className="text-destructive flex items-center gap-1 text-xs">
      <Skull className="size-3" /> {scar.description}
    </span>
  );
}

export function QuickHopeInfo({
  state,
  onChange,
  bonusHopeSlots = 0,
  className,
}: QuickHopeInfoProps) {
  const extraSlots = state.extraSlots ?? 0;
  const effectiveMax = state.max + extraSlots;
  const scars = state.scars ?? [];
  const companionHopeFilled = state.companionHopeFilled ?? false;

  const handleHopeChange = useCallback(
    (value: number) => {
      onChange?.({ ...state, current: value });
    },
    [state, onChange]
  );

  const handleCompanionHopeToggle = useCallback(() => {
    if (!onChange || bonusHopeSlots === 0) return;
    onChange({ ...state, companionHopeFilled: !companionHopeFilled });
  }, [state, onChange, bonusHopeSlots, companionHopeFilled]);

  return (
    <div className={cn('bg-card rounded-lg border p-2 sm:p-3', className)}>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="size-4 sm:size-5" />
          <span className="text-muted-foreground text-xs sm:text-sm">Hope</span>
        </div>
        <div className="flex items-center gap-2">
          {onChange ? (
            <NumberControl
              value={state.current}
              onChange={handleHopeChange}
              min={0}
              max={effectiveMax}
              size="sm"
            />
          ) : (
            <span className="font-bold text-blue-400">{state.current}</span>
          )}
          <span className="text-muted-foreground text-sm">
            / {effectiveMax}
          </span>
        </div>
      </div>

      {/* Companion bonus hope slot */}
      {bonusHopeSlots > 0 && (
        <button
          type="button"
          onClick={handleCompanionHopeToggle}
          className={cn(
            'mt-2 flex items-center gap-1 text-xs transition-colors',
            companionHopeFilled
              ? 'text-emerald-500'
              : 'text-muted-foreground hover:text-emerald-500'
          )}
          disabled={!onChange}
        >
          <PawPrint className="size-3" />
          <span className="flex items-center gap-0.5">
            Companion:{' '}
            {companionHopeFilled ? (
              <Check className="size-3" />
            ) : (
              <Circle className="size-3" />
            )}
          </span>
        </button>
      )}

      {/* Scars display (read-only) */}
      {scars.length > 0 && (
        <div className="mt-2 space-y-1">
          {scars.map(scar => (
            <ScarItem key={scar.id} scar={scar} />
          ))}
        </div>
      )}
    </div>
  );
}
