import { useState } from 'react';

import { CommunityDisplay } from '@/components/community-selector';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CommunitySelection } from '@/lib/schemas/identity';
import { getCommunityByName } from '@/lib/schemas/identity';

const SAMPLE_HIGHBORNE: CommunitySelection = {
  mode: 'standard',
  community: getCommunityByName('Highborne')!,
};

const SAMPLE_WANDERBORNE: CommunitySelection = {
  mode: 'standard',
  community: getCommunityByName('Wanderborne')!,
};

const SAMPLE_LOREBORNE: CommunitySelection = {
  mode: 'standard',
  community: getCommunityByName('Loreborne')!,
};

const SAMPLE_HOMEBREW: CommunitySelection = {
  mode: 'homebrew',
  homebrew: {
    name: 'Skyborne',
    description:
      'Those who dwell among the floating islands and airships, where the wind is home and the ground is but a distant memory. Skyborne communities value freedom, innovation, and adaptability above all else.',
    commonTraits: [
      'adventurous',
      'resourceful',
      'independent',
      'daring',
      'curious',
      'carefree',
    ],
    feature: {
      name: 'Sky Legs',
      description:
        'You have advantage on rolls to maintain balance, navigate aerial vessels, or resist vertigo and fear of heights.',
    },
  },
};

export function CommunityDisplayDemo() {
  const [highborneSelection, setHighborneSelection] =
    useState<CommunitySelection>(SAMPLE_HIGHBORNE);
  const [wanderborneSelection, setWanderborneSelection] =
    useState<CommunitySelection>(SAMPLE_WANDERBORNE);
  const [loreborneSelection, setLoreborneSelection] =
    useState<CommunitySelection>(SAMPLE_LOREBORNE);
  const [homebrewSelection, setHomebrewSelection] =
    useState<CommunitySelection>(SAMPLE_HOMEBREW);
  const [emptySelection, setEmptySelection] =
    useState<CommunitySelection>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">🏘️ Community Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the CommunityDisplay component with edit modal capability.
          Click the Edit button to modify each community selection.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
              >
                👑 Highborne
              </Badge>
              <span className="text-muted-foreground font-normal">
                Noble society
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CommunityDisplay
              selection={highborneSelection}
              onChange={setHighborneSelection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
              >
                🚶 Wanderborne
              </Badge>
              <span className="text-muted-foreground font-normal">
                Nomadic travelers
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CommunityDisplay
              selection={wanderborneSelection}
              onChange={setWanderborneSelection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
              >
                📚 Loreborne
              </Badge>
              <span className="text-muted-foreground font-normal">
                Scholarly pursuit
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CommunityDisplay
              selection={loreborneSelection}
              onChange={setLoreborneSelection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
              >
                🛠️ Homebrew
              </Badge>
              <span className="text-muted-foreground font-normal">
                Custom community
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CommunityDisplay
              selection={homebrewSelection}
              onChange={setHomebrewSelection}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Empty State</Badge>
              <span className="text-muted-foreground font-normal">
                No selection
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CommunityDisplay
              selection={emptySelection}
              onChange={setEmptySelection}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
