import * as React from 'react';

import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getTierForLevel } from '@/features/characters/logic/progression';

export type LevelCardProps = {
  level: number;
  onEdit?: () => void;
  recent?: {
    level: number;
    summary: string;
    selections?: Record<string, number>;
    notes?: string;
  } | null;
  history?: {
    level: number;
    summary: string;
    selections?: Record<string, number>;
    notes?: string;
  }[];
  onSetLevel?: (next: number) => void;
  onUndoLast?: () => void;
};

export function LevelCard({
  level,
  onEdit,
  recent,
  history,
  onUndoLast,
}: LevelCardProps) {
  const tier = getTierForLevel(level);
  const tierNumber =
    tier === '1' ? 1 : tier === '2-4' ? 2 : tier === '5-7' ? 3 : 4;
  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<{
    level: number;
    selections?: Record<string, number>;
    notes?: string;
  } | null>(null);

  const openDetail = (d: {
    level: number;
    selections?: Record<string, number>;
    notes?: string;
  }) => {
    setDetail(d);
    setOpen(true);
  };

  return (
    <Card>
      <CharacterCardHeader
        title={`Level ${level} (Tier ${tierNumber})`}
        subtitle={onEdit ? 'Tap the title or use Level Up' : undefined}
        onTitleClick={onEdit}
        actions={
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button size="sm" onClick={onEdit}>
                Level Up
              </Button>
            )}
            {onUndoLast && (
              <Button size="sm" variant="outline" onClick={onUndoLast}>
                Undo last level
              </Button>
            )}
          </div>
        }
      />
      <CardContent>
        {Array.isArray(history) && history.length > 0 ? (
          <div className="space-y-1">
            {history
              .sort((a, b) => a.level - b.level)
              .map((h, idx) => (
                <button
                  key={`${h.level}-${idx}`}
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-left text-sm underline-offset-2 hover:underline"
                  onClick={() =>
                    openDetail({
                      level: h.level,
                      selections: h.selections,
                      notes: h.notes,
                    })
                  }
                  aria-label={`View level ${h.level} details`}
                >
                  Lv {h.level} — {h.summary}
                </button>
              ))}
          </div>
        ) : recent ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground text-left text-sm underline-offset-2 hover:underline"
            onClick={() =>
              openDetail({
                level: recent.level,
                selections: recent.selections,
                notes: recent.notes,
              })
            }
            aria-label={`View level ${recent.level} details`}
          >
            Last: Lv {recent.level} – {recent.summary}
          </button>
        ) : (
          <div className="text-muted-foreground text-sm">
            No level-up history yet.
          </div>
        )}
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Level {detail?.level} details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {detail?.notes && (
              <div className="text-sm">
                <div className="text-muted-foreground">Notes</div>
                <div>{detail.notes}</div>
              </div>
            )}
            <div className="text-sm">
              <div className="text-muted-foreground">Selections</div>
              {detail?.selections &&
              Object.keys(detail.selections).length > 0 ? (
                <ul className="list-disc pl-5">
                  {Object.entries(detail.selections)
                    .filter(([, v]) => (v as number) > 0)
                    .map(([k, v]) => (
                      <li key={k}>
                        {k} x{v as number}
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="text-muted-foreground">No selections</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
