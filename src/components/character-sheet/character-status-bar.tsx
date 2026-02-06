import { Shield, Skull, Sparkles } from 'lucide-react';

import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

import type { CharacterSheetState } from './types';

interface CharacterStatusBarProps {
  state: CharacterSheetState;
  className?: string;
}

/* ── Circular SVG Gauge ─────────────────────────────────────────── */

const GAUGE_SIZE = 48;
const GAUGE_STROKE = 4;
const GAUGE_RADIUS = (GAUGE_SIZE - GAUGE_STROKE) / 2;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

function CircularGauge({
  current,
  max,
  label,
  color,
  trackColor,
  isCritical,
}: {
  current: number;
  max: number;
  label: string;
  color: string;
  trackColor: string;
  isCritical?: boolean;
}) {
  const pct = max > 0 ? current / max : 0;
  const offset = GAUGE_CIRCUMFERENCE * (1 - pct);

  return (
    <SmartTooltip content={`${label}: ${current}/${max}`}>
      <div
        className={cn(
          'relative flex items-center gap-1.5',
          isCritical && 'animate-pulse-danger'
        )}
      >
        <svg
          width={GAUGE_SIZE}
          height={GAUGE_SIZE}
          viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
          className="shrink-0 -rotate-90"
        >
          {/* Track */}
          <circle
            cx={GAUGE_SIZE / 2}
            cy={GAUGE_SIZE / 2}
            r={GAUGE_RADIUS}
            className="gauge-track"
            stroke={trackColor}
            strokeWidth={GAUGE_STROKE}
          />
          {/* Fill ring */}
          <circle
            cx={GAUGE_SIZE / 2}
            cy={GAUGE_SIZE / 2}
            r={GAUGE_RADIUS}
            className="gauge-ring animate-gauge-fill"
            stroke={color}
            strokeWidth={GAUGE_STROKE}
            strokeDasharray={GAUGE_CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={
              {
                '--gauge-circumference': GAUGE_CIRCUMFERENCE,
                '--gauge-offset': offset,
              } as React.CSSProperties
            }
          />
        </svg>
        {/* Central label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-xs leading-none font-bold"
            style={{ color }}
          >
            {current}
          </span>
        </div>
      </div>
    </SmartTooltip>
  );
}

/* ── Segmented Bar (for compact linear display) ─────────────────── */

function SegmentedBar({
  current,
  max,
  label,
  color,
  trackClass,
  icon: Icon,
  isCritical,
}: {
  current: number;
  max: number;
  label: string;
  color: string;
  trackClass: string;
  icon: React.ComponentType<{ className?: string }>;
  isCritical?: boolean;
}) {
  const pct = max > 0 ? (current / max) * 100 : 0;

  return (
    <SmartTooltip content={`${label}: ${current}/${max}`}>
      <div
        className={cn(
          'flex items-center gap-1.5',
          isCritical && 'animate-pulse-danger'
        )}
      >
        <Icon className={cn('size-3.5 shrink-0', color)} />
        <div
          className={cn(
            'h-1.5 w-10 overflow-hidden rounded-full sm:w-14',
            trackClass
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              color.replace('text-', 'bg-')
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className={cn(
            'min-w-[2ch] text-right font-mono text-xs font-bold',
            color
          )}
        >
          {current}
        </span>
      </div>
    </SmartTooltip>
  );
}

/* ── Hope Pips ──────────────────────────────────────────────────── */

function HopePips({
  current,
  max,
  scarCount,
}: {
  current: number;
  max: number;
  scarCount: number;
}) {
  return (
    <SmartTooltip
      content={`Hope: ${current}/${max}${scarCount > 0 ? ` (${scarCount} scarred)` : ''}`}
    >
      <div className="flex items-center gap-1.5">
        <Sparkles
          className={cn(
            'text-hope size-3.5 shrink-0',
            current >= 3 && 'animate-glow-hope'
          )}
        />
        <div className="flex gap-0.5">
          {Array.from({ length: max }).map((_, i) => {
            const isScarred = i >= max - scarCount;
            const isFilled = !isScarred && i < current;
            return (
              <div
                key={i}
                className={cn(
                  'hope-pip',
                  isFilled && 'hope-pip-filled animate-pip-fill',
                  isScarred && 'hope-pip-scarred'
                )}
                style={isFilled ? { animationDelay: `${i * 40}ms` } : undefined}
              />
            );
          })}
        </div>
        <span className="text-hope font-mono text-xs font-bold">{current}</span>
      </div>
    </SmartTooltip>
  );
}

/* ── Main Status Bar ────────────────────────────────────────────── */

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

  const hpRemaining = hp.max - hp.current;
  const stressRemaining = stress.max - stress.current;
  const hpPct = hp.max > 0 ? hpRemaining / hp.max : 1;
  const hpCritical = hpPct <= 0.25;
  const stressCritical = stressRemaining <= 1;

  // Pick contextual status bar background
  const statusClass = isUnconscious
    ? 'status-bar-unconscious'
    : hpCritical
      ? 'status-bar-critical'
      : hpPct <= 0.5
        ? 'status-bar-wounded'
        : 'status-bar-healthy';

  return (
    <div className={cn('status-bar animate-fade-up', statusClass, className)}>
      {/* Unconscious warning badge */}
      {isUnconscious && (
        <div className="text-destructive animate-pulse-danger bg-destructive/10 flex items-center gap-1 rounded-md px-2 py-0.5">
          <Skull className="size-3.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            Unconscious
          </span>
        </div>
      )}

      {/* HP Gauge */}
      <CircularGauge
        current={hpRemaining}
        max={hp.max}
        label="HP"
        color={
          hpCritical
            ? 'var(--hp-critical)'
            : hpPct <= 0.5
              ? 'var(--hp-wounded)'
              : 'var(--hp-healthy)'
        }
        trackColor={hpCritical ? 'var(--hp-critical)' : 'var(--hp-healthy)'}
        isCritical={hpCritical}
      />

      {/* Stress Gauge */}
      <CircularGauge
        current={stressRemaining}
        max={stress.max}
        label="Stress"
        color={stressCritical ? 'var(--stress-high)' : 'var(--stress-ok)'}
        trackColor={stressCritical ? 'var(--stress-high)' : 'var(--stress-ok)'}
        isCritical={stressCritical}
      />

      {/* Armor (segmented bar, only when armor exists) */}
      {armor.max > 0 && (
        <SegmentedBar
          current={armor.current}
          max={armor.max}
          label="Armor"
          color="text-primary"
          trackClass="bg-primary/20"
          icon={Shield}
        />
      )}

      {/* Separator */}
      <div className="bg-border hidden h-5 w-px sm:block" />

      {/* Hope Pips */}
      <HopePips current={hope.current} max={hope.max} scarCount={scarCount} />
    </div>
  );
}
