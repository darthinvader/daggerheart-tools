import { LevelCard } from '@/components/characters/leveling/level-card';
import { formatLevelUpSummary } from '@/features/characters/leveling/utils';

export type LevelHistoryEntry = {
  level: number;
  selections: Record<string, number>;
  notes?: string;
};

type Props = {
  level: number;
  levelHistory: LevelHistoryEntry[];
  onOpen: () => void;
  onUndo: (nextLevel: number, nextHistory: LevelHistoryEntry[]) => void;
};

export function LevelingSection({
  level,
  levelHistory,
  onOpen,
  onUndo,
}: Props) {
  return (
    <section
      id="leveling"
      aria-label="Leveling"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <LevelCard
        level={level}
        onEdit={onOpen}
        onUndoLast={() => {
          if (levelHistory.length === 0) return;
          const nextHistory = levelHistory.slice(0, -1);
          const nextLevel =
            nextHistory.length > 0
              ? nextHistory[nextHistory.length - 1].level
              : 1;
          onUndo(nextLevel, nextHistory);
        }}
        recent={
          levelHistory.length > 0
            ? {
                level: levelHistory[levelHistory.length - 1].level,
                summary: formatLevelUpSummary(
                  levelHistory[levelHistory.length - 1].selections
                ),
                selections: levelHistory[levelHistory.length - 1].selections,
                notes: levelHistory[levelHistory.length - 1].notes,
              }
            : null
        }
        history={levelHistory.map(h => ({
          level: h.level,
          summary: formatLevelUpSummary(h.selections),
          selections: h.selections,
          notes: h.notes,
        }))}
      />
    </section>
  );
}
