import { useState } from 'react';

import { ClassDisplay } from '@/components/class-selector';
import type { ClassSelection } from '@/lib/schemas/class-selection';

import {
  SAMPLE_DRUID,
  SAMPLE_HOMEBREW,
  SAMPLE_WARRIOR,
  SAMPLE_WIZARD,
} from './class-display-sample-data';
import { DemoCard, EmptyStateCard } from './demo-card';

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
        <DemoCard
          badge="⚔️ Warrior"
          badgeClassName="border-orange-500/30 bg-orange-500/10 text-orange-600"
          label="Martial class"
        >
          <ClassDisplay
            selection={warriorSelection}
            onChange={setWarriorSelection}
          />
        </DemoCard>

        <DemoCard
          badge="📖 Wizard"
          badgeClassName="border-blue-500/30 bg-blue-500/10 text-blue-600"
          label="Arcane caster"
        >
          <ClassDisplay
            selection={wizardSelection}
            onChange={setWizardSelection}
          />
        </DemoCard>

        <DemoCard
          badge="🌿 Druid"
          badgeClassName="border-green-500/30 bg-green-500/10 text-green-600"
          label="Nature magic"
        >
          <ClassDisplay
            selection={druidSelection}
            onChange={setDruidSelection}
          />
        </DemoCard>

        <DemoCard
          badge="🛠️ Homebrew"
          badgeClassName="border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
          label="Custom class"
        >
          <ClassDisplay
            selection={homebrewSelection}
            onChange={setHomebrewSelection}
          />
        </DemoCard>

        <EmptyStateCard label="No selection" className="xl:col-span-2">
          <ClassDisplay
            selection={emptySelection}
            onChange={setEmptySelection}
          />
        </EmptyStateCard>
      </div>
    </div>
  );
}
