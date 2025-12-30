import { cn } from '@/lib/utils';

import { DEATH_MOVE_OPTIONS, RISK_LEVEL_STYLES } from './constants';
import type { DeathMoveType } from './types';

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
        <span className="text-2xl">{option.emoji}</span>
        <div className="space-y-1">
          <div className="font-semibold">{option.name}</div>
          <p className="text-muted-foreground text-sm">{option.description}</p>
        </div>
      </div>
    </button>
  );
}
