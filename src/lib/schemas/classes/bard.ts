import { z } from 'zod';

import { BaseClassSchema, SubclassFeatureSchema } from '../core';

// Bard Subclass Schemas
// ======================================================================================

export const BardSubclassSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('Troubadour'),
    description: z.literal(
      'Play the Troubadour if you want to play music to bolster your allies.'
    ),
    spellcastTrait: z.literal('Presence'),
    features: z.array(SubclassFeatureSchema),
  }),
  z.object({
    name: z.literal('Wordsmith'),
    description: z.literal(
      'Play the Wordsmith if you want to use clever wordplay and captivate crowds.'
    ),
    spellcastTrait: z.literal('Presence'),
    features: z.array(SubclassFeatureSchema),
  }),
]);

// Bard Class Schema
// ======================================================================================

export const BardClassSchema = BaseClassSchema.extend({
  name: z.literal('Bard'),
  subclasses: z.array(BardSubclassSchema),
});

// Bard Class Data
// ======================================================================================

export const BARD: z.infer<typeof BardClassSchema> = {
  name: 'Bard',
  description:
    'Bards are the most charismatic people in all the realms. Members of this class are masters of captivation and specialize in a variety of performance types, including singing, playing musical instruments, weaving tales, or telling jokes.',
  domains: ['Grace', 'Codex'],
  startingEvasion: 10,
  startingHitPoints: 5,
  classItems: ['A romance novel or a letter never opened'],
  hopeFeature: {
    name: 'Make a Scene',
    description:
      'Spend 3 Hope to temporarily Distract a target within Close range, giving them a -2 penalty to their Difficulty.',
    hopeCost: 3,
  },
  classFeatures: [
    {
      name: 'Rally',
      description:
        'Once per session, describe how you rally the party and give yourself and each of your allies a Rally Die. At level 1, your Rally Die is a d6. A PC can spend their Rally Die to roll it, adding the result to their action roll, reaction roll, damage roll, or to clear a number of Stress equal to the result. At the end of each session, clear all unspent Rally Dice. At level 5, your Rally Die increases to a d8.',
      type: 'active',
    },
  ],
  backgroundQuestions: [
    'Who from your community taught you to have such confidence in yourself?',
    'You were in love once. Who did you adore, and how did they hurt you?',
    "You've always looked up to another bard. Who are they, and why do you idolize them?",
  ],
  connections: [
    'What made you realize we were going to be such good friends?',
    'What do I do that annoys you?',
    'Why do you grab my hand at night?',
  ],
  subclasses: [
    {
      name: 'Troubadour',
      description:
        'Play the Troubadour if you want to play music to bolster your allies.',
      spellcastTrait: 'Presence',
      features: [
        {
          name: 'Gifted Performer',
          description:
            'Describe how you perform for others. You can play each song once per long rest: Relaxing Song (You and all allies within Close range clear a Hit Point), Epic Song (Make a target within Close range temporarily Vulnerable), Heartbreaking Song (You and all allies within Close range gain a Hope).',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Maestro',
          description:
            'Your rallying songs steel the courage of those who listen. When you give a Rally Die to an ally, they can gain a Hope or clear a Stress.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Virtuoso',
          description:
            'You are among the greatest of your craft and your skill is boundless. You can perform each of your "Gifted Performer" feature\'s songs twice instead of once per long rest.',
          type: 'mastery',
          level: 8,
          availability: {
            tier: '8-10',
            minLevel: 8,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
      ],
    },
    {
      name: 'Wordsmith',
      description:
        'Play the Wordsmith if you want to use clever wordplay and captivate crowds.',
      spellcastTrait: 'Presence',
      features: [
        {
          name: 'Rousing Speech',
          description:
            'Once per long rest, you can give a heartfelt, inspiring speech. All allies within Far range clear 2 Stress.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Heart of a Poet',
          description:
            'After you make an action roll to impress, persuade, or offend someone, you can spend a Hope to add a d4 to the roll.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Eloquent',
          description:
            'Your moving words boost morale. Once per session, when you encourage an ally, you can do one of the following: Allow them to find a mundane object or tool they need, Help an Ally without spending Hope, Give them an additional downtime move during their next rest.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Epic Poetry',
          description:
            'Your Rally Die increases to a d10. Additionally, when you Help an Ally, you can narrate the moment as if you were writing the tale of their heroism in a memoir. When you do, roll a d10 as your advantage die.',
          type: 'mastery',
          level: 8,
          availability: {
            tier: '8-10',
            minLevel: 8,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
      ],
    },
  ],
};

// Type exports for convenience
export type BardSubclass = z.infer<typeof BardSubclassSchema>;
export type BardClass = z.infer<typeof BardClassSchema>;
