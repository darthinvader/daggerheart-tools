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
  const typeInfo = COUNTDOWN_TYPES.find(t => t.value === countdown.type)!;
  const styles = COUNTDOWN_TYPE_STYLES[countdown.type];
  const complete = isCountdownComplete(countdown);
  const behaviorInfo = COUNTDOWN_BEHAVIOR_OPTIONS.find(
    b => b.value === countdown.behavior
  );

  const hasHistory = (countdown.advancementHistory?.length ?? 0) > 0;

  return (
    <Card
      className={cn(complete && countdown.behavior !== 'loop' && 'opacity-60')}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle className="flex flex-wrap items-center gap-2 text-base">
            <span className="truncate">{countdown.name}</span>
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
          </CardTitle>
          {countdown.description && (
            <p className="text-muted-foreground text-sm">
              {countdown.description}
            </p>
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
        </div>
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
          <div className="flex flex-wrap gap-1">
            {/* Dynamic advancement toggle for dynamic countdowns */}
            {countdown.dynamicAdvancement && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showDynamicControls ? 'secondary' : 'outline'}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() =>
                        setShowDynamicControls(!showDynamicControls)
                      }
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
            )}

            {/* Standard -1/+1 controls */}
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
              disabled={complete && countdown.behavior !== 'loop'}
            >
              <Plus className="h-3 w-3" />
            </Button>

            {/* Multi-step advancement dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={complete && countdown.behavior !== 'loop'}
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

            {/* Undo button */}
            {onUndo && hasHistory && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={onUndo}
                    >
                      <Undo2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Undo last advancement</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Reset button */}
            {onReset && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={onReset}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset countdown</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive h-7 w-7"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Dynamic advancement controls (roll-result based) */}
        {countdown.dynamicAdvancement && showDynamicControls && (
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
                        className={cn(
                          'flex h-auto flex-col py-2',
                          option.color
                        )}
                        onClick={() =>
                          onAdvance(option.advancement, option.value)
                        }
                        disabled={
                          option.advancement === 0 ||
                          (complete && countdown.behavior !== 'loop')
                        }
                      >
                        <span className="font-semibold">
                          {option.shortLabel}
                        </span>
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
        )}
      </CardContent>
    </Card>
  );
}
