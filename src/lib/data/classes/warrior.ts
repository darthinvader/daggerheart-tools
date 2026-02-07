export const WARRIOR = {
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
        'If an adversary within Melee range attempts to leave that range, make a reaction roll using a trait of your choice against their Difficulty. Choose one effect on a success, or two if you critically succeed:\n\u2022 They can\u2019t move from where they are.\n\u2022 You deal damage to them equal to your primary weapon\u2019s damage.\n\u2022 You move with them.',
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
            'Your unwavering bravery is a rallying point for your allies. You can initiate a Tag Team Roll one additional time per session. Additionally, when an ally initiates a Tag Team Roll with you, they only need to spend 2 Hope to do so.',
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
            'You gain a pool of dice called Slayer Dice. On a roll with Hope, you can place a d6 on this card instead of gaining a Hope, adding the die to the pool. You can store a number of Slayer Dice equal to your Proficiency. When you make an attack roll or damage roll, you can spend any number of these Slayer Dice, rolling them and adding their result to the roll. At the end of each session, clear any unspent Slayer Dice on this card and gain a Hope per die cleared.',
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
            'You can wield multiple weapons with dangerous ease. When you succeed on an attack, you can spend a Hope to add one of the damage dice from your secondary weapon to the damage roll. Additionally, once per long rest when you roll your Slayer Dice, reroll any 1s.',
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
            "You're an inspirational warrior to all who travel with you. Your party gains access to the Martial Preparation downtime move. To use this move during a rest, describe how you instruct and train with your party. You and each ally who chooses this downtime move gain a d6 Slayer Die. A PC with a Slayer Die can spend it to roll the die and add the result to an attack or damage roll of their choice.",
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
