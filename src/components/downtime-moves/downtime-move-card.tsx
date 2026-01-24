import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { DOWNTIME_CATEGORY_MAP } from './constants';
import type { DowntimeMove } from './types';

interface DowntimeMoveCardProps {
  move: DowntimeMove;
  onSelect: () => void;
}

export function DowntimeMoveCard({ move, onSelect }: DowntimeMoveCardProps) {
  const category = DOWNTIME_CATEGORY_MAP[move.category];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{move.name}</CardTitle>
          <Badge variant="outline">
            <category.icon className="size-4" /> {category.label}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {move.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between">
        {move.defaultHoursRequired && (
          <span className="text-muted-foreground flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            {move.defaultHoursRequired}h
          </span>
        )}
        <Button size="sm" onClick={onSelect}>
          Start Activity
        </Button>
      </CardContent>
    </Card>
  );
}
