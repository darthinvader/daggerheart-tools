import {
  ChevronDown,
  ChevronUp,
  Dices,
  RotateCcw,
  Sparkles,
  Swords,
  Target,
} from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { resolveDualityRoll, rollDuality } from '@/lib/mechanics/dice-engine';
import type { DualityOutcome, ResolvedDualityRoll } from '@/lib/schemas/dice';
import { cn } from '@/lib/utils';

// =====================================================================================
// Types
// =====================================================================================

interface DualityRollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-filled modifier (e.g., from a trait click) */
  defaultModifier?: number;
  /** Label for what's being rolled (e.g., "Agility Check") */
  rollLabel?: string;
  /** Default effect die notation */
  defaultEffectDie?: string;
  /** Callbacks for resource pool updates */
  onHopeChange?: (delta: number) => void;
  onFearChange?: (delta: number) => void;
  onStressClear?: () => void;
}

// =====================================================================================
// Constants
// =====================================================================================

const OUTCOME_CONFIG: Record<
  DualityOutcome,
  { label: string; className: string; icon: typeof Sparkles }
> = {
  critical_success: {
    label: 'Critical Success!',
    className:
      'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    icon: Sparkles,
  },
  success_with_hope: {
    label: 'Success with Hope',
    className: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
    icon: Sparkles,
  },
  success_with_fear: {
    label: 'Success with Fear',
    className:
      'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300',
    icon: Swords,
  },
  failure_with_fear: {
    label: 'Failure with Fear',
    className: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
    icon: Swords,
  },
};

const DEFAULT_DIFFICULTY = 15;

// =====================================================================================
// Sub-components
// =====================================================================================

/** Large die face display for Hope or Fear */
const DieFace = memo(function DieFace({
  label,
  value,
  colorClass,
  isMatching,
}: {
  label: string;
  value: number;
  colorClass: string;
  isMatching: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 rounded-full border p-4 transition-all duration-300',
        colorClass,
        isMatching &&
          'shadow-[0_0_16px_rgba(251,191,36,0.4)] ring-2 ring-amber-400/60'
      )}
    >
      <span className="text-xs font-semibold tracking-wider uppercase opacity-70">
        {label}
      </span>
      <span className="text-4xl font-bold tabular-nums">{value}</span>
      {isMatching && (
        <Sparkles className="size-4 animate-pulse text-amber-400" />
      )}
    </div>
  );
});

/** Outcome banner with icon and label */
const OutcomeBanner = memo(function OutcomeBanner({
  outcome,
}: {
  outcome: DualityOutcome;
}) {
  const config = OUTCOME_CONFIG[outcome];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-300',
        config.className
      )}
    >
      <Icon className="size-4" />
      {config.label}
    </div>
  );
});

