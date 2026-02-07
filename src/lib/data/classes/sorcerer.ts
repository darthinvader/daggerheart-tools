export const SORCERER = {
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
        'Make a Spellcast Roll (10). On a success, you create a minor visual illusion no larger than yourself within Close range. This illusion is convincing to anyone at Close range or farther.',
      type: 'active',
    },
    {
      name: 'Channel Raw Power',
      description:
        'Once per long rest, you can place a domain card from your loadout into your vault and choose to either:\n\u2022 Gain Hope equal to the level of the card.\n\u2022 Enhance a spell that deals damage, gaining a bonus to your damage roll equal to twice the level of the card.',
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
            'Choose one of the following elements at character creation: air, earth, fire, lightning, water. You can shape this element into harmless effects. Additionally, spend a Hope and describe how your control over this element helps an action roll you\u2019re about to make, then either gain a +2 bonus to the roll or a +3 bonus to the roll\u2019s damage.',
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
            'You can call forth your element to protect you from harm. When an attack roll against you succeeds, you can mark a Stress and describe how you use your element to defend you. When you do, roll a d6 and add its result to your Evasion against the attack.',
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
            'Once per long rest, you can transform into a physical manifestation of your element. When you do, describe your transformation and choose two of the following benefits to gain until your next rest:\n\u2022 +4 bonus to your Severe threshold\n\u2022 +1 bonus to a character trait of your choice\n\u2022 +1 bonus to your Proficiency\n\u2022 +2 bonus to your Evasion',
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
            'Your primal origin allows you to modify the essence of magic itself. After you cast a spell or make an attack using a weapon that deals magic damage, you can mark a Stress to do one of the following:\n\u2022 Extend the spell or attack\u2019s reach by one range\n\u2022 Gain a +2 bonus to the action roll\u2019s result\n\u2022 Double a damage die of your choice\n\u2022 Hit an additional target within range',
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
            'You can enhance the magic of others with your essence. When you Help an Ally with a Spellcast Roll, you can roll a d8 as your advantage die. Once per long rest, after an ally has made a Spellcast Roll with your help, you can swap the results of their Duality Dice.',
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
            'You can gather magical energy to enhance your capabilities. When you take magic damage, you become Charged. Alternatively, you can spend 2 Hope to become Charged. When you successfully make an attack that deals magic damage while Charged, you can clear your Charge to either gain a +10 bonus to the damage roll or gain a +3 bonus to the Difficulty of a reaction roll the spell causes the target to make. You stop being Charged at your next long rest.',
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
} as const;
