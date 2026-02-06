import { RotateCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

interface TapIndicatorProps {
  tapped: boolean;
  onTap?: () => void;
}

/**
 * Visual overlay for tapped/exhausted cards.
 *
 * Usage: wrap the card content and apply the returned `cardClassName`
 * to the card container for the rotation + dimming effect:
 *
 * Apply `cn(baseCardClasses, tapped && 'rotate-6 opacity-60')` to the
 * card container, and add `relative` for the overlay positioning.
 *
 * ```tsx
 * <div className={cn('relative', baseCardClasses, tapped && 'rotate-6 opacity-60')}>
 *   <TapIndicator tapped={tapped} onTap={toggleTap} />
 *   ...card content...
 * </div>
 * ```
 */
export function TapIndicator({ tapped, onTap }: TapIndicatorProps) {
  return (
    <>
      {/* Toggle button in card header area */}
      {onTap && (
        <SmartTooltip content={tapped ? 'Ready card' : 'Exhaust card'}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'size-6',
              tapped
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-muted-foreground'
            )}
            aria-pressed={tapped}
            onClick={e => {
              e.stopPropagation();
              onTap();
            }}
          >
            <RotateCw className="size-3" />
          </Button>
        </SmartTooltip>
      )}

      {/* Exhausted overlay */}
      {tapped && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/20"
          aria-hidden="true"
        >
          <span className="rotate-[-20deg] text-sm font-bold tracking-wider text-white/70 select-none">
            EXHAUSTED
          </span>
        </div>
      )}
    </>
  );
}
