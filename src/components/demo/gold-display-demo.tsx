import { useState } from 'react';

import { GoldDisplay } from '@/components/gold';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Gold } from '@/lib/schemas/character-state';

const SAMPLE_WEALTHY: Gold = {
  handfuls: 5,
  bags: 3,
  chests: 1,
  coins: 0,
  showCoins: false,
  displayDenomination: 'handfuls',
};

const SAMPLE_MODERATE: Gold = {
  handfuls: 8,
  bags: 1,
  chests: 0,
  coins: 5,
  showCoins: true,
  displayDenomination: 'handfuls',
};

const SAMPLE_POOR: Gold = {
  handfuls: 2,
  bags: 0,
  chests: 0,
  coins: 3,
  showCoins: true,
  displayDenomination: 'handfuls',
};

const SAMPLE_EMPTY: Gold = {
  handfuls: 0,
  bags: 0,
  chests: 0,
  coins: 0,
  showCoins: false,
  displayDenomination: 'handfuls',
};

export function GoldDisplayDemo() {
  const [wealthy, setWealthy] = useState<Gold>(SAMPLE_WEALTHY);
  const [moderate, setModerate] = useState<Gold>(SAMPLE_MODERATE);
  const [poor, setPoor] = useState<Gold>(SAMPLE_POOR);
  const [empty, setEmpty] = useState<Gold>(SAMPLE_EMPTY);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">💰 Gold Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the GoldDisplay component with edit modal capability. Click
          the Edit button to modify gold amounts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-amber-500/30 bg-amber-500/10 text-amber-600"
              >
                🏆 Wealthy
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <GoldDisplay gold={wealthy} onChange={setWealthy} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-yellow-500/30 bg-yellow-500/10 text-yellow-600"
              >
                💰 Moderate
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <GoldDisplay gold={moderate} onChange={setModerate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-orange-500/30 bg-orange-500/10 text-orange-600"
              >
                🤛 Poor
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <GoldDisplay gold={poor} onChange={setPoor} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Empty</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <GoldDisplay gold={empty} onChange={setEmpty} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">📊 Compact Mode</Badge>
            <span className="text-muted-foreground font-normal">
              For sidebars and smaller layouts
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <GoldDisplay gold={wealthy} onChange={setWealthy} compactMode />
        </CardContent>
      </Card>
    </div>
  );
}
