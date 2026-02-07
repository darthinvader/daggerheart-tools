export const RANGER = {
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
        "Spend a Hope and make an attack against a target. On a success, deal your attack's normal damage and temporarily make the attack's target your Focus. Until this feature ends or you make a different creature your Focus, you gain the following benefits against your Focus:\n\u2022 You know precisely what direction they are in.\n\u2022 When you deal damage to them, they must mark a Stress.\n\u2022 When you fail an attack against them, you can end your Ranger's Focus feature to reroll your Duality Dice.",
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
            "You have an animal companion of your choice (at the GM's discretion). They stay by your side unless you tell them otherwise.\n\nTake the Ranger Companion sheet. When you level up your character, choose a level-up option for your companion from this sheet as well.",
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
        type: 'Wolf',
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
          level: 1,
          availability: {
            tier: '1',
            minLevel: 1,
            unlockCondition: 'Starting feature',
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
} as const;
