import { useState } from 'react';

import { IdentityDisplay } from '@/components/identity-editor';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IdentityFormValues } from '@/lib/schemas/character-state';

const SAMPLE_FULL: IdentityFormValues = {
  name: 'Lyra Shadowmend',
  pronouns: 'she/they',
  calling: 'The Wandering Flame',
  description:
    'A mysterious figure who travels between worlds, leaving whispers of hope and trails of ash in her wake.',
  background:
    'Once a scholar of the Arcane Academy, Lyra discovered forbidden texts that spoke of realms beyond the veil. Her curiosity led her to experiment with portal magic, resulting in an accident that fused her soul with elemental fire. Now she wanders, seeking to understand her new nature while helping those she meets along the way.',
  descriptionDetails: {
    eyes: 'Flickering amber with flames dancing in the pupils',
    hair: 'Long, wavy auburn that seems to glow faintly in darkness',
    skin: 'Warm bronze with subtle ember-like patterns on her arms',
    body: 'Tall and slender, with graceful but cautious movements',
    clothing: 'Flowing robes in deep reds and oranges, with golden trim',
    mannerisms: 'Often traces patterns in the air while thinking',
    other: 'Leaves faint warmth wherever she sits for too long',
  },
  connections: [
    {
      prompt: 'Who saved your life?',
      answer:
        'Marcus, my mentor, pulled me from the portal collapse and paid with his own vitality.',
      withPlayer: { name: 'Marcus Ironforge' },
    },
    {
      prompt: 'Who do you owe a debt to?',
      answer:
        'The Order of the Silver Flame sheltered me when I had nowhere else to go.',
    },
  ],
};

const SAMPLE_MINIMAL: IdentityFormValues = {
  name: 'Thornwick',
  pronouns: 'he/him',
  calling: '',
  description: 'A simple farmer turned adventurer.',
  background: '',
  descriptionDetails: {
    body: 'Stocky and strong from years of farm work',
  },
  connections: [],
};

const SAMPLE_EMPTY: IdentityFormValues = {
  name: '',
  pronouns: '',
  calling: '',
  description: '',
  background: '',
  descriptionDetails: {},
  connections: [],
};

export function IdentityDisplayDemo() {
  const [fullIdentity, setFullIdentity] =
    useState<IdentityFormValues>(SAMPLE_FULL);
  const [minimalIdentity, setMinimalIdentity] =
    useState<IdentityFormValues>(SAMPLE_MINIMAL);
  const [emptyIdentity, setEmptyIdentity] =
    useState<IdentityFormValues>(SAMPLE_EMPTY);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">👤 Identity Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the IdentityDisplay component with edit modal capability.
          Click the Edit button to modify character identity.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-purple-500/30 bg-purple-500/10 text-purple-600"
              >
                ✨ Fully Detailed
              </Badge>
              <span className="text-muted-foreground font-normal">
                Complete character identity
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <IdentityDisplay
              identity={fullIdentity}
              onChange={setFullIdentity}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-amber-500/30 bg-amber-500/10 text-amber-600"
              >
                📝 Minimal
              </Badge>
              <span className="text-muted-foreground font-normal">
                Basic info only
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <IdentityDisplay
              identity={minimalIdentity}
              onChange={setMinimalIdentity}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Empty State</Badge>
              <span className="text-muted-foreground font-normal">
                No identity set
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <IdentityDisplay
              identity={emptyIdentity}
              onChange={setEmptyIdentity}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
