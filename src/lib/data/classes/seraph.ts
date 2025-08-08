import type { SeraphClass } from '../../schemas/classes/seraph';

export const SERAPH: SeraphClass = {
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