/** Displays the full resolved roll result */
const RollResultDisplay = memo(function RollResultDisplay({
  result,
}: {
  result: ResolvedDualityRoll;
}) {
  // Build modifier breakdown string
  const breakdownParts: string[] = [`${result.hopeDie} + ${result.fearDie}`];
  if (result.modifier !== 0) {
    breakdownParts.push(
      result.modifier > 0 ? `+${result.modifier}` : `${result.modifier}`
    );
  }
  if (result.advantageDie !== undefined) {
    breakdownParts.push(`+${result.advantageDie} (adv)`);
  }
  if (result.disadvantageDie !== undefined) {
    breakdownParts.push(`-${result.disadvantageDie} (dis)`);
  }

  const breakdown = breakdownParts.join(' ');

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex flex-col gap-3 duration-300">
      {/* Die faces */}
      <div className="flex items-center justify-center gap-4">
        <DieFace
          label="Hope"
          value={result.hopeDie}
          colorClass="border-sky-500/30 bg-sky-500/10 text-sky-500"
          isMatching={result.isMatching}
        />
        <DieFace
          label="Fear"
          value={result.fearDie}
          colorClass="border-purple-500/30 bg-purple-500/10 text-purple-500"
          isMatching={result.isMatching}
        />
      </div>

      {/* Advantage/Disadvantage die */}
      {result.advantageDie !== undefined && (
        <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
          <Dices className="size-5" />
          <span>Advantage +{result.advantageDie}</span>
        </div>
      )}
      {result.disadvantageDie !== undefined && (
        <div className="flex items-center justify-center gap-2 text-sm text-red-700 dark:text-red-400">
          <Dices className="size-5" />
          <span>Disadvantage −{result.disadvantageDie}</span>
        </div>
      )}

      {/* Total and breakdown */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums">
            {result.total}
          </span>
          <span className="text-muted-foreground text-sm">
            vs {result.difficulty}
          </span>
        </div>
        <span className="text-muted-foreground text-xs">{breakdown}</span>
      </div>

      {/* Outcome banner */}
      <OutcomeBanner outcome={result.outcome} />

      {/* Resource generation indicators */}
      <div className="flex items-center justify-center gap-3">
        {result.hopeGenerated > 0 && (
          <Badge className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300">
            <ChevronUp className="size-3" />+{result.hopeGenerated} Hope
          </Badge>
        )}
        {result.fearGenerated > 0 && (
          <Badge className="border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300">
            <ChevronDown className="size-3" />+{result.fearGenerated} Fear
          </Badge>
        )}
        {result.clearsStress && (
          <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
            <Sparkles className="size-3" />
            Clear Stress
          </Badge>
        )}
      </div>

      {/* Effect die result */}
      {result.effectDieResult && (
        <div className="flex flex-col items-center gap-1 rounded-lg border border-orange-500/30 bg-orange-500/10 p-2">
          <span className="text-xs font-semibold tracking-wider text-orange-700 uppercase dark:text-orange-300">
            Effect Die ({result.effectDieResult.notation})
          </span>
          <div className="flex items-center gap-2">
            {result.effectDieResult.rolls.map((roll, i) => (
              <span
                key={`${i}-${roll}`}
                className="text-lg font-bold text-orange-700 tabular-nums dark:text-orange-300"
              >
                {roll}
              </span>
            ))}
            {result.effectDieResult.rolls.length > 1 && (
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                = {result.effectDieResult.total}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

// =====================================================================================
// Main Component
// =====================================================================================

export const DualityRollDialog = memo(function DualityRollDialog({
  open,
  onOpenChange,
  defaultModifier = 0,
  rollLabel,
  defaultEffectDie = '1d8',
  onHopeChange,
  onFearChange,
  onStressClear,
}: DualityRollDialogProps) {
  const [modifier, setModifier] = useState(defaultModifier);
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [effectDieEnabled, setEffectDieEnabled] = useState(false);
  const [effectDieNotation, setEffectDieNotation] = useState(defaultEffectDie);
  const [result, setResult] = useState<ResolvedDualityRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const hasAdvantage = advantage && !disadvantage;
  const hasDisadvantage = disadvantage && !advantage;

  const resetResult = useCallback(() => {
    setResult(null);
  }, []);

  const handleRoll = useCallback(() => {
    setIsRolling(true);

    // Brief delay for animation feel
    setTimeout(() => {
      const rawRoll = rollDuality(modifier, {
        advantage: hasAdvantage,
        disadvantage: hasDisadvantage,
        effectDie: effectDieEnabled ? effectDieNotation : undefined,
      });
      const resolved = resolveDualityRoll(rawRoll, difficulty);

      setResult(resolved);
      setIsRolling(false);

      // Fire callbacks
      if (resolved.hopeGenerated > 0) {
        onHopeChange?.(resolved.hopeGenerated);
      }
      if (resolved.fearGenerated > 0) {
        onFearChange?.(resolved.fearGenerated);
      }
      if (resolved.clearsStress) {
        onStressClear?.();
      }
    }, 150);
  }, [
    modifier,
    hasAdvantage,
    hasDisadvantage,
    effectDieEnabled,
    effectDieNotation,
    difficulty,
    onHopeChange,
    onFearChange,
    onStressClear,
  ]);

  const handleRollAgain = useCallback(() => {
    resetResult();
    // Small delay so the UI resets visually before re-rolling
    setTimeout(handleRoll, 50);
  }, [resetResult, handleRoll]);

  const toggleAdvantage = useCallback(() => {
    setAdvantage(prev => !prev);
    if (disadvantage) setDisadvantage(false);
    resetResult();
  }, [disadvantage, resetResult]);

  const toggleDisadvantage = useCallback(() => {
    setDisadvantage(prev => !prev);
    if (advantage) setAdvantage(false);
    resetResult();
  }, [advantage, resetResult]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setResult(null);
        setIsRolling(false);
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  const title = useMemo(() => rollLabel ?? 'Duality Roll', [rollLabel]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="size-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Modifier & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="roll-modifier">Modifier</Label>
              <Input
                id="roll-modifier"
                type="number"
                value={modifier}
                onChange={e => {
                  setModifier(Number(e.target.value) || 0);
                  resetResult();
                }}
                className="tabular-nums"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="roll-difficulty">Difficulty</Label>
              <Input
                id="roll-difficulty"
                type="number"
                value={difficulty}
                onChange={e => {
                  setDifficulty(Number(e.target.value) || DEFAULT_DIFFICULTY);
                  resetResult();
                }}
                className="tabular-nums"
              />
            </div>
          </div>

          {/* Advantage / Disadvantage toggles */}
          <div className="flex items-center gap-2">
            <Button
              variant={hasAdvantage ? 'default' : 'outline'}
              size="sm"
              onClick={toggleAdvantage}
              className={cn(
                'flex-1 transition-colors',
                hasAdvantage && 'bg-emerald-600 text-white hover:bg-emerald-700'
              )}
            >
              <ChevronUp className="size-4" />
              Advantage
            </Button>
            <Button
              variant={hasDisadvantage ? 'default' : 'outline'}
              size="sm"
              onClick={toggleDisadvantage}
              className={cn(
                'flex-1 transition-colors',
                hasDisadvantage && 'bg-red-600 text-white hover:bg-red-700'
              )}
            >
              <ChevronDown className="size-4" />
              Disadvantage
            </Button>
          </div>

          {/* Effect Die toggle */}
          <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Switch
                id="effect-die-toggle"
                checked={effectDieEnabled}
                onCheckedChange={checked => {
                  setEffectDieEnabled(checked);
                  resetResult();
                }}
              />
              <Label htmlFor="effect-die-toggle">Effect Die</Label>
            </div>
            {effectDieEnabled && (
              <Input
                value={effectDieNotation}
                onChange={e => {
                  setEffectDieNotation(e.target.value);
                  resetResult();
                }}
                placeholder="1d8"
                className="w-20 tabular-nums"
              />
            )}
          </div>

          {/* Roll Button or Result */}
          {result ? (
            <RollResultDisplay result={result} />
          ) : (
            <Button
              size="lg"
              onClick={handleRoll}
              isLoading={isRolling}
              loadingText="Rolling..."
              className="w-full bg-linear-to-r from-sky-600 to-purple-600 text-white transition-all duration-200 hover:from-sky-700 hover:to-purple-700"
            >
              <Dices className="size-5" />
              Roll Duality Dice
            </Button>
          )}
        </div>

        {/* Footer with Roll Again */}
        {result && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleRollAgain}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="size-4" />
              Roll Again
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
});

export type { DualityRollDialogProps };
