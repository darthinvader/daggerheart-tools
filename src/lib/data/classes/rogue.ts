import type { RogueClass } from '../../schemas/classes/rogue';

export const ROGUE: RogueClass = {
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
