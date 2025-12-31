import { useCallback, useState } from 'react';

import { ProgressionDisplay } from '@/components/shared/progression-display';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTierForLevel } from '@/lib/schemas/core';

import { DemoCard } from './demo-card';
import {
  type ProgressionState,
  SAMPLE_ADVENTURER,
  SAMPLE_LEGEND,
  SAMPLE_NOVICE,
  SAMPLE_READY_TO_LEVEL,
  SAMPLE_VETERAN,
} from './progression-display-sample-data';

export function ProgressionDisplayDemo() {
  const [novice, setNovice] = useState<ProgressionState>(SAMPLE_NOVICE);
  const [adventurer, setAdventurer] =
    useState<ProgressionState>(SAMPLE_ADVENTURER);
  const [veteran, setVeteran] = useState<ProgressionState>(SAMPLE_VETERAN);
  const [legend, setLegend] = useState<ProgressionState>(SAMPLE_LEGEND);
  const [readyToLevel, setReadyToLevel] = useState<ProgressionState>(
    SAMPLE_READY_TO_LEVEL
  );

  const handleLevelUp = useCallback(() => {
    setReadyToLevel(prev => {
      const newLevel = Math.min(10, prev.currentLevel + 1);
      return {
        ...prev,
        currentLevel: newLevel,
        currentTier: getTierForLevel(newLevel),
        experience: 0,
        experienceToNext: 500 + newLevel * 200,
      };
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">📈 Progression Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the ProgressionDisplay component with level tracking and
          level-up capability. The level-up button triggers when enough XP is
          earned.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DemoCard
          badge="🌱 Novice"
          badgeClassName="border-green-500/30 bg-green-500/10 text-green-600"
          label="Tier 1"
        >
          <ProgressionDisplay progression={novice} onChange={setNovice} />
        </DemoCard>

        <DemoCard
          badge="⚔️ Adventurer"
          badgeClassName="border-blue-500/30 bg-blue-500/10 text-blue-600"
          label="Tier 2-4"
        >
          <ProgressionDisplay
            progression={adventurer}
            onChange={setAdventurer}
          />
        </DemoCard>

        <DemoCard
          badge="🔥 Veteran"
          badgeClassName="border-purple-500/30 bg-purple-500/10 text-purple-600"
          label="Tier 5-7"
        >
          <ProgressionDisplay progression={veteran} onChange={setVeteran} />
        </DemoCard>

        <DemoCard
          badge="👑 Legend"
          badgeClassName="border-amber-500/30 bg-amber-500/10 text-amber-600"
          label="Tier 8-10"
        >
          <ProgressionDisplay progression={legend} onChange={setLegend} />
        </DemoCard>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Badge
              variant="default"
              className="animate-pulse bg-linear-to-r from-amber-500 to-orange-500"
            >
              ⬆️ Ready to Level Up!
            </Badge>
            <span className="text-muted-foreground font-normal">
              Click the button to level up
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ProgressionDisplay
            progression={readyToLevel}
            onChange={setReadyToLevel}
            onLevelUp={handleLevelUp}
          />
        </CardContent>
      </Card>
    </div>
  );
}
