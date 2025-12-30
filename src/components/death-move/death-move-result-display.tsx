import { AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { DeathMoveResult } from './types';

interface DeathMoveResultDisplayProps {
  result: DeathMoveResult;
  className?: string;
}

export function DeathMoveResultDisplay({
  result,
  className,
}: DeathMoveResultDisplayProps) {
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

  const getResultEmoji = () => {
    if (!result.survived) return '💀';
    if (result.gainedScar) return '💔';
    if (result.hpCleared === 999) return '🌟';
    return '✨';
  };

  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border-2 p-4',
        getResultStyles(),
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{getResultEmoji()}</span>
        <h4 className="text-lg font-bold">{getResultTitle()}</h4>
      </div>

      <p className="text-sm">{result.description}</p>

      {result.hopeDieRoll !== undefined && (
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Hope Die: </span>
            <span className="font-bold">{result.hopeDieRoll}</span>
          </div>
          {result.fearDieRoll !== undefined && (
            <div>
              <span className="text-muted-foreground">Fear Die: </span>
              <span className="font-bold">{result.fearDieRoll}</span>
            </div>
          )}
        </div>
      )}

      {result.survived &&
        result.moveType === 'risk_it_all' &&
        result.hpCleared !== undefined && (
          <div className="bg-background/50 rounded p-2 text-sm">
            {result.hpCleared === 999 ? (
              <span className="font-medium">
                Clear ALL Hit Points and Stress!
              </span>
            ) : (
              <span>
                Clear <span className="font-bold">{result.hpCleared}</span> Hit
                Points or Stress (your choice).
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
