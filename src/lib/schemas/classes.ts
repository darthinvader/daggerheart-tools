import { z } from 'zod';

// Level Progression Constants
// ======================================================================================

export const LEVEL_PROGRESSION = {
  TIERS: {
    TIER_1: { name: 'Tier 1', levels: [1], description: 'Starting level' },
    TIER_2: {
      name: 'Tier 2',
      levels: [2, 3, 4],
      description: 'Early advancement',
    },
    TIER_3: {
      name: 'Tier 3',
      levels: [5, 6, 7],
      description: 'Mid-level specialization',
    },
    TIER_4: {
      name: 'Tier 4',
      levels: [8, 9, 10],
      description: 'High-level mastery',
    },
  },
  AUTOMATIC_BENEFITS: {
    LEVEL_2: {
      experience: '+2 Experience',
      proficiency: '+1 Proficiency',
    },
    LEVEL_5: {
      experience: '+2 Experience',
      traitMarks: 'Clear all marks on character traits',
      proficiency: '+1 Proficiency',
    },
    LEVEL_8: {
      experience: '+2 Experience',
      traitMarks: 'Clear all marks on character traits',
      proficiency: '+1 Proficiency',
    },
  },
  RALLY_DIE_PROGRESSION: {
    LEVELS_1_4: 'd6',
    LEVELS_5_PLUS: 'd8',
  },
} as const;

export const LEVEL_UP_OPTIONS = {
  TIER_2: [
    'Gain a +1 bonus to two unmarked character traits and mark them',
    'Permanently gain a +1 bonus to two Experiences',
    'Choose an additional domain card of your level or lower from a domain you have access to (up to level 4)',
    'Permanently gain a +1 bonus to your Evasion',
    'Permanently gain one Hit Point slot',
    'Permanently gain one Stress slot',
  ],
  TIER_3: [
    'Gain a +1 bonus to two unmarked character traits and mark them',
    'Permanently gain a +1 bonus to two Experiences',
    'Choose an additional domain card of your level or lower from a domain you have access to',
    'Permanently gain a +1 bonus to your Evasion',
    'Permanently gain one Hit Point slot',
    'Permanently gain one Stress slot',
    'Take an upgraded subclass card. Then cross out the multiclass option for this tier',
    'Multiclass: Choose an additional class for your character, then cross out an unused "Take an upgraded subclass card" and the other multiclass option on this sheet',
  ],
  TIER_4: [
    'Gain a +1 bonus to two unmarked character traits and mark them',
    'Permanently gain a +1 bonus to two Experiences',
    'Choose an additional domain card of your level or lower from a domain you have access to (up to level 7)',
    'Permanently gain a +1 bonus to your Evasion',
    'Permanently gain one Hit Point slot',
    'Permanently gain one Stress slot',
    'Take an upgraded subclass card. Then cross out the multiclass option for this tier',
    'Multiclass: Choose an additional class for your character, then cross out an unused "Take an upgraded subclass card" and the other multiclass option on this sheet',
  ],
} as const;

// Base Types
// ======================================================================================

const DomainNameEnum = z.enum([
  'Arcana',
  'Blade',
  'Bone',
  'Codex',
  'Grace',
  'Midnight',
  'Sage',
  'Splendor',
  'Valor',
]);

// Class Features
// ======================================================================================

const ClassFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['passive', 'active', 'triggered']).optional(),
});

// Character tier levels (based on character sheet analysis)
const CharacterTierSchema = z.enum(['1', '2-4', '5-7', '8-10']);

// Feature availability based on character tier and specific unlock conditions
const FeatureAvailabilitySchema = z.object({
  tier: CharacterTierSchema,
  minLevel: z.number().int().min(1).max(10),
  unlockCondition: z
    .enum([
      'Starting feature',
      'Take an upgraded subclass card',
      'Automatic at level',
      'Choose from level-up options',
    ])
    .optional(),
});

const SubclassFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['foundation', 'specialization', 'mastery']),
  level: z.number().int().min(1).max(10).optional(),
  availability: FeatureAvailabilitySchema.optional(),
});

const HopeFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  hopeCost: z.number().int().min(1),
});

// Base Class Schema
// ======================================================================================

const BaseClassSchema = z.object({
  name: z.string(),
  description: z.string(),
  domains: z.array(DomainNameEnum).length(2),
  startingEvasion: z.number().int(),
  startingHitPoints: z.number().int(),
  classItems: z.array(z.string()),
  hopeFeature: HopeFeatureSchema,
  classFeatures: z.array(ClassFeatureSchema),
  backgroundQuestions: z.array(z.string()),
  connections: z.array(z.string()),
});

// Subclass Schemas
// ======================================================================================

