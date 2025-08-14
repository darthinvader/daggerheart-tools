import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTierForLevel } from '@/features/characters/logic/progression';

export type LevelCardProps = {
  level: number;
  onEdit?: () => void;
  recent?: { level: number; summary: string } | null;
  onSetLevel?: (next: number) => void;
};

export function LevelCard({
  level,
  onEdit,
  recent,
  onSetLevel,
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
            {onSetLevel && (
              <>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onSetLevel(Math.max(1, level - 1))}
                  aria-label="Decrease level"
                >
                  −
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onSetLevel(Math.min(10, level + 1))}
                  aria-label="Increase level"
                >
                  +
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={onEdit}>
              Level Up
            </Button>
          </div>
        }
      />
      <CardContent>
        {recent ? (
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
