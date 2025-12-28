import { useState } from 'react';

import { LoadoutDisplay } from '@/components/loadout-selector';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DEFAULT_LOADOUT,
  type DomainCardLite,
  type LoadoutSelection,
} from '@/lib/schemas/loadout';

const sampleCard = (
  name: string,
  domain: string,
  level: number,
  type: string,
  hopeCost?: number
): DomainCardLite => ({
  name,
  domain,
  level,
  type,
  description: `A powerful ${domain.toLowerCase()} ability that allows you to ${name.toLowerCase()}.`,
  hopeCost,
  recallCost: type === 'Spell' ? 1 : undefined,
});

const SAMPLE_FULL: LoadoutSelection = {
  ...DEFAULT_LOADOUT,
  mode: 'class-domains',
  classDomains: ['Arcana', 'Grace'],
  creationComplete: true,
  activeCards: [
    sampleCard('Firebolt', 'Arcana', 1, 'Spell', 1),
    sampleCard('Shield of Faith', 'Grace', 1, 'Ability', 2),
    sampleCard('Sneak Attack', 'Midnight', 2, 'Ability', 1),
    sampleCard('Wild Shape', 'Bone', 2, 'Spell', 3),
    sampleCard('Inspiring Word', 'Splendor', 1, 'Ability', 1),
  ],
  vaultCards: [
    sampleCard('Counterspell', 'Arcana', 3, 'Spell', 2),
    sampleCard('Greater Healing', 'Grace', 3, 'Spell', 3),
    sampleCard('Shadow Step', 'Midnight', 2, 'Ability', 2),
  ],
};

const SAMPLE_MINIMAL: LoadoutSelection = {
  ...DEFAULT_LOADOUT,
  mode: 'class-domains',
  classDomains: ['Arcana', 'Blade'],
  creationComplete: true,
  activeCards: [
    sampleCard('Magic Missile', 'Arcana', 1, 'Spell', 1),
    sampleCard('Blade Ward', 'Blade', 1, 'Ability'),
  ],
  vaultCards: [],
};

const SAMPLE_EMPTY: LoadoutSelection = {
  ...DEFAULT_LOADOUT,
  mode: 'class-domains',
  classDomains: ['Arcana', 'Grace'],
  creationComplete: false,
  activeCards: [],
  vaultCards: [],
};

const SAMPLE_DOMAINS = ['Arcana', 'Grace'];

export function LoadoutDisplayDemo() {
  const [fullLoadout, setFullLoadout] = useState<LoadoutSelection>(SAMPLE_FULL);
  const [minimalLoadout, setMinimalLoadout] =
    useState<LoadoutSelection>(SAMPLE_MINIMAL);
  const [emptyLoadout, setEmptyLoadout] =
    useState<LoadoutSelection>(SAMPLE_EMPTY);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">📜 Loadout Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the LoadoutDisplay component with edit modal capability.
          Click the Edit button to manage domain cards.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-violet-500/30 bg-violet-500/10 text-violet-600"
              >
                ⚡ Full Loadout
              </Badge>
              <span className="text-muted-foreground font-normal">
                5 active + 3 vault cards
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <LoadoutDisplay
              selection={fullLoadout}
              onChange={setFullLoadout}
              classDomains={SAMPLE_DOMAINS}
              tier="2-4"
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Badge
                  variant="secondary"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-600"
                >
                  📋 Minimal
                </Badge>
                <span className="text-muted-foreground font-normal">
                  Just basics
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LoadoutDisplay
                selection={minimalLoadout}
                onChange={setMinimalLoadout}
                classDomains={SAMPLE_DOMAINS}
                tier="1"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Badge variant="outline">Empty State</Badge>
                <span className="text-muted-foreground font-normal">
                  No cards selected
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LoadoutDisplay
                selection={emptyLoadout}
                onChange={setEmptyLoadout}
                classDomains={SAMPLE_DOMAINS}
                tier="1"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
