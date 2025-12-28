import { useState } from 'react';

import { ClassDisplay } from '@/components/class-selector';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import type { ClassSelection } from '@/lib/schemas/class-selection';

function buildClassSelection(
  className: string,
  subclassName: string
): ClassSelection | null {
  const gameClass = getClassByName(className);
  const subclass = getSubclassByName(className, subclassName);
  if (!gameClass || !subclass) return null;

  return {
    mode: 'standard',
    className,
    subclassName,
    domains: [...gameClass.domains],
    isHomebrew: false,
    spellcastTrait:
      'spellcastTrait' in subclass ? subclass.spellcastTrait : undefined,
  };
}

const SAMPLE_WARRIOR = buildClassSelection('Warrior', 'Call of the Brave');
const SAMPLE_WIZARD = buildClassSelection('Wizard', 'School of Knowledge');
const SAMPLE_DRUID = buildClassSelection('Druid', 'Warden of Renewal');

const SAMPLE_HOMEBREW: ClassSelection = {
  mode: 'homebrew',
  className: 'Chronomancer',
  subclassName: 'Temporal Weaver',
  domains: ['Arcana', 'Fate'],
  isHomebrew: true,
  homebrewClass: {
    isHomebrew: true,
    name: 'Chronomancer',
    description: 'Masters of time who bend the flow of moments to their will.',
    domains: ['Arcana', 'Fate'],
    startingEvasion: 11,
    startingHitPoints: 5,
    classItems: [],
    backgroundQuestions: [],
    connections: [],
    classFeatures: [
      {
        name: 'Temporal Shift',
        description:
          'You can spend 2 Stress to take an additional action on your turn, but age visibly for a moment.',
        metadata: { source: 'Homebrew' },
      },
    ],
    hopeFeature: {
      name: 'Rewind',
      description: 'Spend 3 Hope to undo the last action taken in combat.',
      hopeCost: 3,
    },
    subclasses: [
      {
        isHomebrew: true,
        name: 'Temporal Weaver',
        description: 'Specialists in manipulating the threads of time itself.',
        spellcastTrait: 'Knowledge',
        features: [
          {
            name: 'Thread Sight',
            description:
              'You can see echoes of past events in locations you visit.',
            type: 'foundation',
            metadata: { source: 'Homebrew' },
          },
        ],
      },
    ],
  },
};

export function ClassDisplayDemo() {
  const [warriorSelection, setWarriorSelection] =
    useState<ClassSelection | null>(SAMPLE_WARRIOR);
  const [wizardSelection, setWizardSelection] = useState<ClassSelection | null>(
    SAMPLE_WIZARD
  );
  const [druidSelection, setDruidSelection] = useState<ClassSelection | null>(
    SAMPLE_DRUID
  );
  const [homebrewSelection, setHomebrewSelection] =
    useState<ClassSelection | null>(SAMPLE_HOMEBREW);
  const [emptySelection, setEmptySelection] = useState<ClassSelection | null>(
    null
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">⚔️ Class Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the ClassDisplay component with edit modal capability. Click
          the Edit button to modify each class selection.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-orange-500/30 bg-orange-500/10 text-orange-600"
              >
                ⚔️ Warrior
              </Badge>
              <span className="text-muted-foreground font-normal">
                Martial class
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ClassDisplay
              selection={warriorSelection}
              onChange={setWarriorSelection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-blue-500/30 bg-blue-500/10 text-blue-600"
              >
                📖 Wizard
              </Badge>
              <span className="text-muted-foreground font-normal">
                Arcane caster
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ClassDisplay
              selection={wizardSelection}
              onChange={setWizardSelection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-green-500/30 bg-green-500/10 text-green-600"
              >
                🌿 Druid
              </Badge>
              <span className="text-muted-foreground font-normal">
                Nature magic
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ClassDisplay
              selection={druidSelection}
              onChange={setDruidSelection}
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
                Custom class
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ClassDisplay
              selection={homebrewSelection}
              onChange={setHomebrewSelection}
            />
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Empty State</Badge>
              <span className="text-muted-foreground font-normal">
                No selection
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ClassDisplay
              selection={emptySelection}
              onChange={setEmptySelection}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
