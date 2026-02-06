import { AlertTriangle, Skull } from 'lucide-react';

import type { DeathMoveState } from '@/components/death-move';
import { cn } from '@/lib/utils';

interface QuickStatusBannerProps {
  deathState: DeathMoveState;
  hpCurrent: number;
  hpMax: number;
  stressCurrent: number;
  stressMax: number;
  className?: string;
}

/**
 * Urgent status banner shown at the top of the quick tab
 * when the character is dead, unconscious, or in critical danger.
 */
export function QuickStatusBanner({
  deathState,
  hpCurrent,
  hpMax,
  stressCurrent,
  stressMax,
  className,
}: QuickStatusBannerProps) {
  if (deathState.isDead) {
    return (
      <div className={cn('quick-status-banner quick-status-dead', className)}>
        <Skull className="size-4" />
        <span>Character is Dead</span>
      </div>
    );
  }

  if (deathState.isUnconscious) {
    return (
      <div
        className={cn(
          'quick-status-banner quick-status-unconscious',
          className
        )}
      >
        <AlertTriangle className="size-4" />
        <span>Unconscious — Death Move Pending</span>
      </div>
    );
  }

  // HP critical warning (≤ 25% and > 0)
  const hpPercent = hpMax > 0 ? hpCurrent / hpMax : 1;
  if (hpCurrent > 0 && hpPercent <= 0.25) {
    return (
      <div
        className={cn('quick-status-banner quick-status-critical', className)}
      >
        <AlertTriangle className="size-4" />
        <span>
          Critical HP — {hpCurrent}/{hpMax}
        </span>
      </div>
    );
  }

  // Stress full warning
  if (stressMax > 0 && stressCurrent >= stressMax) {
    return (
      <div className={cn('quick-status-banner quick-status-stress', className)}>
        <AlertTriangle className="size-4" />
        <span>Stress Full — Overflow damages HP</span>
      </div>
    );
  }

  return null;
}
