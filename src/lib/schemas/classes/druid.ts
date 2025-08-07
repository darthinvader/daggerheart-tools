import { z } from 'zod';

import { BaseClassSchema, SubclassFeatureSchema } from '../core';

// Druid Subclass Schemas
// ======================================================================================

export const DruidSubclassSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('Warden of the Elements'),
    description: z.literal(
      'Play the Warden of the Elements if you want to embody the natural elements of the wild.'
    ),
    spellcastTrait: z.literal('Instinct'),
    features: z.array(SubclassFeatureSchema),
  }),
  z.object({
    name: z.literal('Warden of Renewal'),
    description: z.literal(
      'Play the Warden of Renewal if you want to use powerful magic to heal your party.'
    ),
    spellcastTrait: z.literal('Instinct'),
    features: z.array(SubclassFeatureSchema),
  }),
]);

// Druid Class Schema
// ======================================================================================

export const DruidClassSchema = BaseClassSchema.extend({
  name: z.literal('Druid'),
  subclasses: z.array(DruidSubclassSchema),
});

// Druid Class Data
// ======================================================================================

export const DRUID: z.infer<typeof DruidClassSchema> = {
  name: 'Druid',
  description:
    "Becoming a druid is more than an occupation; it's a calling for those who wish to learn from and protect the magic of the wilderness.",
  domains: ['Sage', 'Arcana'],
  startingEvasion: 10,
  startingHitPoints: 6,
  classItems: [
    'A small bag of rocks and bones or a strange pendant found in the dirt',
  ],
  hopeFeature: {
    name: 'Evolution',
    description:
      'Spend 3 Hope to transform into a Beastform without marking a Stress. When you do, choose one trait to raise by +1 until you drop out of that Beastform.',
    hopeCost: 3,
  },
  classFeatures: [
    {
      name: 'Beastform',
      description:
        'Mark a Stress to magically transform into a creature of your tier or lower from the Beastform list. You can drop out of this form at any time.',
      type: 'active',
    },
    {
      name: 'Wildtouch',
      description:
        'You can perform harmless, subtle effects that involve nature—such as causing a flower to rapidly grow, summoning a slight gust of wind, or starting a campfire—at will.',
      type: 'passive',
    },
  ],
  backgroundQuestions: [
    'Why was the community you grew up in so reliant on nature and its creatures?',
    'Who was the first wild animal you bonded with? Why did your bond end?',
    'Who has been trying to hunt you down? What do they want from you?',
  ],
  connections: [
    'What did you confide in me that makes me leap into danger for you every time?',
    'What animal do I say you remind me of?',
    'What affectionate nickname have you given me?',
  ],
  subclasses: [
    {
      name: 'Warden of the Elements',
      description:
        'Play the Warden of the Elements if you want to embody the natural elements of the wild.',
      spellcastTrait: 'Instinct',
      features: [
        {
          name: 'Elemental Incarnation',
          description:
            'Mark a Stress to Channel one of the following elements until you take Severe damage or until your next rest: Fire, Earth, Water, Air.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Elemental Aura',
          description:
            'Once per rest while Channeling, you can assume an aura matching your element. The aura affects targets within Close range until your Channeling ends.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Elemental Dominion',
          description:
            'You further embody your element. While Channeling, you gain additional benefits based on your chosen element.',
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
      name: 'Warden of Renewal',
      description:
        'Play the Warden of Renewal if you want to use powerful magic to heal your party.',
      spellcastTrait: 'Instinct',
      features: [
        {
          name: 'Clarity of Nature',
          description:
            'Once per long rest, you can create a space of natural serenity within Close range. When you spend a few minutes resting within the space, clear Stress equal to your Instinct, distributed as you choose between you and your allies.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Regeneration',
          description:
            'Touch a creature and spend 3 Hope. That creature clears 1d4 Hit Points.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Regenerative Reach',
          description:
            'You can target creatures within Very Close range with your "Regeneration" feature.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: "Warden's Protection",
          description:
            'Once per long rest, spend 2 Hope to clear 2 Hit Points on 1d4 allies within Close range.',
          type: 'specialization',
          level: 6,
          availability: {
            tier: '5-7',
            minLevel: 6,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Defender',
          description:
            "Your animal transformation embodies a healing guardian spirit. When you're in Beastform and an ally within Close range marks 2 or more Hit Points, you can mark a Stress to reduce the number of Hit Points they mark by 1.",
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
export type DruidSubclass = z.infer<typeof DruidSubclassSchema>;
export type DruidClass = z.infer<typeof DruidClassSchema>;
