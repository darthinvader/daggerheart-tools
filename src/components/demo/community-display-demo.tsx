import { useState } from 'react';

import { CommunityDisplay } from '@/components/community-selector';
import type { CommunitySelection } from '@/lib/schemas/identity';

import {
  SAMPLE_HIGHBORNE,
  SAMPLE_HOMEBREW,
  SAMPLE_LOREBORNE,
  SAMPLE_WANDERBORNE,
} from './community-display-sample-data';
import { DemoCard, EmptyStateCard } from './demo-card';

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
        <DemoCard
          badge="👑 Highborne"
          badgeClassName="border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
          label="Noble society"
        >
          <CommunityDisplay
            selection={highborneSelection}
            onChange={setHighborneSelection}
          />
        </DemoCard>

        <DemoCard
          badge="🚶 Wanderborne"
          badgeClassName="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          label="Nomadic travelers"
        >
          <CommunityDisplay
            selection={wanderborneSelection}
            onChange={setWanderborneSelection}
          />
        </DemoCard>

        <DemoCard
          badge="📚 Loreborne"
          badgeClassName="border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
          label="Scholarly pursuit"
        >
          <CommunityDisplay
            selection={loreborneSelection}
            onChange={setLoreborneSelection}
          />
        </DemoCard>

        <DemoCard
          badge="🛠️ Homebrew"
          badgeClassName="border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
          label="Custom community"
        >
          <CommunityDisplay
            selection={homebrewSelection}
            onChange={setHomebrewSelection}
          />
        </DemoCard>

        <EmptyStateCard label="No selection" className="lg:col-span-2">
          <CommunityDisplay
            selection={emptySelection}
            onChange={setEmptySelection}
          />
        </EmptyStateCard>
      </div>
    </div>
  );
}
