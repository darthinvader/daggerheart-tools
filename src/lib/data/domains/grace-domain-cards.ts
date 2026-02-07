import type { DomainCard } from '../../schemas/domains';

// Complete Grace domain cards — SRD-accurate data

export const GRACE_DOMAIN_CARDS: DomainCard[] = [
  {
    name: 'DEFT DECEIVER',
    level: 1,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 0,
    description:
      'Spend a Hope to gain advantage on a roll to deceive or trick someone into believing a lie you tell them.',
  },
  {
    name: 'ENRAPTURE',
    level: 1,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 0,
    description:
      'Make a Spellcast Roll against a target within Close range. On a success, they become temporarily Enraptured. While Enraptured, a target\u2019s attention is fixed on you, narrowing their field of view and drowning out any sound but your voice. Once per rest on a success, you can mark a Stress to force the Enraptured target to mark a Stress as well.',
  },
  {
    name: 'INSPIRATIONAL WORDS',
    level: 1,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 1,
    description:
      'Your speech is imbued with power. After a long rest, place a number of tokens on this card equal to your Presence. When you speak with an ally, you can spend a token from this card to give them one benefit from the following options:\n\u2022 Your ally clears a Stress.\n\u2022 Your ally clears a Hit Point.\n\u2022 Your ally gains a Hope.\n\nWhen you take a long rest, clear all unspent tokens.',
  },
  {
    name: 'TELL NO LIES',
    level: 2,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'Make a Spellcast Roll against a target within Very Close range. On a success, they can\u2019t lie to you while they remain within Close range, but they are not compelled to speak. If you ask them a question and they refuse to answer, they must mark a Stress and the effect ends. The target is typically unaware this spell has been cast on them until it causes them to utter the truth.',
  },
  {
    name: 'TROUBLEMAKER',
    level: 2,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 2,
    description:
      'When you taunt or provoke a target within Far range, make a Presence Roll against them. Once per rest on a success, roll a number of d4s equal to your Proficiency. The target must mark Stress equal to the highest result rolled.',
  },
  {
    name: 'HYPNOTIC SHIMMER',
    level: 3,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'Make a Spellcast Roll against all adversaries in front of you within Close range. Once per rest on a success, create an illusion of flashing colors and lights that temporarily Stuns targets you succeed against and forces them to mark a Stress. While Stunned, they can\u2019t use reactions and can\u2019t take any other actions until they clear this condition.',
  },
  {
    name: 'INVISIBILITY',
    level: 3,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'Make a Spellcast Roll (10). On a success, mark a Stress and choose yourself or an ally within Melee range to become Invisible. An Invisible creature can\u2019t be seen except through magical means and attack rolls against them are made with disadvantage. Place a number of tokens on this card equal to your Spellcast trait. When the Invisible creature takes an action, spend a token from this card. After the action that spends the last token is resolved, the effect ends.\n\nYou can only hold Invisibility on one creature at a time.',
  },
  {
    name: 'SOOTHING SPEECH',
    level: 4,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 1,
    description:
      'During a short rest, when you take the time to comfort another character while using the Tend to Wounds downtime move on them, clear an additional Hit Point on that character. When you do, you also clear 2 Hit Points.',
  },
  {
    name: 'THROUGH YOUR EYES',
    level: 4,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'Choose a target within Very Far range. You can see through their eyes and hear through their ears. You can transition between using your own senses or the target\u2019s freely until you cast another spell or until your next rest.',
  },
  {
    name: 'THOUGHT DELVER',
    level: 5,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 2,
    description:
      'You can peek into the minds of others. Spend a Hope to read the vague surface thoughts of a target within Far range. Make a Spellcast Roll against the target to delve for deeper, more hidden thoughts. On a roll with Fear, the target might, at the GM\u2019s discretion, become aware that you\u2019re reading their thoughts.',
  },
  {
    name: 'WORDS OF DISCORD',
    level: 5,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'Whisper words of discord to an adversary within Melee range and make a Spellcast Roll (13). On a success, the target must mark a Stress and make an attack against another adversary instead of against you or your allies. Once this attack is over, the target realizes what happened. The next time you cast Words of Discord on them, gain a \u22125 penalty to the Spellcast Roll.',
  },
  {
    name: 'NEVER UPSTAGED',
    level: 6,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 2,
    description:
      'When you mark 1 or more Hit Points from an attack, you can mark a Stress to place a number of tokens equal to the number of Hit Points you marked on this card. On your next successful attack, gain a +5 bonus to your damage roll for each token on this card, then clear all tokens.',
  },
  {
    name: 'SHARE THE BURDEN',
    level: 6,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 0,
    description:
      'Once per rest, take on the Stress from a willing creature within Melee range. The target describes what intimate knowledge or emotions telepathically leak from their mind in this moment between you. Transfer any number of their marked Stress to you, then gain a Hope for each Stress transferred.',
  },
  {
    name: 'ENDLESS CHARISMA',
    level: 7,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 1,
    description:
      'After you make an action roll to persuade, lie, or garner favor, you can spend a Hope to reroll the Hope or Fear Die.',
  },
  {
    name: 'GRACE-TOUCHED',
    level: 7,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 2,
    description:
      'When 4 or more of the domain cards in your loadout are from the Grace domain, gain the following benefits:\n\u2022 You can mark an Armor Slot instead of marking a Stress.\n\u2022 When you would force a target to mark a number of Hit Points, you can choose instead to force them to mark that number of Stress.',
    metadata: {
      domainRequirement: {
        domain: 'Grace',
        minCards: 4,
      },
    },
  },
  {
    name: 'ASTRAL PROJECTION',
    level: 8,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 0,
    description:
      'Once per long rest, mark a Stress to create a projected copy of yourself that can appear anywhere you\u2019ve been before. You can see and hear through the projection as though it were you and affect the world as though you were there. A creature investigating the projection can tell it\u2019s of magical origin. This effect lasts until your next rest or your projection takes any damage.',
  },
  {
    name: 'MASS ENRAPTURE',
    level: 8,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 3,
    description:
      'Make a Spellcast Roll against all targets within Far range. Targets you succeed against become temporarily Enraptured. While Enraptured, a target\u2019s attention is fixed on you, narrowing their field of view and drowning out any sound but your voice. Mark a Stress to force all Enraptured targets to mark a Stress, ending this spell.',
  },
  {
    name: 'COPYCAT',
    level: 9,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 3,
    description:
      'Once per long rest, this card can mimic the features of another domain card of level 8 or lower in another player\u2019s loadout. Spend Hope equal to half the card\u2019s level to gain access to the feature. It lasts until your next rest or they place the card in their vault.',
  },
  {
    name: 'MASTER OF THE CRAFT',
    level: 9,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 0,
    description:
      'Gain a permanent +2 bonus to two of your Experiences or a permanent +3 bonus to one of your Experiences. Then place this card in your vault permanently.',
  },
  {
    name: 'ENCORE',
    level: 10,
    domain: 'Grace',
    type: 'Spell',
    recallCost: 1,
    description:
      'When an ally within Close range deals damage to an adversary, you can make a Spellcast Roll against that same target. On a success, you deal the same damage to the target that your ally dealt. If your Spellcast Roll succeeds with Fear, place this card in your vault.',
  },
  {
    name: 'NOTORIOUS',
    level: 10,
    domain: 'Grace',
    type: 'Ability',
    recallCost: 0,
    description:
      'People know who you are and what you\u2019ve done, and they treat you differently because of it. When you leverage your notoriety to get what you want, you can mark a Stress before you roll to gain a +10 bonus to the result. Your food and drinks are always free wherever you go, and everything else you buy is reduced in price by one bag of gold (to a minimum of one handful). This card doesn\u2019t count against your loadout\u2019s domain card maximum of 5 and can\u2019t be placed in your vault.',
  },
];

// Export just the card names for backward compatibility
export const GRACE_DOMAIN_CARD_NAMES = GRACE_DOMAIN_CARDS.map(
  card => card.name
);

export type GraceDomainCardName = (typeof GRACE_DOMAIN_CARD_NAMES)[number];