const BardSubclassSchema = z.discriminatedUnion('name', [
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

const DruidSubclassSchema = z.discriminatedUnion('name', [
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

const GuardianSubclassSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('Stalwart'),
    description: z.literal(
      'Play the Stalwart if you want to take heavy blows and keep fighting.'
    ),
    spellcastTrait: z.never().optional(),
    features: z.array(SubclassFeatureSchema),
  }),
  z.object({
    name: z.literal('Vengeance'),
    description: z.literal(
      'Play the Vengeance if you want to strike down enemies who harm you or your allies.'
    ),
    spellcastTrait: z.never().optional(),
    features: z.array(SubclassFeatureSchema),
  }),
]);

// Ranger Companion System
// ======================================================================================

export const COMPANION_UPGRADES = {
  INTELLIGENT: {
    name: 'Intelligent',
    description: 'Your companion can speak and understand complex instructions',
    benefit: 'Can communicate verbally and follow complex multi-step plans',
  },
  LIGHT_IN_THE_DARK: {
    name: 'Light in the Dark',
    description: 'Your companion provides comfort and hope in dire situations',
    benefit:
      'Once per rest, your companion can grant you or an ally within Close range a Hope',
  },
  CREATURE_COMFORT: {
    name: 'Creature Comfort',
    description: 'Your companion has a soothing presence that aids recovery',
    benefit:
      'When you rest, you and allies within Close range of your companion clear an additional Stress',
  },
  ARMORED: {
    name: 'Armored',
    description: 'Your companion has natural or worn armor protection',
    benefit: 'Your companion gains +2 to their damage thresholds',
  },
  VICIOUS: {
    name: 'Vicious',
    description: 'Your companion fights with enhanced ferocity',
    benefit: 'Your companion gains +1 bonus to damage rolls',
  },
  RESILIENT: {
    name: 'Resilient',
    description: 'Your companion has enhanced stamina and fortitude',
    benefit: 'Your companion gains +1 Hit Point and +1 Stress',
  },
  BONDED: {
    name: 'Bonded',
    description: 'The connection between you and your companion deepens',
    benefit:
      'When you spend Hope to help your companion or vice versa, roll a d8 instead of d6',
  },
  AWARE: {
    name: 'Aware',
    description: 'Your companion has heightened senses and alertness',
    benefit:
      'Your companion gains advantage on Instinct rolls and can act as a lookout',
  },
} as const;

const CompanionUpgradeSchema = z.object({
  name: z.enum([
    'Intelligent',
    'Light in the Dark',
    'Creature Comfort',
    'Armored',
    'Vicious',
    'Resilient',
    'Bonded',
    'Aware',
  ]),
  description: z.string(),
  benefit: z.string(),
});

const RangerCompanionSchema = z.object({
  name: z.string(),
  type: z.string(), // e.g., "Wolf", "Bear", "Hawk"
  hitPoints: z.number().int().min(1),
  armor: z.number().int().min(0),
  evasion: z.number().int().min(0),
  stress: z.number().int().min(0).max(6),

  // Companion action
  action: z.object({
    name: z.string(),
    description: z.string(),
    damage: z.string().optional(),
  }),

  // Companion progression based on character tier
  upgrades: z.array(CompanionUpgradeSchema).max(8), // Up to 8 upgrades available

  // Inventory specific to companion
  inventory: z.array(z.string()).optional(),
});

const RangerSubclassSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('Beastbound'),
    description: z.literal(
      'Play the Beastbound if you want to form a deep bond with an animal ally.'
    ),
    spellcastTrait: z.literal('Agility'),
    features: z.array(SubclassFeatureSchema),
    companion: RangerCompanionSchema.optional(), // Companion for Beastbound rangers
  }),
  z.object({
    name: z.literal('Wayfinder'),
    description: z.literal(
      'Play the Wayfinder if you want to hunt your prey and strike with deadly force.'
    ),
    spellcastTrait: z.literal('Agility'),
    features: z.array(SubclassFeatureSchema),
  }),
]);

const RogueSubclassSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('Nightwalker'),
    description: z.literal(
      'Play the Nightwalker if you want to manipulate shadows to maneuver through the environment.'
    ),
    spellcastTrait: z.literal('Finesse'),
    features: z.array(SubclassFeatureSchema),
  }),
  z.object({
    name: z.literal('Syndicate'),
    description: z.literal(
      'Play the Syndicate if you want to have a web of contacts everywhere you go.'
    ),
    spellcastTrait: z.literal('Finesse'),
    features: z.array(SubclassFeatureSchema),
  }),
]);

const SeraphSubclassSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('Divine Wielder'),
    description: z.literal(
      'Play the Divine Wielder if you want to dominate the battlefield with a legendary weapon.'
    ),
    spellcastTrait: z.literal('Strength'),
    features: z.array(SubclassFeatureSchema),
  }),
  z.object({
    name: z.literal('Winged Sentinel'),
    description: z.literal(
      'Play the Winged Sentinel if you want to take flight and strike crushing blows from the sky.'
    ),
    spellcastTrait: z.literal('Strength'),
    features: z.array(SubclassFeatureSchema),
  }),
]);

const SorcererSubclassSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('Elemental Origin'),
    description: z.literal(
      'Play the Elemental Origin if you want to channel raw magic to take the shape of a particular element.'
    ),
    spellcastTrait: z.literal('Instinct'),
    features: z.array(SubclassFeatureSchema),
  }),
  z.object({
    name: z.literal('Primal Origin'),
    description: z.literal(
      'Play the Primal Origin if you want to extend the versatility of your spells in powerful ways.'
    ),
    spellcastTrait: z.literal('Instinct'),
    features: z.array(SubclassFeatureSchema),
  }),
]);

const WarriorSubclassSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('Call of the Brave'),
    description: z.literal(
      'Play the Call of the Brave if you want to use the might of your enemies to fuel your own power.'
    ),
    spellcastTrait: z.never().optional(),
    features: z.array(SubclassFeatureSchema),
  }),
  z.object({
    name: z.literal('Call of the Slayer'),
    description: z.literal(
      'Play the Call of the Slayer if you want to strike down adversaries with immense force.'
    ),
    spellcastTrait: z.never().optional(),
    features: z.array(SubclassFeatureSchema),
  }),
]);

const WizardSubclassSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('School of Knowledge'),
    description: z.literal(
      'Play the School of Knowledge if you want a keen understanding of the world around you.'
    ),
    spellcastTrait: z.literal('Knowledge'),
    features: z.array(SubclassFeatureSchema),
  }),
  z.object({
    name: z.literal('School of War'),
    description: z.literal(
      'Play the School of War if you want to utilize trained magic for violence.'
    ),
    spellcastTrait: z.literal('Knowledge'),
    features: z.array(SubclassFeatureSchema),
  }),
]);

// Main Class Schemas
// ======================================================================================

export const BardClassSchema = BaseClassSchema.extend({
  name: z.literal('Bard'),
  subclasses: z.array(BardSubclassSchema),
});

export const DruidClassSchema = BaseClassSchema.extend({
  name: z.literal('Druid'),
  subclasses: z.array(DruidSubclassSchema),
});

export const GuardianClassSchema = BaseClassSchema.extend({
  name: z.literal('Guardian'),
  subclasses: z.array(GuardianSubclassSchema),
});

export const RangerClassSchema = BaseClassSchema.extend({
  name: z.literal('Ranger'),
  subclasses: z.array(RangerSubclassSchema),
});

export const RogueClassSchema = BaseClassSchema.extend({
  name: z.literal('Rogue'),
  subclasses: z.array(RogueSubclassSchema),
});

export const SeraphClassSchema = BaseClassSchema.extend({
  name: z.literal('Seraph'),
  subclasses: z.array(SeraphSubclassSchema),
});

export const SorcererClassSchema = BaseClassSchema.extend({
  name: z.literal('Sorcerer'),
  subclasses: z.array(SorcererSubclassSchema),
});

export const WarriorClassSchema = BaseClassSchema.extend({
  name: z.literal('Warrior'),
  subclasses: z.array(WarriorSubclassSchema),
});

export const WizardClassSchema = BaseClassSchema.extend({
  name: z.literal('Wizard'),
  subclasses: z.array(WizardSubclassSchema),
});

// Union of all classes
export const ClassSchema = z.discriminatedUnion('name', [
  BardClassSchema,
  DruidClassSchema,
  GuardianClassSchema,
  RangerClassSchema,
  RogueClassSchema,
  SeraphClassSchema,
  SorcererClassSchema,
  WarriorClassSchema,
  WizardClassSchema,
]);

// Class Data
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

