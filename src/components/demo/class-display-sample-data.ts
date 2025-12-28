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

export const SAMPLE_WARRIOR = buildClassSelection(
  'Warrior',
  'Call of the Brave'
);
export const SAMPLE_WIZARD = buildClassSelection(
  'Wizard',
  'School of Knowledge'
);
export const SAMPLE_DRUID = buildClassSelection('Druid', 'Warden of Renewal');

export const SAMPLE_HOMEBREW: ClassSelection = {
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
