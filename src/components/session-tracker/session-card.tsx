import { Calendar, Coins, Star, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { formatSessionDate } from './session-utils';
import type { SessionEntry } from './types';

interface SessionCardProps {
  session: SessionEntry;
  isCurrent: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function SessionCard({
  session,
  isCurrent,
  onSelect,
  onDelete,
}: SessionCardProps) {
  return (
    <Card
      className={`hover:bg-muted/50 cursor-pointer transition-colors ${isCurrent ? 'ring-primary ring-2' : ''}`}
      onClick={onSelect}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          Session {session.number}
          {isCurrent && (
            <Badge variant="secondary" className="text-xs">
              Current
            </Badge>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive h-6 w-6"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {session.title && <p className="font-medium">{session.title}</p>}

        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatSessionDate(session.date)}
          </span>
          {session.xpGained > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500" />
              {session.xpGained} XP
            </span>
          )}
          {session.goldGained > 0 && (
            <span className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-yellow-500" />
              {session.goldGained}g
            </span>
          )}
        </div>

        {session.summary && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {session.summary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
