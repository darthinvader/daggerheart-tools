import {
  ChevronDown,
  Minus,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  Undo2,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import {
  COUNTDOWN_BEHAVIOR_OPTIONS,
  COUNTDOWN_TYPE_STYLES,
  COUNTDOWN_TYPES,
  ROLL_RESULT_OPTIONS,
} from './constants';
import { CountdownSegments } from './countdown-segments';
import { isCountdownComplete } from './countdown-utils';
import type { Countdown, RollResult } from './types';

// ---------------------------------------------------------------------------
// Reusable tooltip-wrapped icon button
// ---------------------------------------------------------------------------

interface TooltipIconButtonProps {
  tooltip: string;
  onClick: () => void;
  icon: ReactNode;
  variant?: 'ghost' | 'outline';
  className?: string;
}

function TooltipIconButton({
  tooltip,
  onClick,
  icon,
  variant = 'ghost',
  className,
}: TooltipIconButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="icon"
            className={cn('h-7 w-7', className)}
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Header badges (complete, loop count, dynamic)
// ---------------------------------------------------------------------------

function HeaderBadges({
  countdown,
  complete,
}: {
  countdown: Countdown;
  complete: boolean;
}) {
  return (
    <>
      {complete && countdown.behavior !== 'loop' && (
        <Badge variant="secondary">Complete</Badge>
      )}
      {countdown.behavior === 'loop' && countdown.loopCount > 0 && (
        <Badge variant="outline" className="text-xs">
          <RefreshCw className="mr-1 h-3 w-3" />
          Loop {countdown.loopCount}
        </Badge>
      )}
      {countdown.dynamicAdvancement && (
        <Badge variant="outline" className="text-xs text-yellow-500">
          <Zap className="mr-1 h-3 w-3" />
          Dynamic
        </Badge>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Description + trigger metadata beneath the title
// ---------------------------------------------------------------------------

function HeaderMeta({ countdown }: { countdown: Countdown }) {
  return (
    <>
      {countdown.description && (
        <p className="text-muted-foreground text-sm">{countdown.description}</p>
      )}
      {countdown.trigger && (
        <p className="text-muted-foreground text-xs italic">
          Trigger: {countdown.trigger.description}
          {countdown.trigger.fired && (
            <Badge variant="destructive" className="ml-2 text-xs">
              Fired
            </Badge>
          )}
        </p>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Type badge + behavior label shown in top-right corner
// ---------------------------------------------------------------------------

function HeaderTypeInfo({ countdown }: { countdown: Countdown }) {
  const typeInfo = COUNTDOWN_TYPES.find(t => t.value === countdown.type)!;
  const behaviorInfo = COUNTDOWN_BEHAVIOR_OPTIONS.find(
    b => b.value === countdown.behavior
  );

  return (
    <div className="flex flex-col items-end gap-1">
      <Badge variant="outline" className={typeInfo.color}>
        {typeInfo.label}
      </Badge>
      {countdown.behavior !== 'once' && (
        <span className="text-muted-foreground text-xs">
          {behaviorInfo?.label}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dynamic advancement toggle button
// ---------------------------------------------------------------------------

function DynamicToggleButton({
  showDynamicControls,
  onToggle,
}: {
  showDynamicControls: boolean;
  onToggle: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={showDynamicControls ? 'secondary' : 'outline'}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onToggle}
          >
            <Zap className="mr-1 h-3 w-3" />
            Roll
            <ChevronDown
              className={cn(
                'ml-1 h-3 w-3 transition-transform',
                showDynamicControls && 'rotate-180'
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Advance based on roll result</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Multi-step advancement dropdown (+2 / +3)
// ---------------------------------------------------------------------------

function AdvancementDropdown({
  disabled,
  onAdvance,
}: {
  disabled: boolean;
  onAdvance: (amount: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={disabled}
        >
          +2/3
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Advance By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAdvance(2)}>
          <span className="mr-2">+2</span>
          <span className="text-muted-foreground text-xs">
            Success with Hope
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdvance(3)}>
          <span className="mr-2">+3</span>
          <span className="text-muted-foreground text-xs">
            Critical Success
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Control button bar (all action buttons)
// ---------------------------------------------------------------------------

interface ControlButtonsProps {
  countdown: Countdown;
  complete: boolean;
  styles: { bg: string };
  showDynamicControls: boolean;
  onToggleDynamic: () => void;
  onAdvance: (amount: number) => void;
  onDelete: () => void;
  onReset?: () => void;
  onUndo?: () => void;
  hasHistory: boolean;
}

function ControlButtons({
  countdown,
  complete,
  styles,
  showDynamicControls,
  onToggleDynamic,
  onAdvance,
  onDelete,
  onReset,
  onUndo,
  hasHistory,
}: ControlButtonsProps) {
  const advanceDisabled = complete && countdown.behavior !== 'loop';

  return (
    <div className="flex flex-wrap gap-1">
      {countdown.dynamicAdvancement && (
        <DynamicToggleButton
          showDynamicControls={showDynamicControls}
          onToggle={onToggleDynamic}
        />
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onAdvance(-1)}
        disabled={countdown.filled <= 0}
      >
        <Minus className="h-3 w-3" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn('h-7 w-7', styles.bg)}
        onClick={() => onAdvance(1)}
        disabled={advanceDisabled}
      >
        <Plus className="h-3 w-3" />
      </Button>

      <AdvancementDropdown disabled={advanceDisabled} onAdvance={onAdvance} />

      {onUndo && hasHistory && (
        <TooltipIconButton
          tooltip="Undo last advancement"
          onClick={onUndo}
          icon={<Undo2 className="h-3 w-3" />}
        />
      )}

      {onReset && (
        <TooltipIconButton
          tooltip="Reset countdown"
          onClick={onReset}
          icon={<RotateCcw className="h-3 w-3" />}
        />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="text-destructive h-7 w-7"
        onClick={onDelete}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dynamic advancement panel (roll-result based grid)
// ---------------------------------------------------------------------------

function DynamicControlsPanel({
  countdown,
  complete,
  onAdvance,
}: {
  countdown: Countdown;
  complete: boolean;
  onAdvance: (amount: number, rollResult?: RollResult) => void;
}) {
  const advanceDisabled = complete && countdown.behavior !== 'loop';

  return (
    <div className="border-t pt-3">
      <p className="text-muted-foreground mb-2 text-xs">
        Advance based on roll result:
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ROLL_RESULT_OPTIONS.map(option => (
          <TooltipProvider key={option.value}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn('flex h-auto flex-col py-2', option.color)}
                  onClick={() => onAdvance(option.advancement, option.value)}
                  disabled={option.advancement === 0 || advanceDisabled}
                >
                  <span className="font-semibold">{option.shortLabel}</span>
                  <span className="text-muted-foreground text-xs">
                    +{option.advancement}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs">{option.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main CountdownCard component
// ---------------------------------------------------------------------------

interface CountdownCardProps {
  countdown: Countdown;
  onAdvance: (amount: number, rollResult?: RollResult) => void;
  onDelete: () => void;
  onToggleSegment: (index: number) => void;
  onReset?: () => void;
  onUndo?: () => void;
}

export function CountdownCard({
  countdown,
  onAdvance,
  onDelete,
  onToggleSegment,
  onReset,
  onUndo,
}: CountdownCardProps) {
  const [showDynamicControls, setShowDynamicControls] = useState(false);
  const styles = COUNTDOWN_TYPE_STYLES[countdown.type];
  const complete = isCountdownComplete(countdown);
  const hasHistory = (countdown.advancementHistory?.length ?? 0) > 0;

  return (
    <Card
      className={cn(complete && countdown.behavior !== 'loop' && 'opacity-60')}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle className="flex flex-wrap items-center gap-2 text-base">
            <span className="truncate">{countdown.name}</span>
            <HeaderBadges countdown={countdown} complete={complete} />
          </CardTitle>
          <HeaderMeta countdown={countdown} />
        </div>
        <HeaderTypeInfo countdown={countdown} />
      </CardHeader>
      <CardContent className="space-y-3">
        <CountdownSegments
          countdown={countdown}
          onToggle={onToggleSegment}
          size="md"
        />

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {countdown.filled} / {countdown.segments}
            {countdown.variance !== 'none' && (
              <span className="ml-2 text-xs opacity-60">
                (Variance: {countdown.variance})
              </span>
            )}
          </div>
          <ControlButtons
            countdown={countdown}
            complete={complete}
            styles={styles}
            showDynamicControls={showDynamicControls}
            onToggleDynamic={() => setShowDynamicControls(!showDynamicControls)}
            onAdvance={onAdvance}
            onDelete={onDelete}
            onReset={onReset}
            onUndo={onUndo}
            hasHistory={hasHistory}
          />
        </div>

        {countdown.dynamicAdvancement && showDynamicControls && (
          <DynamicControlsPanel
            countdown={countdown}
            complete={complete}
            onAdvance={onAdvance}
          />
        )}
      </CardContent>
    </Card>
  );
}
