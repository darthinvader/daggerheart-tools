export const DRUID = {
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
        "Mark a Stress to magically transform into a creature of your tier or lower from the Beastform list. You can drop out of this form at any time. While transformed, you can't use weapons or cast spells from domain cards, but you can still use other features or abilities you have access to. Spells you cast before you transform stay active and last for their normal duration, and you can talk and communicate as normal. Additionally, you gain the Beastform's features, add their Evasion bonus to your Evasion, and use the trait specified in their statistics for your attack. While you're in a Beastform, your armor becomes part of your body and you mark Armor Slots as usual; when you drop out of a Beastform, those marked Armor Slots remain marked. If you mark your last Hit Point, you automatically drop out of this form.",
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
            'Mark a Stress to Channel one of the following elements until you take Severe damage or until your next rest:\n\n• Fire: When an adversary within Melee range deals damage to you, they take 1d10 magic damage.\n• Earth: Gain a bonus to your damage thresholds equal to your Proficiency.\n• Water: When you deal damage to an adversary within Melee range, all other adversaries within Very Close range must mark a Stress.\n• Air: You can hover, gaining advantage on Agility Rolls.',
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
            'Once per rest while Channeling, you can assume an aura matching your element. The aura affects targets within Close range until your Channeling ends.\n\n• Fire: When an adversary marks 1 or more Hit Points, they must also mark a Stress.\n• Earth: Your allies gain a +1 bonus to Strength.\n• Water: When an adversary deals damage to you, you can mark a Stress to move them anywhere within Very Close range of where they are.\n• Air: When you or an ally takes damage from an attack beyond Melee range, reduce the damage by 1d8.',
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
            'You further embody your element. While Channeling, you gain the following benefit:\n\n• Fire: You gain a +1 bonus to your Proficiency for attacks and spells that deal damage.\n• Earth: When you would mark Hit Points, roll a d6 per Hit Point marked. For each result of 6, reduce the number of Hit Points you mark by 1.\n• Water: When an attack against you succeeds, you can mark a Stress to make the attacker temporarily Vulnerable.\n• Air: You gain a +1 bonus to your Evasion and can fly.',
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
} as const;
