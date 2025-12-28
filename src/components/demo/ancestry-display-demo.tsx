import { useState } from 'react';

import {
  AncestryDisplay,
  type AncestrySelection,
} from '@/components/ancestry-selector';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createMixedAncestry, getAncestryByName } from '@/lib/schemas/identity';

const SAMPLE_STANDARD: AncestrySelection = {
  mode: 'standard',
  ancestry: getAncestryByName('Elf')!,
};

const SAMPLE_MIXED: AncestrySelection = createMixedAncestry(
  'Half-Elf',
  'Elf',
  'Human'
)
  ? {
      mode: 'mixed',
      mixedAncestry: createMixedAncestry('Half-Elf', 'Elf', 'Human')!,
    }
  : SAMPLE_STANDARD;

const SAMPLE_HOMEBREW: AncestrySelection = {
  mode: 'homebrew',
  homebrew: {
    name: 'Crystalkin',
    description:
      'Born from the heart of ancient geodes, Crystalkin are living gemstones that have gained sentience through magical means.',
    heightRange: '4\'0" - 6\'6"',
    lifespan: '500+ years',
    physicalCharacteristics: [
      'Crystalline skin',
      'Faceted eyes',
      'Resonant voice',
      'Prismatic hair',
    ],
    primaryFeature: {
      name: 'Crystal Resonance',
      description:
        'You can sense magical energy within 30 feet. Spend a Hope to identify the school of magic.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Gemstone Form',
      description:
        'You have natural armor. Your base evasion is 12 instead of 10.',
      type: 'secondary',
    },
  },
};

export function AncestryDisplayDemo() {
  const [standardSelection, setStandardSelection] =
    useState<AncestrySelection>(SAMPLE_STANDARD);
  const [mixedSelection, setMixedSelection] =
    useState<AncestrySelection>(SAMPLE_MIXED);
  const [homebrewSelection, setHomebrewSelection] =
    useState<AncestrySelection>(SAMPLE_HOMEBREW);
  const [emptySelection, setEmptySelection] = useState<AncestrySelection>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">🧬 Ancestry Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the AncestryDisplay component with edit modal capability.
          Click the Edit button to modify each ancestry.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">📖 Standard</Badge>
              <span className="text-muted-foreground font-normal">
                Pre-defined ancestry
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AncestryDisplay
              selection={standardSelection}
              onChange={setStandardSelection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-purple-300 bg-purple-100 text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              >
                🔀 Mixed
              </Badge>
              <span className="text-muted-foreground font-normal">
                Combined ancestry
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AncestryDisplay
              selection={mixedSelection}
              onChange={setMixedSelection}
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
                Custom creation
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AncestryDisplay
              selection={homebrewSelection}
              onChange={setHomebrewSelection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Empty State</Badge>
              <span className="text-muted-foreground font-normal">
                No selection
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AncestryDisplay
              selection={emptySelection}
              onChange={setEmptySelection}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
