import { AlertTriangle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Dice5,
  Flame,
  HeartCrack,
  Skull,
  Sparkle,
  Sparkles,
  Star,
} from '@/lib/icons';
import { cn } from '@/lib/utils';

import type { DeathMoveResult } from './types';

const MOVE_TYPE_LABELS: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  blaze_of_glory: {
    label: 'Blaze of Glory',
    icon: <Flame className="size-4" />,
  },
  avoid_death: { label: 'Avoid Death', icon: <Sparkle className="size-4" /> },
  risk_it_all: { label: 'Risk It All', icon: <Dice5 className="size-4" /> },
};

interface DeathMoveResultDisplayProps {
  result: DeathMoveResult;
  className?: string;
}

export function DeathMoveResultDisplay({
  result,
  className,
}: DeathMoveResultDisplayProps) {
  const moveInfo = MOVE_TYPE_LABELS[result.moveType];

  const getResultStyles = () => {
    if (!result.survived) {
      return 'bg-destructive/20 border-destructive text-destructive-foreground';
    }
    if (result.gainedScar) {
      return 'bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-300';
    }
    return 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300';
  };

  const getResultTitle = () => {
    if (!result.survived) return 'You Have Fallen';
    if (result.gainedScar) return 'Survived, But Scarred';
    return 'You Survived!';
  };

  const getResultIcon = () => {
    if (!result.survived) return <Skull className="size-6" />;
    if (result.gainedScar) return <HeartCrack className="size-6" />;
    if (result.hpCleared === 999) return <Star className="size-6" />;
    return <Sparkles className="size-6" />;
  };

  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border-2 p-4',
        getResultStyles(),
        className
      )}
    >
      {/* Move type indicator */}
      {moveInfo && (
        <Badge variant="outline" className="gap-1.5">
          {moveInfo.icon}
          {moveInfo.label}
        </Badge>
      )}

      <div className="flex items-center gap-2">
        {getResultIcon()}
        <h4 className="text-lg font-bold">{getResultTitle()}</h4>
      </div>

      <p className="text-sm">{result.description}</p>

      {/* Dice roll results */}
      {result.hopeDieRoll !== undefined && (
        <div className="bg-background/50 flex items-center gap-4 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">
              {result.hopeDieRoll}
            </span>
            <span className="text-muted-foreground text-xs">Hope Die</span>
          </div>
          {result.fearDieRoll !== undefined && (
            <>
              <span className="text-muted-foreground">vs</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-red-600 dark:text-red-400">
                  {result.fearDieRoll}
                </span>
                <span className="text-muted-foreground text-xs">Fear Die</span>
              </div>
            </>
          )}
        </div>
      )}

      {result.survived &&
        result.moveType === 'risk_it_all' &&
        (result.hpCleared !== undefined ||
          result.stressCleared !== undefined) && (
          <div className="bg-background/50 rounded p-2 text-sm">
            {result.hpCleared === 999 ? (
              <span className="font-medium">
                Clear ALL Hit Points and Stress!
              </span>
            ) : (
              <span>
                Cleared{' '}
                <span className="font-bold">{result.hpCleared ?? 0}</span> HP
                {' and '}
                <span className="font-bold">
                  {result.stressCleared ?? 0}
                </span>{' '}
                Stress.
              </span>
            )}
          </div>
        )}

      {result.gainedScar && (
        <div className="flex items-start gap-2 rounded bg-yellow-500/10 p-2 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            You must cross out a Hope slot permanently. Work with your GM to
            describe this scar.
          </span>
        </div>
      )}

      {!result.survived && (
        <div className="text-muted-foreground text-xs italic">
          Work with your GM to find a fitting way for the party to say goodbye,
          then prepare a new character.
        </div>
      )}
    </div>
  );
}
