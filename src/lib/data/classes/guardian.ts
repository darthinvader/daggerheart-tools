export const GUARDIAN = {
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
        'Once per long rest, you can become Unstoppable. You gain an Unstoppable Die. At level 1, your Unstoppable Die is a d4. Place it on your character sheet in the space provided, starting with the 1 value facing up. After you make a damage roll that deals 1 or more Hit Points to a target, increase the Unstoppable Die value by one. When the die\u2019s value would exceed its maximum value or when the scene ends, remove the die and drop out of Unstoppable. At level 5, your Unstoppable Die increases to a d6.\n\nWhile Unstoppable, you gain the following benefits:\n\u2022 You reduce the severity of physical damage by one threshold (Severe to Major, Major to Minor, Minor to None).\n\u2022 You add the current value of the Unstoppable Die to your damage roll.\n\u2022 You can\u2019t be Restrained or Vulnerable.',
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
          modifiers: { majorThreshold: 1, severeThreshold: 1 },
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
          modifiers: { majorThreshold: 2, severeThreshold: 2 },
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
          modifiers: { majorThreshold: 3, severeThreshold: 3 },
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
            'Spend 2 Hope to Prioritize an adversary until your next rest. When you make an attack against your Prioritized adversary, you can swap the results of your Hope and Fear Dice. You can only Prioritize one adversary at a time.',
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
