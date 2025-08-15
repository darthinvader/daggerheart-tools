import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTierForLevel } from '@/features/characters/logic/progression';

export type LevelCardProps = {
  level: number;
  onEdit?: () => void;
  recent?: { level: number; summary: string } | null;
  history?: { level: number; summary: string }[];
  onSetLevel?: (next: number) => void;
  onUndoLast?: () => void;
  onResetAll?: () => void;
};

export function LevelCard({
  level,
  onEdit,
  recent,
  history,
  onUndoLast,
  onResetAll,
}: LevelCardProps) {
  const tier = getTierForLevel(level);
  const tierNumber =
    tier === '1' ? 1 : tier === '2-4' ? 2 : tier === '5-7' ? 3 : 4;
  return (
    <Card>
      <CharacterCardHeader
        title={`Level ${level} (Tier ${tierNumber})`}
        actions={
          <div className="flex items-center gap-2">
            {onUndoLast && (
              <Button size="sm" variant="outline" onClick={onUndoLast}>
                Undo last level
              </Button>
            )}
            {onResetAll && (
              <Button size="sm" variant="ghost" onClick={onResetAll}>
                Reset leveling
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onEdit}>
              Level Up
            </Button>
          </div>
        }
      />
      <CardContent>
        {Array.isArray(history) && history.length > 0 ? (
          <div className="space-y-1">
            {history
              .sort((a, b) => a.level - b.level)
              .map((h, idx) => (
                <div
                  key={`${h.level}-${idx}`}
                  className="text-muted-foreground text-sm"
                >
                  Lv {h.level} — {h.summary}
                </div>
              ))}
          </div>
        ) : recent ? (
          <div className="text-muted-foreground text-sm">
            Last: Lv {recent.level} – {recent.summary}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            No level-up history yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
