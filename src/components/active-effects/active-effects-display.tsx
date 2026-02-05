import { Clock, Hourglass, Sparkles, Trash2, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ActiveEffect, EffectDurationType } from '@/lib/schemas/equipment';

interface ActiveEffectsDisplayProps {
  effects: ActiveEffect[];
  onChange: (effects: ActiveEffect[]) => void;
  onClearAll?: () => void;
}

function getDurationLabel(durationType: EffectDurationType): string {
  switch (durationType) {
    case 'next_roll':
      return 'Next Roll';
    case 'until_rest':
      return 'Until Rest';
    case 'until_long_rest':
      return 'Until Long Rest';
    case 'permanent':
      return 'Permanent';
    case 'rounds':
      return 'Rounds';
    default:
      return 'Unknown';
  }
}

function getDurationBadgeVariant(
  durationType: EffectDurationType
): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (durationType) {
    case 'next_roll':
      return 'destructive';
    case 'until_rest':
    case 'until_long_rest':
      return 'secondary';
    case 'permanent':
      return 'default';
    case 'rounds':
      return 'outline';
    default:
      return 'outline';
  }
}

function ActiveEffectCard({
  effect,
  onRemove,
  onMarkUsed,
}: {
  effect: ActiveEffect;
  onRemove: () => void;
  onMarkUsed?: () => void;
}) {
  const durationLabel = getDurationLabel(effect.durationType);
  const badgeVariant = getDurationBadgeVariant(effect.durationType);
  const isNextRoll = effect.durationType === 'next_roll';
  const isUsed = effect.hasBeenUsed;

  return (
    <div
      className={`relative rounded-lg border p-3 transition-opacity ${
        isUsed ? 'border-muted bg-muted/30 opacity-60' : 'bg-card'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className={`font-medium ${isUsed ? 'line-through' : ''}`}>
              {effect.name}
            </span>
          </div>
          {effect.description && (
            <p className="text-muted-foreground text-sm">
              {effect.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant={badgeVariant}>
              {effect.durationType === 'rounds' &&
              effect.roundsRemaining !== undefined ? (
                <span className="flex items-center gap-1">
                  <Hourglass className="h-3 w-3" />
                  {effect.roundsRemaining} rounds
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {durationLabel}
                </span>
              )}
            </Badge>
            {effect.traitBonus && (
              <Badge variant="outline" className="text-green-600">
                +{effect.traitBonus.bonus} {effect.traitBonus.trait}
              </Badge>
            )}
            {isUsed && (
              <Badge variant="outline" className="text-muted-foreground">
                Used
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {isNextRoll && !isUsed && onMarkUsed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onMarkUsed}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark as used (will clear after)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-7 w-7"
                  onClick={onRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove effect</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export function ActiveEffectsDisplay({
  effects,
  onChange,
  onClearAll,
}: ActiveEffectsDisplayProps) {
  const handleRemove = (effectId: string) => {
    onChange(effects.filter(e => e.id !== effectId));
  };

  const handleMarkUsed = (effectId: string) => {
    onChange(
      effects.map(e => (e.id === effectId ? { ...e, hasBeenUsed: true } : e))
    );
  };

  if (effects.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Active Effects
            </CardTitle>
            <CardDescription>
              Temporary bonuses from potions and consumables
            </CardDescription>
          </div>
          {onClearAll && effects.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {effects.map(effect => (
          <ActiveEffectCard
            key={effect.id}
            effect={effect}
            onRemove={() => handleRemove(effect.id)}
            onMarkUsed={
              effect.durationType === 'next_roll' && !effect.hasBeenUsed
                ? () => handleMarkUsed(effect.id)
                : undefined
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
