// Midnight Domain Cards for Daggerheart
// Domain focused on stealth, shadows, and nighttime abilities
import type { DomainCard } from '../../schemas/domains/domain-card.schema';

// Complete Midnight Domain Cards from the SRD
export const MIDNIGHT_DOMAIN_CARDS: DomainCard[] = [
  {
    name: 'PICK AND PULL',
    domain: 'Midnight',
    level: 1,
    type: 'Ability',
    recallCost: 0,
    description:
      'You have advantage on action rolls to pick nonmagical locks, disarm nonmagical traps, or steal items from a target (either through stealth or by force).',
  },
  {
    name: 'RAIN OF BLADES',
    domain: 'Midnight',
    level: 1,
    type: 'Spell',
    recallCost: 1,
    description:
      'Spend a Hope to make a Spellcast Roll and conjure throwing blades that strike out at all targets within Very Close range. Targets you succeed against take d8+2 magic damage using your Proficiency. If a target you hit is Vulnerable, they take an extra 1d8 damage.',
  },
  {
    name: 'UNCANNY DISGUISE',
    domain: 'Midnight',
    level: 1,
    type: 'Spell',
    recallCost: 0,
    description:
      'When you have a few minutes to prepare, you can mark a Stress to don the facade of any humanoid you can picture clearly in your mind. While disguised, you have advantage on Presence Rolls to avoid scrutiny. Place a number of tokens equal to your Spellcast trait on this card. When you take an action while disguised, spend a token from this card. After the action that spends the last token is resolved, the disguise drops.',
  },
  {
    name: 'MIDNIGHT SPIRIT',
    domain: 'Midnight',
    level: 2,
    type: 'Spell',
    recallCost: 1,
    description:
      'Spend a Hope to summon a humanoid-sized spirit that can move or carry things for you until your next rest. You can also send it to attack an adversary. When you do, make a Spellcast Roll against a target within Very Far range. On a success, the spirit moves into Melee range with that target. Roll a number of d6s equal to your Spellcast trait and deal that much magic damage to the target. The spirit then dissipates. You can only have one spirit at a time.',
  },
  {
    name: 'SHADOWBIND',
    domain: 'Midnight',
    level: 2,
    type: 'Spell',
    recallCost: 0,
    description:
      'Make a Spellcast Roll against all adversaries within Very Close range. Targets you succeed against are temporarily Restrained as their shadow binds them in place.',
  },
  {
    name: 'CHOKEHOLD',
    domain: 'Midnight',
    level: 3,
    type: 'Ability',
    recallCost: 1,
    description:
      "When you position yourself behind a creature who's about your size, you can mark a Stress to pull them into a chokehold, making them temporarily Vulnerable. When a creature attacks a target who is Vulnerable in this way, they deal an extra 2d6 damage.",
  },
  {
    name: 'VEIL OF NIGHT',
    domain: 'Midnight',
    level: 3,
    type: 'Spell',
    recallCost: 1,
    description:
      "Make a Spellcast Roll (13). On a success, you can create a temporary curtain of darkness between two points within Far range. Only you can see through this darkness. You're considered Hidden to adversaries on the other side of the veil, and you have advantage on attacks you make through the darkness. The veil remains until you cast another spell.",
  },
  {
    name: 'STEALTH EXPERTISE',
    domain: 'Midnight',
    level: 4,
    type: 'Ability',
    recallCost: 0,
    description:
      'When you roll with Fear while attempting to move unnoticed through a dangerous area, you can mark a Stress to roll with Hope instead. If an ally within Close range is also attempting to move unnoticed and rolls with Fear, you can mark a Stress to change their result to a roll with Hope.',
  },
  {
    name: 'GLYPH OF NIGHTFALL',
    domain: 'Midnight',
    level: 4,
    type: 'Spell',
    recallCost: 1,
    description:
      "Make a Spellcast Roll against a target within Very Close range. On a success, spend a Hope to conjure a dark glyph upon their body that exposes their weak points, temporarily reducing the target's Difficulty by a value equal to your Knowledge (minimum 1).",
  },
  {
    name: 'HUSH',
    domain: 'Midnight',
    level: 5,
    type: 'Spell',
    recallCost: 1,
    description:
      "Make a Spellcast Roll against a target within Close range. On a success, spend a Hope to conjure suppressive magic around the target that encompasses everything within Very Close range of them and follows them as they move. The target and anything within the area is Silenced until the GM spends a Fear on their turn to clear this condition, you cast Hush again, or you take Major damage. While Silenced, they can't make noise and can't cast spells.",
  },
  {
    name: 'PHANTOM RETREAT',
    domain: 'Midnight',
    level: 5,
    type: 'Spell',
    recallCost: 2,
    description:
      "Spend a Hope to activate Phantom Retreat where you're currently standing. Spend another Hope at any time before your next rest to disappear from where you are and reappear where you were standing when you activated Phantom Retreat. This spell ends after you reappear.",
  },
  {
    name: 'DARK WHISPERS',
    domain: 'Midnight',
    level: 6,
    type: 'Spell',
    recallCost: 0,
    description:
      "You can speak into the mind of any person with whom you've made physical contact. Once you've opened a channel with them, they can speak back into your mind. Additionally, you can mark a Stress to make a Spellcast Roll against them. On a success, you can ask the GM one of the following questions and receive an answer: Where are they? What are they doing? What are they afraid of? What do they cherish most in the world?",
  },
  {
    name: 'MASS DISGUISE',
    domain: 'Midnight',
    level: 6,
    type: 'Spell',
    recallCost: 0,
    description:
      "When you have a few minutes of silence to focus, you can mark a Stress to change the appearance of all willing creatures within Close range. Their new forms must share a general body structure and size, and can be somebody or something you've seen before or entirely fabricated. A disguised creature has advantage on Presence Rolls to avoid scrutiny. Activate a Countdown (8). It ticks down as a consequence the GM chooses. When it triggers, the disguise drops.",
  },
  {
    name: 'MIDNIGHT-TOUCHED',
    domain: 'Midnight',
    level: 7,
    type: 'Ability',
    recallCost: 2,
    description:
      'When 4 or more of the domain cards in your loadout are from the Midnight domain, gain the following benefits: Once per rest, when you have 0 Hope and the GM would gain a Fear, you can gain a Hope instead. When you make a successful attack, you can mark a Stress to add the result of your Fear Die to your damage roll.',
  },
  {
    name: 'VANISHING DODGE',
    domain: 'Midnight',
    level: 7,
    type: 'Spell',
    recallCost: 1,
    description:
      'When an attack made against you that would deal physical damage fails, you can spend a Hope to envelop yourself in shadow, becoming Hidden and teleporting to a point within Close range of the attacker. You remain Hidden until the next time you make an action roll.',
  },
  {
    name: 'SHADOWHUNTER',
    domain: 'Midnight',
    level: 8,
    type: 'Ability',
    recallCost: 2,
    description:
      "Your prowess is enhanced under the cover of shadow. While you're shrouded in low light or darkness, you gain a +1 bonus to your Evasion and make attack rolls with advantage.",
  },
  {
    name: 'SPELLCHARGE',
    domain: 'Midnight',
    level: 8,
    type: 'Spell',
    recallCost: 1,
    description:
      'When you take magic damage, place tokens equal to the number of Hit Points you marked on this card. You can store a number of tokens equal to your Spellcast trait. When you make a successful attack against a target, you can spend any number of tokens to add a d6 for each token spent to your damage roll.',
  },
  {
    name: 'NIGHT TERROR',
    domain: 'Midnight',
    level: 9,
    type: 'Spell',
    recallCost: 2,
    description:
      "Once per long rest, choose any targets within Very Close range to perceive you as a nightmarish horror. The targets must succeed on a Reaction Roll (16) or become temporarily Horrified. While Horrified, they're Vulnerable. Steal a number of Fear from the GM equal to the number of targets that are Horrified (up to the number of Fear in the GM's pool). Roll a number of d6s equal to the number of stolen Fear and deal the total damage to each Horrified target. Discard the stolen Fear.",
  },
  {
    name: 'TWILIGHT TOLL',
    domain: 'Midnight',
    level: 9,
    type: 'Ability',
    recallCost: 1,
    description:
      "Choose a target within Far range. When you succeed on an action roll against them that doesn't result in making a damage roll, place a token on this card. When you deal damage to this target, spend any number of tokens to add a d12 for each token spent to your damage roll. You can only hold Twilight Toll on one creature at a time. When you choose a new target or take a rest, clear all unspent tokens.",
  },
  {
    name: 'ECLIPSE',
    domain: 'Midnight',
    level: 10,
    type: 'Spell',
    recallCost: 2,
    description:
      'Make a Spellcast Roll (16). Once per long rest on a success, plunge the entire area within Far range into complete darkness only you and your allies can see through. Attack rolls have disadvantage when targeting you or an ally within this shadow. Additionally, when you or an ally succeeds with Hope against an adversary within this shadow, the target must mark a Stress. This spell lasts until the GM spends a Fear on their turn to clear this effect or you take Severe damage.',
  },
  {
    name: 'SPECTER OF THE DARK',
    domain: 'Midnight',
    level: 10,
    type: 'Spell',
    recallCost: 1,
    description:
      "Mark a Stress to become Spectral until you make an action roll targeting another creature. While Spectral, you're immune to physical damage and can float and pass through solid objects. Other creatures can still see you while you're in this form.",
  },
];

// Export just the card names for backward compatibility
export const MIDNIGHT_DOMAIN_CARD_NAMES = MIDNIGHT_DOMAIN_CARDS.map(
  card => card.name
);

export type MidnightDomainCardName =
  (typeof MIDNIGHT_DOMAIN_CARD_NAMES)[number];
