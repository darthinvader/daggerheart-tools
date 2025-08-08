export const WIZARD = {
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
} as const;
