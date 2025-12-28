import { useCallback, useState } from 'react';

import { ProgressionDisplay } from '@/components/shared/progression-display';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTierForLevel } from '@/lib/schemas/core';

interface ProgressionState {
  currentLevel: number;
  currentTier: string;
  experience?: number;
  experienceToNext?: number;
}

const SAMPLE_NOVICE: ProgressionState = {
  currentLevel: 1,
  currentTier: '1',
  experience: 150,
  experienceToNext: 300,
};

const SAMPLE_ADVENTURER: ProgressionState = {
  currentLevel: 3,
  currentTier: '2-4',
  experience: 800,
  experienceToNext: 1000,
};

const SAMPLE_VETERAN: ProgressionState = {
  currentLevel: 6,
  currentTier: '5-7',
  experience: 2400,
  experienceToNext: 3000,
};

const SAMPLE_LEGEND: ProgressionState = {
  currentLevel: 9,
  currentTier: '8-10',
  experience: 5500,
  experienceToNext: 6000,
};

const SAMPLE_READY_TO_LEVEL: ProgressionState = {
  currentLevel: 2,
  currentTier: '2-4',
  experience: 500,
  experienceToNext: 500,
};

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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-green-500/30 bg-green-500/10 text-green-600"
              >
                🌱 Novice
              </Badge>
              <span className="text-muted-foreground font-normal">Tier 1</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ProgressionDisplay progression={novice} onChange={setNovice} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-blue-500/30 bg-blue-500/10 text-blue-600"
              >
                ⚔️ Adventurer
              </Badge>
              <span className="text-muted-foreground font-normal">
                Tier 2-4
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ProgressionDisplay
              progression={adventurer}
              onChange={setAdventurer}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-purple-500/30 bg-purple-500/10 text-purple-600"
              >
                🔥 Veteran
              </Badge>
              <span className="text-muted-foreground font-normal">
                Tier 5-7
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ProgressionDisplay progression={veteran} onChange={setVeteran} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-amber-500/30 bg-amber-500/10 text-amber-600"
              >
                👑 Legend
              </Badge>
              <span className="text-muted-foreground font-normal">
                Tier 8-10
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ProgressionDisplay progression={legend} onChange={setLegend} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Badge
              variant="default"
              className="animate-pulse bg-gradient-to-r from-amber-500 to-orange-500"
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
            canLevelUp={
              readyToLevel.experience === readyToLevel.experienceToNext
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
