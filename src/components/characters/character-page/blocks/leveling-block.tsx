import * as React from 'react';

import { LevelingSection } from '@/components/characters/character-page/leveling-section';
import { LevelUpDrawerLazy } from '@/components/characters/drawers-lazy';

export function LevelingBlock({
  level,
  levelHistory,
  open,
  onOpenChange,
  onUndo,
  onSubmit,
}: {
  level: number;
  levelHistory: Array<{
    level: number;
    notes?: string;
    selections: Record<string, number>;
  }>;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onUndo: (
    nextLevel: number,
    nextHistory: Array<{
      level: number;
      notes?: string;
      selections: Record<string, number>;
    }>
  ) => void;
  onSubmit: (values: {
    level: number;
    notes?: string;
    selections: Record<string, number>;
  }) => void;
}) {
  return (
    <>
      <LevelingSection
        level={level}
        levelHistory={levelHistory as never}
        onOpen={() => onOpenChange(true)}
        onUndo={onUndo}
      />
      <React.Suspense fallback={null}>
        <LevelUpDrawerLazy
          open={open}
          onOpenChange={onOpenChange}
          level={level}
          history={levelHistory}
          submit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </React.Suspense>
    </>
  );
}
