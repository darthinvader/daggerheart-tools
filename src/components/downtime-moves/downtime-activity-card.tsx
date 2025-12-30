import { Check, Clock, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { DowntimeActivity } from './types';

interface DowntimeActivityCardProps {
  activity: DowntimeActivity;
  onComplete: () => void;
  onDelete: () => void;
}

export function DowntimeActivityCard({
  activity,
  onComplete,
  onDelete,
}: DowntimeActivityCardProps) {
  return (
    <Card className={cn(activity.completed && 'opacity-60')}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {activity.completed && <Check className="h-4 w-4 text-green-500" />}
          {activity.moveName}
        </CardTitle>
        <Badge variant={activity.completed ? 'secondary' : 'default'}>
          {activity.completed ? 'Complete' : 'In Progress'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {activity.notes && (
          <p className="text-muted-foreground text-sm">{activity.notes}</p>
        )}

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          {activity.hoursSpent} hours
        </div>

        {activity.outcome && (
          <div className="bg-muted rounded-lg p-2 text-sm">
            <strong>Outcome:</strong> {activity.outcome}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {!activity.completed && (
            <Button size="sm" variant="outline" onClick={onComplete}>
              <Check className="mr-1 h-4 w-4" />
              Complete
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
