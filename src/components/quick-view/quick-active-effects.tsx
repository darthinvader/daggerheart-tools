import { Clock, Sparkles, X, Zap } from 'lucide-react';
import { useCallback } from 'react';

import type { ActiveEffect } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

interface QuickActiveEffectsProps {
  effects: ActiveEffect[];
  onRemove?: (id: string) => void;
  className?: string;
}

const DURATION_LABELS: Record<string, string> = {
  until_rest: 'Until rest',
  next_roll: 'Next roll',
  rounds: 'Rounds',
  permanent: 'Permanent',
  scene: 'Scene',
};

/**
 * Horizontal scrollable strip of active effects (potions, buffs, etc.).
 * Shown only when there are active effects.
 */
export function QuickActiveEffects({
  effects,
  onRemove,
  className,
}: QuickActiveEffectsProps) {
  const handleRemove = useCallback(
    (id: string) => {
      onRemove?.(id);
    },
    [onRemove]
  );

  if (effects.length === 0) return null;

  return (
    <div className={cn('quick-effects-strip', className)}>
      <div className="quick-effects-header">
        <Sparkles className="size-3 text-amber-500" />
        <span className="quick-effects-title">Active Effects</span>
      </div>
      <div className="quick-effects-list">
        {effects.map(effect => (
          <div
            key={effect.id}
            className={cn(
              'quick-effect-chip',
              effect.hasBeenUsed && 'quick-effect-used'
            )}
            title={effect.description || effect.name}
          >
            <Zap className="size-2.5 shrink-0" />
            <span className="quick-effect-name">{effect.name}</span>
            {effect.durationType && (
              <span className="quick-effect-duration">
                <Clock className="size-2" />
                {effect.durationType === 'rounds' && effect.roundsRemaining
                  ? `${effect.roundsRemaining}r`
                  : (DURATION_LABELS[effect.durationType] ??
                    effect.durationType)}
              </span>
            )}
            {effect.traitBonus && (
              <span className="quick-effect-bonus">
                +{effect.traitBonus.bonus} {effect.traitBonus.trait}
              </span>
            )}
            {onRemove && (
              <button
                type="button"
                className="quick-effect-remove"
                onClick={() => handleRemove(effect.id)}
                aria-label={`Remove ${effect.name}`}
              >
                <X className="size-2.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
