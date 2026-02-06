import { RotateCcw, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { Adversary } from '@/lib/schemas/adversaries';
import { cn } from '@/lib/utils';

import {
  computeTierScaling,
  parseModifier,
  parseThresholds,
} from './tier-scaling-utils';
import type { TierScaleOverrides } from './tier-scaling-utils';

interface TierScalingControlsProps {
  adversary: Adversary;
  currentTierOverride?: number;
  onTierChange: (newTier: number, scaledOverrides: TierScaleOverrides) => void;
  className?: string;
}

const TIER_LABELS: Record<number, string> = {
  1: 'Tier 1',
  2: 'Tier 2',
  3: 'Tier 3',
  4: 'Tier 4',
};

// ============== Stat Comparison Row ==============

function StatRow({
  label,
  original,
  scaled,
  changed,
}: {
  label: string;
  original: number;
  scaled: number;
  changed: boolean;
}) {
  const diff = scaled - original;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="tabular-nums">{original}</span>
        {changed && (
          <>
            <span className="text-muted-foreground">→</span>
            <span
              className={cn(
                'font-semibold tabular-nums',
                diff > 0
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-emerald-500 dark:text-emerald-400'
              )}
            >
              {scaled}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ============== Main Component ==============

export default function TierScalingControls({
  adversary,
  currentTierOverride,
  onTierChange,
  className,
}: TierScalingControlsProps) {
  const originalTier = Number(adversary.tier);
  const targetTier = currentTierOverride ?? originalTier;
  const isChanged = targetTier !== originalTier;

  const baseThresholds = useMemo(
    () => parseThresholds(adversary.thresholds),
    [adversary.thresholds]
  );
  const baseModifier = useMemo(
    () => parseModifier(adversary.attack.modifier),
    [adversary.attack.modifier]
  );
  const scaled = useMemo(
    () => computeTierScaling(adversary, targetTier),
    [adversary, targetTier]
  );

  function handleSliderChange(value: number[]) {
    const newTier = value[0];
    if (newTier === undefined) return;
    onTierChange(newTier, computeTierScaling(adversary, newTier));
  }

  function handleReset() {
    onTierChange(originalTier, computeTierScaling(adversary, originalTier));
  }

  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 p-3',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-indigo-500" />
          <Label className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            Tier Scaling
          </Label>
          <Badge
            variant="outline"
            className="border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
          >
            {TIER_LABELS[originalTier]}
          </Badge>
          {isChanged && (
            <span className="text-muted-foreground text-xs">→</span>
          )}
          {isChanged && (
            <Badge className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              {TIER_LABELS[targetTier]}
            </Badge>
          )}
        </div>
        {isChanged && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 px-2 text-xs text-indigo-500 hover:bg-indigo-500/20 hover:text-indigo-400"
            onClick={handleReset}
          >
            <RotateCcw className="size-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Slider */}
      <div className="space-y-1.5">
        <Slider
          value={[targetTier]}
          min={1}
          max={4}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        <div className="flex justify-between px-0.5">
          {[1, 2, 3, 4].map(t => (
            <span
              key={t}
              className={cn(
                'text-[10px] tabular-nums',
                t === targetTier
                  ? 'font-bold text-indigo-600 dark:text-indigo-400'
                  : 'text-muted-foreground'
              )}
            >
              T{t}
            </span>
          ))}
        </div>
      </div>

      {/* Stat Comparison */}
      {isChanged && (
        <div className="space-y-1 rounded-md border border-indigo-500/20 bg-indigo-500/5 px-3 py-2">
          <StatRow
            label="Difficulty"
            original={adversary.difficulty}
            scaled={scaled.difficulty}
            changed={isChanged}
          />
          <StatRow
            label="HP"
            original={adversary.hp}
            scaled={scaled.hp}
            changed={isChanged}
          />
          <StatRow
            label="Stress"
            original={adversary.stress}
            scaled={scaled.stress}
            changed={isChanged}
          />
          <StatRow
            label="Attack Mod"
            original={baseModifier}
            scaled={scaled.attackModifier}
            changed={isChanged}
          />
          <StatRow
            label="Major Threshold"
            original={baseThresholds.major}
            scaled={scaled.thresholds.major}
            changed={isChanged}
          />
          <StatRow
            label="Severe Threshold"
            original={baseThresholds.severe}
            scaled={scaled.thresholds.severe}
            changed={isChanged}
          />
          {baseThresholds.massive != null &&
            scaled.thresholds.massive != null && (
              <StatRow
                label="Massive Threshold"
                original={baseThresholds.massive}
                scaled={scaled.thresholds.massive}
                changed={isChanged}
              />
            )}
        </div>
      )}
    </div>
  );
}
