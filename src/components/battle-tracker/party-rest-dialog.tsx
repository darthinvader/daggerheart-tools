/**
 * Party Rest Dialog for GM to trigger party rest and track Fear gain.
 * Per Daggerheart Chapter 3:
 * - Short Rest: GM gains 1d4 Fear
 * - Long Rest: GM gains (number of PCs + 1d4) Fear
 */
import { Flame, Moon, Sun } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { calculateFearGain, getFearGainSummary } from '../rest';
import type { FearGainResult, RestType } from '../rest';

export interface PartyRestDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Number of PCs in the party */
  partySize: number;
  /** Current fear pool value */
  currentFear: number;
  /** Maximum fear pool value */
  maxFear: number;
  /** Callback when rest is confirmed with Fear gain */
  onRestComplete: (fearGain: FearGainResult) => void;
}

type Phase = 'select' | 'result';

export function PartyRestDialog({
  isOpen,
  onClose,
  partySize,
  currentFear,
  maxFear,
  onRestComplete,
}: PartyRestDialogProps) {
  const [phase, setPhase] = useState<Phase>('select');
  const [fearGain, setFearGain] = useState<FearGainResult | null>(null);
  const [selectedRestType, setSelectedRestType] = useState<RestType | null>(
    null
  );

  const handleSelectRestType = useCallback(
    (restType: RestType) => {
      setSelectedRestType(restType);
      const result = calculateFearGain(restType, partySize);
      setFearGain(result);
      setPhase('result');
    },
    [partySize]
  );

  const handleClose = useCallback(() => {
    setPhase('select');
    setFearGain(null);
    setSelectedRestType(null);
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (fearGain) {
      onRestComplete(fearGain);
    }
    handleClose();
  }, [fearGain, onRestComplete, handleClose]);

  const handleBack = useCallback(() => {
    setPhase('select');
    setFearGain(null);
    setSelectedRestType(null);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-md">
        {phase === 'select' && (
          <RestTypeSelection
            partySize={partySize}
            onSelect={handleSelectRestType}
          />
        )}
        {phase === 'result' && fearGain && (
          <RestResultDisplay
            fearGain={fearGain}
            restType={selectedRestType!}
            currentFear={currentFear}
            maxFear={maxFear}
            onConfirm={handleConfirm}
            onBack={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface RestTypeSelectionProps {
  partySize: number;
  onSelect: (type: RestType) => void;
}

function RestTypeSelection({ partySize, onSelect }: RestTypeSelectionProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5" />
          Party Rest
        </DialogTitle>
        <DialogDescription>
          The party is taking a rest. Select the rest type to calculate Fear
          gained.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <button
          type="button"
          onClick={() => onSelect('short')}
          className="hover:border-primary hover:bg-accent flex flex-col gap-2 rounded-lg border-2 border-dashed p-4 text-left transition-colors"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Sun className="h-5 w-5 text-amber-500" />
            Short Rest
          </div>
          <p className="text-muted-foreground text-sm">
            About 1 hour. PCs make 2 downtime moves.
          </p>
          <p className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400">
            <Flame className="h-4 w-4" />
            GM gains <span className="font-bold">1d4</span> Fear
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelect('long')}
          className="hover:border-primary hover:bg-accent flex flex-col gap-2 rounded-lg border-2 border-dashed p-4 text-left transition-colors"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Moon className="h-5 w-5 text-indigo-500" />
            Long Rest
          </div>
          <p className="text-muted-foreground text-sm">
            Several hours. PCs make 2 downtime moves with full recovery.
          </p>
          <p className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400">
            <Flame className="h-4 w-4" />
            GM gains{' '}
            <span className="font-bold">
              {partySize} PC{partySize !== 1 ? 's' : ''} + 1d4
            </span>{' '}
            Fear
          </p>
        </button>
      </div>

      <DialogFooter>
        <p className="text-muted-foreground w-full text-center text-xs">
          Per Daggerheart Chapter 3 rest rules
        </p>
      </DialogFooter>
    </>
  );
}

interface RestResultDisplayProps {
  fearGain: FearGainResult;
  restType: RestType;
  currentFear: number;
  maxFear: number;
  onConfirm: () => void;
  onBack: () => void;
}

function RestResultDisplay({
  fearGain,
  restType,
  currentFear,
  maxFear,
  onConfirm,
  onBack,
}: RestResultDisplayProps) {
  const restLabel = restType === 'short' ? 'Short Rest' : 'Long Rest';
  const RestIcon = restType === 'short' ? Sun : Moon;
  const iconColor = restType === 'short' ? 'text-amber-500' : 'text-indigo-500';

  const newFear = Math.min(maxFear, currentFear + fearGain.total);
  const actualGain = newFear - currentFear;
  const isCapped = actualGain < fearGain.total;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <RestIcon className={cn('h-5 w-5', iconColor)} />
          {restLabel} Complete
        </DialogTitle>
        <DialogDescription>
          Fear has been calculated for the party rest.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Fear Gain Display */}
        <div className="flex items-center gap-3 rounded-lg border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-violet-500/10 p-4">
          <Flame className="h-8 w-8 text-purple-500" />
          <div className="flex-1">
            <div className="font-medium text-purple-700 dark:text-purple-400">
              Fear Gained
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-300">
              {getFearGainSummary(fearGain)}
            </div>
          </div>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            +{fearGain.total}
          </div>
        </div>

        {/* Fear Pool Update Preview */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Current Fear</span>
            <span className="font-medium">{currentFear}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Fear Gained</span>
            <span className="font-medium text-purple-600">
              +{isCapped ? actualGain : fearGain.total}
              {isCapped && (
                <span className="text-muted-foreground ml-1 text-xs">
                  (capped from +{fearGain.total})
                </span>
              )}
            </span>
          </div>
          <div className="my-2 border-t" />
          <div className="flex items-center justify-between">
            <span className="font-medium">New Fear Total</span>
            <Badge
              variant="secondary"
              className="bg-purple-500/20 text-purple-700 dark:text-purple-300"
            >
              {newFear} / {maxFear}
            </Badge>
          </div>
        </div>

        {isCapped && (
          <p className="text-muted-foreground text-center text-xs">
            Fear is capped at the maximum ({maxFear})
          </p>
        )}
      </div>

      <DialogFooter className="flex-row gap-2 sm:justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onConfirm}>
          <Flame className="mr-2 h-4 w-4" />
          Add Fear to Pool
        </Button>
      </DialogFooter>
    </>
  );
}