export const GUARDIAN: z.infer<typeof GuardianClassSchema> = {
  name: 'Guardian',
  description:
    'The title of guardian represents an array of martial professions, speaking more to their moral compass and unshakeable fortitude than the means by which they fight.',
  domains: ['Valor', 'Blade'],
  startingEvasion: 9,
  startingHitPoints: 7,
  classItems: ['A totem from your mentor or a secret key'],
  hopeFeature: {
    name: 'Frontline Tank',
    description: 'Spend 3 Hope to clear 2 Armor Slots.',
    hopeCost: 3,
  },
  classFeatures: [
    {
      name: 'Unstoppable',
      description:
        'Once per long rest, you can become Unstoppable. You gain an Unstoppable Die. At level 1, your Unstoppable Die is a d4. Place it on your character sheet starting with the 1 value facing up. After you make a damage roll that deals 1 or more Hit Points to a target, increase the Unstoppable Die value by one.',
      type: 'active',
    },
  ],
  backgroundQuestions: [
    'Who from your community did you fail to protect, and why do you still think of them?',
    "You've been tasked with protecting something important and delivering it somewhere dangerous. What is it, and where does it need to go?",
    'You consider an aspect of yourself to be a weakness. What is it, and how has it affected you?',
  ],
  connections: [
    'How did I save your life the first time we met?',
    'What small gift did you give me that you notice I always carry with me?',
    'What lie have you told me about yourself that I absolutely believe?',
  ],
  subclasses: [
    {
      name: 'Stalwart',
      description:
        'Play the Stalwart if you want to take heavy blows and keep fighting.',
      features: [
        {
          name: 'Unwavering',
          description: 'Gain a permanent +1 bonus to your damage thresholds.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Iron Will',
          description:
            'When you take physical damage, you can mark an additional Armor Slot to reduce the severity.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Unrelenting',
          description: 'Gain a permanent +2 bonus to your damage thresholds.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Partners-in-Arms',
          description:
            'When an ally within Very Close range takes damage, you can mark an Armor Slot to reduce the severity by one threshold.',
          type: 'specialization',
          level: 6,
          availability: {
            tier: '5-7',
            minLevel: 6,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Undaunted',
          description: 'Gain a permanent +3 bonus to your damage thresholds.',
          type: 'mastery',
          level: 8,
          availability: {
            tier: '8-10',
            minLevel: 8,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Loyal Protector',
          description:
            'When an ally within Close range has 2 or fewer Hit Points and would take damage, you can mark a Stress to sprint to their side and take the damage instead.',
          type: 'mastery',
          level: 9,
          availability: {
            tier: '8-10',
            minLevel: 9,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
      ],
    },
    {
      name: 'Vengeance',
      description:
        'Play the Vengeance if you want to strike down enemies who harm you or your allies.',
      features: [
        {
          name: 'At Ease',
          description: 'Gain an additional Stress slot.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Revenge',
          description:
            'When an adversary within Melee range succeeds on an attack against you, you can mark 2 Stress to force the attacker to mark a Hit Point.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Act of Reprisal',
          description:
            'When an adversary damages an ally within Melee range, you gain a +1 bonus to your Proficiency for the next successful attack you make against that adversary.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Nemesis',
          description:
            'Spend 2 Hope to Prioritize an adversary until your next rest. When you make an attack against your Prioritized adversary, you can swap the results of your Hope and Fear Dice.',
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

export const RANGER: z.infer<typeof RangerClassSchema> = {
  name: 'Ranger',
  description:
    'Rangers are highly skilled hunters who, despite their martial abilities, rarely lend their skills to an army.',
  domains: ['Bone', 'Sage'],
  startingEvasion: 12,
  startingHitPoints: 6,
  classItems: ['A trophy from your first kill or a seemingly broken compass'],
  hopeFeature: {
    name: 'Hold Them Off',
    description:
      'Spend 3 Hope when you succeed on an attack with a weapon to use that same roll against two additional adversaries within range of the attack.',
    hopeCost: 3,
  },
  classFeatures: [
    {
      name: "Ranger's Focus",
      description:
        "Spend a Hope and make an attack against a target. On a success, deal your attack's normal damage and temporarily make the attack's target your Focus.",
      type: 'active',
    },
  ],
  backgroundQuestions: [
    "A terrible creature hurt your community, and you've vowed to hunt them down. What are they, and what unique trail or sign do they leave behind?",
    'Your first kill almost killed you, too. What was it, and what part of you was never the same after that event?',
    "You've traveled many dangerous lands, but what is the one place you refuse to go?",
  ],
  connections: [
    'What friendly competition do we have?',
    "Why do you act differently when we're alone than when others are around?",
    'What threat have you asked me to watch for, and why are you worried about it?',
  ],
  subclasses: [
    {
      name: 'Beastbound',
      description:
        'Play the Beastbound if you want to form a deep bond with an animal ally.',
      spellcastTrait: 'Agility',
      features: [
        {
          name: 'Companion',
          description:
            "You have an animal companion of your choice (at the GM's discretion). They stay by your side unless you tell them otherwise.",
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Expert Training',
          description:
            'Choose an additional level-up option for your companion.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Battle-Bonded',
          description:
            "When an adversary attacks you while they're within your companion's Melee range, you gain a +2 bonus to your Evasion against the attack.",
          type: 'specialization',
          level: 6,
          availability: {
            tier: '5-7',
            minLevel: 6,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Advanced Training',
          description:
            'Choose two additional level-up options for your companion.',
          type: 'mastery',
          level: 8,
          availability: {
            tier: '8-10',
            minLevel: 8,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Loyal Friend',
          description:
            "Once per long rest, when the damage from an attack would mark your companion's last Stress or your last Hit Point and you're within Close range of each other, you or your companion can rush to the other's side and take that damage instead.",
          type: 'mastery',
          level: 9,
          availability: {
            tier: '8-10',
            minLevel: 9,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
      ],
      companion: {
        name: 'Animal Companion',
        type: 'Wolf', // Default example
        hitPoints: 3,
        armor: 0,
        evasion: 12,
        stress: 0,
        action: {
          name: 'Bite',
          description:
            'Make a Finesse roll against an adversary within Melee range.',
          damage: 'd4+1 physical damage',
        },
        upgrades: [],
        inventory: [],
      },
    },
    {
      name: 'Wayfinder',
      description:
        'Play the Wayfinder if you want to hunt your prey and strike with deadly force.',
      spellcastTrait: 'Agility',
      features: [
        {
          name: 'Ruthless Predator',
          description:
            'When you make a damage roll, you can mark a Stress to gain a +1 bonus to your Proficiency. Additionally, when you deal Severe damage to an adversary, they must mark a Stress.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Path Forward',
          description:
            "When you're traveling to a place you've previously visited or you carry an object that has been at the location before, you can identify the shortest, most direct path to your destination.",
          type: 'foundation',
          level: 2,
          availability: {
            tier: '2-4',
            minLevel: 2,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Elusive Predator',
          description:
            'When your Focus makes an attack against you, you gain a +2 bonus to your Evasion against the attack.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Apex Predator',
          description:
            "Before you make an attack roll against your Focus, you can spend a Hope. On a successful attack, you remove a Fear from the GM's Fear pool.",
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

export const ROGUE: z.infer<typeof RogueClassSchema> = {
  name: 'Rogue',
  description:
    'Rogues are scoundrels, often in both attitude and practice. Broadly known as liars and thieves, the best among this class move through the world anonymously.',
  domains: ['Midnight', 'Grace'],
  startingEvasion: 12,
  startingHitPoints: 6,
  classItems: ['A set of forgery tools or a grappling hook'],
  hopeFeature: {
    name: "Rogue's Dodge",
    description:
      'Spend 3 Hope to gain a +2 bonus to your Evasion until the next time an attack succeeds against you. Otherwise, this bonus lasts until your next rest.',
    hopeCost: 3,
  },
  classFeatures: [
    {
      name: 'Cloaked',
      description:
        'Any time you would be Hidden, you are instead Cloaked. In addition to the benefits of the Hidden condition, while Cloaked you remain unseen if you are stationary when an adversary moves to where they would normally see you.',
      type: 'passive',
    },
    {
      name: 'Sneak Attack',
      description:
        'When you succeed on an attack while Cloaked or while an ally is within Melee range of your target, add a number of d6s equal to your tier to your damage roll.',
      type: 'passive',
    },
  ],
  backgroundQuestions: [
    'What did you get caught doing that got you exiled from your home community?',
    "You used to have a different life, but you've tried to leave it behind. Who from your past is still chasing you?",
    'Who from your past were you most sad to say goodbye to?',
  ],
  connections: [
    'What did I recently convince you to do that got us both in trouble?',
    'What have I discovered about your past that I hold secret from the others?',
    'Who do you know from my past, and how have they influenced your feelings about me?',
  ],
  subclasses: [
    {
      name: 'Nightwalker',
      description:
        'Play the Nightwalker if you want to manipulate shadows to maneuver through the environment.',
      spellcastTrait: 'Finesse',
      features: [
        {
          name: 'Shadow Stepper',
          description:
            'You can move from shadow to shadow. When you move into an area of darkness or a shadow cast by another creature or object, you can mark a Stress to disappear from where you are and reappear inside another shadow within Far range.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Dark Cloud',
          description:
            'Make a Spellcast Roll (15). On a success, create a temporary dark cloud that covers any area within Close range.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Adrenaline',
          description:
            "While you're Vulnerable, add your level to your damage rolls.",
          type: 'specialization',
          level: 6,
          availability: {
            tier: '5-7',
            minLevel: 6,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Fleeting Shadow',
          description:
            'Gain a permanent +1 bonus to your Evasion. You can use your "Shadow Stepper" feature to move within Very Far range.',
          type: 'mastery',
          level: 8,
          availability: {
            tier: '8-10',
            minLevel: 8,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Vanishing Act',
          description:
            'Mark a Stress to become Cloaked at any time. When Cloaked from this feature, you automatically clear the Restrained condition if you have it.',
          type: 'mastery',
          level: 9,
          availability: {
            tier: '8-10',
            minLevel: 9,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
      ],
    },
    {
      name: 'Syndicate',
      description:
        'Play the Syndicate if you want to have a web of contacts everywhere you go.',
      spellcastTrait: 'Finesse',
      features: [
        {
          name: 'Well-Connected',
          description:
            'When you arrive in a prominent town or environment, you know somebody who calls this place home. Give them a name, note how you think they could be useful, and choose one fact from a list.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Contacts Everywhere',
          description:
            'Once per session, you can briefly call on a shady contact. Choose one of several benefits and describe what brought them here to help you in this moment.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Reliable Backup',
          description:
            'You can use your "Contacts Everywhere" feature three times per session. Additional options are added to the list of benefits you can choose from.',
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

export const SERAPH: z.infer<typeof SeraphClassSchema> = {
  name: 'Seraph',
  description:
    'Seraphs are divine fighters and healers imbued with sacred purpose.',
  domains: ['Splendor', 'Valor'],
  startingEvasion: 9,
  startingHitPoints: 7,
  classItems: ['A bundle of offerings or a sigil of your god'],
  hopeFeature: {
    name: 'Life Support',
    description:
      'Spend 3 Hope to clear a Hit Point on an ally within Close range.',
    hopeCost: 3,
  },
  classFeatures: [
    {
      name: 'Prayer Dice',
      description:
        "At the beginning of each session, roll a number of d4s equal to your subclass's Spellcast trait and place them on your character sheet. These are your Prayer Dice. You can spend any number of Prayer Dice to aid yourself or an ally within Far range.",
      type: 'passive',
    },
  ],
  backgroundQuestions: [
    'Which god did you devote yourself to? What incredible feat did they perform for you in a moment of desperation?',
    'How did your appearance change after taking your oath?',
    'In what strange or unique way do you communicate with your god?',
  ],
  connections: [
    'What promise did you make me agree to, should you die on the battlefield?',
    'Why do you ask me so many questions about my god?',
    "You've told me to protect one member of our party above all others, even yourself. Who are they and why?",
  ],
  subclasses: [
    {
      name: 'Divine Wielder',
      description:
        'Play the Divine Wielder if you want to dominate the battlefield with a legendary weapon.',
      spellcastTrait: 'Strength',
      features: [
        {
          name: 'Spirit Weapon',
          description:
            'When you have an equipped weapon with a range of Melee or Very Close, it can fly from your hand to attack an adversary within Close range and then return to you.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Sparing Touch',
          description:
            'Once per long rest, touch a creature and clear 2 Hit Points or 2 Stress from them.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Devout',
          description:
            'When you roll your Prayer Dice, you can roll an additional die and discard the lowest result. Additionally, you can use your "Sparing Touch" feature twice instead of once per long rest.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Sacred Resonance',
          description:
            'When you roll damage for your "Spirit Weapon" feature, if any of the die results match, double the value of each matching die.',
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
      name: 'Winged Sentinel',
      description:
        'Play the Winged Sentinel if you want to take flight and strike crushing blows from the sky.',
      spellcastTrait: 'Strength',
      features: [
        {
          name: 'Wings of Light',
          description:
            'You can fly. While flying, you can mark a Stress to pick up and carry another willing creature approximately your size or smaller, or spend a Hope to deal an extra 1d8 damage on a successful attack.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Ethereal Visage',
          description:
            'Your supernatural visage strikes awe and fear. While flying, you have advantage on Presence Rolls.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Ascendant',
          description:
            'Gain a permanent +4 bonus to your Severe damage threshold.',
          type: 'mastery',
          level: 8,
          availability: {
            tier: '8-10',
            minLevel: 8,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Power of the Gods',
          description:
            'While flying, you deal an extra 1d12 damage instead of 1d8 from your "Wings of Light" feature.',
          type: 'mastery',
          level: 9,
          availability: {
            tier: '8-10',
            minLevel: 9,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
      ],
    },
  ],
};

export const SORCERER: z.infer<typeof SorcererClassSchema> = {
  name: 'Sorcerer',
  description:
    'Not all innate magic users choose to hone their craft, but those who do can become powerful sorcerers.',
  domains: ['Arcana', 'Midnight'],
  startingEvasion: 10,
  startingHitPoints: 6,
  classItems: ['A whispering orb or a family heirloom'],
  hopeFeature: {
    name: 'Volatile Magic',
    description:
      'Spend 3 Hope to reroll any number of your damage dice on an attack that deals magic damage.',
    hopeCost: 3,
  },
  classFeatures: [
    {
      name: 'Arcane Sense',
      description:
        'You can sense the presence of magical people and objects within Close range.',
      type: 'passive',
    },
    {
      name: 'Minor Illusion',
      description:
        'Make a Spellcast Roll (10). On a success, you create a minor visual illusion no larger than yourself within Close range.',
      type: 'active',
    },
    {
      name: 'Channel Raw Power',
      description:
        'Once per long rest, you can place a domain card from your loadout into your vault and choose to either gain Hope equal to the level of the card or enhance a spell that deals damage.',
      type: 'active',
    },
  ],
  backgroundQuestions: [
    'What did you do that made the people in your community wary of you?',
    'What mentor taught you to control your untamed magic, and why are they no longer able to guide you?',
    'You have a deep fear you hide from everyone. What is it, and why does it scare you?',
  ],
  connections: [
    'Why do you trust me so deeply?',
    'What did I do that makes you cautious around me?',
    'Why do we keep our shared past a secret?',
  ],
  subclasses: [
    {
      name: 'Elemental Origin',
      description:
        'Play the Elemental Origin if you want to channel raw magic to take the shape of a particular element.',
      spellcastTrait: 'Instinct',
      features: [
        {
          name: 'Elementalist',
          description:
            'Choose one of the following elements at character creation: air, earth, fire, lightning, water. You can shape this element into harmless effects.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Natural Evasion',
          description:
            'You can call forth your element to protect you from harm. When an attack roll against you succeeds, you can mark a Stress and describe how you use your element to defend you.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Transcendence',
          description:
            'Once per long rest, you can transform into a physical manifestation of your element. When you do, describe your transformation and choose two benefits to gain until your next rest.',
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
      name: 'Primal Origin',
      description:
        'Play the Primal Origin if you want to extend the versatility of your spells in powerful ways.',
      spellcastTrait: 'Instinct',
      features: [
        {
          name: 'Manipulate Magic',
          description:
            'Your primal origin allows you to modify the essence of magic itself. After you cast a spell or make an attack using a weapon that deals magic damage, you can mark a Stress to modify the spell.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Enchanted Aid',
          description:
            'You can enhance the magic of others with your essence. When you Help an Ally with a Spellcast Roll, you can roll a d8 as your advantage die.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Arcane Charge',
          description:
            'You can gather magical energy to enhance your capabilities. When you take magic damage, you become Charged. Alternatively, you can spend 2 Hope to become Charged.',
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

export const WARRIOR: z.infer<typeof WarriorClassSchema> = {
  name: 'Warrior',
  description:
    'Becoming a warrior requires years, often a lifetime, of training and dedication to the mastery of weapons and violence.',
  domains: ['Blade', 'Bone'],
  startingEvasion: 11,
  startingHitPoints: 6,
  classItems: ['The drawing of a lover or a sharpening stone'],
  hopeFeature: {
    name: 'No Mercy',
    description:
      'Spend 3 Hope to gain a +1 bonus to your attack rolls until your next rest.',
    hopeCost: 3,
  },
  classFeatures: [
    {
      name: 'Attack of Opportunity',
      description:
        'If an adversary within Melee range attempts to leave that range, make a reaction roll using a trait of your choice against their Difficulty.',
      type: 'triggered',
    },
    {
      name: 'Combat Training',
      description:
        'You ignore burden when equipping weapons. When you deal physical damage, you gain a bonus to your damage roll equal to your level.',
      type: 'passive',
    },
  ],
  backgroundQuestions: [
    'Who taught you to fight, and why did they stay behind when you left home?',
    'Somebody defeated you in battle years ago and left you to die. Who was it, and how did they betray you?',
    'What legendary place have you always wanted to visit, and why is it so special?',
  ],
  connections: [
    'We knew each other long before this party came together. How?',
    'What mundane task do you usually help me with off the battlefield?',
    'What fear am I helping you overcome?',
  ],
  subclasses: [
    {
      name: 'Call of the Brave',
      description:
        'Play the Call of the Brave if you want to use the might of your enemies to fuel your own power.',
      features: [
        {
          name: 'Courage',
          description: 'When you fail a roll with Fear, you gain a Hope.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Battle Ritual',
          description:
            'Once per long rest, before you attempt something incredibly dangerous or face off against a foe who clearly outmatches you, describe what ritual you perform or preparations you make. When you do, clear 2 Stress and gain 2 Hope.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Rise to the Challenge',
          description:
            'You are vigilant in the face of mounting danger. While you have 2 or fewer Hit Points unmarked, you can roll a d20 as your Hope Die.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Camaraderie',
          description:
            'Your unwavering bravery is a rallying point for your allies. You can initiate a Tag Team Roll one additional time per session.',
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
      name: 'Call of the Slayer',
      description:
        'Play the Call of the Slayer if you want to strike down adversaries with immense force.',
      features: [
        {
          name: 'Slayer',
          description:
            'You gain a pool of dice called Slayer Dice. On a roll with Hope, you can place a d6 on this card instead of gaining a Hope, adding the die to the pool.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Weapon Specialist',
          description:
            'You can wield multiple weapons with dangerous ease. When you succeed on an attack, you can spend a Hope to add one of the damage dice from your secondary weapon to the damage roll.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Martial Preparation',
          description:
            "You're an inspirational warrior to all who travel with you. Your party gains access to the Martial Preparation downtime move.",
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

export const WIZARD: z.infer<typeof WizardClassSchema> = {
  name: 'Wizard',
  description:
    'Whether through an institution or individual study, those known as wizards acquire and hone immense magical power over years of learning.',
  domains: ['Codex', 'Splendor'],
  startingEvasion: 11,
  startingHitPoints: 5,
  classItems: [
    "A book you're trying to translate or a tiny, harmless elemental pet",
  ],
  hopeFeature: {
    name: 'Not This Time',
    description:
      'Spend 3 Hope to force an adversary within Far range to reroll an attack or damage roll.',
    hopeCost: 3,
  },
  classFeatures: [
    {
      name: 'Prestidigitation',
      description:
        "You can perform harmless, subtle magical effects at will. For example, you can change an object's color, create a smell, light a candle, cause a tiny object to float, illuminate a room, or repair a small object.",
      type: 'passive',
    },
    {
      name: 'Strange Patterns',
      description:
        'Choose a number between 1 and 12. When you roll that number on a Duality Die, gain a Hope or clear a Stress. You can change this number when you take a long rest.',
      type: 'passive',
    },
  ],
  backgroundQuestions: [
    'What responsibilities did your community once count on you for? How did you let them down?',
    "You've spent your life searching for a book or object of great significance. What is it, and why is it so important to you?",
    'You have a powerful rival. Who are they, and why are you so determined to defeat them?',
  ],
  connections: [
    "What favor have I asked of you that you're not sure you can fulfill?",
    'What weird hobby or strange fascination do we both share?',
    'What secret about yourself have you entrusted only to me?',
  ],
  subclasses: [
    {
      name: 'School of Knowledge',
      description:
        'Play the School of Knowledge if you want a keen understanding of the world around you.',
      spellcastTrait: 'Knowledge',
      features: [
        {
          name: 'Prepared',
          description:
            'Take an additional domain card of your level or lower from a domain you have access to.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Adept',
          description:
            'When you Utilize an Experience, you can mark a Stress instead of spending a Hope. If you do, double your Experience modifier for that roll.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Accomplished',
          description:
            'Take an additional domain card of your level or lower from a domain you have access to.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Perfect Recall',
          description:
            'Once per rest, when you recall a domain card in your vault, you can reduce its Recall Cost by 1.',
          type: 'specialization',
          level: 6,
          availability: {
            tier: '5-7',
            minLevel: 6,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Brilliant',
          description:
            'Take an additional domain card of your level or lower from a domain you have access to.',
          type: 'mastery',
          level: 8,
          availability: {
            tier: '8-10',
            minLevel: 8,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Honed Expertise',
          description:
            'When you use an Experience, roll a d6. On a result of 5 or higher, you can use it without spending Hope.',
          type: 'mastery',
          level: 9,
          availability: {
            tier: '8-10',
            minLevel: 9,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
      ],
    },
    {
      name: 'School of War',
      description:
        'Play the School of War if you want to utilize trained magic for violence.',
      spellcastTrait: 'Knowledge',
      features: [
        {
          name: 'Battlemage',
          description:
            "You've focused your studies on becoming an unconquerable force on the battlefield. Gain an additional Hit Point slot.",
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Face Your Fear',
          description:
            'When you succeed with Fear on an attack roll, you deal an extra 1d10 magic damage.',
          type: 'foundation',
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
          },
        },
        {
          name: 'Conjure Shield',
          description:
            'You can maintain a protective barrier of magic. While you have at least 2 Hope, you add your Proficiency to your Evasion.',
          type: 'specialization',
          level: 5,
          availability: {
            tier: '5-7',
            minLevel: 5,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Fueled by Fear',
          description:
            'The extra magic damage from your "Face Your Fear" feature increases to 2d10.',
          type: 'specialization',
          level: 6,
          availability: {
            tier: '5-7',
            minLevel: 6,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Thrive in Chaos',
          description:
            'When you succeed on an attack, you can mark a Stress after rolling damage to force the target to mark an additional Hit Point.',
          type: 'mastery',
          level: 8,
          availability: {
            tier: '8-10',
            minLevel: 8,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
        {
          name: 'Have No Fear',
          description:
            'The extra magic damage from your "Face Your Fear" feature increases to 3d10.',
          type: 'mastery',
          level: 9,
          availability: {
            tier: '8-10',
            minLevel: 9,
            unlockCondition: 'Take an upgraded subclass card',
          },
        },
      ],
    },
  ],
};

// Export all classes
export const ALL_CLASSES = [
  BARD,
  DRUID,
  GUARDIAN,
  RANGER,
  ROGUE,
  SERAPH,
  SORCERER,
  WARRIOR,
  WIZARD,
] as const;

// Type exports
export type DaggerheartClass = z.infer<typeof ClassSchema>;
export type ClassFeature = z.infer<typeof ClassFeatureSchema>;
export type SubclassFeature = z.infer<typeof SubclassFeatureSchema>;
export type HopeFeature = z.infer<typeof HopeFeatureSchema>;
