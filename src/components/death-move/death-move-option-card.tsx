import { Dice5, Flame, Sparkle } from '@/lib/icons';
import { cn } from '@/lib/utils';

import {
  DEATH_MOVE_OPTIONS,
  type DeathMoveIconKey,
  RISK_LEVEL_STYLES,
} from './constants';
import type { DeathMoveType } from './types';

const DEATH_MOVE_ICONS: Record<
  DeathMoveIconKey,
  React.ComponentType<{ className?: string }>
> = {
  flame: Flame,
  sparkle: Sparkle,
  dice5: Dice5,
};

interface DeathMoveOptionCardProps {
  type: DeathMoveType;
  isSelected: boolean;
  onSelect: (type: DeathMoveType) => void;
}

export function DeathMoveOptionCard({
  type,
  isSelected,
  onSelect,
}: DeathMoveOptionCardProps) {
  const option = DEATH_MOVE_OPTIONS.find(o => o.type === type);
  if (!option) return null;
  const Icon = DEATH_MOVE_ICONS[option.iconKey];

  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      className={cn(
        'w-full rounded-lg border-2 p-4 text-left transition-all',
        RISK_LEVEL_STYLES[option.riskLevel],
        isSelected && 'ring-primary ring-2 ring-offset-2'
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="size-7 shrink-0" />
        <div className="space-y-1">
          <div className="font-semibold">{option.name}</div>
          <p className="text-muted-foreground text-sm">{option.description}</p>
        </div>
      </div>
    </button>
  );
}
