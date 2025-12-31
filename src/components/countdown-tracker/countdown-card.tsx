import { Minus, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { COUNTDOWN_TYPE_STYLES, COUNTDOWN_TYPES } from './constants';
import { CountdownSegments } from './countdown-segments';
import { isCountdownComplete } from './countdown-utils';
import type { Countdown } from './types';

interface CountdownCardProps {
  countdown: Countdown;
  onAdvance: (amount: number) => void;
  onDelete: () => void;
  onToggleSegment: (index: number) => void;
}

export function CountdownCard({
  countdown,
  onAdvance,
  onDelete,
  onToggleSegment,
}: CountdownCardProps) {
  const typeInfo = COUNTDOWN_TYPES.find(t => t.value === countdown.type)!;
  const styles = COUNTDOWN_TYPE_STYLES[countdown.type];
  const complete = isCountdownComplete(countdown);

  return (
    <Card className={cn(complete && 'opacity-60')}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            {countdown.name}
            {complete && <Badge variant="secondary">Complete</Badge>}
          </CardTitle>
          {countdown.description && (
            <p className="text-muted-foreground text-sm">
              {countdown.description}
            </p>
          )}
        </div>
        <Badge variant="outline" className={typeInfo.color}>
          {typeInfo.label}
        </Badge>
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
          </div>
          <div className="flex gap-1">
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
              disabled={complete}
            >
              <Plus className="h-3 w-3" />
            </Button>
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
      </CardContent>
    </Card>
  );
}
