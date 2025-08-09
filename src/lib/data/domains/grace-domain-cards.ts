import type { DomainCard } from '../../schemas/domains';

// Complete Grace domain cards with full details from the SRD
export const GRACE_DOMAIN_CARDS: DomainCard[] = [
  {
    name: 'DEFT DECEIVER',
    level: 1,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 1,
    description:
      'When you make a successful Presence Roll to deceive someone, mark a Stress to convince one additional person within Very Close range who is listening.',
  },
  {
    name: 'ENRAPTURE',
    level: 1,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'Make a Spellcast Roll against a target within Close range. On a success, the target is Charmed and compelled to look at you and only you. While Charmed, the target cannot attack you or anyone else, cannot move, and has disadvantage on rolls to notice anything other than you. The target can spend a Hope to break free of this effect.',
  },
  {
    name: 'INSPIRATIONAL WORDS',
    level: 1,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 0,
    description:
      "When you give someone genuine encouragement about something they're attempting, they gain a Hope.",
  },
  {
    name: 'TELL NO LIES',
    level: 2,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 1,
    description:
      'When you speak only the truth for an entire scene, gain 2 Hope at the end of the scene.',
  },
  {
    name: 'TROUBLEMAKER',
    level: 2,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 1,
    description:
      'When you create a distraction, you can spend a Hope to allow all allies within Very Far range to immediately move to anywhere within Close range without making an Agility Roll.',
  },
  {
    name: 'HYPNOTIC SHIMMER',
    level: 3,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'Make a Spellcast Roll against all targets within Close range. Targets you succeed against are mesmerized and Dazed. While Dazed, a target acts on a delay (meaning their turn in initiative is moved to the end of the round) and has disadvantage on attack rolls.',
  },
  {
    name: 'INVISIBILITY',
    level: 3,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 2,
    description:
      "Spend a Hope to become invisible until the end of the scene or until you make an attack. While invisible, you can't be seen by mundane sight and have advantage on Agility Rolls to move unseen.",
  },
  {
    name: 'SOOTHING SPEECH',
    level: 4,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 1,
    description:
      'Once per long rest, when you spend at least a few minutes talking with someone about their problems or fears, you can both clear a Stress.',
  },
  {
    name: 'THROUGH YOUR EYES',
    level: 4,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 0,
    description:
      'When you successfully cast Enrapture on a target, you can spend an additional Hope to see through their eyes and hear through their ears for the duration of the spell. You are aware of your own surroundings as well.',
  },
  {
    name: 'THOUGHT DELVER',
    level: 5,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'Make a Spellcast Roll against a target within Close range. On a success, you can ask the GM one question about what the target is currently thinking, and they must answer honestly. Additionally, you can spend a Hope to ask a follow-up question.',
  },
  {
    name: 'WORDS OF DISCORD',
    level: 5,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 2,
    description:
      'Make a Spellcast Roll against up to three targets within Far range. Targets you succeed against must use their next action to attack another adversary of your choice within their range. If there are no valid targets, they are Dazed instead.',
  },
  {
    name: 'NEVER UPSTAGED',
    level: 6,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 1,
    description:
      'When another character in the scene rolls a critical success, you can mark a Stress to immediately gain the spotlight and describe how you do something impressive. Gain a Hope.',
  },
  {
    name: 'SHARE THE BURDEN',
    level: 6,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 2,
    description:
      'Once per rest, when an ally within Very Close range would mark a Stress, you can mark a Stress to prevent them from marking it.',
  },
  {
    name: 'ENDLESS CHARISMA',
    level: 7,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 0,
    description:
      'When you make a Presence Roll and spend a Hope, add a d12 to the roll. If the d12 shows a 12, gain a Hope.',
  },
  {
    name: 'GRACE-TOUCHED',
    level: 7,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 2,
    description:
      "When 4 or more of the domain cards in your loadout are from the Grace domain, gain the following benefits:\n• +1 bonus to your Presence Rolls\n• Once per rest, when you spend Hope, roll a d6. On a 5-6, you don't spend the Hope.",
  },
  {
    name: 'ASTRAL PROJECTION',
    level: 8,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'Once per rest, make a Spellcast Roll (15). On a success, your consciousness separates from your body, allowing you to move anywhere within Very Far range as an incorporeal projection. You can see and hear normally, but cannot interact with the physical world. Your body remains vulnerable while you are projected. This effect lasts until you choose to return, take damage, or cast another spell.',
  },
  {
    name: 'MASS ENRAPTURE',
    level: 8,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 2,
    description:
      'Make a Spellcast Roll against all targets within Far range. This functions as Enrapture, but affects multiple targets. Mark a Stress for each target beyond the first that you attempt to affect with this spell.',
  },
  {
    name: 'COPYCAT',
    level: 9,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 2,
    description:
      'Once per rest, when you see another character use a domain card, you can spend 3 Hope to use that same card as though it were in your loadout. You must meet any requirements of the card (such as being the correct level).',
  },
  {
    name: 'MASTER OF THE CRAFT',
    level: 9,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 1,
    description:
      'Once per rest, when you make a Presence Roll with advantage, you can treat the roll as a critical success regardless of the actual result.',
  },
  {
    name: 'ENCORE',
    level: 10,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 3,
    description:
      'Once per long rest, immediately after you use a domain card, you can use it again without paying its Recall Cost.',
  },
  {
    name: 'NOTORIOUS',
    level: 10,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 0,
    description:
      "Your reputation precedes you. When you enter a new location where people might know of you, the GM will tell you how you are known and whether that reputation is helpful or harmful in the current situation. Additionally, once per rest, you can spend a Hope to have someone recognize you in a way that's beneficial to your current goals.",
  },
];

// Export just the card names for backward compatibility
export const GRACE_DOMAIN_CARD_NAMES = GRACE_DOMAIN_CARDS.map(
  card => card.name
);

export type GraceDomainCardName = (typeof GRACE_DOMAIN_CARD_NAMES)[number];
