import { Heart, HeartCrack, Shield, Skull, Sparkles, Zap } from 'lucide-react';

import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

import type { CharacterSheetState } from './types';

interface CharacterStatusBarProps {
  state: CharacterSheetState;
  className?: string;
}

function StatusPip({
  filled,
  color,
  scarred,
}: {
  filled: boolean;
  color: string;
  scarred?: boolean;
}) {
  return (
    <div
      className={cn(
        'h-2 w-2 rounded-full border transition-colors',
        scarred && 'border-destructive bg-destructive/30 line-through',
        !scarred && filled && color,
        !scarred && !filled && 'border-muted-foreground/30 bg-transparent'
      )}
    />
  );
}

function ResourceMeter({
  current,
  max,
  label,
  icon: Icon,
  color,
  bgColor,
  criticalThreshold,
  scarredSlots,
}: {
  current: number;
  max: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  criticalThreshold?: number;
  scarredSlots?: number;
}) {
  const percentage = max > 0 ? (current / max) * 100 : 0;
  const isCritical =
    criticalThreshold !== undefined && current <= criticalThreshold;

  return (
    <SmartTooltip
      content={`${label}: ${current}/${max}${scarredSlots ? ` (${scarredSlots} scarred)` : ''}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon
          className={cn(
            'size-3.5 shrink-0',
            isCritical ? 'animate-pulse-danger text-destructive' : color
          )}
        />
        <div className={cn('h-1.5 w-12 overflow-hidden rounded-full', bgColor)}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isCritical ? 'bg-destructive' : color.replace('text-', 'bg-')
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span
          className={cn(
            'min-w-[2ch] text-right font-mono text-xs font-bold',
            isCritical ? 'animate-pulse-danger text-destructive' : color
          )}
        >
          {current}
        </span>
      </div>
    </SmartTooltip>
  );
}

export function CharacterStatusBar({
  state,
  className,
}: CharacterStatusBarProps) {
  const hp = state.resources.hp;
  const stress = state.resources.stress;
  const armor = state.resources.armorScore;
  const hope = state.hopeWithScars;
  const isUnconscious = state.deathState?.isUnconscious;
  const scarCount = hope.scars?.length ?? 0;

  const hpPercentage = hp.max > 0 ? hp.current / hp.max : 1;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2 text-xs sm:gap-4',
        isUnconscious &&
          'animate-pulse-danger border-destructive/50 bg-destructive/5',
        !isUnconscious && hpPercentage <= 0.25 && 'status-bar-critical',
        !isUnconscious &&
          hpPercentage > 0.25 &&
          hpPercentage <= 0.5 &&
          'status-bar-wounded',
        !isUnconscious && hpPercentage > 0.5 && 'status-bar-healthy',
        className
      )}
    >
      {isUnconscious && (
        <div className="text-destructive flex items-center gap-1">
          <Skull className="size-3.5" />
          <span className="text-xs font-bold">UNCONSCIOUS</span>
        </div>
      )}

      <ResourceMeter
        current={hp.max - hp.current}
        max={hp.max}
        label="Hit Points"
        icon={hpPercentage <= 0.25 ? HeartCrack : Heart}
        color="text-hp-healthy"
        bgColor="bg-hp-healthy/20"
        criticalThreshold={Math.ceil(hp.max * 0.25)}
      />

      <ResourceMeter
        current={stress.max - stress.current}
        max={stress.max}
        label="Stress"
        icon={Zap}
        color="text-stress-ok"
        bgColor="bg-stress-ok/20"
        criticalThreshold={1}
      />

      {armor.max > 0 && (
        <ResourceMeter
          current={armor.current}
          max={armor.max}
          label="Armor"
          icon={Shield}
          color="text-primary"
          bgColor="bg-primary/20"
        />
      )}

      <SmartTooltip
        content={`Hope: ${hope.current}/${hope.max}${scarCount > 0 ? ` (${scarCount} scarred)` : ''}`}
      >
        <div className="flex items-center gap-1">
          <Sparkles
            className={cn(
              'text-hope size-3.5 shrink-0',
              hope.current >= 3 && 'animate-glow-hope'
            )}
          />
          <div className="flex gap-0.5">
            {Array.from({ length: hope.max }).map((_, i) => (
              <StatusPip
                key={i}
                filled={i < hope.current}
                color="border-hope bg-hope"
                scarred={i >= hope.max - scarCount}
              />
            ))}
          </div>
        </div>
      </SmartTooltip>
    </div>
  );
}
